import sqlite3
import os
from typing import List, Dict, Any

class DatabaseService:
    def __init__(self):
        # Use SQLite for development
        self.db_path = os.path.join(os.getcwd(), 'researchly.db')
        
    def get_connection(self):
        return sqlite3.connect(self.db_path)
    
    async def create_sources_table(self):
        """Create sources table if it doesn't exist"""
        with self.get_connection() as conn:
            conn.execute("""
                CREATE TABLE IF NOT EXISTS sources (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    title TEXT NOT NULL,
                    authors TEXT,  -- JSON string for array
                    abstract TEXT,
                    url TEXT,
                    year INTEGER,
                    field TEXT,
                    type TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
            conn.commit()
    
    async def insert_source(self, source: Dict[str, Any]) -> int:
        """Insert a source and return its ID"""
        with self.get_connection() as conn:
            cur = conn.cursor()
            cur.execute("""
                INSERT INTO sources (title, authors, abstract, url, year, field, type)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (
                source.get('title'),
                str(source.get('authors', [])),
                source.get('abstract'),
                source.get('url'),
                source.get('year'),
                source.get('field'),
                source.get('type')
            ))
            conn.commit()
            return cur.lastrowid
    
    async def search_sources(self, query: str, filters: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Search sources with filters"""
        with self.get_connection() as conn:
            cur = conn.cursor()
            
            # Build query with filters
            sql = """
                SELECT id, title, authors, abstract, url, year, field, type, created_at
                FROM sources
                WHERE title LIKE ? OR abstract LIKE ?
            """
            params = [f'%{query}%', f'%{query}%']
            
            if filters.get('year'):
                sql += " AND year = ?"
                params.append(filters['year'])
            
            if filters.get('field'):
                sql += " AND field LIKE ?"
                params.append(f'%{filters["field"]}%')
            
            if filters.get('type'):
                sql += " AND type LIKE ?"
                params.append(f'%{filters["type"]}%')
            
            sql += " ORDER BY created_at DESC"
            
            cur.execute(sql, params)
            rows = cur.fetchall()
            
            results = []
            for row in rows:
                results.append({
                    'id': row[0],
                    'title': row[1],
                    'authors': eval(row[2]) if row[2] else [],  # Convert string back to list
                    'abstract': row[3],
                    'url': row[4],
                    'year': row[5],
                    'field': row[6],
                    'type': row[7],
                    'created_at': row[8]
                })
    async def get_source_by_id(self, source_id: int) -> Dict[str, Any]:
        """Get a source by its ID"""
        with self.get_connection() as conn:
            cur = conn.cursor()
            
            cur.execute('SELECT id, title, authors, abstract, url, year, field, type, created_at FROM sources WHERE id = ?', (source_id,))
            row = cur.fetchone()
            
            if row:
                return {
                    'id': row[0],
                    'title': row[1],
                    'authors': eval(row[2]) if row[2] else [],
                    'abstract': row[3],
                    'url': row[4],
                    'year': row[5],
                    'field': row[6],
                    'type': row[7],
                    'created_at': row[8]
                }
            return None

database_service = DatabaseService()
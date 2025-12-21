import os
import json
import asyncpg
from typing import List, Dict, Any, Optional

class DatabaseService:
    def __init__(self):
        # PostgreSQL connection parameters
        self.db_config = {
            'host': os.getenv('DB_HOST', 'localhost'),
            'port': int(os.getenv('DB_PORT', '5432')),
            'user': os.getenv('DB_USER', 'postgres'),
            'password': os.getenv('DB_PASSWORD', '2004'),
            'database': os.getenv('DB_NAME', 'researchly')
        }
        self.pool = None

    async def get_connection(self):
        """Get database connection from pool"""
        if self.pool is None:
            self.pool = await asyncpg.create_pool(**self.db_config)
        return await self.pool.acquire()
    
    async def create_sources_table(self):
        """Create sources table if it doesn't exist"""
        conn = await self.get_connection()
        try:
            await conn.execute("""
                CREATE TABLE IF NOT EXISTS sources (
                    id SERIAL PRIMARY KEY,
                    title TEXT NOT NULL,
                    authors JSONB,  -- JSON array for authors
                    abstract TEXT,
                    url TEXT,
                    year INTEGER,
                    field TEXT,
                    type TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
        finally:
            await self.pool.release(conn)
    
    async def insert_source(self, source: Dict[str, Any]) -> int:
        """Insert a source and return its ID"""
        conn = await self.get_connection()
        try:
            result = await conn.fetchval("""
                INSERT INTO sources (title, authors, abstract, url, year, field, type)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING id
            """,
                source.get('title'),
                source.get('authors', []),
                source.get('abstract'),
                source.get('url'),
                source.get('year'),
                source.get('field'),
                source.get('type')
            )
            return result
        finally:
            await self.pool.release(conn)
    
    async def search_sources(self, query: str, filters: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Search sources with filters"""
        conn = await self.get_connection()
        try:
            # Build query with filters
            sql = """
                SELECT id, title, authors, abstract, url, year, field, type, created_at
                FROM sources
                WHERE title ILIKE $1 OR abstract ILIKE $1
            """
            params = [f'%{query}%']

            if filters.get('year'):
                sql += " AND year = $2"
                params.append(filters['year'])

            if filters.get('field'):
                sql += f" AND field ILIKE ${len(params) + 1}"
                params.append(f'%{filters["field"]}%')

            if filters.get('type'):
                sql += f" AND type ILIKE ${len(params) + 1}"
                params.append(f'%{filters["type"]}%')

            sql += " ORDER BY created_at DESC"

            rows = await conn.fetch(sql, *params)

            results = []
            for row in rows:
                results.append({
                    'id': row['id'],
                    'title': row['title'],
                    'authors': row['authors'] or [],  # JSONB field
                    'abstract': row['abstract'],
                    'url': row['url'],
                    'year': row['year'],
                    'field': row['field'],
                    'type': row['type'],
                    'created_at': row['created_at'].isoformat() if row['created_at'] else None
                })

            return results
        finally:
            await self.pool.release(conn)
    async def get_source_by_id(self, source_id: int) -> Optional[Dict[str, Any]]:
        """Get a source by its ID"""
        conn = await self.get_connection()
        try:
            row = await conn.fetchrow("""
                SELECT id, title, authors, abstract, url, year, field, type, created_at
                FROM sources WHERE id = $1
            """, source_id)

            if row:
                return {
                    'id': row['id'],
                    'title': row['title'],
                    'authors': row['authors'] or [],
                    'abstract': row['abstract'],
                    'url': row['url'],
                    'year': row['year'],
                    'field': row['field'],
                    'type': row['type'],
                    'created_at': row['created_at'].isoformat() if row['created_at'] else None
                }
            return None
        finally:
            await self.pool.release(conn)

    async def create_user_tables(self):
        """Create user-related tables if they don't exist"""
        conn = await self.get_connection()
        try:
            # User searches table
            await conn.execute("""
                CREATE TABLE IF NOT EXISTS user_searches (
                    id SERIAL PRIMARY KEY,
                    query TEXT NOT NULL,
                    filters JSONB,
                    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    results_count INTEGER DEFAULT 0
                )
            """)

            # User logs table
            await conn.execute("""
                CREATE TABLE IF NOT EXISTS user_logs (
                    id SERIAL PRIMARY KEY,
                    actions JSONB NOT NULL,
                    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)

            # Validations table
            await conn.execute("""
                CREATE TABLE IF NOT EXISTS validations (
                    id SERIAL PRIMARY KEY,
                    source_id INTEGER REFERENCES sources(id),
                    ai_response TEXT NOT NULL,
                    constraints JSONB,
                    confidence_score DECIMAL(3,2),
                    flagged_inconsistencies JSONB,
                    recommendations JSONB,
                    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
        finally:
            await self.pool.release(conn)

    async def insert_user_search(self, search_data: Dict[str, Any]) -> int:
        """Insert a user search and return its ID"""
        conn = await self.get_connection()
        try:
            result = await conn.fetchval("""
                INSERT INTO user_searches (query, filters, results_count)
                VALUES ($1, $2, $3)
                RETURNING id
            """,
                search_data['query'],
                search_data.get('filters', {}),
                search_data.get('results_count', 0)
            )
            return result
        finally:
            await self.pool.release(conn)

    async def insert_user_log(self, actions: List[Dict[str, Any]]) -> int:
        """Insert user actions log and return its ID"""
        conn = await self.get_connection()
        try:
            result = await conn.fetchval("""
                INSERT INTO user_logs (actions)
                VALUES ($1)
                RETURNING id
            """, actions)
            return result
        finally:
            await self.pool.release(conn)

    async def insert_validation(self, validation_data: Dict[str, Any]) -> int:
        """Insert a validation and return its ID"""
        conn = await self.get_connection()
        try:
            result = await conn.fetchval("""
                INSERT INTO validations (source_id, ai_response, constraints, confidence_score, flagged_inconsistencies, recommendations)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING id
            """,
                validation_data.get('source_id'),
                validation_data['ai_response'],
                validation_data.get('constraints', {}),
                validation_data.get('confidence_score'),
                validation_data.get('flagged_inconsistencies', []),
                validation_data.get('recommendations', [])
            )
            return result
        finally:
            await self.pool.release(conn)

database_service = DatabaseService()
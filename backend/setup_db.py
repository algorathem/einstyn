#!/usr/bin/env python3
"""
Database setup script for ResearchlyAI PostgreSQL database
"""
import os
import asyncpg
import asyncio
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

async def setup_database():
    """Set up the PostgreSQL database and tables"""

    # Database configuration
    db_config = {
        'host': os.getenv('DB_HOST', 'localhost'),
        'port': int(os.getenv('DB_PORT', '5432')),
        'user': os.getenv('DB_USER', 'postgres'),
        'password': os.getenv('DB_PASSWORD', '2004'),
        'database': os.getenv('DB_NAME', 'researchly')
    }

    try:
        # Connect to PostgreSQL (without specifying database to create it if needed)
        admin_config = db_config.copy()
        admin_config['database'] = 'postgres'  # Connect to default database

        print("Connecting to PostgreSQL...")
        conn = await asyncpg.connect(**admin_config)

        # Create database if it doesn't exist
        db_name = db_config['database']
        result = await conn.fetchval("""
            SELECT 1 FROM pg_database WHERE datname = $1
        """, db_name)

        if not result:
            print(f"Creating database '{db_name}'...")
            await conn.execute(f"CREATE DATABASE {db_name}")
            print(f"Database '{db_name}' created successfully!")
        else:
            print(f"Database '{db_name}' already exists.")

        await conn.close()

        # Connect to the researchly database
        print(f"Connecting to database '{db_name}'...")
        conn = await asyncpg.connect(**db_config)

        # Create tables
        print("Creating tables...")

        # Sources table
        await conn.execute("""
            CREATE TABLE IF NOT EXISTS sources (
                id SERIAL PRIMARY KEY,
                title TEXT NOT NULL,
                authors JSONB,
                abstract TEXT,
                url TEXT,
                year INTEGER,
                field TEXT,
                type TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        print("✓ sources table created")

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
        print("✓ user_searches table created")

        # User logs table
        await conn.execute("""
            CREATE TABLE IF NOT EXISTS user_logs (
                id SERIAL PRIMARY KEY,
                actions JSONB NOT NULL,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        print("✓ user_logs table created")

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
        print("✓ validations table created")

        # Insert some sample data
        print("Inserting sample data...")

        # Check if sources table is empty
        count = await conn.fetchval("SELECT COUNT(*) FROM sources")
        if count == 0:
            await conn.execute("""
                INSERT INTO sources (title, authors, abstract, url, year, field, type) VALUES
                ('Machine Learning in Healthcare', '["Dr. Smith", "Dr. Johnson"]', 'Research on ML applications in healthcare...', 'https://example.com/ml-healthcare', 2024, 'Computer Science', 'research_paper'),
                ('AI Ethics and Bias', '["Dr. Brown"]', 'Ethical considerations in AI development...', 'https://example.com/ai-ethics', 2023, 'Ethics', 'review_paper'),
                ('Deep Learning for Medical Imaging', '["Dr. Davis", "Dr. Wilson"]', 'Applications of deep learning in medical image analysis...', 'https://example.com/dl-imaging', 2024, 'Medicine', 'research_paper')
            """)
            print("✓ Sample sources inserted")

        await conn.close()
        print("\n✅ Database setup completed successfully!")
        print("\nDatabase configuration:")
        print(f"Host: {db_config['host']}")
        print(f"Port: {db_config['port']}")
        print(f"Database: {db_config['database']}")
        print(f"User: {db_config['user']}")

    except Exception as e:
        print(f"❌ Error setting up database: {e}")
        return False

    return True

if __name__ == "__main__":
    print("ResearchlyAI Database Setup")
    print("=" * 30)
    asyncio.run(setup_database())

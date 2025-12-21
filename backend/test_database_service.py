#!/usr/bin/env python3
"""
Test script for DatabaseService PostgreSQL functionality
"""
import asyncio
import os
from src.services.database_service import database_service

async def test_database_service():
    """Test the database service methods"""
    print("Testing DatabaseService PostgreSQL integration...")

    try:
        # Test table creation
        print("1. Creating tables...")
        await database_service.create_sources_table()
        await database_service.create_user_tables()
        print("✓ Tables created successfully")

        # Test inserting a source
        print("2. Inserting test source...")
        test_source = {
            'title': 'Test Research Paper',
            'authors': ['Dr. Test Author', 'Dr. Co-Author'],
            'abstract': 'This is a test abstract for database testing purposes.',
            'url': 'https://example.com/test-paper',
            'year': 2024,
            'field': 'Computer Science',
            'type': 'research_paper'
        }
        source_id = await database_service.insert_source(test_source)
        print(f"✓ Source inserted with ID: {source_id}")

        # Test searching sources
        print("3. Searching sources...")
        results = await database_service.search_sources('test', {})
        print(f"✓ Found {len(results)} sources matching 'test'")

        # Test getting source by ID
        print("4. Getting source by ID...")
        source = await database_service.get_source_by_id(source_id)
        if source:
            print(f"✓ Retrieved source: {source['title']}")
        else:
            print("✗ Source not found")

        # Test user search logging
        print("5. Logging user search...")
        search_data = {
            'query': 'machine learning',
            'filters': {'year': 2024},
            'results_count': len(results)
        }
        search_id = await database_service.insert_user_search(search_data)
        print(f"✓ User search logged with ID: {search_id}")

        # Test user log
        print("6. Logging user actions...")
        actions = [
            {'action': 'click', 'element': 'search_button', 'timestamp': '2024-01-01T10:00:00Z'},
            {'action': 'view', 'element': 'source_details', 'source_id': source_id}
        ]
        log_id = await database_service.insert_user_log(actions)
        print(f"✓ User actions logged with ID: {log_id}")

        # Test validation
        print("7. Inserting validation...")
        validation_data = {
            'source_id': source_id,
            'ai_response': 'This is a test AI response that needs validation.',
            'constraints': {'must_cite_sources': True},
            'confidence_score': 0.85,
            'flagged_inconsistencies': [
                {'type': 'citation_missing', 'description': 'Missing source citation'}
            ],
            'recommendations': [
                'Add proper citations to support claims'
            ]
        }
        validation_id = await database_service.insert_validation(validation_data)
        print(f"✓ Validation inserted with ID: {validation_id}")

        print("\n✅ All database tests passed successfully!")
        print("\nDatabase connection details:")
        print(f"Host: {os.getenv('DB_HOST', 'localhost')}")
        print(f"Port: {os.getenv('DB_PORT', '5432')}")
        print(f"Database: {os.getenv('DB_NAME', 'researchly')}")
        print(f"User: {os.getenv('DB_USER', 'postgres')}")

    except Exception as e:
        print(f"❌ Database test failed: {e}")
        import traceback
        traceback.print_exc()
        return False

    return True

if __name__ == "__main__":
    print("ResearchlyAI Database Service Test")
    print("=" * 40)
    asyncio.run(test_database_service())

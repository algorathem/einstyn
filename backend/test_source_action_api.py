import asyncio
import sys
import os
sys.path.insert(0, os.getcwd())

from steps.source_action_api_step import handler

class MockLogger:
    def info(self, msg, data=None):
        print(f"INFO: {msg}", data or "")
    
    def error(self, msg, data=None):
        print(f"ERROR: {msg}", data or "")

class MockContext:
    def __init__(self):
        self.logger = MockLogger()

async def test_source_action_api():
    """Test the source action API handler"""

    # Mock context
    context = MockContext()

    print("Testing Source Action API...")

    # Test 1: Missing source ID
    print("\n1. Testing missing source ID...")
    req = {
        'body': {
            'actionType': 'explain_term',
            'context': 'machine learning'
        }
    }
    response = await handler(req, context)
    print(f"Status: {response['status']}")
    print(f"Message: {response['body']['message']}")
    assert response['status'] == 400

    # Test 2: Missing action type
    print("\n2. Testing missing action type...")
    req = {
        'pathParams': {'sourceId': '1'},
        'body': {
            'context': 'machine learning'
        }
    }
    response = await handler(req, context)
    print(f"Status: {response['status']}")
    print(f"Message: {response['body']['message']}")
    assert response['status'] == 400

    # Test 3: Invalid action type
    print("\n3. Testing invalid action type...")
    req = {
        'pathParams': {'sourceId': '1'},
        'body': {
            'actionType': 'invalid_action',
            'context': 'machine learning'
        }
    }
    response = await handler(req, context)
    print(f"Status: {response['status']}")
    print(f"Message: {response['body']['message']}")
    assert response['status'] == 400

    # Test 4: Valid request (will fail due to no source in DB, but validates structure)
    print("\n4. Testing valid request structure...")
    req = {
        'pathParams': {'sourceId': '1'},
        'body': {
            'actionType': 'explain_term',
            'context': 'machine learning'
        }
    }
    response = await handler(req, context)
    print(f"Status: {response['status']}")
    print(f"Message: {response['body']['message']}")
    # Should be 404 (source not found) or 500 (OpenAI error), but not 400
    assert response['status'] != 400

    print("\n✅ All validation tests passed!")

if __name__ == "__main__":
    asyncio.run(test_source_action_api())
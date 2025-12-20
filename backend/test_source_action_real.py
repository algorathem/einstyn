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

async def test_source_action_with_real_data():
    """Test the source action API with real database data"""

    context = MockContext()

    print("Testing Source Action API with real data...")

    # Test with the existing source (ID: 1)
    req = {
        'pathParams': {'sourceId': '1'},
        'body': {
            'actionType': 'explain_term',
            'context': 'machine learning'
        }
    }

    print("\nPerforming 'explain_term' action on source ID 1...")
    response = await handler(req, context)

    print(f"Status: {response['status']}")
    if response['status'] == 200:
        print("✅ Action completed successfully!")
        print(f"Action Type: {response['body']['actionType']}")
        print(f"Source ID: {response['body']['sourceId']}")
        print(f"Source Title: {response['body']['source']['title']}")
        print(f"Response Preview: {response['body']['response'][:200]}...")
    else:
        print(f"❌ Error: {response['body']['message']}")

    # Test another action type
    req2 = {
        'pathParams': {'sourceId': '1'},
        'body': {
            'actionType': 'create_outline',
            'context': 'main research findings'
        }
    }

    print("\nPerforming 'create_outline' action on source ID 1...")
    response2 = await handler(req2, context)

    print(f"Status: {response2['status']}")
    if response2['status'] == 200:
        print("✅ Action completed successfully!")
        print(f"Action Type: {response2['body']['actionType']}")
        print(f"Response Preview: {response2['body']['response'][:200]}...")
    else:
        print(f"❌ Error: {response2['body']['message']}")

if __name__ == "__main__":
    asyncio.run(test_source_action_with_real_data())
import sys
import os
sys.path.insert(0, os.getcwd())

from steps.source_chat_api_step import handler
import asyncio

async def test_handler():
    # Mock request
    req = {
        'pathParams': {'sourceId': '1'},
        'body': {
            'message': 'Summarize the main findings',
            'mode': 'summary'
        }
    }

    # Mock context
    class MockLogger:
        def info(self, msg, data=None):
            print(f"INFO: {msg}", data or "")
        def error(self, msg, data=None):
            print(f"ERROR: {msg}", data or "")

    class MockContext:
        def __init__(self):
            self.logger = MockLogger()

    context = MockContext()

    try:
        result = await handler(req, context)
        print("Handler result:")
        print(f"Status: {result['status']}")
        print(f"Message: {result['body']['message']}")
        if 'response' in result['body']:
            print(f"Response: {result['body']['response'][:200]}...")
    except Exception as e:
        print(f"Handler failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_handler())
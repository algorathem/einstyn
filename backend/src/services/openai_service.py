import os
from openai import OpenAI

class OpenAIService:
    def __init__(self):
        api_key = os.getenv('OPENAI_API_KEY')
        if not api_key or api_key == "dummy-key":
            self.client = None
            self.model = "gpt-4"
        else:
            self.client = OpenAI(api_key=api_key)
            self.model = os.getenv('OPENAI_MODEL', 'gpt-4')
    
    async def create_completion(self, messages, **kwargs):
        if self.client is None:
            # Return mock response for testing
            class MockResponse:
                def __init__(self):
                    self.choices = [MockChoice()]
            class MockChoice:
                def __init__(self):
                    self.message = MockMessage()
            class MockMessage:
                def __init__(self):
                    # Check if json_object format is requested
                    if kwargs.get('response_format', {}).get('type') == 'json_object':
                        self.content = '{"validation_report": {"confidence": 0.8, "issues": ["Mock validation result"]}}'
                    else:
                        self.content = "This is a mock response. Please set OPENAI_API_KEY environment variable for real responses."
            return MockResponse()
        return await self.client.chat.completions.create(
            model=self.model,
            messages=messages,
            **kwargs
        )
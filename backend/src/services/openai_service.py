import os
from openai import OpenAI
import json

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
    
    async def research_sources(self, query: str, filters: dict = None) -> list:
        """Generate research sources using OpenAI"""
        if self.client is None:
            # Mock sources for testing
            return [
                {
                    "title": f"Research on {query}",
                    "authors": ["AI Generated Author"],
                    "abstract": f"This is a mock abstract for research on {query}.",
                    "url": "https://example.com/mock-source",
                    "year": 2024,
                    "field": filters.get('field', 'General') if filters else 'General',
                    "type": filters.get('type', 'Article') if filters else 'Article'
                }
            ]
        
        filters = filters or {}
        year_filter = f" from {filters.get('year')}" if filters.get('year') else ""
        field_filter = f" in the field of {filters.get('field')}" if filters.get('field') else ""
        type_filter = f" of type {filters.get('type')}" if filters.get('type') else ""
        
        prompt = f"""Generate 5 relevant research sources for the query: "{query}"{year_filter}{field_filter}{type_filter}.

For each source, provide:
- title: A realistic academic title
- authors: Array of 1-3 author names
- abstract: A brief 2-3 sentence summary
- url: A plausible academic URL (use domains like arxiv.org, nature.com, sciencedirect.com, etc.)
- year: Publication year (prefer recent years{', specifically ' + str(filters.get('year')) if filters.get('year') else ''})
- field: Research field
- type: Publication type (Journal Article, Conference Paper, Book, etc.)

Return as JSON array of objects."""

        messages = [
            {"role": "system", "content": "You are a research assistant that generates realistic academic sources. Always return valid JSON."},
            {"role": "user", "content": prompt}
        ]
        
        response = await self.create_completion(messages, response_format={"type": "json_object"})
        content = response.choices[0].message.content
        
        try:
            data = json.loads(content)
            # If it's wrapped in an object, extract the array
            if isinstance(data, dict) and 'sources' in data:
                return data['sources']
            elif isinstance(data, list):
                return data
            else:
                return []
        except:
            return []
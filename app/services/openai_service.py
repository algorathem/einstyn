import openai
from ..config import settings
from typing import List, Dict, Any

class OpenAIService:
    def __init__(self):
        self.client = openai.OpenAI(api_key=settings.openai_api_key)
        self.model = settings.openai_model

    async def generate_search_queries(self, topic: str, count: int) -> List[str]:
        system_prompt = f"""Generate {count} different search queries for: {topic}.
        Return a JSON object with a 'queries' array containing the search queries."""
        
        response = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Topic: {topic}"}
            ],
            response_format={"type": "json_object"},
            temperature=0.7
        )
        
        result = response.choices[0].message.content
        import json
        data = json.loads(result)
        return data.get("queries", [])
    
    async def analyze_content(
        self, 
        original_query: str, 
        contents: List[Dict[str, Any]], 
        depth: int, 
        max_depth: int
    ) -> Dict[str, Any]:
        # Prepare content for analysis
        content_text = ""
        for content in contents:
            content_text += f"""
SOURCE: {content['title']}
URL: {content['url']}
CONTENT:
{content['content'][:5000]}
---
"""
        
        system_prompt = f"""Analyze content for "{original_query}".
        Return JSON with: summary, keyFindings array, sources array, followUpQueries array (if depth {depth} < {max_depth})."""
        
        response = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": content_text}
            ],
            response_format={"type": "json_object"},
            temperature=0.5
        )
        
        import json
        return json.loads(response.choices[0].message.content)
    
    async def generate_research_report(self, original_query: str, analyses: List[Dict[str, Any]]) -> Dict[str, Any]:
        system_prompt = f"""Compile comprehensive report on "{original_query}" from analyses. Return structured JSON."""
        
        response = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": str(analyses)}
            ],
            response_format={"type": "json_object"},
            temperature=0.5
        )
        
        import json
        return json.loads(response.choices[0].message.content)
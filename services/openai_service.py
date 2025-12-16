import os
import json
from typing import List, Dict, Any, Optional
from openai import AsyncOpenAI


class OpenAIService:
    def __init__(self, api_key: Optional[str] = None):
        self.client = AsyncOpenAI(
            api_key=api_key or os.getenv('OPENAI_API_KEY')
        )
        self.model = os.getenv('OPENAI_MODEL', 'gpt-4o')
    
    async def generate_search_queries(self, topic: str, count: int) -> List[str]:
        """Generate search queries for a given topic"""
        system_prompt = f"""You are a helpful research assistant tasked with generating search queries to explore a given topic in-depth.
Generate {count} different search queries that will help gather comprehensive information about the topic.
Each query should focus on a different aspect or perspective of the topic.
Return ONLY a valid JSON object with a "queries" key containing an array of strings with no additional text."""
        
        response = await self.client.chat.completions.create(
            model='gpt-4o',
            messages=[
                {'role': 'system', 'content': system_prompt},
                {'role': 'user', 'content': f'Topic: {topic}'}
            ],
            response_format={'type': 'json_object'},
            temperature=0.7,
        )
        
        content = response.choices[0].message.content
        if not content:
            raise Exception('Failed to generate search queries: No content returned')
        
        # Parse the response to get the search queries
        parsed_response = json.loads(content)
        return parsed_response.get('queries', [])
    
    async def analyze_content(
        self,
        original_query: str,
        extracted_contents: List[Dict[str, str]],
        depth: int,
        max_depth: int
    ) -> Dict[str, Any]:
        """Analyze extracted content to generate research insights"""
        # Prepare content for analysis
        content_parts = []
        for content in extracted_contents:
            content_part = f"""
SOURCE: {content['title']}
URL: {content['url']}
RELATED TO QUERY: {content['query']}
CONTENT:
{content['content'][:5000]}  # Limit content size to avoid token limits
"""
            content_parts.append(content_part)
        
        content_for_analysis = '\n\n'.join(content_parts)
        
        # Truncate if too large to fit in context window
        if len(content_for_analysis) > 100000:
            content_for_analysis = content_for_analysis[:100000] + '... (content truncated)'
        
        # System prompt for analysis
        system_prompt = f"""You are a research assistant analyzing web content to create a comprehensive summary on "{original_query}".

Analyze the provided content from multiple sources and:

1. Create a detailed summary of the findings
2. Identify key insights and important facts
3. List the sources used

If this is at depth {depth} of a total allowed depth of {max_depth}, also identify areas that need further research.

Format your response as a valid JSON object with the following structure:
{{
  "summary": "Comprehensive summary of findings",
  "keyFindings": ["Key finding 1", "Key finding 2", ...],
  "sources": [{{"title": "Source title", "url": "Source URL"}}, ...],
  "followUpQueries": ["Query 1", "Query 2", ...]  // Only include if further research is needed
}}"""
        
        response = await self.client.chat.completions.create(
            model=self.model,
            messages=[
                {'role': 'system', 'content': system_prompt},
                {'role': 'user', 'content': content_for_analysis}
            ],
            response_format={'type': 'json_object'},
            temperature=0.5,
        )
        
        content = response.choices[0].message.content
        if not content:
            raise Exception('Failed to generate analysis: No content returned')
        
        # Parse and return the response
        return json.loads(content)
    
    async def generate_research_report(
        self,
        original_query: str,
        analyses: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Generate a final research report from analyses at different depths"""
        analyses_content = json.dumps(analyses, indent=2)
        
        system_prompt = f"""You are a research assistant tasked with compiling a comprehensive report on "{original_query}".

You have been provided with analyses from different depths of research. Your task is to:

1. Synthesize all the information into a cohesive report
2. Organize the content into logical sections
3. Highlight the most important findings and insights
4. Include all relevant sources

Format your response as a valid JSON object with the following structure:
{{
  "title": "Research Report Title",
  "overview": "Executive summary of the entire research",
  "sections": [
    {{"title": "Section Title", "content": "Section content..."}},
    ...
  ],
  "keyTakeaways": ["Key takeaway 1", "Key takeaway 2", ...],
  "sources": [{{"title": "Source title", "url": "Source URL"}}, ...],
  "originalQuery": "The original research query",
  "metadata": {{
    "depthUsed": 2,
    "completedAt": "ISO date string"
  }}
}}"""
        
        response = await self.client.chat.completions.create(
            model=self.model,
            messages=[
                {'role': 'system', 'content': system_prompt},
                {'role': 'user', 'content': analyses_content}
            ],
            response_format={'type': 'json_object'},
            temperature=0.5,
        )
        
        content = response.choices[0].message.content
        if not content:
            raise Exception('Failed to generate final report: No content returned')
        
        return json.loads(content)


import os
import json
from typing import List, Dict, Any, Optional
from openai import AsyncOpenAI


class OpenAIService:
    def __init__(self, api_key: Optional[str] = None):
        self.client = AsyncOpenAI(
            api_key=api_key or os.getenv("OPENAI_API_KEY")
        )
        self.model = os.getenv("OPENAI_MODEL", "gpt-4o")

    async def generate_search_queries(self, topic: str, count: int) -> List[str]:
        system_prompt = (
            "You are a helpful research assistant tasked with generating search queries "
            "to explore a given topic in-depth.\n"
            f"Generate {count} different search queries that will help gather comprehensive information.\n"
            "Each query should focus on a different aspect or perspective.\n"
            "Return ONLY a valid JSON object with a 'queries' key containing an array of strings."
        )

        response = await self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Topic: {topic}"}
            ],
            response_format={"type": "json_object"},
            temperature=0.7,
        )

        content = response.choices[0].message.content
        if not content:
            raise RuntimeError("No content returned from OpenAI")

        parsed = json.loads(content)
        return parsed.get("queries", [])

    async def analyze_content(
        self,
        original_query: str,
        extracted_contents: List[Dict[str, str]],
        depth: int,
        max_depth: int,
    ) -> Dict[str, Any]:
        content_parts = []
        for item in extracted_contents:
            content_parts.append(
                f"SOURCE: {item['title']}\n"
                f"URL: {item['url']}\n"
                f"RELATED QUERY: {item['query']}\n"
                f"CONTENT:\n{item['content'][:5000]}"
            )

        content_for_analysis = "\n\n".join(content_parts)

        if len(content_for_analysis) > 100_000:
            content_for_analysis = content_for_analysis[:100_000] + "..."

        system_prompt = (
            f"You are a research assistant analyzing web content about '{original_query}'.\n\n"
            "Tasks:\n"
            "1. Summarize findings\n"
            "2. Identify key insights\n"
            "3. List sources\n\n"
            f"If depth {depth} < max depth {max_depth}, suggest follow-up research.\n\n"
            "Return a valid JSON object with:\n"
            "summary, keyFindings, sources, followUpQueries (optional)."
        )

        response = await self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": content_for_analysis},
            ],
            response_format={"type": "json_object"},
            temperature=0.5,
        )

        content = response.choices[0].message.content
        if not content:
            raise RuntimeError("No analysis returned from OpenAI")

        return json.loads(content)

    async def generate_research_report(
        self,
        original_query: str,
        analyses: List[Dict[str, Any]],
    ) -> Dict[str, Any]:
        system_prompt = (
            f"You are compiling a comprehensive research report on '{original_query}'.\n\n"
            "Tasks:\n"
            "1. Synthesize analyses\n"
            "2. Organize into sections\n"
            "3. Highlight insights\n"
            "4. Include sources\n\n"
            "Return a valid JSON object with title, overview, sections, keyTakeaways, sources, metadata."
        )

        response = await self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": json.dumps(analyses, indent=2)},
            ],
            response_format={"type": "json_object"},
            temperature=0.5,
        )

        content = response.choices[0].message.content
        if not content:
            raise RuntimeError("No report returned from OpenAI")

        return json.loads(content)

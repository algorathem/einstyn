import os
import asyncio
from typing import List, Optional, Dict, Any
from firecrawl import FirecrawlApp


class SearchResult:
    def __init__(self, url: str, title: str, snippet: str):
        self.url = url
        self.title = title
        self.snippet = snippet

    def to_dict(self) -> Dict[str, str]:
        return self.__dict__


class ExtractedContent:
    def __init__(self, url: str, title: str, content: str, query: str):
        self.url = url
        self.title = title
        self.content = content
        self.query = query

    def to_dict(self) -> Dict[str, str]:
        return self.__dict__


class FirecrawlService:
    def __init__(self, api_key: Optional[str] = None):
        key = api_key or os.getenv("FIRECRAWL_API_KEY")
        api_url = os.getenv("FIRECRAWL_API_URL")

        if not key:
            raise ValueError("Firecrawl API key not set")

        self.client = FirecrawlApp(api_key=key, api_url=api_url)

    async def search(self, query: str, logger=None) -> List[SearchResult]:
        loop = asyncio.get_running_loop()
        response = await loop.run_in_executor(None, self.client.search, query)

        if not response.get("success"):
            raise RuntimeError(response.get("error", "Search failed"))

        return [
            SearchResult(
                url=doc.get("url", ""),
                title=doc.get("title", ""),
                snippet=doc.get("description", ""),
            )
            for doc in response.get("data", [])
        ]

    async def extract_content(self, url: str, logger=None) -> str:
        loop = asyncio.get_running_loop()
        response = await loop.run_in_executor(
            None, lambda: self.client.scrape_url(url, {"formats": ["markdown"]})
        )

        if not response.get("success"):
            raise RuntimeError(response.get("error", "Scrape failed"))

        return response.get("markdown", "")

    async def batch_extract_content(
        self,
        urls_to_extract: List[Dict[str, str]],
        logger=None,
    ) -> List[ExtractedContent]:
        concurrency = int(os.getenv("FIRECRAWL_CONCURRENCY_LIMIT", "2"))
        results: List[ExtractedContent] = []

        for i in range(0, len(urls_to_extract), concurrency):
            batch = urls_to_extract[i : i + concurrency]
            tasks = [self._extract_single(item) for item in batch]
            batch_results = await asyncio.gather(*tasks, return_exceptions=True)

            for item in batch_results:
                if isinstance(item, ExtractedContent):
                    results.append(item)

        return results

    async def _extract_single(self, item: Dict[str, str]) -> Optional[ExtractedContent]:
        try:
            content = await self.extract_content(item["url"])
            return ExtractedContent(
                url=item["url"],
                title=item["title"],
                content=content,
                query=item["query"],
            )
        except Exception:
            return None

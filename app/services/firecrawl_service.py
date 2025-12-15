from firecrawl import FirecrawlApp
from ..config import settings
from typing import List, Dict, Any
import asyncio
import logging

logger = logging.getLogger(__name__)

class FirecrawlService:
    def __init__(self):
        self.client = FirecrawlApp(api_key=settings.firecrawl_api_key)
    
    async def search(self, query: str) -> List[Dict[str, str]]:
        """Search the web using Firecrawl"""
        try:
            response = self.client.search(query=query)
            
            if not response.get('success'):
                raise Exception(f"Search failed: {response.get('error')}")
            
            results = []
            for item in response.get('data', []):
                results.append({
                    'url': item.get('url', ''),
                    'title': item.get('title', ''),
                    'snippet': item.get('description', '')
                })
            
            return results
        except Exception as e:
            logger.error(f"Search failed for query '{query}': {e}")
            raise
    
    async def extract_content(self, url: str) -> str:
        """Extract content from a single URL"""
        try:
            response = self.client.scrape_url(url=url, params={'formats': ['markdown']})
            
            if not response.get('success'):
                raise Exception(f"Extraction failed: {response.get('error')}")
            
            return response.get('markdown', '')
        except Exception as e:
            logger.error(f"Content extraction failed for {url}: {e}")
            raise
    
    async def batch_extract_content(
        self, 
        urls: List[Dict[str, str]]
    ) -> List[Dict[str, str]]:
        """Extract content from multiple URLs with concurrency control"""
        concurrency_limit = settings.firecrawl_concurrency_limit
        batch_delay = settings.firecrawl_batch_delay_ms / 1000  # Convert to seconds
        
        results = []
        
        # Process in batches
        for i in range(0, len(urls), concurrency_limit):
            batch = urls[i:i + concurrency_limit]
            
            # Process batch concurrently
            batch_tasks = []
            for item in batch:
                task = self.extract_content(item['url'])
                batch_tasks.append(task)
            
            batch_results = await asyncio.gather(*batch_tasks, return_exceptions=True)
            
            # Process results
            for j, result in enumerate(batch_results):
                item = batch[j]
                if isinstance(result, Exception):
                    logger.error(f"Failed to extract {item['url']}: {result}")
                    continue
                
                results.append({
                    'url': item['url'],
                    'title': item['title'],
                    'content': result,
                    'query': item['query']
                })
            
            # Delay between batches
            if i + concurrency_limit < len(urls):
                await asyncio.sleep(batch_delay)
        
        return results
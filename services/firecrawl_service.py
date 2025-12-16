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
        return {
            'url': self.url,
            'title': self.title,
            'snippet': self.snippet
        }


class ExtractedContent:
    def __init__(self, url: str, title: str, content: str, query: str):
        self.url = url
        self.title = title
        self.content = content
        self.query = query
    
    def to_dict(self) -> Dict[str, str]:
        return {
            'url': self.url,
            'title': self.title,
            'content': self.content,
            'query': self.query
        }


class FirecrawlService:
    def __init__(self, api_key: Optional[str] = None):
        key = api_key or os.getenv('FIRECRAWL_API_KEY', '')
        api_url = os.getenv('FIRECRAWL_API_URL')
        
        if not key:
            raise ValueError('Firecrawl API key is not set')
        
        self.client = FirecrawlApp(api_key=key, api_url=api_url)
    
    async def search(self, query: str, logger: Optional[Any] = None) -> List[SearchResult]:
        """Execute a search query and return results"""
        if logger:
            logger.info('Executing search query', {'query': query})
        
        try:
            # Run synchronous Firecrawl call in thread pool
            loop = asyncio.get_event_loop()
            response = await loop.run_in_executor(None, self.client.search, query)
            
            if not response.get('success', False):
                error_msg = response.get('error', 'Unknown error')
                if logger:
                    logger.error('Search failed', {'query': query, 'error': response})
                raise Exception(f'Search failed: {error_msg}')
            
            # Transform the results to match our interface
            data = response.get('data', [])
            results = [
                SearchResult(
                    url=doc.get('url', ''),
                    title=doc.get('title', ''),
                    snippet=doc.get('description', '')
                )
                for doc in data
            ]
            
            if logger:
                logger.info('Search results received', {
                    'query': query,
                    'resultCount': len(results)
                })
            
            return results
        except Exception as error:
            error_msg = str(error) if isinstance(error, Exception) else 'Unknown error'
            if logger:
                logger.error('Error during search', {'query': query, 'error': error_msg})
            raise
    
    async def extract_content(self, url: str, logger: Optional[Any] = None) -> str:
        """Extract content from a URL"""
        if logger:
            logger.info('Extracting content from URL', {'url': url})
        
        try:
            # Run synchronous Firecrawl call in thread pool
            loop = asyncio.get_event_loop()
            response = await loop.run_in_executor(
                None,
                lambda: self.client.scrape_url(url, {'formats': ['markdown']})
            )
            
            if not response.get('success', False):
                error_msg = response.get('error', 'Unknown error')
                raise Exception(f'Scraping failed: {error_msg}')
            
            content = response.get('markdown', '')
            
            if logger:
                logger.info('Content extracted successfully', {
                    'url': url,
                    'contentLength': len(content)
                })
            
            return content
        except Exception as error:
            if logger:
                logger.error('Error during content extraction', {'url': url, 'error': str(error)})
            raise
    
    async def batch_extract_content(
        self,
        urls_to_extract: List[Dict[str, str]],
        logger: Optional[Any] = None
    ) -> List[ExtractedContent]:
        """Extract content from multiple URLs with concurrency control"""
        extracted_contents: List[ExtractedContent] = []
        
        concurrency_limit = int(os.getenv('FIRECRAWL_CONCURRENCY_LIMIT', '2'))
        
        # Process URLs in batches
        for i in range(0, len(urls_to_extract), concurrency_limit):
            batch = urls_to_extract[i:i + concurrency_limit]
            
            # Process batch concurrently
            tasks = [
                self._extract_single_url(item, logger)
                for item in batch
            ]
            batch_results = await asyncio.gather(*tasks, return_exceptions=True)
            
            for result in batch_results:
                if isinstance(result, Exception):
                    if logger:
                        logger.error('Error during batch content extraction', {'error': str(result)})
                elif result:
                    extracted_contents.append(result)
        
        return extracted_contents
    
    async def _extract_single_url(
        self,
        item: Dict[str, str],
        logger: Optional[Any] = None
    ) -> Optional[ExtractedContent]:
        """Extract content from a single URL"""
        try:
            content = await self.extract_content(item['url'], logger)
            return ExtractedContent(
                url=item['url'],
                title=item['title'],
                content=content,
                query=item['query']
            )
        except Exception as error:
            if logger:
                logger.error('Error extracting single URL', {'url': item['url'], 'error': str(error)})
            return None


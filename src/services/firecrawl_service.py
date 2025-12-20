import os
from firecrawl import FirecrawlApp

class FirecrawlService:
    def __init__(self):
        api_key = os.getenv('FIRECRAWL_API_KEY')
        if not api_key:
            raise ValueError("API key not set")
        
        self.app = FirecrawlApp(api_key=api_key)
    
    async def search(self, query, logger):
        """Search for sources using Firecrawl"""
        try:
            logger.info('Searching with Firecrawl', {'query': query})
            results = self.app.search(query)
            
            # Convert to expected format
            sources = []
            for result in results.get('data', []):
                sources.append({
                    'title': result.get('title', ''),
                    'url': result.get('url', ''),
                    'snippet': result.get('description', ''),
                })
            
            return sources
        except Exception as e:
            logger.error('Firecrawl search failed', {'error': str(e)})
            raise
    
    async def extract_content(self, url, logger):
        """Extract content from a URL using Firecrawl"""
        try:
            logger.info('Extracting content with Firecrawl', {'url': url})
            result = self.app.scrape_url(url)
            
            # Return the markdown content
            return result.get('data', {}).get('markdown', '')
        except Exception as e:
            logger.error('Firecrawl extract failed', {'error': str(e)})
            raise
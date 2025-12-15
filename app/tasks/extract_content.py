from .celery_app import celery_app
from ..services.firecrawl_service import FirecrawlService
from ..database import redis_client
import json
import asyncio

@celery_app.task
def extract_web_content(search_results: list, request_id: str, original_query: str, depth: int):
    """Extract content from search results"""
    try:
        firecrawl_service = FirecrawlService()
        
        # Flatten URLs
        urls_to_extract = []
        for sr in search_results:
            for result in sr['results']:
                urls_to_extract.append({
                    'url': result['url'],
                    'title': result['title'],
                    'query': sr['query']
                })
        
        # Extract content
        extracted_contents = asyncio.run(
            firecrawl_service.batch_extract_content(urls_to_extract)
        )
        
        # Store full content
        redis_client.set(f"{request_id}:extracted_content_depth_{depth}", json.dumps(extracted_contents))
        
        # Trigger analysis
        from .analyze_content import analyze_extracted_content
        analyze_extracted_content.delay(extracted_contents, request_id, original_query, depth)
        
    except Exception as e:
        print(f"Error extracting content: {e}")
        raise
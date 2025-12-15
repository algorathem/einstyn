from .celery_app import celery_app
from ..services.firecrawl_service import FirecrawlService
from ..database import redis_client
import json
import asyncio

@celery_app.task
def perform_web_search(search_queries: list, request_id: str, original_query: str, depth: int):
    """Perform web searches"""
    try:
        firecrawl_service = FirecrawlService()
        
        async def search_all():
            search_results = []
            for query in search_queries:
                results = await firecrawl_service.search(query)
                search_results.append({
                    'query': query,
                    'results': results
                })
            return search_results
        
        # Run async search
        search_results = asyncio.run(search_all())
        
        # Store results
        redis_client.set(f"{request_id}:search_results_depth_{depth}", json.dumps(search_results))
        
        # Trigger content extraction
        from .extract_content import extract_web_content
        extract_web_content.delay(search_results, request_id, original_query, depth)
        
    except Exception as e:
        print(f"Error in web search: {e}")
        raise
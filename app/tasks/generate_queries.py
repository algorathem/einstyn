from .celery_app import celery_app
from ..services.openai_service import OpenAIService
from ..database import redis_client
import json

@celery_app.task
def generate_search_queries(query: str, breadth: int, depth: int, request_id: str):
    """Generate search queries for research"""
    try:
        openai_service = OpenAIService()
        search_queries = openai_service.generate_search_queries(query, breadth)
        
        # Store in Redis
        redis_client.set(f"{request_id}:search_queries", json.dumps(search_queries))
        redis_client.set(f"{request_id}:original_query", query)
        redis_client.set(f"{request_id}:research_config", json.dumps({
            'breadth': breadth,
            'depth': depth,
            'current_depth': 0
        }))
        
        # Trigger next task
        from .search_web import perform_web_search
        perform_web_search.delay(search_queries, request_id, query, 0)
        
    except Exception as e:
        print(f"Error generating queries: {e}")
        raise
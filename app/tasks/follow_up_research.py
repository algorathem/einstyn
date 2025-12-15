from .celery_app import celery_app
from ..database import redis_client
import json

@celery_app.task
def process_follow_up(follow_up_queries: list, request_id: str, original_query: str, depth: int, previous_analysis: dict):
    """Process follow-up research queries"""
    try:
        # Store follow-up queries
        redis_client.set(f"{request_id}:follow_up_queries_depth_{depth}", json.dumps(follow_up_queries))
        
        # Trigger new search
        from .search_web import perform_web_search
        perform_web_search.delay(follow_up_queries, request_id, original_query, depth)
        
    except Exception as e:
        print(f"Error in follow-up research: {e}")
        raise
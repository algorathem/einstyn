from .celery_app import celery_app
from ..services.openai_service import OpenAIService
from ..database import redis_client
import json

@celery_app.task
def compile_final_report(analysis: dict, request_id: str, original_query: str, depth: int, is_complete: bool):
    """Compile final research report"""
    try:
        if not is_complete:
            return
        
        openai_service = OpenAIService()
        
        # Gather all analyses
        analyses = []
        for i in range(depth + 1):
            analysis_data = redis_client.get(f"{request_id}:analysis_depth_{i}")
            if analysis_data:
                analyses.append(json.loads(analysis_data))
        
        # Generate report
        report = openai_service.generate_research_report(original_query, analyses)
        
        # Store final report
        redis_client.set(f"{request_id}:final_report", json.dumps(report))
        
    except Exception as e:
        print(f"Error compiling report: {e}")
        raise
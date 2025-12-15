from .celery_app import celery_app
from ..services.openai_service import OpenAIService
from ..database import redis_client
import json

@celery_app.task
def analyze_extracted_content(extracted_contents: list, request_id: str, original_query: str, depth: int):
    """Analyze extracted content with AI"""
    try:
        openai_service = OpenAIService()
        
        # Get research config
        config_data = redis_client.get(f"{request_id}:research_config")
        config = json.loads(config_data) if config_data else {'depth': 0}
        
        # Analyze content
        analysis = openai_service.analyze_content(
            original_query, 
            extracted_contents, 
            depth, 
            config.get('depth', 0)
        )
        
        # Store analysis
        redis_client.set(f"{request_id}:analysis_depth_{depth}", json.dumps(analysis))
        
        # Check if more research needed
        need_more = (depth < config.get('depth', 0) and 
                    analysis.get('followUpQueries') and 
                    len(analysis['followUpQueries']) > 0)
        
        if need_more:
            # Update depth
            config['current_depth'] = depth + 1
            redis_client.set(f"{request_id}:research_config", json.dumps(config))
            
            # Trigger follow-up
            from .follow_up_research import process_follow_up
            process_follow_up.delay(
                analysis['followUpQueries'], 
                request_id, 
                original_query, 
                depth + 1,
                {
                    'summary': analysis['summary'],
                    'keyFindings': analysis['keyFindings'],
                    'sources': analysis['sources']
                }
            )
        else:
            # Compile final report
            from .compile_report import compile_final_report
            compile_final_report.delay(
                {
                    'summary': analysis['summary'],
                    'keyFindings': analysis['keyFindings'],
                    'sources': analysis['sources']
                },
                request_id,
                original_query,
                depth,
                True
            )
            
    except Exception as e:
        print(f"Error analyzing content: {e}")
        raise
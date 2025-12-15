from fastapi import APIRouter, HTTPException
from ..models.schemas import StatusResponse
from ..database import redis_client
import json

router = APIRouter()

@router.get("/research/status", response_model=StatusResponse)
async def get_research_status(request_id: str):
    """Get research status"""
    try:
        # Get stored data
        original_query = redis_client.get(f"{request_id}:original_query")
        config_data = redis_client.get(f"{request_id}:research_config")
        final_report = redis_client.get(f"{request_id}:final_report")
        
        if not original_query:
            raise HTTPException(status_code=404, detail="Research not found")
        
        config = json.loads(config_data) if config_data else {}
        status = "completed" if final_report else "in-progress"
        
        progress = None
        if config:
            progress = {
                "currentDepth": config.get("current_depth", 0),
                "totalDepth": config.get("depth", 0),
                "percentComplete": round((config.get("current_depth", 0) / config.get("depth", 1)) * 100)
            }
        
        return StatusResponse(
            request_id=request_id,
            original_query=original_query.decode(),
            status=status,
            progress=progress,
            report_available=bool(final_report)
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get status: {str(e)}")
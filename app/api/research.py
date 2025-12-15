from fastapi import APIRouter, HTTPException
from ..models.schemas import ResearchRequest, ResearchResponse
from ..tasks.generate_queries import generate_search_queries
import uuid

router = APIRouter()

@router.post("/research", response_model=ResearchResponse)
async def start_research(request: ResearchRequest):
    """Start a deep research process"""
    request_id = str(uuid.uuid4())
    
    try:
        # Trigger the research workflow
        generate_search_queries.delay(
            request.query,
            request.breadth,
            request.depth,
            request_id
        )
        
        return ResearchResponse(
            message="Research process started",
            request_id=request_id
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to start research: {str(e)}")
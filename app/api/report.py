from fastapi import APIRouter, HTTPException
from ..models.schemas import ReportResponse
from ..database import redis_client
import json

router = APIRouter()

@router.get("/research/report", response_model=ReportResponse)
async def get_research_report(request_id: str):
    """Get research report"""
    try:
        final_report = redis_client.get(f"{request_id}:final_report")
        
        if not final_report:
            raise HTTPException(status_code=404, detail="Research report not found")
        
        report_data = json.loads(final_report)
        
        return ReportResponse(
            message="Research report retrieved successfully",
            report=report_data,
            request_id=request_id
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get report: {str(e)}")
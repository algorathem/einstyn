from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime

# API Request/Response Models
class ResearchRequest(BaseModel):
    query: str
    breadth: int = 4
    depth: int = 2

class ResearchResponse(BaseModel):
    message: str
    request_id: str

class StatusResponse(BaseModel):
    request_id: str
    original_query: str
    status: str  # "in-progress" | "completed"
    progress: Optional[Dict[str, Any]] = None
    report_available: bool = False

class ReportResponse(BaseModel):
    message: str
    report: Dict[str, Any]
    request_id: str

# Internal Data Models
class SearchResult(BaseModel):
    url: str
    title: str
    snippet: str

class ExtractedContent(BaseModel):
    url: str
    title: str
    content: str
    query: str

class ResearchAnalysis(BaseModel):
    summary: str
    key_findings: List[str]
    sources: List[Dict[str, str]]
    follow_up_queries: Optional[List[str]] = None

class ResearchConfig(BaseModel):
    breadth: int
    depth: int
    current_depth: int = 0
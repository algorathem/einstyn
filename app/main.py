from fastapi import FastAPI
from .api import research, status, report
from .config import settings

app = FastAPI(
    title=settings.app_name,
    description="AI-powered deep research agent",
    version="1.0.0"
)

# Include routers
app.include_router(research.router)
app.include_router(status.router)
app.include_router(report.router)

@app.get("/")
async def root():
    return {"message": "AI Deep Research Agent API"}

@app.get("/health")
async def health():
    return {"status": "healthy"}
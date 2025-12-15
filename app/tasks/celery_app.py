from celery import Celery
from ..config import settings

celery_app = Celery('research_agent')
celery_app.config_from_object('celery_config')

# Import tasks to register them
from . import generate_queries, search_web, extract_content, analyze_content, follow_up_research, compile_report
from app.config import settings

# Celery configuration
broker_url = settings.redis_url
result_backend = settings.redis_url

task_serializer = 'json'
accept_content = ['json']
result_serializer = 'json'
timezone = 'UTC'
enable_utc = True

# Task routing
task_routes = {
    'app.tasks.generate_queries.generate_search_queries': {'queue': 'research'},
    'app.tasks.search_web.perform_web_search': {'queue': 'research'},
    'app.tasks.extract_content.extract_web_content': {'queue': 'research'},
    'app.tasks.analyze_content.analyze_extracted_content': {'queue': 'research'},
    'app.tasks.follow_up_research.process_follow_up': {'queue': 'research'},
    'app.tasks.compile_report.compile_final_report': {'queue': 'research'},
}
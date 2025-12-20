import json
import os
import sys
sys.path.insert(0, os.getcwd())
from src.services.firecrawl_service import FirecrawlService

config = {
    'type': 'api',
    'name': 'Research Query API',
    'description': 'API endpoint to query research sources',
    'path': '/api/v1/research/query',
    'method': 'POST',
    'emits': [],
    'flows': ['research'],
}

async def handler(req, context):
    """Handler for research query API"""
    logger = context.logger
    
    body = req.get('body', {})
    query = body.get('query', '')
    filters = body.get('filters', {})
    
    if not query:
        return {
            'status': 400,
            'body': {
                'message': 'Query is required'
            },
        }
    
    logger.info('Querying research sources', {
        'query': query,
        'filters': filters
    })
    
    try:
        firecrawl = FirecrawlService()
        search_results = await firecrawl.search(query, logger)
        
        sources = []
        for result in search_results:
            sources.append({
                'title': result.get('title', ''),
                'url': result.get('url', ''),
                'snippet': result.get('snippet', ''),
                'authors': [],  # Firecrawl might not provide authors
                'abstract': result.get('snippet', ''),  # Using snippet as abstract
            })
        
        return {
            'status': 200,
            'body': {
                'message': 'Sources retrieved successfully',
                'sources': sources
            },
        }
    except ValueError as e:
        if "API key not set" in str(e):
            return {
                'status': 500,
                'body': {
                    'message': 'API key not configured',
                    'error': 'Firecrawl API key is required'
                },
            }
        raise
    except Exception as error:
        logger.error('Error querying sources', {'error': str(error)})
        
        return {
            'status': 500,
            'body': {
                'message': 'Failed to query sources',
                'error': str(error)
            },
        }
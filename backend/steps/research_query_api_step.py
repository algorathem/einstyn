import json
import os
import sys
sys.path.insert(0, os.getcwd())
from src.services.openai_service import OpenAIService
from src.services.database_service import database_service

config = {
    'type': 'api',
    'name': 'Research Query API',
    'description': 'API endpoint to query research sources',
    'path': '/api/research/query',
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
        # Ensure table exists
        await database_service.create_sources_table()
        
        # First, search existing sources in database
        existing_sources = await database_service.search_sources(query, filters)
        
        sources = []
        # Convert DB results to expected format
        for source in existing_sources:
            sources.append({
                'title': source['title'],
                'authors': source['authors'] or [],
                'abstract': source['abstract'] or '',
                'url': source['url'] or '',
                'year': source['year'],
                'field': source['field'],
                'type': source['type']
            })
        
        # If we have less than 5 sources, generate new ones with OpenAI
        if len(sources) < 5:
            openai = OpenAIService()
            generated_sources = await openai.research_sources(query, filters)
            
            # Store new sources in database
            for source in generated_sources:
                try:
                    await database_service.insert_source(source)
                    sources.append(source)
                except Exception as e:
                    logger.error('Error storing source', {'error': str(e), 'source': source})
                    # Still add to response even if DB fails
                    sources.append(source)
        
        return {
            'status': 200,
            'body': {
                'message': 'Sources retrieved successfully',
                'sources': sources[:10]  # Limit to 10 sources
            },
        }
    except Exception as error:
        logger.error('Error querying sources', {'error': str(error)})
        
        return {
            'status': 500,
            'body': {
                'message': 'Failed to query sources',
                'error': str(error)
            },
        }
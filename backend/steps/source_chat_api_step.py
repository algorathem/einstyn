import json
import os
import sys
sys.path.insert(0, os.getcwd())
from src.services.database_service import database_service
from src.services.openai_service import OpenAIService

config = {
    'type': 'api',
    'name': 'Source Chat API',
    'description': 'API endpoint for chatting with a research source',
    'path': '/api/source/:sourceId/chat',
    'method': 'POST',
    'emits': [],
    'flows': ['research'],
}

async def handler(req, context):
    """Handler for source chat API"""
    logger = context.logger
    
    path_params = req.get('pathParams', {})
    source_id = path_params.get('sourceId', '')
    body = req.get('body', {})
    user_message = body.get('message', '')
    mode = body.get('mode', 'summary')  # summary, explanation, implementation
    
    if not source_id or not user_message:
        return {
            'status': 400,
            'body': {
                'message': 'Source ID and message are required'
            },
        }
    
    logger.info('Chatting with source', {
        'sourceId': source_id,
        'mode': mode
    })
    
    try:
        # Fetch source from database by ID
        source = await database_service.get_source_by_id(int(source_id))
        
        if not source:
            return {
                'status': 404,
                'body': {
                    'message': 'Source not found'
                },
            }
        
        # Use source content (title + abstract as the content)
        content = f"Title: {source['title']}\n\nAbstract: {source['abstract']}\n\nAuthors: {', '.join(source['authors'])}\n\nYear: {source['year']}\n\nField: {source['field']}"
        
        openai = OpenAIService()
        
        # Craft prompt based on mode and user message
        if mode == 'summary':
            prompt = f"Based on this research source, provide a point-form summary addressing: {user_message}\n\nSource Content:\n{content}"
        elif mode == 'explanation':
            prompt = f"Explain the concepts in this research source as they relate to: {user_message}\n\nSource Content:\n{content}"
        elif mode == 'implementation':
            prompt = f"Provide step-by-step implementation guidance based on this research source for: {user_message}\n\nSource Content:\n{content}"
        else:
            prompt = f"Respond to: {user_message}\n\nBased on this research source:\n{content}"
        
        # Use chat completion
        response = await openai.create_completion(
            messages=[
                {"role": "system", "content": "You are a helpful research assistant that provides accurate information based on the given research source. Be concise but informative."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
        )
        
        ai_response = response.choices[0].message.content
        
        return {
            'status': 200,
            'body': {
                'message': 'Chat response generated',
                'response': ai_response,
                'mode': mode,
                'source': {
                    'id': source['id'],
                    'title': source['title'],
                    'authors': source['authors'],
                    'year': source['year']
                }
            },
        }
    except Exception as error:
        logger.error('Error in source chat', {'error': str(error)})
        
        return {
            'status': 500,
            'body': {
                'message': 'Failed to generate chat response',
                'error': str(error)
            },
        }
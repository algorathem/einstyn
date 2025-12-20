import json
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
from src.services.firecrawl_service import FirecrawlService
from src.services.openai_service import OpenAIService

config = {
    'type': 'api',
    'name': 'Source Chat API',
    'description': 'API endpoint for chatting with a research source',
    'path': '/api/source/{sourceId}/chat',
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
        # Assume sourceId is the URL
        url = source_id
        
        firecrawl = FirecrawlService()
        content = await firecrawl.extract_content(url, logger)
        
        openai = OpenAIService()
        
        # Craft prompt based on mode
        if mode == 'summary':
            prompt = f"Summarize the following content in point form: {content[:5000]}"
        elif mode == 'explanation':
            prompt = f"Explain the key concepts in this content: {content[:5000]}"
        elif mode == 'implementation':
            prompt = f"Provide step-by-step implementation guidance based on this content: {content[:5000]}"
        else:
            prompt = f"Respond to: {user_message}\n\nContent: {content[:5000]}"
        
        # For simplicity, use a basic chat completion
        response = await openai.client.chat.completions.create(
            model=openai.model,
            messages=[
                {"role": "system", "content": "You are a helpful research assistant."},
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
                'mode': mode
            },
        }
    except ValueError as e:
        if "API key not set" in str(e):
            return {
                'status': 500,
                'body': {
                    'message': 'API key not configured',
                    'error': str(e)
                },
            }
        raise
    except Exception as error:
        logger.error('Error in source chat', {'error': str(error)})
        
        return {
            'status': 500,
            'body': {
                'message': 'Failed to generate chat response',
                'error': str(error)
            },
        }
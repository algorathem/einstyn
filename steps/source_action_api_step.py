import json
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
from src.services.firecrawl_service import FirecrawlService
from src.services.openai_service import OpenAIService

config = {
    'type': 'api',
    'name': 'Source Action API',
    'description': 'API endpoint for performing actions on research sources',
    'path': '/api/source/{sourceId}/action',
    'method': 'POST',
    'emits': [],
    'flows': ['research'],
}

async def handler(req, context):
    """Handler for source action API"""
    logger = context.logger
    
    path_params = req.get('pathParams', {})
    source_id = path_params.get('sourceId', '')
    body = req.get('body', {})
    action_type = body.get('actionType', '')
    context_data = body.get('context', '')  # Additional context for the action
    
    if not source_id or not action_type:
        return {
            'status': 400,
            'body': {
                'message': 'Source ID and action type are required'
            },
        }
    
    logger.info('Performing action on source', {
        'sourceId': source_id,
        'actionType': action_type
    })
    
    try:
        # Assume sourceId is the URL
        url = source_id
        
        firecrawl = FirecrawlService()
        content = await firecrawl.extract_content(url, logger)
        
        openai = OpenAIService()
        
        # Craft prompt based on action type
        action_prompts = {
            'generate_code_snippet': f"Generate a code snippet based on this content: {content[:5000]}\n\nContext: {context_data}",
            'highlight_method': f"Highlight and explain the key methods/algorithms in this content: {content[:5000]}\n\nContext: {context_data}",
            'explain_term': f"Explain the following term/concept from the content: {context_data}\n\nContent: {content[:5000]}",
            'summarize_section': f"Summarize the section about: {context_data}\n\nContent: {content[:5000]}",
        }
        
        prompt = action_prompts.get(action_type, f"Perform action '{action_type}' on this content: {content[:5000]}\n\nContext: {context_data}")
        
        response = await openai.client.chat.completions.create(
            model=openai.model,
            messages=[
                {"role": "system", "content": "You are a helpful research assistant performing specific actions on academic content."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.5,
        )
        
        ai_response = response.choices[0].message.content
        
        return {
            'status': 200,
            'body': {
                'message': 'Action completed successfully',
                'actionType': action_type,
                'response': ai_response
            },
        }
    except ValueError as e:
        if "API key not set" in str(e):
            return {
                'status': 500,
                'body': {
                    'message': 'API key not configured',
                    'error': 'OpenAI or Firecrawl API key is required'
                },
            }
        raise
    except Exception as error:
        logger.error('Error performing action', {'error': str(error)})
        
        return {
            'status': 500,
            'body': {
                'message': 'Failed to perform action',
                'error': str(error)
            },
        }
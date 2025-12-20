import json
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
from src.services.openai_service import OpenAIService

config = {
    'type': 'api',
    'name': 'Source Validation API',
    'description': 'API endpoint for validating AI responses',
    'path': '/api/source/{sourceId}/validate',
    'method': 'POST',
    'emits': [],
    'flows': ['research'],
}

async def handler(req, context):
    """Handler for source validation API"""
    logger = context.logger
    
    path_params = req.get('pathParams', {})
    source_id = path_params.get('sourceId', '')
    body = req.get('body', {})
    ai_response = body.get('aiResponse', '')
    constraints = body.get('constraints', {})
    
    if not source_id or not ai_response:
        return {
            'status': 400,
            'body': {
                'message': 'Source ID and AI response are required'
            },
        }
    
    logger.info('Validating AI response', {
        'sourceId': source_id,
        'constraints': constraints
    })
    
    try:
        openai = OpenAIService()
        
        prompt = f"Validate this AI response against the source and constraints:\n\nAI Response: {ai_response}\n\nConstraints: {json.dumps(constraints)}\n\nProvide a validation report with confidence score and flagged inconsistencies."
        
        response = await openai.client.chat.completions.create(
            model=openai.model,
            messages=[
                {"role": "system", "content": "You are a validation assistant. Check accuracy and consistency."},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"},
            temperature=0.5,
        )
        
        validation_report = json.loads(response.choices[0].message.content)
        
        return {
            'status': 200,
            'body': {
                'message': 'Validation completed successfully',
                'validationReport': validation_report
            },
        }
    except ValueError as e:
        if "API key not set" in str(e):
            return {
                'status': 500,
                'body': {
                    'message': 'API key not configured',
                    'error': 'OpenAI API key is required'
                },
            }
        raise
    except Exception as error:
        logger.error('Error validating response', {'error': str(error)})
        
        return {
            'status': 500,
            'body': {
                'message': 'Failed to validate response',
                'error': str(error)
            },
        }
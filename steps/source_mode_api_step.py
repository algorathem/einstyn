import json
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

config = {
    'type': 'api',
    'name': 'Source Mode API',
    'description': 'API endpoint for toggling source interaction modes',
    'path': '/api/v1/source/mode',
    'method': 'POST',
    'emits': [],
    'flows': ['research'],
}

async def handler(req, context):
    """Handler for source mode toggle API"""
    logger = context.logger
    
    query_params = req.get('queryParams', {})
    source_id = query_params.get('sourceId', '')
    body = req.get('body', {})
    mode = body.get('mode', 'summary')  # summary, explanation, implementation
    
    if not source_id:
        return {
            'status': 400,
            'body': {
                'message': 'Source ID is required'
            },
        }
    
    valid_modes = ['summary', 'explanation', 'implementation']
    if mode not in valid_modes:
        return {
            'status': 400,
            'body': {
                'message': f'Invalid mode. Must be one of: {", ".join(valid_modes)}'
            },
        }
    
    logger.info('Toggling source mode', {
        'sourceId': source_id,
        'mode': mode
    })
    
    try:
        # Here you could emit an event to update the workflow or store the mode
        # For now, just acknowledge the mode change
        
        return {
            'status': 200,
            'body': {
                'message': 'Mode updated successfully',
                'sourceId': source_id,
                'mode': mode
            },
        }
    except Exception as error:
        logger.error('Error updating mode', {'error': str(error)})
        
        return {
            'status': 500,
            'body': {
                'message': 'Failed to update mode',
                'error': str(error)
            },
        }
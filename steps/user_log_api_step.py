import json
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

config = {
    'type': 'api',
    'name': 'User Log API',
    'description': 'API endpoint for logging user interactions',
    'path': '/api/user/log',
    'method': 'POST',
    'emits': [],
    'flows': ['research'],
}

async def handler(req, context):
    """Handler for user logging API"""
    logger = context.logger
    
    body = req.get('body', {})
    user_id = body.get('userId', 'anonymous')
    action = body.get('action', '')
    metadata = body.get('metadata', {})
    timestamp = body.get('timestamp', None)
    
    if not action:
        return {
            'status': 400,
            'body': {
                'message': 'Action is required'
            },
        }
    
    logger.info('User action logged', {
        'userId': user_id,
        'action': action,
        'metadata': metadata,
        'timestamp': timestamp
    })
    
    try:
        # Here you could store the log in a database or emit an event
        # For now, just acknowledge the log
        
        return {
            'status': 200,
            'body': {
                'message': 'User action logged successfully',
                'logged': True
            },
        }
    except Exception as error:
        logger.error('Error logging user action', {'error': str(error)})
        
        return {
            'status': 500,
            'body': {
                'message': 'Failed to log user action',
                'error': str(error)
            },
        }
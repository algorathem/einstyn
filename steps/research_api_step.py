config = {
    'type': 'api',
    'name': 'Deep Research API',
    'description': 'API endpoint to start a deep research process',
    'path': '/research',
    'method': 'POST',
    'emits': [{
        'topic': 'research-started',
        'label': 'Research process started',
    }],
    'flows': ['research'],
}


async def handler(req, context):
    """Handler for deep research API"""
    logger = context['logger']
    emit = context['emit']
    trace_id = context['traceId']
    
    body = req.get('body', {})
    query = body.get('query', '')
    breadth = body.get('breadth', 4)
    depth = body.get('depth', 2)
    
    logger.info('Starting deep research process', {
        'query': query,
        'breadth': breadth,
        'depth': depth,
        'traceId': trace_id
    })
    
    await emit({
        'topic': 'research-started',
        'data': {
            'query': query,
            'breadth': breadth,
            'depth': depth,
            'requestId': trace_id
        },
    })
    
    return {
        'status': 200,
        'body': {
            'message': 'Research process started',
            'requestId': trace_id
        },
    }


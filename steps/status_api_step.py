config = {
    'type': 'api',
    'name': 'Research Status API',
    'description': 'API endpoint to check the status of a research process',
    'path': '/research/status',
    'method': 'GET',
    'emits': [],
    'flows': ['research'],
}


async def handler(req, context):
    """Handler for research status API"""
    logger = context['logger']
    state = context['state']
    
    request_id = req.get('queryParams', {}).get('requestId', '')
    logger.info('Checking research status', {'requestId': request_id})
    
    try:
        # Retrieve original query and research config
        original_query = await state.get(request_id, 'originalQuery')
        research_config = await state.get(request_id, 'researchConfig')
        final_report = await state.get(request_id, 'finalReport')
        
        if not original_query or not research_config:
            return {
                'status': 404,
                'body': {
                    'message': 'Research not found',
                    'requestId': request_id
                },
            }
        
        status = 'completed' if final_report else 'in-progress'
        progress = None
        if research_config:
            current_depth = research_config.get('currentDepth', 0)
            total_depth = research_config.get('depth', 0)
            progress = {
                'currentDepth': current_depth,
                'totalDepth': total_depth,
                'percentComplete': round((current_depth / total_depth * 100) if total_depth > 0 else 0)
            }
        
        return {
            'status': 200,
            'body': {
                'message': 'Research status retrieved successfully',
                'requestId': request_id,
                'originalQuery': original_query,
                'status': status,
                'progress': progress,
                'reportAvailable': bool(final_report)
            },
        }
    except Exception as error:
        logger.error('Error checking research status', {'requestId': request_id, 'error': str(error)})
        
        return {
            'status': 500,
            'body': {
                'message': 'Failed to check research status',
                'requestId': request_id,
                'error': str(error)
            },
        }


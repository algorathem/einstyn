config = {
    'type': 'api',
    'name': 'Research Report API',
    'description': 'API endpoint to retrieve research reports',
    'path': '/research/report',
    'method': 'GET',
    'emits': [],
    'flows': ['research'],
}


async def handler(req, context):
    """Handler for research report API"""
    logger = context['logger']
    state = context['state']
    
    request_id = req.get('queryParams', {}).get('requestId', '')
    logger.info('Retrieving research report', {'requestId': request_id})
    
    try:
        # Retrieve the final report from state
        final_report = await state.get(request_id, 'finalReport')
        
        if not final_report:
            return {
                'status': 404,
                'body': {
                    'message': 'Research report not found',
                    'requestId': request_id
                },
            }
        
        return {
            'status': 200,
            'body': {
                'message': 'Research report retrieved successfully',
                'report': final_report,
                'requestId': request_id
            },
        }
    except Exception as error:
        logger.error('Error retrieving research report', {'requestId': request_id, 'error': str(error)})
        
        return {
            'status': 500,
            'body': {
                'message': 'Failed to retrieve research report',
                'requestId': request_id,
                'error': str(error)
            },
        }


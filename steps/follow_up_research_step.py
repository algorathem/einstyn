config = {
    'type': 'event',
    'name': 'Follow-up Research',
    'description': 'Process follow-up research queries for deeper investigation',
    'subscribes': ['follow-up-research-needed'],
    'emits': [{
        'topic': 'search-queries-generated',
        'label': 'Search queries generated',
    }],
    'flows': ['research'],
}


async def handler(input_data, context):
    """Handler for follow-up research"""
    logger = context['logger']
    state = context['state']
    emit = context['emit']
    trace_id = context['traceId']
    
    follow_up_queries = input_data.get('followUpQueries', [])
    request_id = input_data.get('requestId', '')
    original_query = input_data.get('originalQuery', '')
    depth = input_data.get('depth', 0)
    
    logger.info('Processing follow-up research queries', {
        'queriesCount': len(follow_up_queries),
        'depth': depth
    })
    
    try:
        # Store the follow-up queries in state
        await state.set(trace_id, f'followUpQueries-depth-{depth}', follow_up_queries)
        
        # Pass the follow-up queries directly to the search step
        await emit({
            'topic': 'search-queries-generated',
            'data': {
                'searchQueries': follow_up_queries,
                'requestId': request_id,
                'originalQuery': original_query,
                'depth': depth
            }
        })
        
    except Exception as error:
        logger.error('Error processing follow-up research', {'error': str(error)})
        raise


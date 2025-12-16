from services.firecrawl_service import FirecrawlService

config = {
    'type': 'event',
    'name': 'Web Search',
    'description': 'Perform web searches using Firecrawl',
    'subscribes': ['search-queries-generated'],
    'emits': [{
        'topic': 'search-results-collected',
        'label': 'Search results collected',
    }],
    'flows': ['research'],
}


async def handler(input_data, context):
    """Handler for web search event"""
    logger = context['logger']
    state = context['state']
    emit = context['emit']
    trace_id = context['traceId']
    
    search_queries = input_data.get('searchQueries', [])
    request_id = input_data.get('requestId', '')
    original_query = input_data.get('originalQuery', '')
    depth = input_data.get('depth', 0)
    
    logger.info('Performing web searches', {
        'numberOfQueries': len(search_queries),
        'depth': depth
    })
    
    firecrawl_service = FirecrawlService()
    search_results = []
    
    # Process each search query sequentially to avoid rate limiting
    for query in search_queries:
        logger.info('Executing search query', {'query': query})
        
        try:
            # Use the FirecrawlService to perform the search
            results = await firecrawl_service.search(query, logger)
            
            # Convert SearchResult objects to dicts
            results_dict = [r.to_dict() for r in results]
            
            # Add the search results to our collection
            search_results.append({
                'query': query,
                'results': results_dict
            })
        except Exception as error:
            logger.error('Error during web search', {'query': query, 'error': str(error)})
            # Continue with other queries even if one fails
    
    # Store the search results in state
    await state.set(trace_id, f'searchResults-depth-{depth}', search_results)
    
    # Emit event with the collected search results
    await emit({
        'topic': 'search-results-collected',
        'data': {
            'searchResults': search_results,
            'requestId': request_id,
            'originalQuery': original_query,
            'depth': depth
        }
    })


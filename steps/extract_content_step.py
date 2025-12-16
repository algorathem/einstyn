from services.firecrawl_service import FirecrawlService

config = {
    'type': 'event',
    'name': 'Extract Web Content',
    'description': 'Extract content from web pages using Firecrawl',
    'subscribes': ['search-results-collected'],
    'emits': [{
        'topic': 'content-extracted',
        'label': 'Content extracted',
    }],
    'flows': ['research'],
}


async def handler(input_data, context):
    """Handler for extracting web content"""
    logger = context['logger']
    state = context['state']
    emit = context['emit']
    trace_id = context['traceId']
    
    search_results = input_data.get('searchResults', [])
    request_id = input_data.get('requestId', '')
    original_query = input_data.get('originalQuery', '')
    depth = input_data.get('depth', 0)
    
    logger.info('Extracting content from web pages', {
        'numberOfQueries': len(search_results),
        'depth': depth
    })
    
    try:
        firecrawl_service = FirecrawlService()
        
        # Flatten the search results to get all URLs
        urls_to_extract = []
        for sr in search_results:
            query = sr.get('query', '')
            for result in sr.get('results', []):
                urls_to_extract.append({
                    'url': result.get('url', ''),
                    'title': result.get('title', ''),
                    'query': query
                })
        
        # Extract content from all URLs using the service
        extracted_contents = await firecrawl_service.batch_extract_content(
            urls_to_extract,
            logger
        )
        
        # Convert ExtractedContent objects to dicts
        extracted_contents_dict = [ec.to_dict() for ec in extracted_contents]
        
        # Truncate content to avoid SNS message size limits (256KB)
        # Each content limited to 10,000 characters to stay well under SNS limits
        MAX_CONTENT_LENGTH = 10000
        truncated_contents = []
        for content in extracted_contents_dict:
            content_str = content.get('content', '')
            if len(content_str) > MAX_CONTENT_LENGTH:
                truncated_contents.append({
                    **content,
                    'content': content_str[:MAX_CONTENT_LENGTH] + '\n... (content truncated)'
                })
            else:
                truncated_contents.append(content)
        
        logger.info('Content extracted and truncated', {
            'originalCount': len(extracted_contents_dict),
            'truncatedCount': len(truncated_contents),
            'totalSize': len(str(truncated_contents))
        })
        
        # Store the full extracted content in state (no size limits)
        await state.set(trace_id, f'extractedContent-depth-{depth}', extracted_contents_dict)
        
        # Emit event with truncated content (for SNS compatibility)
        await emit({
            'topic': 'content-extracted',
            'data': {
                'extractedContents': truncated_contents,
                'requestId': request_id,
                'originalQuery': original_query,
                'depth': depth
            }
        })
    except Exception as error:
        error_msg = str(error) if isinstance(error, Exception) else 'Unknown error'
        logger.error('Failed to extract content', {'error': error_msg})
        raise


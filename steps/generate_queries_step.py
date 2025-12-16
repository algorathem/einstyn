from services.openai_service import OpenAIService
from steps.types.research_config import ResearchConfig

config = {
    'type': 'event',
    'name': 'Generate Search Queries',
    'description': 'Generate search queries based on the research topic',
    'subscribes': ['research-started'],
    'emits': [{
        'topic': 'search-queries-generated',
        'label': 'Search queries generated',
    }],
    'flows': ['research'],
}


async def handler(input_data, context):
    """Handler for generating search queries"""
    logger = context['logger']
    state = context['state']
    emit = context['emit']
    trace_id = context['traceId']
    
    query = input_data.get('query', '')
    breadth = input_data.get('breadth', 4)
    depth = input_data.get('depth', 2)
    request_id = input_data.get('requestId', '')
    
    logger.info('Generating search queries for research topic', input_data)
    
    try:
        # Use the OpenAI service to generate search queries
        openai_service = OpenAIService()
        search_queries = await openai_service.generate_search_queries(query, breadth)
        
        logger.info('Generated search queries', {'searchQueries': search_queries})
        
        # Store the search queries in state
        await state.set(trace_id, 'searchQueries', search_queries)
        await state.set(trace_id, 'originalQuery', query)
        await state.set(trace_id, 'researchConfig', {
            'breadth': breadth,
            'depth': depth,
            'currentDepth': 0
        })
        
        # Emit event with the generated queries
        await emit({
            'topic': 'search-queries-generated',
            'data': {
                'searchQueries': search_queries,
                'requestId': request_id,
                'originalQuery': query,
                'depth': 0,
            }
        })
    except Exception as error:
        logger.error('Error generating search queries', {'error': str(error)})
        raise


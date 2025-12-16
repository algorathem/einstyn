from services.openai_service import OpenAIService
from steps.types.research_config import ResearchConfig

config = {
    'type': 'event',
    'name': 'Analyze Content',
    'description': 'Analyze extracted content and generate research summary',
    'subscribes': ['content-extracted'],
    'emits': [{
        'topic': 'analysis-completed',
        'label': 'Analysis completed',
    }, {
        'topic': 'follow-up-research-needed',
        'label': 'Follow-up research needed',
    }],
    'flows': ['research'],
}


async def handler(input_data, context):
    """Handler for analyzing content"""
    logger = context['logger']
    state = context['state']
    emit = context['emit']
    trace_id = context['traceId']
    
    extracted_contents = input_data.get('extractedContents', [])
    request_id = input_data.get('requestId', '')
    original_query = input_data.get('originalQuery', '')
    depth = input_data.get('depth', 0)
    
    logger.info('Analyzing extracted content', {
        'contentCount': len(extracted_contents),
        'depth': depth
    })
    
    try:
        # Retrieve research config to check depth
        research_config = await state.get(trace_id, 'researchConfig')
        
        # Get full content from state (not truncated version from event)
        full_extracted_contents = await state.get(trace_id, f'extractedContent-depth-{depth}')
        if not full_extracted_contents:
            full_extracted_contents = extracted_contents
        
        logger.info('Using content for analysis', {
            'fullContentCount': len(full_extracted_contents),
            'fromState': full_extracted_contents != extracted_contents
        })
        
        # Use the OpenAI service to analyze content
        openai_service = OpenAIService()
        max_depth = research_config.get('depth', 0) if research_config else 0
        parsed_response = await openai_service.analyze_content(
            original_query,
            full_extracted_contents,
            depth,
            max_depth
        )
        
        logger.info('Analysis completed', {
            'summaryLength': len(parsed_response.get('summary', '')),
            'keyFindingsCount': len(parsed_response.get('keyFindings', [])),
            'sourcesCount': len(parsed_response.get('sources', [])),
            'followUpCount': len(parsed_response.get('followUpQueries', []))
        })
        
        # Store the analysis in state
        await state.set(trace_id, f'analysis-depth-{depth}', parsed_response)
        
        # Check if we need to continue research
        follow_up_queries = parsed_response.get('followUpQueries', [])
        need_more_research = (
            depth < max_depth and
            isinstance(follow_up_queries, list) and
            len(follow_up_queries) > 0
        )
        
        if need_more_research:
            # Update current depth
            if research_config:
                research_config['currentDepth'] = depth + 1
                await state.set(trace_id, 'researchConfig', research_config)
            
            # Emit event for follow-up research
            await emit({
                'topic': 'follow-up-research-needed',
                'data': {
                    'followUpQueries': follow_up_queries,
                    'requestId': request_id,
                    'originalQuery': original_query,
                    'depth': depth + 1,
                    'previousAnalysis': {
                        'summary': parsed_response.get('summary', ''),
                        'keyFindings': parsed_response.get('keyFindings', []),
                        'sources': parsed_response.get('sources', [])
                    }
                }
            })
        else:
            # Emit event for completion
            await emit({
                'topic': 'analysis-completed',
                'data': {
                    'analysis': {
                        'summary': parsed_response.get('summary', ''),
                        'keyFindings': parsed_response.get('keyFindings', []),
                        'sources': parsed_response.get('sources', [])
                    },
                    'requestId': request_id,
                    'originalQuery': original_query,
                    'depth': depth,
                    'isComplete': True
                }
            })
    except Exception as error:
        logger.error('Error analyzing content', {'error': str(error)})
        raise


from services.openai_service import OpenAIService
from datetime import datetime

config = {
    'type': 'event',
    'name': 'Compile Research Report',
    'description': 'Compile final research report with all findings',
    'subscribes': ['analysis-completed'],
    'emits': [{
        'topic': 'report-completed',
        'label': 'Report completed',
    }],
    'flows': ['research'],
}


async def handler(input_data, context):
    """Handler for compiling research report"""
    logger = context['logger']
    state = context['state']
    emit = context['emit']
    trace_id = context['traceId']
    
    analysis = input_data.get('analysis', {})
    request_id = input_data.get('requestId', '')
    original_query = input_data.get('originalQuery', '')
    depth = input_data.get('depth', 0)
    is_complete = input_data.get('isComplete', False)
    
    logger.info('Compiling final research report', {
        'originalQuery': original_query,
        'depth': depth,
        'isComplete': is_complete
    })
    
    try:
        # Only compile the final report when research is complete
        if not is_complete:
            logger.info('Research not yet complete, waiting for further analysis')
            return
        
        # Use the OpenAI service to generate the report
        openai_service = OpenAIService()
        
        # Get all previous analyses from different depths
        analyses = []
        
        for i in range(depth + 1):
            analysis_data = await state.get(trace_id, f'analysis-depth-{i}')
            if analysis_data:
                analyses.append({
                    'depth': i,
                    **analysis_data
                })
        
        logger.info('Retrieved analyses from all depths', {
            'analysesCount': len(analyses)
        })
        
        # Generate the final report using the OpenAI service
        parsed_response = await openai_service.generate_research_report(original_query, analyses)
        
        logger.info('Final report generated', {
            'title': parsed_response.get('title', ''),
            'overviewLength': len(parsed_response.get('overview', '')),
            'sectionsCount': len(parsed_response.get('sections', [])),
            'takeawaysCount': len(parsed_response.get('keyTakeaways', [])),
            'sourcesCount': len(parsed_response.get('sources', []))
        })
        
        # Store the final report in state
        await state.set(trace_id, 'finalReport', parsed_response)
        
        # Emit event for report completion
        await emit({
            'topic': 'report-completed',
            'data': {
                'report': parsed_response,
                'requestId': request_id,
                'originalQuery': original_query
            }
        })
    except Exception as error:
        logger.error('Error compiling final report', {'error': str(error)})
        raise


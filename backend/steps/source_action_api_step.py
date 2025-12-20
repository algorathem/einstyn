import json
import os
import sys
sys.path.insert(0, os.getcwd())
from src.services.openai_service import OpenAIService
from src.services.database_service import database_service

config = {
    'type': 'api',
    'name': 'Source Action API',
    'description': 'API endpoint for performing quick actions on research sources',
    'path': '/api/source/:sourceId/action',
    'method': 'POST',
    'emits': [],
    'flows': ['research'],
}

async def handler(req, context):
    """Handler for source action API"""
    logger = context.logger
    
    path_params = req.get('pathParams', {})
    source_id = path_params.get('sourceId', '')
    body = req.get('body', {})
    action_type = body.get('actionType', '')
    context_data = body.get('context', '')  # Additional context for the action
    
    if not source_id:
        return {
            'status': 400,
            'body': {
                'message': 'Source ID is required'
            },
        }
    
    if not action_type:
        return {
            'status': 400,
            'body': {
                'message': 'Action type is required'
            },
        }
    
    valid_actions = [
        'generate_code_snippet',
        'highlight_method', 
        'explain_term',
        'summarize_section',
        'extract_quotes',
        'find_references',
        'create_outline'
    ]
    
    if action_type not in valid_actions:
        return {
            'status': 400,
            'body': {
                'message': f'Invalid action type. Must be one of: {", ".join(valid_actions)}'
            },
        }
    
    logger.info('Performing action on source', {
        'sourceId': source_id,
        'actionType': action_type
    })
    
    try:
        # Fetch source from database
        source = await database_service.get_source_by_id(int(source_id))
        if not source:
            return {
                'status': 404,
                'body': {
                    'message': 'Source not found'
                },
            }
        
        openai = OpenAIService()
        
        # Craft prompt based on action type
        action_prompts = {
            'generate_code_snippet': f"""Based on this research source, generate a practical code snippet that demonstrates the key concepts discussed.

Source Title: {source['title']}
Source Abstract: {source['abstract']}
Source Content: {source.get('content', 'Content not available')}

Context: {context_data}

Please provide a complete, runnable code snippet with comments explaining how it relates to the research.""",
            
            'highlight_method': f"""Analyze this research source and highlight the key methods, algorithms, or approaches discussed.

Source Title: {source['title']}
Source Abstract: {source['abstract']}
Source Content: {source.get('content', 'Content not available')}

Context: {context_data}

Please provide:
1. Key methods identified
2. How they work
3. Their significance to the research
4. Any limitations mentioned""",
            
            'explain_term': f"""Explain the following term or concept from this research source.

Source Title: {source['title']}
Source Abstract: {source['abstract']}
Source Content: {source.get('content', 'Content not available')}

Term/Concept to explain: {context_data}

Please provide a clear, comprehensive explanation with examples if relevant.""",
            
            'summarize_section': f"""Summarize the section or topic specified from this research source.

Source Title: {source['title']}
Source Abstract: {source['abstract']}
Source Content: {source.get('content', 'Content not available')}

Section/Topic: {context_data}

Please provide a concise but comprehensive summary.""",
            
            'extract_quotes': f"""Extract the most important or relevant quotes from this research source.

Source Title: {source['title']}
Source Abstract: {source['abstract']}
Source Content: {source.get('content', 'Content not available')}

Context: {context_data}

Please extract 3-5 key quotes that best represent the main findings or conclusions.""",
            
            'find_references': f"""Find and list relevant references or citations from this research source.

Source Title: {source['title']}
Source Abstract: {source['abstract']}
Source Content: {source.get('content', 'Content not available')}

Context: {context_data}

Please identify and list key references, related works, or citations mentioned.""",
            
            'create_outline': f"""Create a structured outline of this research source.

Source Title: {source['title']}
Source Abstract: {source['abstract']}
Source Content: {source.get('content', 'Content not available')}

Context: {context_data}

Please create a hierarchical outline showing the main sections, subsections, and key points."""
        }
        
        prompt = action_prompts.get(action_type, f"Perform action '{action_type}' on this source: {source['title']}\n\nContent: {source.get('content', 'Content not available')}\n\nContext: {context_data}")
        
        response = await openai.create_completion(
            messages=[
                {"role": "system", "content": "You are a helpful research assistant performing specific actions on academic sources. Provide clear, accurate, and well-structured responses."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,  # Lower temperature for more focused responses
        )
        
        ai_response = response.choices[0].message.content
        
        return {
            'status': 200,
            'body': {
                'message': 'Action completed successfully',
                'actionType': action_type,
                'sourceId': source_id,
                'response': ai_response,
                'source': {
                    'id': source['id'],
                    'title': source['title']
                }
            },
        }
    except Exception as error:
        logger.error('Error performing action', {'error': str(error)})
        
        return {
            'status': 500,
            'body': {
                'message': 'Failed to perform action',
                'error': str(error)
            },
        }
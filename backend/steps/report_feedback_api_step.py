import json
import os
import sys
sys.path.insert(0, os.getcwd())
from src.services.openai_service import OpenAIService

config = {
    'type': 'api',
    'name': 'Report Feedback API',
    'description': 'API endpoint for getting AI feedback on research reports',
    'path': '/api/v1/report/feedback',
    'method': 'POST',
    'emits': [],
    'flows': ['research'],
}

async def handler(req, context):
    """Handler for report feedback API"""
    logger = context.logger
    
    body = req.get('body', {})
    report_content = body.get('reportContent', '')
    flags = body.get('flags', {})  # e.g., {'replicability': True, 'evidence_check': True}
    
    if not report_content:
        return {
            'status': 400,
            'body': {
                'message': 'Report content is required'
            },
        }
    
    logger.info('Generating feedback for report', {
        'contentLength': len(report_content),
        'flags': flags
    })
    
    try:
        openai = OpenAIService()
        
        # Build prompt based on flags
        flag_descriptions = []
        if flags.get('replicability'):
            flag_descriptions.append("Check for replicability issues")
        if flags.get('evidence_check'):
            flag_descriptions.append("Verify evidence and citations")
        
        flags_text = "; ".join(flag_descriptions) if flag_descriptions else "General review"
        
        prompt = f"""Review this research report and provide structured feedback. Focus on: {flags_text}

Report Content:
{report_content[:10000]}

Provide feedback in JSON format with the following structure:
{{
  "feedback": [
    {{
      "section": "section name or 'general'",
      "issueType": "replicability|evidence|citation|methodology|clarity|other",
      "suggestion": "specific improvement suggestion",
      "confidence": 0.0-1.0
    }}
  ]
}}"""
        
        response = await openai.create_completion(
            messages=[
                {"role": "system", "content": "You are an expert research reviewer. Provide constructive, specific feedback on research reports."},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"},
            temperature=0.3,
        )
        
        feedback_data = json.loads(response.choices[0].message.content)
        
        return {
            'status': 200,
            'body': {
                'message': 'Feedback generated successfully',
                'feedback': feedback_data.get('feedback', [])
            },
        }
    except ValueError as e:
        if "API key not set" in str(e):
            return {
                'status': 500,
                'body': {
                    'message': 'API key not configured',
                    'error': 'OpenAI API key is required'
                },
            }
        raise
    except Exception as error:
        logger.error('Error generating feedback', {'error': str(error)})
        
        return {
            'status': 500,
            'body': {
                'message': 'Failed to generate feedback',
                'error': str(error)
            },
        }
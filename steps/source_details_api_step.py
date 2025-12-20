import json
import os
import sys
sys.path.insert(0, os.getcwd())
from src.services.firecrawl_service import FirecrawlService

config = {
    'type': 'api',
    'name': 'Source Details API',
    'description': 'API endpoint for getting detailed source information',
    'path': '/api/v1/source/details',
    'method': 'GET',
    'emits': [],
    'flows': ['research'],
}

async def handler(req, context):
    """Handler for source details API"""
    logger = context.logger
    
    query_params = req.get('queryParams', {})
    source_id = query_params.get('sourceId', '')
    
    if not source_id:
        return {
            'status': 400,
            'body': {
                'message': 'Source ID is required'
            },
        }
    
    logger.info('Fetching source details', {
        'sourceId': source_id
    })
    
    try:
        # Assume sourceId is the URL
        url = source_id
        
        firecrawl = FirecrawlService()
        content = await firecrawl.extract_content(url, logger)
        
        # Parse content to extract metadata
        # This is a simplified extraction - in reality you'd want more sophisticated parsing
        lines = content.split('\n')
        
        # Extract title (usually first non-empty line)
        title = ""
        for line in lines[:10]:
            line = line.strip()
            if line and not line.startswith('#') and len(line) > 10:
                title = line
                break
        
        # Extract abstract (look for common patterns)
        abstract = ""
        in_abstract = False
        for line in lines:
            line = line.strip()
            if line.lower().startswith('abstract'):
                in_abstract = True
                continue
            elif in_abstract and line and not line.startswith('#'):
                if len(abstract) + len(line) < 1000:  # Limit abstract length
                    abstract += line + " "
                else:
                    break
        
        # Look for figures and pseudocode (simplified)
        figures = []
        pseudocode_blocks = []
        
        for i, line in enumerate(lines):
            if 'figure' in line.lower() or 'fig.' in line.lower():
                figures.append({
                    'line': i,
                    'text': line.strip()
                })
            if '```' in line and ('python' in line.lower() or 'code' in line.lower() or 'algorithm' in line.lower()):
                # Extract code block
                code_start = i
                code_lines = []
                for j in range(i+1, len(lines)):
                    if '```' in lines[j]:
                        break
                    code_lines.append(lines[j])
                pseudocode_blocks.append({
                    'line': code_start,
                    'code': '\n'.join(code_lines)
                })
        
        return {
            'status': 200,
            'body': {
                'message': 'Source details retrieved successfully',
                'sourceId': source_id,
                'metadata': {
                    'title': title,
                    'url': url,
                    'abstract': abstract.strip(),
                    'pdfLink': url if url.endswith('.pdf') else None,
                    'figures': figures[:5],  # Limit to 5 figures
                    'pseudocodeBlocks': pseudocode_blocks[:3],  # Limit to 3 blocks
                    'fullContent': content[:5000]  # Truncated full content
                }
            },
        }
    except ValueError as e:
        if "API key not set" in str(e):
            return {
                'status': 500,
                'body': {
                    'message': 'API key not configured',
                    'error': 'Firecrawl API key is required'
                },
            }
        raise
    except Exception as error:
        logger.error('Error fetching source details', {'error': str(error)})
        
        return {
            'status': 500,
            'body': {
                'message': 'Failed to fetch source details',
                'error': str(error)
            },
        }
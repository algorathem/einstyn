# ReSearchly - Python Motia Research Workflow

This is a Python version of a Motia workflow project that performs deep research using Firecrawl for web search and OpenAI for content analysis.

## Setup

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

2. Install Motia (if not already installed):
```bash
npm install motia
```

3. Set up environment variables in a `.env` file:
```
FIRECRAWL_API_KEY=your_firecrawl_api_key
FIRECRAWL_API_URL=optional_firecrawl_api_url
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4o
FIRECRAWL_CONCURRENCY_LIMIT=2
```

## Project Structure

- `steps/` - Python step files (workflow handlers)
  - `*_step.py` - Step files following Motia naming convention
- `services/` - Service classes for external APIs
  - `firecrawl_service.py` - Firecrawl integration
  - `openai_service.py` - OpenAI integration
- `steps/types/` - Type definitions
  - `research_config.py` - Research configuration types

## Running the Project

Start the Motia development server:
```bash
npm run dev
```

This will start the Motia Workbench where you can test and debug your workflows.

## Workflow Steps

1. **Research API** (`research_api_step.py`) - Entry point to start research
2. **Generate Queries** (`generate_queries_step.py`) - Generates search queries using OpenAI
3. **Web Search** (`search_web_step.py`) - Performs web searches using Firecrawl
4. **Extract Content** (`extract_content_step.py`) - Extracts content from search results
5. **Analyze Content** (`analyze_content_step.py`) - Analyzes content and generates insights
6. **Follow-up Research** (`follow_up_research_step.py`) - Handles follow-up research queries
7. **Compile Report** (`compile_report_step.py`) - Compiles final research report
8. **Status API** (`status_api_step.py`) - Check research status
9. **Report API** (`report_api_step.py`) - Retrieve research reports

## Notes

- All Python step files follow the `*_step.py` naming convention required by Motia
- Services are designed to be async-compatible
- The workflow supports configurable research depth and breadth


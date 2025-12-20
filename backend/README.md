# ReSearchly AI

A comprehensive AI-powered research assistant built with the Motia framework. This application provides modular API endpoints for research queries, source interactions, AI chat, report feedback, and more.

## What is Motia?

Motia is an open-source, unified backend framework that eliminates runtime fragmentation by bringing **APIs, background jobs, queueing, streaming, state, workflows, AI agents, observability, scaling, and deployment** into one unified system using a single core primitive, the **Step**.

## Prerequisites

Before running this application, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **Python** (v3.8 or higher) - [Download here](https://python.org/)
- **Git** - [Download here](https://git-scm.com/)

## Quick Start

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <your-repo-url>
cd ReSearchly_AI

# Install Node.js dependencies
npm install

# Set up Python virtual environment
python -m venv python_modules
# On Windows:
python_modules\Scripts\activate
# On macOS/Linux:
source python_modules/bin/activate

# Install Python dependencies
pip install -r requirements.txt
```

### 2. Environment Configuration

Create a `.env` file in the root directory with your API keys:

```env
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o-mini

# Firecrawl Configuration
FIRECRAWL_API_KEY=your_firecrawl_api_key_here

# Redis Configuration (optional, for production state management)
# REDIS_URL=redis://localhost:6379

# Server Configuration
PORT=3000
HOST=0.0.0.0
```

### 3. Start the Development Server

```bash
# Start the Motia development server with Workbench
npm run dev
```

The server will start and be available at [`http://localhost:3000`](http://localhost:3000) (or `http://localhost:3002` if port 3000 is busy).

### 4. Access the Application

- **Workbench UI**: [`http://localhost:3000`](http://localhost:3000) - Visual workflow designer and debugging interface
- **API Endpoints**: Available at `http://localhost:3000/api/v1/*`

## API Endpoints

This application provides 8 modular API endpoints for research operations:

### Research Operations
- `POST /api/v1/research/query` - Search for research sources
- `POST /api/v1/source/details?sourceId=url` - Extract content and metadata from sources

### AI Interactions
- `POST /api/v1/source/chat?sourceId=url` - Chat with AI about specific sources
- `POST /api/v1/source/action?sourceId=url` - Perform quick actions on sources (summarize, analyze, etc.)
- `POST /api/v1/source/validate?sourceId=url` - Validate AI responses against sources

### Management & Feedback
- `POST /api/v1/source/mode?sourceId=url&mode=type` - Set interaction modes for sources
- `POST /api/v1/report/feedback` - Get AI feedback on research reports
- `POST /api/v1/user/log` - Log user actions and interactions

## Testing the APIs

### Direct Handler Testing (Recommended)

Test all APIs directly using Python:

```bash
# Test all endpoints at once
python -c "
import sys, asyncio, json
sys.path.insert(0, '.')

# Import handlers
from steps.research_query_api_step import handler as rq_handler
from steps.source_chat_api_step import handler as sc_handler
# ... import other handlers

class MockContext:
    def __init__(self):
        self.logger = MockLogger()
class MockLogger:
    def info(self, msg, *args): print(f'INFO: {msg}')
    def error(self, msg, *args): print(f'ERROR: {msg}')

async def test_apis():
    ctx = MockContext()
    
    # Test Research Query
    req = {'body': {'query': 'machine learning'}}
    result = await rq_handler(req, ctx)
    print(f'Research Query: {result[\"status\"]}')
    
    # Test Source Chat
    req = {'queryParams': {'sourceId': 'https://example.com'}, 'body': {'message': 'Explain this'}}
    result = await sc_handler(req, ctx)
    print(f'Source Chat: {result[\"status\"]}')
    
    print('All APIs tested successfully!')

asyncio.run(test_apis())
"
```

### HTTP Testing (when server is stable)

```bash
# Test Research Query API
curl -X POST http://localhost:3000/api/v1/research/query \
  -H "Content-Type: application/json" \
  -d '{"query": "machine learning algorithms"}'

# Test Source Details API
curl -X POST "http://localhost:3000/api/v1/source/details?sourceId=https://example.com/paper.pdf"

# Test Source Chat API
curl -X POST "http://localhost:3000/api/v1/source/chat?sourceId=https://example.com" \
  -H "Content-Type: application/json" \
  -d '{"message": "Summarize this paper"}'
```

## Development Commands

```bash
# Start Workbench and development server
npm run dev

# Start production server (without hot reload)
npm run start

# Generate TypeScript types from Step configs
npm run generate-types

# Build project for deployment
npm run build
```

## Project Structure

```
ReSearchly_AI/
├── steps/                    # API and event step definitions
│   ├── research_query_api_step.py
│   ├── source_chat_api_step.py
│   ├── source_action_api_step.py
│   ├── report_feedback_api_step.py
│   ├── source_details_api_step.py
│   ├── user_log_api_step.py
│   ├── source_validation_api_step.py
│   └── source_mode_api_step.py
├── src/                      # Shared services and utilities
│   └── services/
│       ├── openai_service.py
│       └── firecrawl_service.py
├── frontend/                 # React frontend application
├── python_modules/           # Python virtual environment
├── motia.config.ts          # Motia configuration
├── requirements.txt         # Python dependencies
├── package.json             # Node.js dependencies
└── .env                     # Environment variables
```

## Step Types

Every Step has a `type` that defines how it triggers:

| Type | When it runs | Use case |
|------|--------------|----------|
| **`api`** | HTTP request | REST APIs, webhooks |
| **`event`** | Event emitted | Background jobs, workflows |
| **`cron`** | Schedule | Cleanup, reports, reminders |

## Tutorial

This project includes an interactive tutorial that will guide you through:
- Understanding Steps and their types
- Creating API endpoints
- Building event-driven workflows
- Using state management
- Observing your flows in the Workbench

## Troubleshooting

### Common Issues

1. **Server won't start**: Ensure all dependencies are installed and API keys are set in `.env`
2. **Redis connection errors**: The app is configured to use memory state, but Redis may still be initialized
3. **API returns 500 errors**: Check that `OPENAI_API_KEY` and `FIRECRAWL_API_KEY` are set correctly
4. **Port already in use**: Server will automatically use the next available port

### Environment Variables

Make sure your `.env` file contains:
- `OPENAI_API_KEY`: Your OpenAI API key
- `FIRECRAWL_API_KEY`: Your Firecrawl API key
- Optional: `REDIS_URL` for production state management

## Learn More

- [Motia Documentation](https://motia.dev/docs) - Complete guides and API reference
- [Motia Quick Start](https://motia.dev/docs/getting-started/quick-start) - Detailed getting started tutorial
- [Motia Core Concepts](https://motia.dev/docs/concepts/overview) - Learn about Steps and Motia architecture
- [Discord Community](https://discord.gg/motia) - Get help and connect with other developers
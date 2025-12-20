# ResearchlyAI API Testing Guide

## Overview
This guide explains how to test the ResearchlyAI APIs correctly and ensure they work functionally.

## Server Setup

1. **Start the server:**
   ```bash
   npm run dev
   ```
   The server will run on `http://localhost:3001`

2. **Check server health:**
   ```bash
   curl http://localhost:3001/health
   ```

## API Endpoints

### 1. Research Query API
**Endpoint:** `POST /api/research/query`
**Purpose:** Search and retrieve research sources

```bash
curl -X POST http://localhost:3001/api/research/query \
  -H "Content-Type: application/json" \
  -d '{
    "query": "machine learning in healthcare",
    "filters": {
      "year": 2024,
      "field": "Computer Science"
    }
  }'
```

### 2. Source Chat API
**Endpoint:** `POST /api/source/:sourceId/chat`
**Purpose:** Interactive chat with research sources

```bash
curl -X POST http://localhost:3001/api/source/1/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Explain the main findings",
    "mode": "summary"
  }'
```

### 3. Source Mode API
**Endpoint:** `POST /api/source/:sourceId/mode`
**Purpose:** Change interaction mode

```bash
curl -X POST http://localhost:3001/api/source/1/mode \
  -H "Content-Type: application/json" \
  -d '{
    "mode": "explanation"
  }'
```

### 4. Source Action API
**Endpoint:** `POST /api/source/:sourceId/action`
**Purpose:** Quick actions on sources

```bash
curl -X POST http://localhost:3001/api/source/1/action \
  -H "Content-Type: application/json" \
  -d '{
    "actionType": "create_outline",
    "context": "key contributions"
  }'
```

## Automated Testing

Run the comprehensive API test suite:

```bash
npm test
```

This will test:
- ✅ Server health
- ✅ API documentation access
- ✅ Research query functionality
- ✅ Source chat interactions
- ✅ Mode switching
- ✅ Action execution

## CORS Configuration

CORS is enabled for frontend testing. All origins are allowed in development.

## Error Handling

The server includes:
- ✅ Global error handling
- ✅ Request logging
- ✅ CORS support
- ✅ Health check endpoint
- ✅ API documentation

## Troubleshooting

1. **Server not starting:** Check if port 3001 is available
2. **API returns 500:** Check server logs for OpenAI/database errors
3. **CORS errors:** CORS is enabled, check request headers
4. **Database errors:** Ensure SQLite database exists

## Development URLs

- **Server:** http://localhost:3001
- **Workbench:** http://localhost:3001 (Motia workbench)
- **Health Check:** http://localhost:3001/health
- **API Docs:** http://localhost:3001/api/docs
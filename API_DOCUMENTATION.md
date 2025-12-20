# ResearchlyAI API Documentation

## Overview

ResearchlyAI provides AI-powered research assistance APIs that allow users to search, explore, and interact with research sources through natural language interfaces.

## Base URL

```
http://localhost:3001
```

## Authentication

Currently, the APIs use development authentication. In production, implement proper authentication headers.

## API Endpoints

### 1. Health Check

Get the server health status and available APIs.

**Endpoint:** `GET /health`

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-12-21T10:30:00.000Z",
  "version": "1.0.0",
  "apis": [
    "POST /api/research/query",
    "POST /api/source/:sourceId/chat",
    "POST /api/source/:sourceId/mode",
    "POST /api/source/:sourceId/action"
  ]
}
```

### 2. Research Query

Search for research sources based on a query and optional filters.

**Endpoint:** `POST /api/research/query`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "query": "machine learning in healthcare",
  "filters": {
    "year": 2024,
    "field": "Computer Science"
  }
}
```

**Response:**
```json
{
  "sources": [
    {
      "id": "source_123",
      "title": "Machine Learning Applications in Healthcare",
      "authors": ["Dr. Smith", "Dr. Johnson"],
      "year": 2024,
      "abstract": "This paper explores...",
      "url": "https://example.com/paper123",
      "relevance_score": 0.95
    }
  ],
  "total": 1,
  "query": "machine learning in healthcare",
  "filters": {
    "year": 2024,
    "field": "Computer Science"
  }
}
```

**Error Response:**
```json
{
  "error": "Query is required",
  "timestamp": "2025-12-21T10:30:00.000Z"
}
```

### 3. Source Chat

Chat with a specific research source using AI assistance.

**Endpoint:** `POST /api/source/:sourceId/chat`

**Headers:**
```
Content-Type: application/json
```

**URL Parameters:**
- `sourceId`: The unique identifier of the research source

**Request Body:**
```json
{
  "message": "Explain the main findings of this research",
  "mode": "summary"
}
```

**Response:**
```json
{
  "sourceId": "source_123",
  "response": "The main findings of this research indicate that machine learning algorithms can improve diagnostic accuracy by 15-20% when properly trained on large healthcare datasets...",
  "mode": "summary",
  "timestamp": "2025-12-21T10:30:00.000Z",
  "confidence": 0.89
}
```

**Available Modes:**
- `summary`: Provide a concise summary
- `explanation`: Detailed explanation of concepts
- `implementation`: Focus on practical implementation details

### 4. Source Mode

Change the interaction mode for a research source.

**Endpoint:** `POST /api/source/:sourceId/mode`

**Headers:**
```
Content-Type: application/json
```

**URL Parameters:**
- `sourceId`: The unique identifier of the research source

**Request Body:**
```json
{
  "mode": "explanation"
}
```

**Response:**
```json
{
  "sourceId": "source_123",
  "mode": "explanation",
  "message": "Mode changed to explanation",
  "timestamp": "2025-12-21T10:30:00.000Z"
}
```

**Available Modes:**
- `summary`: Concise overviews
- `explanation`: Detailed explanations
- `implementation`: Technical implementation focus

### 5. Source Action

Perform quick actions on a research source.

**Endpoint:** `POST /api/source/:sourceId/action`

**Headers:**
```
Content-Type: application/json
```

**URL Parameters:**
- `sourceId`: The unique identifier of the research source

**Request Body:**
```json
{
  "actionType": "create_outline",
  "context": "key research contributions"
}
```

**Response:**
```json
{
  "sourceId": "source_123",
  "action": "create_outline",
  "result": "I. Introduction\nII. Methodology\nIII. Results\nIV. Discussion\nV. Conclusion",
  "context": "key research contributions",
  "timestamp": "2025-12-21T10:30:00.000Z"
}
```

**Available Actions:**
- `create_outline`: Generate a structured outline
- `extract_key_points`: Extract main points
- `generate_questions`: Create discussion questions
- `summarize_methodology`: Focus on research methods

### 6. Source Validation

Validate AI response for a research source with confidence score and flagged inconsistencies.

**Endpoint:** `POST /api/source/:sourceId/validate`

**Headers:**
```
Content-Type: application/json
```

**URL Parameters:**
- `sourceId`: The unique identifier of the research source

**Request Body:**
```json
{
  "aiResponse": "The machine learning model achieves 95% accuracy on the test dataset",
  "constraints": {
    "must_cite_sources": true,
    "match_pseudocode": false
  }
}
```

**Response:**
```json
{
  "sourceId": "source_123",
  "validationReport": {
    "confidenceScore": 0.87,
    "isValid": true,
    "flaggedInconsistencies": [
      {
        "type": "citation_missing",
        "description": "Response mentions accuracy but doesn't cite the source",
        "severity": "medium"
      }
    ],
    "recommendations": [
      "Add citation to the original paper for accuracy claims"
    ]
  },
  "timestamp": "2025-12-21T10:30:00.000Z"
}
```

**Error Response:**
```json
{
  "error": "Source not found",
  "timestamp": "2025-12-21T10:30:00.000Z"
}
```

### 7. User Interaction Logging

Log user actions for analytics and workflow monitoring.

**Endpoint:** `POST /api/user/log`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "actions": [
    {
      "type": "click",
      "element": "search_button",
      "timestamp": "2025-12-21T10:30:00.000Z"
    },
    {
      "type": "drag",
      "element": "source_card",
      "sourceId": "source_123",
      "timestamp": "2025-12-21T10:30:01.000Z"
    },
    {
      "type": "mode_toggle",
      "from": "summary",
      "to": "explanation",
      "sourceId": "source_123",
      "timestamp": "2025-12-21T10:30:02.000Z"
    }
  ]
}
```

**Response:**
```json
{
  "message": "User actions logged successfully",
  "loggedCount": 3,
  "timestamp": "2025-12-21T10:30:00.000Z"
}
```

**Error Response:**
```json
{
  "error": "Actions array is required",
  "timestamp": "2025-12-21T10:30:00.000Z"
}
```

### 6. API Documentation

Get detailed API documentation.

**Endpoint:** `GET /api/docs`

**Response:**
```json
{
  "title": "ResearchlyAI API Documentation",
  "version": "1.0.0",
  "description": "AI-powered research assistant APIs",
  "endpoints": {
    "research": {
      "query": {
        "method": "POST",
        "path": "/api/research/query",
        "description": "Search and retrieve research sources",
        "body": {
          "query": "string (required)",
          "filters": "object (optional)"
        }
      }
    },
    "source": {
      "chat": {
        "method": "POST",
        "path": "/api/source/:sourceId/chat",
        "description": "Chat with a specific research source",
        "body": {
          "message": "string (required)",
          "mode": "string (optional: summary, explanation, implementation)"
        }
      },
      "mode": {
        "method": "POST",
        "path": "/api/source/:sourceId/mode",
        "description": "Change interaction mode for a source",
        "body": {
          "mode": "string (required: summary, explanation, implementation)"
        }
      },
      "action": {
        "method": "POST",
        "path": "/api/source/:sourceId/action",
        "description": "Perform quick actions on a source",
        "body": {
          "actionType": "string (required)",
          "context": "string (optional)"
        }
      }
    }
  }
}
```

## Error Handling

All APIs return appropriate HTTP status codes and error messages:

- `200`: Success
- `400`: Bad Request (missing required fields)
- `404`: Not Found (invalid source ID)
- `500`: Internal Server Error

**Error Response Format:**
```json
{
  "error": "Error message description",
  "timestamp": "2025-12-21T10:30:00.000Z"
}
```

## Frontend Integration Examples

### JavaScript/TypeScript

```javascript
// Health check
const healthCheck = async () => {
  const response = await fetch('http://localhost:3001/health');
  const data = await response.json();
  return data;
};

// Research query
const searchResearch = async (query, filters = {}) => {
  const response = await fetch('http://localhost:3001/api/research/query', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, filters }),
  });
  const data = await response.json();
  return data;
};

// Source chat
const chatWithSource = async (sourceId, message, mode = 'summary') => {
  const response = await fetch(`http://localhost:3001/api/source/${sourceId}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message, mode }),
  });
  const data = await response.json();
  return data;
};

// Change source mode
const changeSourceMode = async (sourceId, mode) => {
  const response = await fetch(`http://localhost:3001/api/source/${sourceId}/mode`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ mode }),
  });
  const data = await response.json();
  return data;
};

// Source action
const performSourceAction = async (sourceId, actionType, context = '') => {
  const response = await fetch(`http://localhost:3001/api/source/${sourceId}/action`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ actionType, context }),
  });
  const data = await response.json();
  return data;
};
```

### React Hook Example

```javascript
import { useState, useEffect } from 'react';

const useResearchAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchResearch = async (query, filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3001/api/research/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, filters }),
      });
      const data = await response.json();
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const chatWithSource = async (sourceId, message, mode = 'summary') => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:3001/api/source/${sourceId}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, mode }),
      });
      const data = await response.json();
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    searchResearch,
    chatWithSource,
    loading,
    error,
  };
};

export default useResearchAPI;
```

## CORS Configuration

The server is configured with CORS enabled for cross-origin requests. The following headers are set:

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization
```

## Rate Limiting

Currently no rate limiting is implemented. Consider implementing appropriate rate limits for production use.

## Versioning

Current API version: `1.0.0`

API versioning will be implemented using URL paths (e.g., `/api/v1/research/query`) in future updates.

## Support

For questions or issues with the APIs, please refer to the server logs or contact the development team.
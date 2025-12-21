#!/usr/bin/env node

/**
 * Simple test server for ResearchlyAI APIs
 * Mimics the Motia API endpoints for testing
 */

import express from 'express'
import cors from 'cors'

const app = express()
const PORT = 3002 // Different port to avoid conflicts

// Middleware
app.use(cors())
app.use(express.json())

// Mock database
const mockSources = [
  { id: '1', title: 'Machine Learning in Healthcare', content: 'Research on ML applications...' },
  { id: '2', title: 'AI Ethics', content: 'Ethical considerations in AI...' }
]

// Mock database for user searches, logs, validations
const userSearches = []
const userLogs = []
const validations = []

// Health endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    apis: [
      'POST /api/research/query',
      'POST /api/source/:sourceId/chat',
      'POST /api/source/:sourceId/mode',
      'POST /api/source/:sourceId/action',
      'POST /api/source/:sourceId/validate',
      'POST /api/user/log',
      'POST /api/report/feedback',
      'GET /api/source/:sourceId/details',
      'GET /api/docs'
    ]
  })
})

// Research query endpoint
app.post('/api/research/query', async (req, res) => {
  try {
    const { query, filters } = req.body

    if (!query) {
      return res.status(400).json({ error: 'Query is required' })
    }

    // Search sources in database
    const sources = await db.search_sources(query, filters || {})

    // Store search in database
    const searchEntry = {
      query: query,
      filters: filters || {},
      results_count: sources.length
    }
    const searchId = await db.insert_user_search(searchEntry)

    res.json({
      sources: sources,
      total: sources.length,
      query: query,
      filters: filters || {},
      searchId: searchId
    })
  } catch (error) {
    console.error('Research query error:', error)
    // Fallback to mock data
    res.json({
      sources: mockSources,
      total: mockSources.length,
      query: req.body.query,
      filters: req.body.filters || {},
      searchId: Date.now().toString()
    })
  }
})

// Source chat endpoint
app.post('/api/source/:sourceId/chat', (req, res) => {
  const { sourceId } = req.params
  const { message, mode } = req.body

  if (!message) {
    return res.status(400).json({ error: 'Message is required' })
  }

  const source = mockSources.find(s => s.id === sourceId)
  if (!source) {
    return res.status(404).json({ error: 'Source not found' })
  }

  // Mock AI response
  res.json({
    sourceId: sourceId,
    response: `AI response to: "${message}" in ${mode || 'default'} mode`,
    timestamp: new Date().toISOString()
  })
})

// Source mode endpoint
app.post('/api/source/:sourceId/mode', (req, res) => {
  const { sourceId } = req.params
  const { mode } = req.body

  if (!mode) {
    return res.status(400).json({ error: 'Mode is required' })
  }

  const source = mockSources.find(s => s.id === sourceId)
  if (!source) {
    return res.status(404).json({ error: 'Source not found' })
  }

  res.json({
    sourceId: sourceId,
    mode: mode,
    message: `Mode changed to ${mode}`,
    timestamp: new Date().toISOString()
  })
})

// Source action endpoint
app.post('/api/source/:sourceId/action', (req, res) => {
  const { sourceId } = req.params
  const { actionType, context } = req.body

  if (!actionType) {
    return res.status(400).json({ error: 'Action type is required' })
  }

  const source = mockSources.find(s => s.id === sourceId)
  if (!source) {
    return res.status(404).json({ error: 'Source not found' })
  }

  res.json({
    sourceId: sourceId,
    action: actionType,
    result: `Action "${actionType}" performed on source`,
    context: context || null,
    timestamp: new Date().toISOString()
  })
})

// Source validate endpoint
app.post('/api/source/:sourceId/validate', async (req, res) => {
  try {
    const { sourceId } = req.params
    const { aiResponse, constraints } = req.body

    if (!aiResponse) {
      return res.status(400).json({ error: 'AI response is required' })
    }

    // Check if source exists in database
    const source = await db.get_source_by_id(parseInt(sourceId))
    if (!source) {
      return res.status(404).json({ error: 'Source not found' })
    }

    // Store validation in database
    const validationData = {
      source_id: parseInt(sourceId),
      ai_response: aiResponse,
      constraints: constraints || {},
      confidence_score: 0.87,
      flagged_inconsistencies: [
        {
          type: 'citation_missing',
          description: 'Response mentions accuracy but doesn\'t cite the source',
          severity: 'medium'
        }
      ],
      recommendations: [
        'Add citation to the original paper for accuracy claims'
      ]
    }
    const validationId = await db.insert_validation(validationData)

    res.json({
      sourceId: sourceId,
      validationId: validationId,
      validationReport: {
        confidenceScore: 0.87,
        isValid: true,
        flaggedInconsistencies: [
          {
            type: 'citation_missing',
            description: 'Response mentions accuracy but doesn\'t cite the source',
            severity: 'medium'
          }
        ],
        recommendations: [
          'Add citation to the original paper for accuracy claims'
        ]
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Validation error:', error)
    // Fallback to mock response
    const { sourceId } = req.params
    const source = mockSources.find(s => s.id === sourceId)
    if (!source) {
      return res.status(404).json({ error: 'Source not found' })
    }

    res.json({
      sourceId: sourceId,
      validationReport: {
        confidenceScore: 0.87,
        isValid: true,
        flaggedInconsistencies: [
          {
            type: 'citation_missing',
            description: 'Response mentions accuracy but doesn\'t cite the source',
            severity: 'medium'
          }
        ],
        recommendations: [
          'Add citation to the original paper for accuracy claims'
        ]
      },
      timestamp: new Date().toISOString()
    })
  }
})

// User log endpoint
app.post('/api/user/log', async (req, res) => {
  try {
    const { actions } = req.body

    if (!actions || !Array.isArray(actions)) {
      return res.status(400).json({ error: 'Actions array is required' })
    }

    // Store user log in database
    const logId = await db.insert_user_log(actions)

    res.json({
      message: 'User actions logged successfully',
      logId: logId,
      loggedCount: actions.length,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('User log error:', error)
    // Fallback to mock storage
    const logEntry = {
      id: Date.now().toString(),
      actions: req.body.actions,
      timestamp: new Date().toISOString()
    }
    userLogs.push(logEntry)

    res.json({
      message: 'User actions logged successfully',
      loggedCount: req.body.actions.length,
      timestamp: new Date().toISOString()
    })
  }
})

// Report feedback endpoint
app.post('/api/report/feedback', (req, res) => {
  const { reportContent, flags } = req.body

  if (!reportContent) {
    return res.status(400).json({ error: 'Report content is required' })
  }

  // Mock feedback response
  const mockFeedback = [
    {
      section: 'introduction',
      issueType: 'clarity',
      suggestion: 'Consider adding more context about the research gap this work addresses',
      confidence: 0.85
    },
    {
      section: 'methodology',
      issueType: 'replicability',
      suggestion: 'Include specific hyperparameters and random seeds for reproducibility',
      confidence: 0.92
    },
    {
      section: 'results',
      issueType: 'evidence',
      suggestion: 'Add statistical significance tests for the key findings',
      confidence: 0.78
    }
  ]

  res.json({
    message: 'Feedback generated successfully',
    feedback: mockFeedback,
    timestamp: new Date().toISOString()
  })
})

// Source details endpoint
app.get('/api/source/:sourceId/details', (req, res) => {
  const { sourceId } = req.params

  const source = mockSources.find(s => s.id === sourceId)
  if (!source) {
    return res.status(404).json({ error: 'Source not found' })
  }

  // Mock detailed metadata
  const mockDetails = {
    sourceId: sourceId,
    metadata: {
      title: source.title,
      url: `https://example.com/paper/${sourceId}`,
      abstract: `This is a detailed abstract for ${source.title}. It contains comprehensive information about the research methodology, findings, and implications.`,
      pdfLink: `https://example.com/paper/${sourceId}.pdf`,
      figures: [
        {
          line: 45,
          text: 'Figure 1: Architecture diagram showing the proposed model'
        },
        {
          line: 78,
          text: 'Figure 2: Performance comparison across different datasets'
        }
      ],
      pseudocodeBlocks: [
        {
          line: 120,
          code: `def train_model(data, epochs=100):
    model = initialize_model()
    for epoch in range(epochs):
        loss = model.train_step(data)
        print(f"Epoch {epoch}: loss = {loss}")
    return model`
        }
      ],
      fullContent: source.content + ' [Extended content would be here]'
    }
  }

  res.json(mockDetails)
})

// API docs endpoint
app.get('/api/docs', (req, res) => {
  res.json({
    title: 'ResearchlyAI API Documentation',
    version: '1.0.0',
    description: 'AI-powered research assistant APIs',
    endpoints: {
      research: {
        query: {
          method: 'POST',
          path: '/api/research/query',
          description: 'Search and retrieve research sources',
          body: {
            query: 'string (required)',
            filters: 'object (optional)'
          }
        }
      },
      source: {
        chat: {
          method: 'POST',
          path: '/api/source/:sourceId/chat',
          description: 'Chat with a specific research source',
          body: {
            message: 'string (required)',
            mode: 'string (optional: summary, explanation, implementation)'
          }
        },
        mode: {
          method: 'POST',
          path: '/api/source/:sourceId/mode',
          description: 'Change interaction mode for a source',
          body: {
            mode: 'string (required: summary, explanation, implementation)'
          }
        },
        action: {
          method: 'POST',
          path: '/api/source/:sourceId/action',
          description: 'Perform quick actions on a source',
          body: {
            actionType: 'string (required)',
            context: 'string (optional)'
          }
        },
        validate: {
          method: 'POST',
          path: '/api/source/:sourceId/validate',
          description: 'Validate AI response for a source with confidence score',
          body: {
            aiResponse: 'string (required)',
            constraints: 'object (optional: must_cite_sources, match_pseudocode)'
          }
        }
      },
      user: {
        log: {
          method: 'POST',
          path: '/api/user/log',
          description: 'Log user actions for analytics',
          body: {
            actions: 'array (required: clicks, drags, mode_toggles)'
          }
        }
      },
      report: {
        feedback: {
          method: 'POST',
          path: '/api/report/feedback',
          description: 'Get AI feedback on research reports',
          body: {
            reportContent: 'string (required)',
            flags: 'object (optional: replicability, evidence_check)'
          }
        }
      },
      sourceDetails: {
        details: {
          method: 'GET',
          path: '/api/source/:sourceId/details',
          description: 'Get detailed metadata and content for a source',
          params: {
            sourceId: 'string (required)'
          }
        }
      }
    }
  })
})

app.listen(PORT, () => {
  console.log(`Test server running on http://localhost:${PORT}`)
  console.log('Available endpoints:')
  console.log('  GET  /health')
  console.log('  POST /api/research/query')
  console.log('  POST /api/source/:sourceId/chat')
  console.log('  POST /api/source/:sourceId/mode')
  console.log('  POST /api/source/:sourceId/action')
  console.log('  POST /api/source/:sourceId/validate')
  console.log('  POST /api/user/log')
  console.log('  POST /api/report/feedback')
  console.log('  GET  /api/source/:sourceId/details')
  console.log('  GET  /api/docs')
})

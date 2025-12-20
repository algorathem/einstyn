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
      'POST /api/source/:sourceId/action'
    ]
  })
})

// Research query endpoint
app.post('/api/research/query', (req, res) => {
  const { query, filters } = req.body

  if (!query) {
    return res.status(400).json({ error: 'Query is required' })
  }

  // Mock response
  res.json({
    sources: mockSources,
    total: mockSources.length,
    query: query,
    filters: filters || {}
  })
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
        }
      }
    }
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`Test server running on http://localhost:${PORT}`)
  console.log('Available endpoints:')
  console.log('  GET  /health')
  console.log('  POST /api/research/query')
  console.log('  POST /api/source/:sourceId/chat')
  console.log('  POST /api/source/:sourceId/mode')
  console.log('  POST /api/source/:sourceId/action')
  console.log('  GET  /api/docs')
})
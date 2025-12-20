import { defineConfig } from '@motiadev/core'
// import endpointPlugin from '@motiadev/plugin-endpoint/plugin'
// import logsPlugin from '@motiadev/plugin-logs/plugin'
// import observabilityPlugin from '@motiadev/plugin-observability/plugin'
// import statesPlugin from '@motiadev/plugin-states/plugin'
// import bullmqPlugin from '@motiadev/plugin-bullmq/plugin'

export default defineConfig({
  plugins: [], // endpointPlugin, logsPlugin, statesPlugin, bullmqPlugin
  // Disable states and Redis to prevent connection issues
  states: {
    disabled: true
  },
  // Disable Redis to prevent connection issues
  redis: {
    disabled: true,
    host: 'invalid-host',
    port: 9999
  },
  // Add stream authentication configuration to fix socket authorization errors
  streamAuth: {
    authenticate: async (request) => {
      // For development, allow all connections without authentication
      // In production, you would validate tokens from headers/cookies
      return {
        userId: 'dev-user',
        permissions: ['read:stream', 'write:stream']
      }
    }
  },
  // Add Express app customization for API testing
  app: (app) => {
    // Enable CORS for frontend testing
    app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*')
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')

      if (req.method === 'OPTIONS') {
        res.sendStatus(200)
      } else {
        next()
      }
    })

    // Health check endpoint for testing
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

    // API documentation endpoint
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

    // Request logging middleware for debugging
    app.use((req, res, next) => {
      const timestamp = new Date().toISOString()
      console.log(`[${timestamp}] ${req.method} ${req.path}`)
      next()
    })

    // Global error handler
    app.use((err, req, res, next) => {
      console.error('Global error handler:', err)
      res.status(500).json({
        error: 'Internal Server Error',
        message: err.message,
        timestamp: new Date().toISOString()
      })
    })
  }
})

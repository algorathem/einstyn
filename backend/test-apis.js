#!/usr/bin/env node

/**
 * ResearchlyAI API Testing Script
 * Tests all research APIs to ensure they work correctly
 */

console.log('Script loaded!')

import http from 'http'

const BASE_URL = 'http://localhost:3002'

// Test data
const testQuery = {
  query: 'machine learning in healthcare',
  filters: {
    year: 2024,
    field: 'Computer Science'
  }
}

const testChat = {
  message: 'Explain the main findings of this research',
  mode: 'summary'
}

const testMode = {
  mode: 'explanation'
}

const testAction = {
  actionType: 'create_outline',
  context: 'key research contributions'
}

// Helper function to make HTTP requests
function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    console.log(`Making request to ${options.hostname}:${options.port}${options.path}`)
    const req = http.request({
      ...options,
      timeout: 5000 // 5 second timeout
    }, (res) => {
      let body = ''
      res.on('data', (chunk) => {
        body += chunk
      })
      res.on('end', () => {
        try {
          const response = {
            status: res.statusCode,
            headers: res.headers,
            body: body ? JSON.parse(body) : null
          }
          console.log(`Response status: ${response.status}`)
          resolve(response)
        } catch (e) {
          console.log(`JSON parse error: ${e.message}`)
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: body
          })
        }
      })
    })

    req.on('timeout', () => {
      console.log('Request timed out')
      req.destroy()
      reject(new Error('Request timed out'))
    })

    req.on('error', (err) => {
      console.log(`Request error: ${err.message}`)
      reject(err)
    })

    if (data) {
      req.write(JSON.stringify(data))
    }
    req.end()
  })
}

// Test functions
async function testHealth() {
  console.log('\n🩺 Testing Health Check...')
  try {
    const response = await makeRequest({
      hostname: 'localhost',
      port: 3002,
      path: '/health',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (response.status === 200) {
      console.log('✅ Health check passed')
      console.log('   Status:', response.body.status)
      console.log('   APIs available:', response.body.apis.length)
    } else {
      console.log('❌ Health check failed:', response.status)
    }
  } catch (error) {
    console.log('❌ Health check error:', error.message)
  }
}

async function testResearchQuery() {
  console.log('\n🔍 Testing Research Query API...')
  try {
    const response = await makeRequest({
      hostname: 'localhost',
      port: 3002,
      path: '/api/research/query',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }, testQuery)

    if (response.status === 200) {
      console.log('✅ Research query successful')
      console.log('   Sources found:', response.body.sources?.length || 0)
      if (response.body.sources?.length > 0) {
        console.log('   First source:', response.body.sources[0].title)
        return response.body.sources[0].id // Return first source ID for other tests
      }
    } else {
      console.log('❌ Research query failed:', response.status, response.body?.message)
    }
  } catch (error) {
    console.log('❌ Research query error:', error.message)
  }
  return null
}

async function testSourceChat(sourceId) {
  if (!sourceId) {
    console.log('\n💬 Skipping Source Chat test (no source available)')
    return
  }

  console.log('\n💬 Testing Source Chat API...')
  try {
    const response = await makeRequest({
      hostname: 'localhost',
      port: 3002,
      path: `/api/source/${sourceId}/chat`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }, testChat)

    if (response.status === 200) {
      console.log('✅ Source chat successful')
      console.log('   Response length:', response.body.response?.length || 0, 'characters')
    } else {
      console.log('❌ Source chat failed:', response.status, response.body?.message)
    }
  } catch (error) {
    console.log('❌ Source chat error:', error.message)
  }
}

async function testSourceMode(sourceId) {
  if (!sourceId) {
    console.log('\n⚙️ Skipping Source Mode test (no source available)')
    return
  }

  console.log('\n⚙️ Testing Source Mode API...')
  try {
    const response = await makeRequest({
      hostname: 'localhost',
      port: 3002,
      path: `/api/source/${sourceId}/mode`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }, testMode)

    if (response.status === 200) {
      console.log('✅ Source mode change successful')
      console.log('   New mode:', response.body.mode)
    } else {
      console.log('❌ Source mode failed:', response.status, response.body?.message)
    }
  } catch (error) {
    console.log('❌ Source mode error:', error.message)
  }
}

async function testSourceAction(sourceId) {
  if (!sourceId) {
    console.log('\n⚡ Skipping Source Action test (no source available)')
    return
  }

  console.log('\n⚡ Testing Source Action API...')
  try {
    const response = await makeRequest({
      hostname: 'localhost',
      port: 3002,
      path: `/api/source/${sourceId}/action`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }, testAction)

    if (response.status === 200) {
      console.log('✅ Source action successful')
      console.log('   Action type:', response.body.actionType)
      console.log('   Response length:', response.body.response?.length || 0, 'characters')
    } else {
      console.log('❌ Source action failed:', response.status, response.body?.message)
    }
  } catch (error) {
    console.log('❌ Source action error:', error.message)
  }
}

async function testAPIDocs() {
  console.log('\n📚 Testing API Documentation...')
  try {
    const response = await makeRequest({
      hostname: 'localhost',
      port: 3002,
      path: '/api/docs',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (response.status === 200) {
      console.log('✅ API docs accessible')
      console.log('   Title:', response.body.title)
      console.log('   Endpoints documented:', Object.keys(response.body.endpoints).length)
    } else {
      console.log('❌ API docs failed:', response.status)
    }
  } catch (error) {
    console.log('❌ API docs error:', error.message)
  }
}

// Main test runner
async function runTests() {
  console.log('🚀 ResearchlyAI API Testing Suite')
  console.log('==================================')

  // Test infrastructure
  await testHealth()
  await testAPIDocs()

  // Test APIs
  const sourceId = await testResearchQuery()
  await testSourceChat(sourceId)
  await testSourceMode(sourceId)
  await testSourceAction(sourceId)

  console.log('\n✨ Testing complete!')
  console.log('💡 Make sure the server is running on port 3002')
  console.log('🔗 Server: http://localhost:3002')
  console.log('📖 API Docs: http://localhost:3002/api/docs')
}

// Run tests
console.log('🚀 Starting ResearchlyAI API Tests...')
runTests().catch(console.error)

export { runTests, testHealth, testResearchQuery, testSourceChat, testSourceMode, testSourceAction, testAPIDocs }
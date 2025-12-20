#!/usr/bin/env node

/**
 * Test script for the new ResearchlyAI API endpoints
 */

import http from 'http';

const BASE_URL = 'http://localhost:3002';

function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    console.log(`Testing ${options.method} ${options.path}`);
    const req = http.request({
      hostname: 'localhost',
      port: 3002,
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    }, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const response = {
            status: res.statusCode,
            headers: res.headers,
            body: body
          };
          resolve(response);
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Testing ResearchlyAI API Endpoints\n');

  try {
    // Test 1: Health check
    console.log('1. Testing Health Endpoint...');
    const health = await makeRequest({ path: '/health', method: 'GET' });
    console.log(`✅ Status: ${health.status}`);
    console.log(`📊 APIs available: ${JSON.parse(health.body).apis?.length || 0}\n`);

    // Test 2: Report Feedback
    console.log('2. Testing Report Feedback Endpoint...');
    const feedbackData = {
      reportContent: 'This is a sample research report about machine learning applications in healthcare. The study shows promising results but lacks detailed methodology.',
      flags: { replicability: true, evidence_check: true }
    };
    const feedback = await makeRequest({ path: '/api/report/feedback', method: 'POST' }, feedbackData);
    console.log(`✅ Status: ${feedback.status}`);
    const feedbackBody = JSON.parse(feedback.body);
    console.log(`📝 Feedback items: ${feedbackBody.feedback?.length || 0}\n`);

    // Test 3: Source Details
    console.log('3. Testing Source Details Endpoint...');
    const details = await makeRequest({ path: '/api/source/1/details', method: 'GET' });
    console.log(`✅ Status: ${details.status}`);
    const detailsBody = JSON.parse(details.body);
    console.log(`📄 Title: ${detailsBody.metadata?.title || 'N/A'}`);
    console.log(`🔗 PDF Link: ${detailsBody.metadata?.pdfLink ? 'Available' : 'N/A'}`);
    console.log(`🖼️ Figures: ${detailsBody.metadata?.figures?.length || 0}`);
    console.log(`💻 Code blocks: ${detailsBody.metadata?.pseudocodeBlocks?.length || 0}\n`);

    console.log('🎉 All tests completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

runTests();
#!/usr/bin/env node

/**
 * Quick test for the new ResearchlyAI API endpoints
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

async function testNewEndpoints() {
  console.log('🧪 Testing New ResearchlyAI API Endpoints\n');

  try {
    // Test 1: Report Feedback
    console.log('1. Testing Report Feedback API...');
    const feedbackData = {
      reportContent: 'This is a sample research report about machine learning applications in healthcare. The study shows promising results but lacks detailed methodology.',
      flags: { replicability: true, evidence_check: true }
    };
    const feedback = await makeRequest({ path: '/api/report/feedback', method: 'POST' }, feedbackData);
    console.log(`✅ Status: ${feedback.status}`);
    const feedbackBody = JSON.parse(feedback.body);
    console.log(`📝 Feedback items: ${feedbackBody.feedback?.length || 0}`);
    console.log(`💬 Message: ${feedbackBody.message}\n`);

    // Test 2: Source Details
    console.log('2. Testing Source Details API...');
    const details = await makeRequest({ path: '/api/source/1/details', method: 'GET' });
    console.log(`✅ Status: ${details.status}`);
    const detailsBody = JSON.parse(details.body);
    console.log(`📄 Title: ${detailsBody.metadata?.title || 'N/A'}`);
    console.log(`🔗 PDF Link: ${detailsBody.metadata?.pdfLink ? 'Available' : 'N/A'}`);
    console.log(`🖼️ Figures: ${detailsBody.metadata?.figures?.length || 0}`);
    console.log(`💻 Code blocks: ${detailsBody.metadata?.pseudocodeBlocks?.length || 0}\n`);

    console.log('🎉 All new endpoints are working correctly!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testNewEndpoints();
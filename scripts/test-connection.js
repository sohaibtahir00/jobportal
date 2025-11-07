const axios = require('axios');

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'https://job-portal-backend-production-cd05.up.railway.app';

async function testConnection() {
  console.log('🔍 Testing connection to backend...');
  console.log('Backend URL:', BACKEND_URL);
  console.log('');

  // Test 1: Health check
  try {
    console.log('Test 1: Health Check');
    const response = await axios.get(`${BACKEND_URL}/api/health`, {
      timeout: 10000
    });
    console.log('✅ Health check passed');
    console.log('Response:', response.data);
  } catch (error) {
    console.log('❌ Health check failed');
    console.log('Error:', error.message);
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    }
  }

  console.log('');

  // Test 2: Auth validate endpoint
  try {
    console.log('Test 2: Auth Validate Endpoint');
    const response = await axios.post(`${BACKEND_URL}/api/auth/validate`, {
      email: 'test@example.com',
      password: 'wrongpassword'
    }, {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log('✅ Auth endpoint reachable');
    console.log('Response:', response.data);
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.log('✅ Auth endpoint reachable (401 expected for wrong credentials)');
    } else {
      console.log('❌ Auth endpoint failed');
      console.log('Error:', error.message);
      if (error.response) {
        console.log('Status:', error.response.status);
        console.log('Data:', error.response.data);
      }
    }
  }

  console.log('');

  // Test 3: CORS check
  try {
    console.log('Test 3: CORS Configuration');
    const response = await axios.options(`${BACKEND_URL}/api/auth/validate`, {
      headers: {
        'Origin': 'https://jobportal-rouge-mu.vercel.app',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type, Authorization, X-User-Id, X-User-Email, X-User-Role'
      }
    });
    console.log('✅ CORS headers present');
    console.log('Access-Control-Allow-Origin:', response.headers['access-control-allow-origin']);
    console.log('Access-Control-Allow-Credentials:', response.headers['access-control-allow-credentials']);
    console.log('Access-Control-Allow-Headers:', response.headers['access-control-allow-headers']);
  } catch (error) {
    console.log('❌ CORS check failed');
    console.log('Error:', error.message);
    if (error.response) {
      console.log('Headers:', error.response.headers);
    }
  }

  console.log('');

  // Test 4: Register endpoint
  try {
    console.log('Test 4: Register Endpoint Connectivity');
    const testEmail = `test-${Date.now()}@example.com`;
    const response = await axios.post(`${BACKEND_URL}/api/auth/register`, {
      email: testEmail,
      password: 'TestPassword123!',
      name: 'Test User',
      role: 'CANDIDATE'
    }, {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://jobportal-rouge-mu.vercel.app'
      }
    });
    console.log('✅ Register endpoint works!');
    console.log('Status:', response.status);
    console.log('Response:', response.data);
  } catch (error) {
    if (error.code === 'ERR_NETWORK') {
      console.log('❌ Network error - backend may be unreachable or CORS blocking');
    } else if (error.response) {
      console.log('✅ Register endpoint reachable (got response)');
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    } else {
      console.log('❌ Register endpoint failed');
      console.log('Error:', error.message);
    }
  }

  console.log('');
  console.log('=== CONNECTION TEST COMPLETE ===');
}

testConnection();

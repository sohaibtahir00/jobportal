/**
 * Backend API Test Script
 *
 * Run this to test the Railway backend API and see actual responses
 * Usage: node test-backend-api.js
 */

const API_URL = 'https://job-portal-backend-production-cd05.up.railway.app';

// Test registration
async function testRegister() {
  console.log('\n========================================');
  console.log('Testing POST /api/auth/register');
  console.log('========================================\n');

  const testCases = [
    {
      name: 'Test 1: Lowercase role "candidate"',
      data: {
        email: `test1_${Date.now()}@example.com`,
        password: 'Test1234!',
        name: 'Test User One',
        role: 'candidate'
      }
    },
    {
      name: 'Test 2: Uppercase role "CANDIDATE"',
      data: {
        email: `test2_${Date.now()}@example.com`,
        password: 'Test1234!',
        name: 'Test User Two',
        role: 'CANDIDATE'
      }
    },
    {
      name: 'Test 3: With fullName instead of name',
      data: {
        email: `test3_${Date.now()}@example.com`,
        password: 'Test1234!',
        fullName: 'Test User Three',
        role: 'CANDIDATE'
      }
    }
  ];

  for (const testCase of testCases) {
    console.log(`\n${testCase.name}`);
    console.log('Request:', JSON.stringify(testCase.data, null, 2));

    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testCase.data)
      });

      console.log('Status:', response.status);
      const data = await response.json();
      console.log('Response:', JSON.stringify(data, null, 2));

      // If successful, test the token
      if (response.ok) {
        console.log('\n  ✅ Registration successful!');

        if (data.token) {
          console.log('  Token received:', data.token.substring(0, 20) + '...');
          console.log('  User object:', JSON.stringify(data.user, null, 2));
          // Test /me endpoint with this token
          await testMe(data.token);
        } else {
          console.log('  ⚠️  No token in response - backend might require login after registration');
          console.log('  Attempting to login with same credentials...');
          await testLogin(testCase.data.email, testCase.data.password);
        }
      } else {
        console.log('\n  ❌ Registration failed');
      }
    } catch (error) {
      console.log('  ❌ Error:', error.message);
    }
  }
}

// Test login
async function testLogin(email = 'existing@example.com', password = 'password123') {
  console.log('\n========================================');
  console.log('Testing POST /api/auth/login');
  console.log('========================================\n');

  console.log('Request:', JSON.stringify({ email, password }, null, 2));

  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    console.log('Status:', response.status);
    console.log('Content-Type:', response.headers.get('content-type'));

    const contentType = response.headers.get('content-type');
    let data;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
      console.log('Response:', JSON.stringify(data, null, 2));
    } else {
      const text = await response.text();
      console.log('Response (non-JSON):', text.substring(0, 500));
      data = { error: 'Non-JSON response received' };
    }

    if (response.ok && data.token) {
      console.log('\n✅ Login successful!');
      return data.token;
    } else {
      console.log('\n❌ Login failed');
      return null;
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
    return null;
  }
}

// Test /me endpoint
async function testMe(token) {
  console.log('\n  Testing GET /api/auth/me with token...');

  try {
    const response = await fetch(`${API_URL}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('  Status:', response.status);
    const data = await response.json();
    console.log('  Response:', JSON.stringify(data, null, 2));

    if (response.ok) {
      console.log('  ✅ /me endpoint successful!');
    } else {
      console.log('  ❌ /me endpoint failed');
    }
  } catch (error) {
    console.log('  ❌ Error:', error.message);
  }
}

// Test health endpoint
async function testHealth() {
  console.log('\n========================================');
  console.log('Testing GET /api/health');
  console.log('========================================\n');

  try {
    const response = await fetch(`${API_URL}/api/health`);
    console.log('Status:', response.status);
    const data = await response.json();
    console.log('Response:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

// Main test runner
async function runTests() {
  console.log('╔════════════════════════════════════════╗');
  console.log('║  Backend API Test Suite                ║');
  console.log('║  Railway URL: ' + API_URL.substring(0, 30) + '...  ║');
  console.log('╚════════════════════════════════════════╝');

  // Test health endpoint first
  await testHealth();

  // Test registration
  await testRegister();

  // Try to login with a test account
  // (This will fail if the account doesn't exist, which is expected)
  console.log('\n========================================');
  console.log('Testing Login (may fail if no account)');
  console.log('========================================');
  await testLogin('test@example.com', 'Test1234!');

  console.log('\n========================================');
  console.log('Tests Complete!');
  console.log('========================================\n');

  console.log('Review the responses above to understand:');
  console.log('1. Correct field names (name vs fullName)');
  console.log('2. Role format (uppercase vs lowercase)');
  console.log('3. Response structure (user object location)');
  console.log('4. Error message format');
}

// Run all tests
runTests().catch(console.error);

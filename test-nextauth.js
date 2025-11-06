/**
 * NextAuth.js Login Test
 *
 * Testing different NextAuth.js authentication endpoints
 */

const API_URL = 'https://job-portal-backend-production-cd05.up.railway.app';

async function testNextAuthSignIn() {
  console.log('\n========================================');
  console.log('Testing NextAuth.js Sign In Endpoints');
  console.log('========================================\n');

  // Test 1: POST /api/auth/signin (standard NextAuth endpoint)
  console.log('Test 1: POST /api/auth/signin');
  try {
    const response = await fetch(`${API_URL}/api/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test2_1762395067118@example.com',
        password: 'Test1234!'
      })
    });

    console.log('Status:', response.status);
    console.log('Content-Type:', response.headers.get('content-type'));

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      console.log('Response:', JSON.stringify(data, null, 2));
    } else {
      const text = await response.text();
      console.log('Response (first 500 chars):', text.substring(0, 500));
    }
  } catch (error) {
    console.log('Error:', error.message);
  }

  // Test 2: POST /api/auth/callback/credentials
  console.log('\n\nTest 2: POST /api/auth/callback/credentials');
  try {
    const response = await fetch(`${API_URL}/api/auth/callback/credentials`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        email: 'test2_1762395067118@example.com',
        password: 'Test1234!',
        redirect: 'false',
        json: 'true'
      })
    });

    console.log('Status:', response.status);
    console.log('Content-Type:', response.headers.get('content-type'));

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      console.log('Response:', JSON.stringify(data, null, 2));
    } else {
      const text = await response.text();
      console.log('Response (first 500 chars):', text.substring(0, 500));
    }
  } catch (error) {
    console.log('Error:', error.message);
  }

  // Test 3: GET /api/auth/providers (to see available providers)
  console.log('\n\nTest 3: GET /api/auth/providers');
  try {
    const response = await fetch(`${API_URL}/api/auth/providers`);
    console.log('Status:', response.status);

    const data = await response.json();
    console.log('Available providers:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.log('Error:', error.message);
  }

  // Test 4: GET /api/auth/csrf (CSRF token required for NextAuth)
  console.log('\n\nTest 4: GET /api/auth/csrf');
  try {
    const response = await fetch(`${API_URL}/api/auth/csrf`);
    console.log('Status:', response.status);

    const data = await response.json();
    console.log('CSRF Token:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.log('Error:', error.message);
  }

  // Test 5: GET /api/auth/session (check if we can get session)
  console.log('\n\nTest 5: GET /api/auth/session');
  try {
    const response = await fetch(`${API_URL}/api/auth/session`);
    console.log('Status:', response.status);

    const data = await response.json();
    console.log('Session:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.log('Error:', error.message);
  }
}

testNextAuthSignIn().catch(console.error);

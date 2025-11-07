import axios from 'axios';
import { getSession } from 'next-auth/react';

// Get backend URL - MUST be set in Vercel environment variables
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'https://job-portal-backend-production-cd05.up.railway.app';

console.log('[API Client] Backend URL:', BACKEND_URL);

export const api = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth headers
api.interceptors.request.use(
  async (config) => {
    const session = await getSession();
    console.log('[API Client] Request interceptor - Session:', session?.user ? 'Found' : 'Not found');
    if (session?.user) {
      // Add user info headers for backend authentication
      config.headers['X-User-Id'] = session.user.id;
      config.headers['X-User-Email'] = session.user.email || '';
      config.headers['X-User-Role'] = session.user.role || '';
      console.log('[API Client] Request headers:', {
        'X-User-Id': config.headers['X-User-Id'],
        'X-User-Email': config.headers['X-User-Email'],
        'X-User-Role': config.headers['X-User-Role'],
      });
    }
    console.log('[API Client] Making request to:', `${config.baseURL || ''}${config.url || ''}`);
    return config;
  },
  (error) => {
    console.error('[API Client] Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

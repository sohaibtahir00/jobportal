/**
 * Authentication API Functions
 * Strongly typed API calls for authentication endpoints
 * Backend documentation: docs/API_REFERENCE.md
 */

import api from '../api';
import type {
  RegisterRequest,
  RegisterResponse,
  SignInRequest,
  SignInResponse,
  SessionResponse,
  ProvidersResponse,
  CsrfResponse,
  ErrorResponse
} from '../api-types';
import { UserRole } from '@/types';

/**
 * POST /api/auth/register
 * Register a new user (candidate or employer)
 *
 * CRITICAL:
 * - Backend expects 'name', NOT 'fullName'
 * - Role must be UPPERCASE: "CANDIDATE" | "EMPLOYER" | "ADMIN"
 *
 * @param data Registration data
 * @returns Promise with user data
 * @throws Error with backend error message
 */
export async function register(data: RegisterRequest): Promise<RegisterResponse> {
  try {
    // Transform role to uppercase for backend
    const requestData = {
      ...data,
      role: data.role ? (data.role.toUpperCase() as UserRole) : UserRole.CANDIDATE
    };

    const response = await api.post<RegisterResponse>('/api/auth/register', requestData);
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.error ||
                        error.response?.data?.message ||
                        'Registration failed. Please try again.';

    // Handle specific errors
    if (error.response?.status === 409) {
      throw new Error('An account with this email already exists.');
    }

    if (error.response?.status === 400 && error.response?.data?.details) {
      const details = Array.isArray(error.response.data.details)
        ? error.response.data.details.join(', ')
        : error.response.data.details;
      throw new Error(details);
    }

    throw new Error(errorMessage);
  }
}

/**
 * POST /api/auth/signin (via NextAuth callback)
 * Sign in with credentials using NextAuth
 *
 * NOTE: This uses NextAuth's credentials provider
 * Backend endpoint: /api/auth/callback/credentials
 *
 * @param credentials Email and password
 * @returns Promise with sign in result
 */
export async function signIn(credentials: SignInRequest): Promise<SignInResponse> {
  try {
    // NextAuth requires CSRF token for credentials signin
    const csrfResponse = await api.get<CsrfResponse>('/api/auth/csrf');
    const csrfToken = csrfResponse.data.csrfToken;

    // Call NextAuth callback endpoint
    const response = await api.post('/api/auth/callback/credentials', {
      email: credentials.email,
      password: credentials.password,
      csrfToken,
      redirect: false,
      json: true
    }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.error ||
                        error.response?.data?.message ||
                        'Login failed. Please check your credentials.';

    throw new Error(errorMessage);
  }
}

/**
 * POST /api/auth/signout
 * Sign out current user
 */
export async function signOut(): Promise<void> {
  try {
    await api.post('/api/auth/signout');
  } catch (error: any) {
    console.error('Sign out error:', error);
    // Don't throw - signing out should always succeed on client side
  }
}

/**
 * GET /api/auth/session
 * Get current session
 *
 * @returns Promise with session data or null if not authenticated
 */
export async function getSession(): Promise<SessionResponse | null> {
  try {
    const response = await api.get<SessionResponse>('/api/auth/session');

    // NextAuth returns empty object {} if no session
    if (!response.data || !response.data.user) {
      return null;
    }

    return response.data;
  } catch (error: any) {
    console.error('Get session error:', error);
    return null;
  }
}

/**
 * GET /api/auth/providers
 * Get available authentication providers
 *
 * @returns Promise with providers data
 */
export async function getProviders(): Promise<ProvidersResponse> {
  try {
    const response = await api.get<ProvidersResponse>('/api/auth/providers');
    return response.data;
  } catch (error: any) {
    console.error('Get providers error:', error);
    throw new Error('Failed to fetch authentication providers');
  }
}

/**
 * GET /api/auth/csrf
 * Get CSRF token for authentication
 *
 * @returns Promise with CSRF token
 */
export async function getCsrfToken(): Promise<string> {
  try {
    const response = await api.get<CsrfResponse>('/api/auth/csrf');
    return response.data.csrfToken;
  } catch (error: any) {
    console.error('Get CSRF token error:', error);
    throw new Error('Failed to fetch CSRF token');
  }
}

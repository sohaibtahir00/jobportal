/**
 * Auth Helper Utilities
 *
 * Provides utilities for token management and cookie handling
 */

// Cookie utilities
export const setCookie = (name: string, value: string, days: number = 7) => {
  if (typeof window === 'undefined') return;

  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
};

export const getCookie = (name: string): string | null => {
  if (typeof window === 'undefined') return null;

  const nameEQ = name + '=';
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

export const removeCookie = (name: string) => {
  if (typeof window === 'undefined') return;

  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
};

// Token management with dual storage (localStorage + cookie)
const TOKEN_KEY = 'auth_token';

export const setAuthToken = (token: string) => {
  if (typeof window === 'undefined') return;

  // Store in localStorage
  localStorage.setItem(TOKEN_KEY, token);

  // Also store in cookie for middleware access
  setCookie(TOKEN_KEY, token, 7);
};

export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;

  // Try localStorage first
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) return token;

  // Fallback to cookie
  return getCookie(TOKEN_KEY);
};

export const removeAuthToken = () => {
  if (typeof window === 'undefined') return;

  // Remove from localStorage
  localStorage.removeItem(TOKEN_KEY);

  // Remove from cookie
  removeCookie(TOKEN_KEY);
};

// Decode JWT to get payload (client-side only, no verification)
export const decodeToken = (token: string): any => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
};

// Check if token is expired
export const isTokenExpired = (token: string): boolean => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;

  const currentTime = Date.now() / 1000;
  return decoded.exp < currentTime;
};

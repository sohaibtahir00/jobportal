import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define public routes that don't require authentication
const publicRoutes = [
  '/',
  '/login',
  '/signup',
  '/forgot-password',
  '/jobs',
  '/employers',
  '/about',
  '/blog',
  '/privacy',
  '/terms',
  '/skills-assessment',
  '/claim',
  '/components',
  '/test-error',
];

// Define protected route prefixes
const candidateRoutes = ['/candidate'];
const employerRoutes = ['/employer'];

// Helper function to check if a path matches any of the routes
function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some(route => {
    if (route === '/') return pathname === '/';
    return pathname.startsWith(route);
  });
}

function isCandidateRoute(pathname: string): boolean {
  return candidateRoutes.some(route => pathname.startsWith(route));
}

function isEmployerRoute(pathname: string): boolean {
  return employerRoutes.some(route => pathname.startsWith(route));
}

// Decode JWT to get user role (simple version without verification)
// Note: This is just for routing, actual security is on the backend
function getUserRoleFromToken(token: string): string | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const payload = JSON.parse(jsonPayload);
    return payload.role || null;
  } catch (error) {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (isPublicRoute(pathname)) {
    // If user is logged in and tries to access login/signup, redirect to dashboard
    const token = request.cookies.get('auth_token')?.value ||
                  request.headers.get('authorization')?.replace('Bearer ', '');

    if (token && (pathname === '/login' || pathname === '/signup')) {
      const role = getUserRoleFromToken(token);

      if (role === 'employer') {
        return NextResponse.redirect(new URL('/employer/dashboard', request.url));
      } else if (role === 'candidate') {
        return NextResponse.redirect(new URL('/candidate/dashboard', request.url));
      }
    }

    return NextResponse.next();
  }

  // Check for authentication token
  // First check cookies, then localStorage (via header)
  const token = request.cookies.get('auth_token')?.value ||
                request.headers.get('authorization')?.replace('Bearer ', '');

  // If no token, redirect to login
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Get user role from token
  const userRole = getUserRoleFromToken(token);

  // Protect candidate routes
  if (isCandidateRoute(pathname)) {
    if (userRole !== 'candidate') {
      // Wrong role, redirect to appropriate dashboard
      if (userRole === 'employer') {
        return NextResponse.redirect(new URL('/employer/dashboard', request.url));
      }
      // Invalid token, redirect to login
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Protect employer routes
  if (isEmployerRoute(pathname)) {
    if (userRole !== 'employer') {
      // Wrong role, redirect to appropriate dashboard
      if (userRole === 'candidate') {
        return NextResponse.redirect(new URL('/candidate/dashboard', request.url));
      }
      // Invalid token, redirect to login
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

// Configure which routes should run the middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|robots.txt|sitemap.xml).*)',
  ],
};

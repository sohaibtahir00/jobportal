import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'https://job-portal-backend-production-cd05.up.railway.app';

// Proxy route to backend with authentication headers
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "EMPLOYER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Make request to backend with auth headers
    const response = await fetch(`${BACKEND_URL}/api/employer/integrations/google-calendar/oauth`, {
      headers: {
        'X-User-Id': session.user.id,
        'X-User-Email': session.user.email || '',
        'X-User-Role': session.user.role || '',
      },
      redirect: 'manual', // Don't follow redirects automatically
    });

    // If backend returns a redirect (302/303), get the Location header
    if (response.status === 302 || response.status === 303 || response.status === 307) {
      const location = response.headers.get('Location');
      if (location) {
        // Redirect browser to Google OAuth
        return NextResponse.redirect(location);
      }
    }

    // Handle error responses
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Failed to initiate OAuth' }));
      return NextResponse.json(error, { status: response.status });
    }

    // This shouldn't happen, but handle it gracefully
    return NextResponse.json({ error: 'Unexpected response from backend' }, { status: 500 });
  } catch (error) {
    console.error('OAuth proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to connect to backend' },
      { status: 500 }
    );
  }
}

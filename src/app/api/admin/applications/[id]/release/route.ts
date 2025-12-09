import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL || 'https://job-portal-backend-production-cd05.up.railway.app';

/**
 * POST /api/admin/applications/[id]/release
 * Proxy to backend POST /api/admin/applications/[id]/release
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const url = `${BACKEND_URL}/api/admin/applications/${id}/release`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': session.user.id,
        'X-User-Email': session.user.email || '',
        'X-User-Role': session.user.role || '',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Failed to release application' }));
      return NextResponse.json(error, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Admin release application proxy error:', error);
    return NextResponse.json({ error: "Failed to release application" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

// Backend URL configuration
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL || 'https://job-portal-backend-production-cd05.up.railway.app';

/**
 * PATCH /api/admin/jobs/[id]/approve
 * Proxy to backend PATCH /api/admin/jobs/[id]/approve
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    const { id } = params;
    const body = await request.json();

    const response = await fetch(`${BACKEND_URL}/api/admin/jobs/${id}/approve`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': session.user.id,
        'X-User-Email': session.user.email || '',
        'X-User-Role': session.user.role || '',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Failed to process job approval' }));
      return NextResponse.json(error, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Admin job approval proxy error:', error);
    return NextResponse.json(
      { error: "Failed to process job approval" },
      { status: 500 }
    );
  }
}

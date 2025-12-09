import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL || 'https://job-portal-backend-production-cd05.up.railway.app';

/**
 * GET /api/admin/campaigns/[id]
 * Proxy to backend GET /api/admin/campaigns/[id]
 */
export async function GET(
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
    const url = `${BACKEND_URL}/api/admin/campaigns/${id}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': session.user.id,
        'X-User-Email': session.user.email || '',
        'X-User-Role': session.user.role || '',
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Failed to fetch campaign' }));
      return NextResponse.json(error, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Admin campaign detail proxy error:', error);
    return NextResponse.json({ error: "Failed to fetch campaign" }, { status: 500 });
  }
}

/**
 * PATCH /api/admin/campaigns/[id]
 * Proxy to backend PATCH /api/admin/campaigns/[id]
 */
export async function PATCH(
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
    const url = `${BACKEND_URL}/api/admin/campaigns/${id}`;

    const response = await fetch(url, {
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
      const error = await response.json().catch(() => ({ error: 'Failed to update campaign' }));
      return NextResponse.json(error, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Admin update campaign proxy error:', error);
    return NextResponse.json({ error: "Failed to update campaign" }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/campaigns/[id]
 * Proxy to backend DELETE /api/admin/campaigns/[id]
 */
export async function DELETE(
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
    const url = `${BACKEND_URL}/api/admin/campaigns/${id}`;

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': session.user.id,
        'X-User-Email': session.user.email || '',
        'X-User-Role': session.user.role || '',
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Failed to delete campaign' }));
      return NextResponse.json(error, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Admin delete campaign proxy error:', error);
    return NextResponse.json({ error: "Failed to delete campaign" }, { status: 500 });
  }
}

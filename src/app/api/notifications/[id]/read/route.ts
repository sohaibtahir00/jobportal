import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

// Backend URL configuration
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL || 'https://job-portal-backend-production-cd05.up.railway.app';

/**
 * PATCH /api/notifications/[id]/read
 * Proxy to backend PATCH /api/notifications/[id]/read (mark single as read)
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

    const { id } = params;

    // Forward request to backend with user info in headers
    const response = await fetch(`${BACKEND_URL}/api/notifications/${id}/read`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': session.user.id,
        'X-User-Email': session.user.email || '',
        'X-User-Role': session.user.role || '',
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Failed to mark notification as read' }));
      return NextResponse.json(error, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Mark notification as read proxy error:', error);
    return NextResponse.json(
      { error: "Failed to mark notification as read" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/notifications/[id]/read
 * Proxy to backend DELETE /api/notifications/[id]/read (delete notification)
 */
export async function DELETE(
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

    const { id } = params;

    // Forward request to backend with user info in headers
    const response = await fetch(`${BACKEND_URL}/api/notifications/${id}/read`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': session.user.id,
        'X-User-Email': session.user.email || '',
        'X-User-Role': session.user.role || '',
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Failed to delete notification' }));
      return NextResponse.json(error, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Delete notification proxy error:', error);
    return NextResponse.json(
      { error: "Failed to delete notification" },
      { status: 500 }
    );
  }
}

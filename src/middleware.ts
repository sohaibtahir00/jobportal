import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Check if user is accessing employer routes
    if (path.startsWith("/employer")) {
      // If user is not an employer, redirect to appropriate dashboard
      if (token?.role !== "EMPLOYER") {
        if (token?.role === "CANDIDATE") {
          return NextResponse.redirect(new URL("/candidate/dashboard", req.url));
        }
        // If role is not set or is ADMIN, redirect to home
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    // Check if user is accessing candidate routes
    if (path.startsWith("/candidate")) {
      // If user is not a candidate, redirect to appropriate dashboard
      if (token?.role !== "CANDIDATE") {
        if (token?.role === "EMPLOYER") {
          return NextResponse.redirect(new URL("/employer/dashboard", req.url));
        }
        // If role is not set or is ADMIN, redirect to home
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/candidate/:path*",
    "/employer/:path*",
  ],
};

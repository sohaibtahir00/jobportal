import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Log in development for debugging
    if (process.env.NODE_ENV === "development") {
      console.log("[Middleware]", {
        path,
        role: token?.role,
        hasToken: !!token,
      });
    }

    // If no token, let NextAuth handle the redirect
    if (!token) {
      return NextResponse.next();
    }

    // Check if user is accessing employer routes
    if (path.startsWith("/employer")) {
      // If user is not an employer, redirect to appropriate dashboard
      if (token.role !== "EMPLOYER") {
        if (token.role === "CANDIDATE") {
          const url = new URL("/candidate/dashboard", req.url);
          console.log("[Middleware] Redirecting candidate from employer route to:", url.toString());
          return NextResponse.redirect(url);
        }
        // If role is not set or is ADMIN, redirect to home
        const url = new URL("/", req.url);
        console.log("[Middleware] Redirecting non-employer from employer route to:", url.toString());
        return NextResponse.redirect(url);
      }
    }

    // Check if user is accessing candidate routes
    if (path.startsWith("/candidate")) {
      // If user is not a candidate, redirect to appropriate dashboard
      if (token.role !== "CANDIDATE") {
        if (token.role === "EMPLOYER") {
          const url = new URL("/employer/dashboard", req.url);
          console.log("[Middleware] Redirecting employer from candidate route to:", url.toString());
          return NextResponse.redirect(url);
        }
        // If role is not set or is ADMIN, redirect to home
        const url = new URL("/", req.url);
        console.log("[Middleware] Redirecting non-candidate from candidate route to:", url.toString());
        return NextResponse.redirect(url);
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // Return true if token exists, false will trigger redirect to sign-in
        return !!token;
      },
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: [
    "/candidate/:path*",
    "/employer/:path*",
  ],
};

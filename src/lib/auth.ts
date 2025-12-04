import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'https://job-portal-backend-production-cd05.up.railway.app';

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_OAUTH_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET || "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        rememberMe: { label: "Remember Me", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        // Call backend validation endpoint
        const res = await fetch(`${BACKEND_URL}/api/auth/validate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({ error: "Authentication failed" }));
          const errorMessage = errorData.error || "Invalid credentials";

          // Throw with the exact error message so it can be detected in the frontend
          throw new Error(errorMessage);
        }

        const user = await res.json();

        if (user && user.id) {
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image || null,
            role: user.role,
            status: user.status,
            rememberMe: credentials.rememberMe === "true",
          };
        }

        return null;
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days (max)
  },

  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days (max)
  },

  callbacks: {
    async signIn({ user, account, profile }) {
      // Handle Google OAuth sign-in
      if (account?.provider === "google") {
        try {
          // Check if user exists in our backend
          const res = await fetch(`${BACKEND_URL}/api/auth/oauth/check`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: user.email }),
          });

          const data = await res.json();

          if (data.exists) {
            // User exists - store their data for JWT callback
            (user as any).id = data.user.id;
            (user as any).role = data.user.role;
            (user as any).isOAuthUser = true;
            return true;
          } else {
            // User doesn't exist - they need to sign up first or this is a signup flow
            // We'll handle this in the callback page
            (user as any).isNewOAuthUser = true;
            (user as any).isOAuthUser = true;
            return true;
          }
        } catch (error) {
          console.error("OAuth check error:", error);
          // Allow sign-in to continue, handle in callback
          (user as any).isOAuthUser = true;
          (user as any).isNewOAuthUser = true;
          return true;
        }
      }
      return true;
    },

    async jwt({ token, user, account, trigger, session }) {
      // Initial sign in
      if (user) {
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;

        // Handle OAuth user
        if ((user as any).isOAuthUser) {
          token.isOAuthUser = true;
          token.isNewOAuthUser = (user as any).isNewOAuthUser || false;

          if ((user as any).id) {
            token.id = (user as any).id;
          }
          if ((user as any).role) {
            token.role = (user as any).role;
          }
        } else {
          // Regular credentials sign in
          token.id = user.id;
          token.role = (user as any).role;
          token.rememberMe = (user as any).rememberMe || false;

          // Set expiration based on rememberMe
          const now = Math.floor(Date.now() / 1000);
          if (token.rememberMe) {
            token.exp = now + (30 * 24 * 60 * 60);
          } else {
            token.exp = now + (24 * 60 * 60);
          }
        }
      }

      // Handle session update (when update() is called)
      if (trigger === "update") {
        // If session data is passed directly, use it
        if (session?.name) {
          token.name = session.name;
        }
        if (session?.email) {
          token.email = session.email;
        }
        if (session?.id) {
          token.id = session.id;
        }
        if (session?.role) {
          token.role = session.role;
        }
        // Clear new user flag after update
        if (session?.isNewOAuthUser === false) {
          token.isNewOAuthUser = false;
        }

        // Otherwise, fetch updated user data from backend
        if (!session?.name && !session?.email && token.id) {
          try {
            const res = await fetch(`${BACKEND_URL}/api/settings`, {
              headers: {
                "X-User-Id": token.id as string,
                "X-User-Email": token.email as string,
                "X-User-Role": token.role as string,
              },
            });

            if (res.ok) {
              const data = await res.json();
              if (data.settings) {
                token.name = data.settings.name || token.name;
                token.email = data.settings.email || token.email;
              }
            }
          } catch (error) {
            console.error("Failed to fetch updated user data:", error);
          }
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.role = token.role as 'CANDIDATE' | 'EMPLOYER' | 'ADMIN';
        (session as any).isNewOAuthUser = token.isNewOAuthUser || false;
        (session as any).isOAuthUser = token.isOAuthUser || false;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET || "development-secret-change-in-production",
};

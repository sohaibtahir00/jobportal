import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'https://job-portal-backend-production-cd05.up.railway.app';

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        try {
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
            throw new Error(errorData.error || "Invalid credentials");
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
            };
          }

          return null;
        } catch (error: any) {
          console.error("Auth error:", error);
          throw new Error(error.message || "Authentication failed");
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  jwt: {
    maxAge: 30 * 24 * 60 * 60,
  },

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
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

        // Otherwise, fetch updated user data from backend
        if (!session?.name && !session?.email) {
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

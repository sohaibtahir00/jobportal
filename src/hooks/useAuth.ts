"use client";

import { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

// Type declarations for Credential Management API
interface PasswordCredentialData {
  id: string;
  password: string;
  name?: string;
}

interface PasswordCredentialConstructor {
  new (data: PasswordCredentialData): Credential;
}

declare global {
  interface Window {
    PasswordCredential?: PasswordCredentialConstructor;
  }
}

export interface SignupData {
  email: string;
  password: string;
  fullName: string;
  role: "candidate" | "employer";
}

export function useAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const user = session?.user
    ? {
        id: session.user.id,
        email: session.user.email!,
        name: session.user.name!,
        fullName: session.user.name!,
        role: session.user.role?.toLowerCase() as "candidate" | "employer",
        image: session.user.image,
        status: session.user.status,
      }
    : null;

  const login = async ({ email, password, rememberMe }: { email: string; password: string; rememberMe?: boolean }) => {
    setIsAuthLoading(true);
    setAuthError(null);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        rememberMe: String(rememberMe || false),
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      // Store credentials for browser password manager (desktop browsers)
      // This explicitly tells the browser to save the credentials after successful AJAX login
      if (window.PasswordCredential && navigator.credentials) {
        try {
          const credential = new window.PasswordCredential({
            id: email,
            password: password,
            name: email,
          });
          await navigator.credentials.store(credential);
        } catch (credError) {
          // Silently fail - credential storage is optional
          console.debug("Credential storage not available:", credError);
        }
      }

      // Redirect based on role after successful login
      // Use window.location.href instead of router.push to trigger full page reload
      const response = await fetch("/api/auth/session");
      const sessionData = await response.json();

      if (sessionData?.user?.role) {
        const role = sessionData.user.role.toLowerCase();
        if (role === "employer") {
          window.location.href = "/employer/dashboard";
        } else {
          window.location.href = "/candidate/dashboard";
        }
      }
    } catch (error: any) {
      setAuthError(error.message || "Login failed");
      setIsAuthLoading(false);
      throw error;
    }
  };

  const signup = async (data: SignupData) => {
    setIsAuthLoading(true);
    setAuthError(null);

    try {
      // Call backend register API - use relative path since api client already has baseURL configured
      const response = await api.post('/api/auth/register', {
        email: data.email,
        password: data.password,
        name: data.fullName,
        role: data.role.toUpperCase(),
      });

      if (response.status !== 201) {
        throw new Error(response.data.error || "Registration failed");
      }

      // After registration, log the user in
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      // Redirect to onboarding based on role (instead of dashboard)
      if (data.role === "employer") {
        router.push("/onboarding/employer");
      } else {
        router.push("/onboarding/candidate");
      }
    } catch (error: any) {
      setAuthError(error.message || "Registration failed");
      setIsAuthLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  const clearError = () => {
    setAuthError(null);
  };

  return {
    user,
    isAuthenticated: !!session,
    isLoading: status === "loading" || isAuthLoading,
    error: authError,
    login,
    signup,
    logout,
    clearError,
  };
}

export default useAuth;

"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export interface SignupData {
  email: string;
  password: string;
  fullName: string;
  role: "candidate" | "employer";
}

export function useAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();

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
    const result = await signIn("credentials", {
      email,
      password,
      rememberMe: String(rememberMe || false),
      redirect: false,
    });

    if (result?.error) {
      throw new Error(result.error);
    }

    // Redirect based on role after successful login
    // Use window.location.href instead of router.push to trigger full page reload
    // This allows Chrome to detect successful login and prompt to save password
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
  };

  const signup = async (data: SignupData) => {
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
  };

  const logout = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  return {
    user,
    isAuthenticated: !!session,
    isLoading: status === "loading",
    error: null,
    login,
    signup,
    logout,
    clearError: () => {}, // No-op for compatibility
  };
}

export default useAuth;

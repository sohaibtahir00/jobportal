"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CandidateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  // 🔍 DEBUG - Remove after fixing
  console.log('[Candidate Layout] Status:', status);
  console.log('[Candidate Layout] Session:', session);
  console.log('[Candidate Layout] User Role:', session?.user?.role);

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/login");
      return;
    }

    if (session.user.role === "ADMIN") {
      router.push("/admin");
      return;
    }

    if (session.user.role !== "CANDIDATE") {
      router.push("/employer/dashboard");
      return;
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!session || session.user.role !== "CANDIDATE") {
    return null;
  }

  return <>{children}</>;
}

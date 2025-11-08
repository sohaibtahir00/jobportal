"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function EmployerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  // 🔍 DEBUG - Remove after fixing
  console.log('[Employer Layout] Status:', status);
  console.log('[Employer Layout] Session:', session);
  console.log('[Employer Layout] User Role:', session?.user?.role);

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/login");
      return;
    }

    if (session.user.role !== "EMPLOYER") {
      router.push("/candidate/dashboard");
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

  if (!session || session.user.role !== "EMPLOYER") {
    return null;
  }

  return <>{children}</>;
}

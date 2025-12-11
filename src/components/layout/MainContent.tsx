"use client";

import { usePathname } from "next/navigation";

interface MainContentProps {
  children: React.ReactNode;
}

export function MainContent({ children }: MainContentProps) {
  const pathname = usePathname();

  // Dashboard routes have their own layout with no public header, so no padding needed
  const isDashboardRoute =
    pathname.startsWith("/candidate") ||
    pathname.startsWith("/employer") ||
    pathname.startsWith("/admin");

  return (
    <main className={`flex-1 ${isDashboardRoute ? "" : "pt-16"}`}>
      {children}
    </main>
  );
}

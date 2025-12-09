"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Award,
  DollarSign,
  Settings as SettingsIcon,
  LogOut,
  Menu,
  X,
  Loader2,
  Shield,
  AlertTriangle,
  Mail,
} from "lucide-react";
import { useState, useEffect } from "react";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Footer } from "@/components/layout";

const adminNavItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "User Management", icon: Users },
  { href: "/admin/jobs", label: "Jobs Management", icon: Briefcase },
  { href: "/admin/assessments", label: "Assessments Review", icon: Award },
  { href: "/admin/placements", label: "Placements & Revenue", icon: DollarSign },
  { href: "/admin/check-ins", label: "Check-in Emails", icon: Mail },
  { href: "/admin/circumvention", label: "Circumvention Flags", icon: AlertTriangle },
  { href: "/admin/settings", label: "Platform Settings", icon: SettingsIcon },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Redirect if not logged in or not admin
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?redirect=/admin");
    }
    if (status === "authenticated" && session?.user?.role !== "ADMIN") {
      router.push("/");
    }
  }, [status, session, router]);

  // Loading state
  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary-50">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary-600" />
          <p className="mt-4 text-secondary-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated or not admin
  if (!session || session.user.role !== "ADMIN") {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-secondary-900/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-gradient-to-b from-purple-900 to-purple-800 shadow-lg transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col overflow-y-auto">
          {/* Logo & Close Button */}
          <div className="flex h-16 items-center justify-between border-b border-purple-700 px-6">
            <Link href="/" className="flex items-center gap-2">
              <Shield className="h-8 w-8 text-purple-200" />
              <span className="text-lg font-bold text-white">Admin Panel</span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-purple-200 hover:text-white"
              aria-label="Close sidebar"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* User Info */}
          <div className="border-b border-purple-700 p-6">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-700 text-purple-100">
                <Shield className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium text-white">
                  {session.user?.name || "Admin"}
                </p>
                <p className="truncate text-xs text-purple-300">
                  {session.user?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {adminNavItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-purple-700 text-white"
                      : "text-purple-200 hover:bg-purple-700/50 hover:text-white"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Back to Site & Logout */}
          <div className="border-t border-purple-700 p-3 space-y-2">
            <Link
              href="/"
              className="flex w-full items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium text-purple-200 transition-colors hover:bg-purple-700/50 hover:text-white"
            >
              <LayoutDashboard className="h-5 w-5" />
              <span>Back to Site</span>
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex w-full items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium text-red-300 transition-colors hover:bg-red-900/30 hover:text-red-200"
            >
              <LogOut className="h-5 w-5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-secondary-200 bg-white px-4 shadow-sm lg:px-8">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden"
            aria-label="Open sidebar"
          >
            <Menu className="h-6 w-6 text-secondary-600" />
          </button>

          <div className="flex-1 lg:flex lg:items-center lg:gap-3">
            <Shield className="hidden lg:block h-5 w-5 text-purple-600" />
            <h1 className="hidden lg:block text-lg font-semibold text-secondary-900">
              Admin Control Panel
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-medium">
              Administrator
            </span>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-8">
          <ErrorBoundary>{children}</ErrorBoundary>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
  Users,
  Receipt,
  BarChart3,
  Loader2,
  Star,
  Calendar,
  UserPlus,
  Search,
  CheckCircle2,
  Bookmark,
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import ErrorBoundary from "@/components/ErrorBoundary";

// This will be replaced with actual auth check later
const MOCK_CANDIDATE_USER = {
  name: "Sarah Johnson",
  email: "sarah.johnson@email.com",
  role: "candidate" as const,
  avatar: null,
};

const MOCK_EMPLOYER_USER = {
  name: "TechCorp AI",
  email: "hiring@techcorp.ai",
  role: "employer" as const,
  avatar: null,
};

const candidateNavItems = [
  { href: "/candidate/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/candidate/profile", label: "My Profile", icon: FileText },
  { href: "/candidate/jobs", label: "Browse Jobs", icon: Briefcase },
  { href: "/candidate/exclusive-jobs", label: "Exclusive Jobs", icon: Star },
  { href: "/candidate/applications", label: "My Applications", icon: FileText },
  { href: "/candidate/saved", label: "Saved Jobs", icon: Bookmark },
  { href: "/candidate/messages", label: "Messages", icon: MessageSquare },
  { href: "/candidate/interviews", label: "Interviews", icon: Calendar },
  { href: "/candidate/referrals", label: "Referrals", icon: UserPlus },
  { href: "/candidate/settings", label: "Settings", icon: Settings },
];

const employerNavItems = [
  { href: "/employer/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/employer/jobs/new", label: "Post New Job", icon: Briefcase },
  { href: "/employer/applicants", label: "All Applicants", icon: Users },
  { href: "/employer/search", label: "Search Candidates", icon: Search },
  { href: "/employer/claim", label: "Claim Jobs", icon: Briefcase },
  { href: "/employer/placements", label: "Placements", icon: CheckCircle2 },
  { href: "/employer/invoices", label: "Invoices", icon: Receipt },
  { href: "/employer/settings", label: "Settings", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Detect role from pathname or session
  const isEmployer = pathname.startsWith("/employer");
  const navItems = isEmployer ? employerNavItems : candidateNavItems;

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

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

  // Not authenticated
  if (!session) {
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
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col overflow-y-auto">
          {/* Logo & Close Button */}
          <div className="flex h-16 items-center justify-between border-b border-secondary-200 px-6">
            <Link href="/" className="flex items-center">
              <img src="/logo.png" alt="Job Portal" className="h-14 w-auto" />
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden"
              aria-label="Close sidebar"
            >
              <X className="h-6 w-6 text-secondary-600" />
            </button>
          </div>

          {/* User Info */}
          <div className="border-b border-secondary-200 p-6">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                <span className="text-sm font-semibold">
                  {session.user?.name
                    ? session.user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                    : session.user?.email?.[0].toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium text-secondary-900">
                  {session.user?.name || "User"}
                </p>
                <p className="truncate text-xs text-secondary-500">
                  {session.user?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary-50 text-primary-600"
                      : "text-secondary-700 hover:bg-secondary-50"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="border-t border-secondary-200 p-3">
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex w-full items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
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

          <div className="flex-1 lg:hidden" />

          <div className="flex items-center space-x-4">
            {/* Notification bell or other header actions can go here */}
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-8">
          <ErrorBoundary>{children}</ErrorBoundary>
        </main>
      </div>
    </div>
  );
}

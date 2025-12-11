"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  MessageSquare,
  Settings,
  Menu,
  X,
  Users,
  Receipt,
  Loader2,
  Star,
  Calendar,
  CheckCircle2,
  Bookmark,
  Video,
  Gift,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { useState, useEffect } from "react";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Footer } from "@/components/layout";
import { NotificationsDropdown } from "@/components/layout/NotificationsDropdown";

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
  { href: "/candidate/recommendations", label: "Recommended Jobs", icon: Sparkles },
  { href: "/candidate/exclusive-jobs", label: "Exclusive Jobs", icon: Star },
  { href: "/candidate/applications", label: "My Applications", icon: FileText },
  { href: "/candidate/saved", label: "Saved Jobs", icon: Bookmark },
  { href: "/candidate/messages", label: "Messages", icon: MessageSquare },
  { href: "/candidate/interviews", label: "Interviews", icon: Calendar },
  { href: "/candidate/offers", label: "Offers", icon: Gift },
  { href: "/candidate/placements", label: "Placements", icon: CheckCircle2 },
  { href: "/candidate/settings", label: "Settings", icon: Settings },
];

const employerNavItems = [
  { href: "/employer/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/employer/jobs/new", label: "Post New Job", icon: Briefcase },
  { href: "/employer/applicants", label: "All Applicants", icon: Users },
  { href: "/employer/messages", label: "Messages", icon: MessageSquare },
  { href: "/employer/interviews", label: "Interviews", icon: Video },
  { href: "/employer/offers", label: "Offers", icon: Gift },
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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Load collapsed state from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("sidebarCollapsed");
    if (stored !== null) {
      setSidebarCollapsed(stored === "true");
    }
  }, []);

  // Persist collapsed state to localStorage
  const toggleSidebarCollapsed = () => {
    const newState = !sidebarCollapsed;
    setSidebarCollapsed(newState);
    localStorage.setItem("sidebarCollapsed", String(newState));
  };

  // Detect role from pathname or session
  const isEmployer = pathname.startsWith("/employer");
  const navItems = isEmployer ? employerNavItems : candidateNavItems;

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      const redirect = isEmployer ? "/employer/dashboard" : "/candidate/dashboard";
      router.push(`/login?redirect=${redirect}`);
    }
  }, [status, router, isEmployer]);

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
        className={`fixed inset-y-0 left-0 z-40 transform bg-white shadow-lg transition-all duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } ${sidebarCollapsed ? "lg:w-[70px]" : "lg:w-64"} w-64`}
      >
        <div className="flex h-full flex-col overflow-y-auto overflow-x-hidden">
          {/* Toggle Button Row */}
          <div className={`flex h-16 items-center border-b border-secondary-200 ${sidebarCollapsed ? "justify-center px-2" : "justify-between px-4"}`}>
            {/* Mobile: Show logo and close button */}
            <Link href="/" className="flex items-center lg:hidden">
              <img src="/logo.png" alt="SkillProof" className="h-8 w-auto" />
            </Link>
            {/* Mobile close button */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden"
              aria-label="Close sidebar"
            >
              <X className="h-6 w-6 text-secondary-600" />
            </button>
            {/* Desktop: Collapse toggle only (no logo in sidebar) */}
            <button
              onClick={toggleSidebarCollapsed}
              className={`hidden lg:flex items-center justify-center rounded-md transition-colors ${
                sidebarCollapsed
                  ? "h-10 w-10 bg-primary-100 text-primary-600 hover:bg-primary-200"
                  : "h-8 w-8 text-secondary-500 hover:bg-secondary-100 hover:text-secondary-700"
              }`}
              aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <ChevronRight className={`transition-transform ${sidebarCollapsed ? "h-6 w-6" : "h-5 w-5 rotate-180"}`} />
            </button>
          </div>

          {/* Navigation - starts directly after toggle */}
          <nav className={`flex-1 space-y-1 py-4 ${sidebarCollapsed ? "px-2" : "px-3"}`}>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group relative flex items-center rounded-lg py-2 text-sm font-medium transition-colors ${
                    sidebarCollapsed ? "justify-center px-2" : "space-x-3 px-3"
                  } ${
                    isActive
                      ? "bg-primary-50 text-primary-600"
                      : "text-secondary-700 hover:bg-secondary-50"
                  }`}
                  onClick={() => {
                    setSidebarOpen(false);
                    // Auto-collapse sidebar on desktop when clicking a menu item
                    if (window.innerWidth >= 1024 && !sidebarCollapsed) {
                      setSidebarCollapsed(true);
                      localStorage.setItem("sidebarCollapsed", "true");
                    }
                  }}
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!sidebarCollapsed && <span>{item.label}</span>}
                  {/* Tooltip for collapsed state */}
                  {sidebarCollapsed && (
                    <span className="absolute left-full ml-2 px-2 py-1 text-xs font-medium text-white bg-secondary-800 rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity whitespace-nowrap z-50">
                      {item.label}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarCollapsed ? "lg:pl-[70px]" : "lg:pl-64"}`}>
        {/* Top Bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center border-b border-secondary-200 bg-white px-4 shadow-sm lg:px-8">
          {/* Left side: Mobile menu button + Logo (always visible on desktop) */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden"
              aria-label="Open sidebar"
            >
              <Menu className="h-6 w-6 text-secondary-600" />
            </button>
            {/* Logo - always visible in header on desktop */}
            <Link href="/" className="hidden lg:flex items-center">
              <img src="/logo.png" alt="SkillProof" className="h-8 w-auto" />
            </Link>
          </div>

          {/* Spacer to push right content */}
          <div className="flex-1" />

          {/* Right side: Notifications + User dropdown */}
          <div className="flex items-center gap-3">
            <NotificationsDropdown />
            {/* User info display */}
            <div className="flex items-center gap-2 text-sm">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                <span className="text-xs font-semibold">
                  {session.user?.name
                    ? session.user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                    : session.user?.email?.[0].toUpperCase()}
                </span>
              </div>
              <span className="hidden sm:block font-medium text-secondary-700 max-w-[120px] truncate">
                {session.user?.name || session.user?.email}
              </span>
            </div>
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

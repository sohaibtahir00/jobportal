"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Briefcase, Menu, X, User, LogOut } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui";

export interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const [userMenuOpen, setUserMenuOpen] = React.useState(false);

  // Handle scroll effect
  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when window is resized to desktop
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [mobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  React.useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  const navigation = [
    { name: "Find Jobs", href: "/jobs" },
    { name: "For Employers", href: "/employers" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full border-b transition-all duration-200",
        scrolled
          ? "border-secondary-200 bg-white/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/80"
          : "border-transparent bg-white",
        className
      )}
    >
      <div className="container">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center transition-opacity hover:opacity-80">
            <Image
              src="/logo.png"
              alt="Job Portal"
              width={280}
              height={70}
              className="h-14 md:h-16 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-8 md:flex">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-secondary-600 transition-colors hover:text-primary-600"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-4 md:flex">
            {status === "loading" ? (
              <div className="h-9 w-24 animate-pulse rounded-md bg-secondary-200" />
            ) : session ? (
              <>
                {/* Show Post Job button for employers only */}
                {session.user?.role === "EMPLOYER" && (
                  <Button variant="primary" size="sm" asChild>
                    <Link href="/employer/jobs/new">Post a Job</Link>
                  </Button>
                )}

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 rounded-full bg-primary-100 px-3 py-2 text-sm font-medium text-primary-700 transition-colors hover:bg-primary-200"
                  >
                    <User className="h-4 w-4" />
                    <span className="max-w-[100px] truncate">{session.user?.name || session.user?.email}</span>
                  </button>

                  {/* Dropdown Menu */}
                  {userMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setUserMenuOpen(false)}
                      />
                      <div className="absolute right-0 z-20 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                        <Link
                          href={session.user?.role === "CANDIDATE" ? "/candidate/dashboard" : "/employer/dashboard"}
                          className="block px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-100"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          Dashboard
                        </Link>
                        <Link
                          href={session.user?.role === "CANDIDATE" ? "/candidate/profile" : "/employer/profile"}
                          className="block px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-100"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          Profile
                        </Link>
                        {session.user?.role === "CANDIDATE" && (
                          <Link
                            href="/jobs"
                            className="block px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-100"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            Browse Jobs
                          </Link>
                        )}
                        <hr className="my-1 border-secondary-200" />
                        <button
                          onClick={() => {
                            setUserMenuOpen(false);
                            signOut({ callbackUrl: "/" });
                          }}
                          className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                        >
                          <LogOut className="h-4 w-4" />
                          Log Out
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button variant="primary" size="sm" asChild>
                  <Link href="/register">Get Started</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex items-center justify-center rounded-md p-2 text-secondary-600 transition-colors hover:bg-secondary-100 hover:text-secondary-900 md:hidden"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-16 z-50 bg-white md:hidden">
          <nav className="container flex flex-col space-y-1 py-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-md px-4 py-3 text-base font-medium text-secondary-900 transition-colors hover:bg-secondary-100"
              >
                {item.name}
              </Link>
            ))}

            <div className="my-4 border-t border-secondary-200" />

            <div className="flex flex-col gap-3 px-4">
              {session ? (
                <>
                  {/* User Info */}
                  <div className="mb-2 rounded-lg bg-primary-50 p-3">
                    <p className="text-sm font-medium text-primary-900">{session.user?.name}</p>
                    <p className="text-xs text-primary-700">{session.user?.email}</p>
                  </div>

                  {/* Post Job for Employers */}
                  {session.user?.role === "EMPLOYER" && (
                    <Button variant="primary" className="w-full justify-center" asChild>
                      <Link href="/employer/jobs/new" onClick={() => setMobileMenuOpen(false)}>
                        Post a Job
                      </Link>
                    </Button>
                  )}

                  {/* Dashboard Link */}
                  <Button variant="outline" className="w-full justify-center" asChild>
                    <Link
                      href={session.user?.role === "CANDIDATE" ? "/candidate/dashboard" : "/employer/dashboard"}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <User className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </Button>

                  {/* Browse Jobs for Candidates */}
                  {session.user?.role === "CANDIDATE" && (
                    <Button variant="outline" className="w-full justify-center" asChild>
                      <Link href="/jobs" onClick={() => setMobileMenuOpen(false)}>
                        <Briefcase className="mr-2 h-4 w-4" />
                        Browse Jobs
                      </Link>
                    </Button>
                  )}

                  {/* Log Out */}
                  <Button
                    variant="ghost"
                    className="w-full justify-center text-red-600 hover:bg-red-50 hover:text-red-700"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      signOut({ callbackUrl: "/" });
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log Out
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    className="w-full justify-center"
                    asChild
                  >
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                      Sign In
                    </Link>
                  </Button>
                  <Button variant="primary" className="w-full justify-center" asChild>
                    <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                      Get Started
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

Header.displayName = "Header";

export { Header };

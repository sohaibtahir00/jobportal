"use client";

import * as React from "react";
import Link from "next/link";
import { Briefcase, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui";

export interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

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
    { name: "Companies", href: "/companies" },
    { name: "For Employers", href: "/employers" },
    { name: "Resources", href: "/resources" },
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
          <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600">
              <Briefcase className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-secondary-900">
              Job Portal
            </span>
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
            <Button variant="ghost" size="sm" asChild>
              <Link href="/signin">Sign In</Link>
            </Button>
            <Button variant="primary" size="sm" asChild>
              <Link href="/post-job">Post a Job</Link>
            </Button>
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
              <Button
                variant="outline"
                className="w-full justify-center"
                asChild
              >
                <Link href="/signin" onClick={() => setMobileMenuOpen(false)}>
                  Sign In
                </Link>
              </Button>
              <Button variant="primary" className="w-full justify-center" asChild>
                <Link href="/post-job" onClick={() => setMobileMenuOpen(false)}>
                  Post a Job
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

Header.displayName = "Header";

export { Header };

import * as React from "react";
import Link from "next/link";
import {
  Briefcase,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Github,
  Mail,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className }) => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    forCandidates: [
      { name: "Browse Jobs", href: "/jobs" },
      { name: "AI/ML Jobs", href: "/ai-ml-jobs" },
      { name: "Healthcare IT Jobs", href: "/healthcare-it-jobs" },
      { name: "Fintech Jobs", href: "/fintech-jobs" },
      { name: "Cybersecurity Jobs", href: "/cybersecurity-jobs" },
      { name: "Skills Assessment", href: "/skills-assessment" },
    ],
    forEmployers: [
      { name: "For Employers", href: "/employers" },
      { name: "Pricing", href: "/pricing" },
      { name: "Claim Your Job", href: "/claim" },
      { name: "Post a Job", href: "/employer/jobs/new" },
      { name: "Search Candidates", href: "/employer/search" },
    ],
    company: [
      { name: "About Us", href: "/about" },
      { name: "How It Works", href: "/how-it-works" },
      { name: "Contact", href: "/contact" },
      { name: "FAQ", href: "/faq" },
      { name: "Resources", href: "/resources" },
      { name: "Blog", href: "/blog" },
    ],
    legal: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
    ],
  };

  const socialLinks = [
    {
      name: "Facebook",
      href: "https://facebook.com",
      icon: Facebook,
    },
    {
      name: "Twitter",
      href: "https://twitter.com",
      icon: Twitter,
    },
    {
      name: "LinkedIn",
      href: "https://linkedin.com",
      icon: Linkedin,
    },
    {
      name: "Instagram",
      href: "https://instagram.com",
      icon: Instagram,
    },
    {
      name: "GitHub",
      href: "https://github.com",
      icon: Github,
    },
  ];

  return (
    <footer
      className={cn(
        "border-t border-secondary-200 bg-secondary-50",
        className
      )}
    >
      <div className="container py-12 md:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-6">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="flex items-center gap-2 transition-opacity hover:opacity-80"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-primary-600 to-accent-600">
                <Briefcase className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-secondary-900">
                Job Portal
              </span>
            </Link>
            <p className="mt-4 text-sm text-secondary-600">
              Specialized recruitment for AI/ML, Healthcare IT, Fintech &
              Cybersecurity engineers. Skills-verified candidates, success-fee
              model.
            </p>

            {/* Trust Signals */}
            <div className="mt-6 space-y-2">
              <div className="flex items-center gap-2 text-sm text-secondary-700">
                <span className="text-success-600">✓</span>
                <span className="font-medium">2,000+ candidates placed</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-secondary-700">
                <span className="text-success-600">✓</span>
                <span className="font-medium">15-20% success fee only</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-secondary-700">
                <span className="text-success-600">✓</span>
                <span className="font-medium">90-day guarantee</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-6 flex items-center gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-secondary-600 transition-colors hover:bg-primary-600 hover:text-white"
                    aria-label={social.name}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>

            {/* Newsletter */}
            <div className="mt-6">
              <h3 className="mb-3 text-sm font-semibold text-secondary-900">
                Subscribe to our Newsletter
              </h3>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <label htmlFor="footer-newsletter-email" className="sr-only">
                    Email address for newsletter subscription
                  </label>
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary-400" />
                  <input
                    id="footer-newsletter-email"
                    type="email"
                    placeholder="Enter your email"
                    className="h-10 w-full rounded-md border border-secondary-300 bg-white pl-10 pr-3 text-sm focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600/20"
                  />
                </div>
                <button className="h-10 rounded-md bg-gradient-to-r from-primary-600 to-accent-600 px-4 text-sm font-medium text-white transition-colors hover:from-primary-700 hover:to-accent-700">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* For Candidates */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-secondary-900">
              For Candidates
            </h3>
            <ul className="space-y-3">
              {footerLinks.forCandidates.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-secondary-600 transition-colors hover:text-primary-600"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Employers */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-secondary-900">
              For Employers
            </h3>
            <ul className="space-y-3">
              {footerLinks.forEmployers.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-secondary-600 transition-colors hover:text-primary-600"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-secondary-900">
              Company
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-secondary-600 transition-colors hover:text-primary-600"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-secondary-900">
              Legal
            </h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-secondary-600 transition-colors hover:text-primary-600"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-secondary-200 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-center text-sm text-secondary-600">
              &copy; {currentYear} Job Portal. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link
                href="/privacy"
                className="text-sm text-secondary-600 transition-colors hover:text-primary-600"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="text-sm text-secondary-600 transition-colors hover:text-primary-600"
              >
                Terms
              </Link>
              <Link
                href="/about"
                className="text-sm text-secondary-600 transition-colors hover:text-primary-600"
              >
                About
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

Footer.displayName = "Footer";

export { Footer };

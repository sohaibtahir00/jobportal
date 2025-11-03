import Link from "next/link";
import { Briefcase, TrendingUp, Users, Award } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen">
      {/* Left Side - Form */}
      <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-12 xl:px-20">
        <div className="mx-auto w-full max-w-md">
          {/* Logo */}
          <Link href="/" className="mb-8 inline-block">
            <div className="flex items-center space-x-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600">
                <Briefcase className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-secondary-900">
                JobPortal
              </span>
            </div>
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-secondary-900">{title}</h1>
            <p className="mt-2 text-secondary-600">{subtitle}</p>
          </div>

          {/* Form Content */}
          {children}
        </div>
      </div>

      {/* Right Side - Branding */}
      <div className="relative hidden lg:block lg:w-1/2">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600">
          {/* Overlay Pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAgMS4xLS45IDItMiAycy0yLS45LTItMiAuOS0yIDItMiAyIC45IDIgMm0tMiAxMGMtMS4xIDAtMiAuOS0yIDJzLjkgMiAyIDIgMi0uOSAyLTItLjktMi0yLTJtMCAxMGMtMS4xIDAtMiAuOS0yIDJzLjkgMiAyIDIgMi0uOSAyLTItLjktMi0yLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>

          <div className="relative flex h-full flex-col justify-center px-12 xl:px-20">
            {/* Content */}
            <div className="mb-12">
              <h2 className="text-4xl font-bold text-white">
                Find Your Dream AI/ML Role
              </h2>
              <p className="mt-4 text-lg text-primary-100">
                Join thousands of professionals advancing their careers in
                artificial intelligence and machine learning.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-6">
              <div className="rounded-lg bg-white/10 p-6 backdrop-blur-sm">
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-white/20">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-white">85,000+</div>
                <div className="mt-1 text-sm text-primary-100">
                  Active Professionals
                </div>
              </div>

              <div className="rounded-lg bg-white/10 p-6 backdrop-blur-sm">
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-white/20">
                  <Briefcase className="h-6 w-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-white">2,500+</div>
                <div className="mt-1 text-sm text-primary-100">
                  Companies Hiring
                </div>
              </div>

              <div className="rounded-lg bg-white/10 p-6 backdrop-blur-sm">
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-white/20">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-white">15,000+</div>
                <div className="mt-1 text-sm text-primary-100">
                  Successful Placements
                </div>
              </div>

              <div className="rounded-lg bg-white/10 p-6 backdrop-blur-sm">
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-white/20">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-white">4.9/5</div>
                <div className="mt-1 text-sm text-primary-100">
                  Average Rating
                </div>
              </div>
            </div>

            {/* Testimonial */}
            <div className="mt-12 rounded-lg bg-white/10 p-6 backdrop-blur-sm">
              <p className="text-lg italic text-white">
                "JobPortal helped me land my dream role as an ML Engineer at a
                top tech company. The platform is intuitive and the quality of
                opportunities is unmatched."
              </p>
              <div className="mt-4 flex items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-sm font-semibold text-white">
                  SJ
                </div>
                <div className="ml-3">
                  <div className="font-medium text-white">Sarah Johnson</div>
                  <div className="text-sm text-primary-100">
                    ML Engineer at TechCorp
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Info, Github, Code2, Zap } from "lucide-react";
import { Button, Card, CardContent, Badge } from "@/components/ui";

export const metadata: Metadata = {
  title: "About the Project",
  description: "Learn about our AI/ML job portal and the technology behind it.",
};

export default function AboutPage() {
  const techStack = [
    "Next.js 14",
    "TypeScript",
    "Tailwind CSS",
    "React Hook Form",
    "Zod",
    "Lucide Icons",
  ];

  const features = [
    {
      icon: Code2,
      title: "Modern Tech Stack",
      description: "Built with the latest web technologies for optimal performance",
    },
    {
      icon: Zap,
      title: "Fast & Responsive",
      description: "Optimized for speed with mobile-first design approach",
    },
    {
      icon: Github,
      title: "Open Development",
      description: "Transparent development process with clean, maintainable code",
    },
  ];

  return (
    <div className="relative bg-gradient-to-br from-secondary-50 via-white to-secondary-50 py-12">
      <div className="container">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="ghost" asChild className="gap-2 hover:bg-primary-50 transition-all">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>

        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary-100 to-accent-100 shadow-lg">
              <Info className="h-8 w-8 text-primary-600" />
            </div>
          </div>
          <h1 className="mb-4 text-4xl font-bold text-secondary-900">
            About This Project
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-secondary-600">
            A modern, full-featured job portal specializing in AI, Machine
            Learning, and Data Science positions
          </p>
        </div>

        {/* Overview Card */}
        <Card className="mx-auto mb-12 max-w-4xl border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all">
          <CardContent className="p-8 md:p-12">
            <h2 className="mb-4 text-2xl font-semibold text-secondary-900">
              Project Overview
            </h2>
            <p className="mb-6 text-secondary-700">
              This is a demo job portal application built to showcase modern web
              development practices and provide a template for job board
              platforms. The application features a comprehensive set of
              functionality including job search, filtering, applications, and
              separate dashboards for candidates and employers.
            </p>

            <h3 className="mb-3 text-xl font-semibold text-secondary-900">
              Key Features
            </h3>
            <ul className="mb-6 space-y-2 text-secondary-700">
              <li className="flex items-start gap-2">
                <span className="mt-1 text-primary-600">•</span>
                <span>Advanced job search and filtering system</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 text-primary-600">•</span>
                <span>Separate dashboards for candidates and employers</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 text-primary-600">•</span>
                <span>Comprehensive profile management</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 text-primary-600">•</span>
                <span>Multi-step job posting wizard</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 text-primary-600">•</span>
                <span>Responsive design with mobile-first approach</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 text-primary-600">•</span>
                <span>SEO optimized with structured data</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 text-primary-600">•</span>
                <span>WCAG 2.1 accessibility compliance</span>
              </li>
            </ul>

            <h3 className="mb-3 text-xl font-semibold text-secondary-900">
              Technology Stack
            </h3>
            <div className="mb-6 flex flex-wrap gap-2">
              {techStack.map((tech) => (
                <Badge key={tech} variant="primary" className="bg-gradient-to-r from-primary-500 to-accent-500 text-white border-none shadow-sm hover:shadow-md transition-all">
                  {tech}
                </Badge>
              ))}
            </div>

            <p className="text-secondary-700">
              The application uses Next.js 14 with the App Router, TypeScript
              for type safety, Tailwind CSS for styling, and includes form
              validation with React Hook Form and Zod schemas.
            </p>
          </CardContent>
        </Card>

        {/* Features Grid */}
        <div className="mx-auto mb-12 max-w-4xl">
          <h2 className="mb-8 text-center text-2xl font-semibold text-secondary-900">
            Built With Best Practices
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl hover:-translate-y-1 transition-all">
                  <CardContent className="p-6 text-center">
                    <div className="mb-4 flex justify-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary-100 to-accent-100 shadow-lg">
                        <Icon className="h-6 w-6 text-primary-600" />
                      </div>
                    </div>
                    <h3 className="mb-2 font-semibold text-secondary-900">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-secondary-600">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Development Status */}
        <Card className="mx-auto max-w-4xl border-0 shadow-xl bg-gradient-to-br from-primary-50 to-accent-50">
          <CardContent className="p-8 text-center">
            <h3 className="mb-3 text-xl font-semibold text-secondary-900">
              Development Status
            </h3>
            <p className="mb-4 text-secondary-700">
              This is a demo application showcasing frontend capabilities. The
              backend integration, authentication system, and database
              connections are planned for future implementation.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button variant="primary" asChild className="bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 shadow-lg shadow-primary-500/30 hover:shadow-xl hover:-translate-y-0.5 transition-all">
                <Link href="/jobs">Browse Jobs</Link>
              </Button>
              <Button variant="outline" asChild className="hover:bg-gradient-to-r hover:from-primary-50 hover:to-accent-50 hover:border-primary-300 transition-all">
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

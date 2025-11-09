"use client";

import Link from "next/link";
import {
  UserPlus,
  FileCheck,
  Search,
  MessageSquare,
  Award,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Clock,
  Shield,
  Zap,
  Users,
  Briefcase,
  Target,
} from "lucide-react";
import { Button, Badge, Card, CardContent } from "@/components/ui";

export default function HowItWorksPage() {
  const candidateSteps = [
    {
      icon: UserPlus,
      title: "Sign Up Free",
      description: "Create your account in under 2 minutes. No credit card required.",
      time: "2 min",
    },
    {
      icon: FileCheck,
      title: "Take Skills Assessment (Optional)",
      description: "Complete our 60-minute proctored test to get verified and unlock exclusive jobs.",
      time: "60 min",
    },
    {
      icon: Search,
      title: "Browse & Apply",
      description: "Search thousands of jobs. Verified candidates get priority review.",
      time: "Ongoing",
    },
    {
      icon: MessageSquare,
      title: "Interview & Get Hired",
      description: "Connect with employers, ace your interviews, and land your dream job.",
      time: "1-4 weeks",
    },
  ];

  const employerSteps = [
    {
      icon: Briefcase,
      title: "Post Your Job Free",
      description: "Create a detailed job posting. No upfront costs or subscriptions.",
      time: "10 min",
    },
    {
      icon: Users,
      title: "Receive Verified Applicants",
      description: "Get applications from skills-verified candidates with score cards.",
      time: "1-7 days",
    },
    {
      icon: Target,
      title: "Review & Interview",
      description: "Filter by Skills Score Cards, review profiles, and schedule interviews.",
      time: "1-2 weeks",
    },
    {
      icon: Award,
      title: "Hire & Pay Success Fee",
      description: "Make your hire. Pay our 15-20% success fee only after they start.",
      time: "After hire",
    },
  ];

  const features = [
    {
      icon: Shield,
      title: "Skills Verification",
      description: "Proctored assessments ensure candidates have the skills they claim.",
      color: "bg-success-50 text-success-600",
    },
    {
      icon: Zap,
      title: "Fast Matching",
      description: "Our algorithm matches the right candidates with the right jobs instantly.",
      color: "bg-accent-50 text-accent-600",
    },
    {
      icon: Clock,
      title: "Save Time",
      description: "Employers save 60% of time screening with Skills Score Cards.",
      color: "bg-primary-50 text-primary-600",
    },
    {
      icon: TrendingUp,
      title: "Higher Success Rate",
      description: "Verified candidates are 3x more likely to pass interviews and stay longer.",
      color: "bg-yellow-50 text-yellow-600",
    },
  ];

  const benefits = {
    candidates: [
      "Free forever - no hidden fees",
      "Priority review for verified candidates",
      "Access to 250+ exclusive jobs",
      "18% higher average salary",
      "Shareable Skills Certificate",
      "Personal career support",
    ],
    employers: [
      "No upfront costs or subscriptions",
      "Only pay when you successfully hire",
      "Skills Score Cards eliminate guesswork",
      "90-day replacement guarantee",
      "Fill roles 40% faster",
      "Dedicated account manager",
    ],
  };

  return (
    <div className="min-h-screen bg-secondary-50 py-12">
      <div className="container">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="mb-4 text-4xl font-bold text-secondary-900 md:text-5xl">
            How It Works
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-secondary-600">
            A simple, transparent process that connects skilled candidates with great employers
          </p>
        </div>

        {/* For Candidates Section */}
        <div className="mb-20">
          <div className="mb-8 text-center">
            <Badge variant="primary" className="mb-4">
              For Candidates
            </Badge>
            <h2 className="text-3xl font-bold text-secondary-900">
              Land Your Dream Job in 4 Steps
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {candidateSteps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <Card key={idx} className="relative">
                  <CardContent className="p-6">
                    {/* Step Number */}
                    <div className="absolute -top-4 left-6 flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 text-sm font-bold text-white">
                      {idx + 1}
                    </div>

                    {/* Icon */}
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary-100">
                      <Icon className="h-7 w-7 text-primary-600" />
                    </div>

                    {/* Content */}
                    <h3 className="mb-2 text-lg font-bold text-secondary-900">
                      {step.title}
                    </h3>
                    <p className="mb-3 text-sm text-secondary-600">
                      {step.description}
                    </p>
                    <Badge variant="secondary" size="sm">
                      <Clock className="mr-1 h-3 w-3" />
                      {step.time}
                    </Badge>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Candidate Benefits */}
          <Card className="mt-8 bg-gradient-to-br from-primary-50 to-accent-50">
            <CardContent className="p-8">
              <h3 className="mb-6 text-xl font-bold text-secondary-900">
                Why Candidates Love Us
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {benefits.candidates.map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-success-600" />
                    <p className="text-secondary-700">{benefit}</p>
                  </div>
                ))}
              </div>
              <Button
                variant="primary"
                size="lg"
                className="mt-6"
                asChild
              >
                <Link href="/signup?role=candidate">
                  Sign Up as Candidate
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* For Employers Section */}
        <div className="mb-20">
          <div className="mb-8 text-center">
            <Badge variant="secondary" className="mb-4">
              For Employers
            </Badge>
            <h2 className="text-3xl font-bold text-secondary-900">
              Hire Top Talent in 4 Steps
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {employerSteps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <Card key={idx} className="relative">
                  <CardContent className="p-6">
                    {/* Step Number */}
                    <div className="absolute -top-4 left-6 flex h-8 w-8 items-center justify-center rounded-full bg-accent-600 text-sm font-bold text-white">
                      {idx + 1}
                    </div>

                    {/* Icon */}
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent-100">
                      <Icon className="h-7 w-7 text-accent-600" />
                    </div>

                    {/* Content */}
                    <h3 className="mb-2 text-lg font-bold text-secondary-900">
                      {step.title}
                    </h3>
                    <p className="mb-3 text-sm text-secondary-600">
                      {step.description}
                    </p>
                    <Badge variant="secondary" size="sm">
                      <Clock className="mr-1 h-3 w-3" />
                      {step.time}
                    </Badge>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Employer Benefits */}
          <Card className="mt-8 bg-gradient-to-br from-accent-50 to-yellow-50">
            <CardContent className="p-8">
              <h3 className="mb-6 text-xl font-bold text-secondary-900">
                Why Employers Trust Us
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {benefits.employers.map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-success-600" />
                    <p className="text-secondary-700">{benefit}</p>
                  </div>
                ))}
              </div>
              <Button
                variant="secondary"
                size="lg"
                className="mt-6"
                asChild
              >
                <Link href="/signup?role=employer">
                  Sign Up as Employer
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Key Features */}
        <div className="mb-20">
          <div className="mb-8 text-center">
            <h2 className="mb-4 text-3xl font-bold text-secondary-900">
              What Makes Us Different
            </h2>
            <p className="mx-auto max-w-2xl text-secondary-600">
              Our unique approach ensures quality matches and successful hires
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <Card key={idx}>
                  <CardContent className="p-6 text-center">
                    <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${feature.color}`}>
                      <Icon className="h-8 w-8" />
                    </div>
                    <h3 className="mb-2 font-bold text-secondary-900">
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

        {/* Skills Assessment Deep Dive */}
        <Card className="mb-20 border-2 border-primary-200">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div>
                <Badge variant="primary" className="mb-4">
                  Skills Assessment
                </Badge>
                <h2 className="mb-4 text-2xl font-bold text-secondary-900">
                  How Our Verification Works
                </h2>
                <p className="mb-6 text-secondary-600">
                  Our comprehensive 60-minute assessment is proctored to ensure authenticity and covers three key areas:
                </p>

                <div className="space-y-4">
                  <div>
                    <h4 className="mb-1 font-bold text-secondary-900">
                      1. Technical Skills (20 min)
                    </h4>
                    <p className="text-sm text-secondary-600">
                      Multiple-choice questions covering programming concepts, data structures, and system knowledge.
                    </p>
                  </div>
                  <div>
                    <h4 className="mb-1 font-bold text-secondary-900">
                      2. Practical Coding (25 min)
                    </h4>
                    <p className="text-sm text-secondary-600">
                      Real coding challenges to demonstrate problem-solving and implementation skills.
                    </p>
                  </div>
                  <div>
                    <h4 className="mb-1 font-bold text-secondary-900">
                      3. System Design (15 min)
                    </h4>
                    <p className="text-sm text-secondary-600">
                      Architecture and design questions to assess scalability thinking.
                    </p>
                  </div>
                </div>

                <Button variant="primary" className="mt-6" asChild>
                  <Link href="/skills-assessment">
                    Learn More About Assessment
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>

              <div className="space-y-4">
                <div className="rounded-lg bg-success-50 p-6">
                  <h4 className="mb-2 font-bold text-success-900">
                    For Candidates
                  </h4>
                  <ul className="space-y-2 text-sm text-success-800">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0" />
                      <span>Stand out with a verified score (0-100)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0" />
                      <span>Get priority review from employers</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0" />
                      <span>Access exclusive high-paying jobs</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0" />
                      <span>Earn 18% more on average</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-lg bg-accent-50 p-6">
                  <h4 className="mb-2 font-bold text-accent-900">
                    For Employers
                  </h4>
                  <ul className="space-y-2 text-sm text-accent-800">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0" />
                      <span>See verified skills before interviewing</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0" />
                      <span>Reduce screening time by 60%</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0" />
                      <span>Filter by performance tier (Elite, Advanced, etc.)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0" />
                      <span>Hire with confidence backed by data</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <Card className="bg-gradient-to-br from-primary-600 to-accent-600 text-white">
          <CardContent className="p-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">
              Ready to Get Started?
            </h2>
            <p className="mb-8 text-xl opacity-90">
              Join thousands of candidates and employers already using our platform
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button
                variant="secondary"
                size="lg"
                className="bg-white text-primary-600 hover:bg-primary-50"
                asChild
              >
                <Link href="/signup?role=candidate">
                  I'm Looking for a Job
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white/10"
                asChild
              >
                <Link href="/signup?role=employer">
                  I'm Hiring Talent
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

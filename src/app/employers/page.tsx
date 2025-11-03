"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Rocket,
  Target,
  Shield,
  Zap,
  CheckCircle2,
  ArrowRight,
  Users,
  TrendingUp,
  Clock,
  DollarSign,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button, Badge, Card, CardContent } from "@/components/ui";

export default function EmployersPage() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const benefits = [
    {
      icon: Users,
      title: "Pre-Vetted Talent Pool",
      description:
        "Access a curated network of 85,000+ AI/ML professionals who have been thoroughly screened and verified for their technical expertise.",
    },
    {
      icon: Zap,
      title: "Faster Time-to-Hire",
      description:
        "Reduce your hiring timeline by 50%. Our streamlined process helps you find and hire qualified candidates in weeks, not months.",
    },
    {
      icon: Shield,
      title: "Quality Guarantee",
      description:
        "Every candidate profile includes verified credentials, portfolio reviews, and technical assessments to ensure top-tier quality.",
    },
    {
      icon: Target,
      title: "Precise Matching",
      description:
        "Our AI-powered matching algorithm connects you with candidates who perfectly fit your technical requirements and company culture.",
    },
  ];

  const timeline = [
    {
      step: "1",
      title: "Post Your Job",
      description:
        "Create a detailed job listing in minutes. Specify your requirements, tech stack, and compensation range.",
      time: "5 minutes",
    },
    {
      step: "2",
      title: "Review Candidates",
      description:
        "Receive applications from qualified candidates. Review their profiles, portfolios, and technical assessments.",
      time: "1-2 days",
    },
    {
      step: "3",
      title: "Interview Top Talent",
      description:
        "Conduct interviews with pre-screened candidates who match your criteria. Schedule directly through our platform.",
      time: "1-2 weeks",
    },
    {
      step: "4",
      title: "Make an Offer",
      description:
        "Extend offers to your chosen candidates. We facilitate the entire hiring process including offer negotiation.",
      time: "3-5 days",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "VP of Engineering",
      company: "TechVision AI",
      image: "👩‍💼",
      content:
        "We hired three exceptional ML engineers through Job Portal in just two weeks. The quality of candidates was outstanding, and the 18% fee was worth every penny for the time saved.",
      rating: 5,
    },
    {
      name: "Michael Rodriguez",
      role: "CTO",
      company: "DataScale Inc",
      image: "👨‍💻",
      content:
        "The pre-vetted talent pool saved us months of screening. We found our lead AI architect within days, and he's been instrumental in scaling our ML infrastructure.",
      rating: 5,
    },
    {
      name: "Emily Watson",
      role: "Head of Talent",
      company: "CloudAI Solutions",
      image: "👩‍💼",
      content:
        "Job Portal transformed our hiring process. The platform is intuitive, candidates are top-notch, and their support team is incredibly responsive. Highly recommend!",
      rating: 5,
    },
  ];

  const stats = [
    { value: "85,000+", label: "Verified Professionals" },
    { value: "2,500+", label: "Companies Hiring" },
    { value: "15,000+", label: "Successful Placements" },
    { value: "4.9/5", label: "Average Rating" },
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) =>
      prev === testimonials.length - 1 ? 0 : prev + 1
    );
  };

  const previousTestimonial = () => {
    setCurrentTestimonial((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 py-20 text-white md:py-32">
        <div className="container relative z-10">
          <div className="mx-auto max-w-4xl text-center">
            <Badge
              variant="secondary"
              size="lg"
              className="mb-6 bg-white/20 text-white"
            >
              🚀 Trusted by 2,500+ Companies
            </Badge>
            <h1 className="mb-6 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
              Hire Pre-Vetted AI/ML Talent
            </h1>
            <p className="mb-8 text-xl text-primary-100 md:text-2xl">
              Access the largest pool of qualified AI and Machine Learning
              professionals. Hire faster, smarter, and with confidence.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                variant="secondary"
                size="lg"
                className="bg-white text-primary-600 hover:bg-primary-50"
                asChild
              >
                <Link href="/employer/jobs/new">
                  Post a Job - It's Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white/10"
                asChild
              >
                <Link href="/about">Talk to Sales</Link>
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-4">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="mb-1 text-3xl font-bold md:text-4xl">
                    {stat.value}
                  </div>
                  <div className="text-sm text-primary-100">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
      </section>

      {/* Benefits Section */}
      <section className="bg-white py-20">
        <div className="container">
          <div className="mb-12 text-center">
            <Badge variant="primary" className="mb-4">
              Why Choose Us
            </Badge>
            <h2 className="mb-4 text-3xl font-bold text-secondary-900 md:text-4xl">
              Everything You Need to Hire Top Talent
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-secondary-600">
              Our platform provides all the tools and support you need to build
              your AI/ML dream team
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card key={index} className="text-center transition-all hover:shadow-lg">
                  <CardContent className="p-8">
                    <div className="mb-4 flex justify-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
                        <Icon className="h-8 w-8 text-primary-600" />
                      </div>
                    </div>
                    <h3 className="mb-3 text-xl font-semibold text-secondary-900">
                      {benefit.title}
                    </h3>
                    <p className="text-secondary-600">{benefit.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Timeline */}
      <section className="bg-secondary-50 py-20">
        <div className="container">
          <div className="mb-12 text-center">
            <Badge variant="primary" className="mb-4">
              Simple Process
            </Badge>
            <h2 className="mb-4 text-3xl font-bold text-secondary-900 md:text-4xl">
              How It Works
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-secondary-600">
              From posting to hiring in 4 simple steps
            </p>
          </div>

          <div className="relative">
            {/* Timeline Line - Desktop */}
            <div className="absolute left-0 right-0 top-12 hidden h-1 bg-gradient-to-r from-primary-200 via-primary-400 to-primary-600 md:block" />

            <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
              {timeline.map((item, index) => (
                <div key={index} className="relative">
                  <Card className="h-full">
                    <CardContent className="p-6">
                      <div className="mb-4 flex items-center justify-between">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-600 text-xl font-bold text-white">
                          {item.step}
                        </div>
                        <Badge variant="outline" size="sm">
                          <Clock className="mr-1 h-3 w-3" />
                          {item.time}
                        </Badge>
                      </div>
                      <h3 className="mb-2 text-lg font-semibold text-secondary-900">
                        {item.title}
                      </h3>
                      <p className="text-sm text-secondary-600">
                        {item.description}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="bg-white py-20">
        <div className="container">
          <div className="mb-12 text-center">
            <Badge variant="primary" className="mb-4">
              Transparent Pricing
            </Badge>
            <h2 className="mb-4 text-3xl font-bold text-secondary-900 md:text-4xl">
              Simple, Performance-Based Pricing
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-secondary-600">
              Only pay when you make a successful hire. No upfront costs or
              hidden fees.
            </p>
          </div>

          <div className="mx-auto max-w-4xl">
            <Card className="border-2 border-primary-200 shadow-xl">
              <CardContent className="p-8 md:p-12">
                <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
                  {/* Pricing Info */}
                  <div>
                    <div className="mb-6">
                      <div className="mb-2 text-sm font-medium text-secondary-600">
                        Success-Based Fee
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-6xl font-bold text-primary-600">
                          18%
                        </span>
                        <span className="text-xl text-secondary-600">
                          of first year salary
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3 border-t border-secondary-200 pt-6">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-success-600" />
                        <span className="text-secondary-700">
                          No upfront costs or subscription fees
                        </span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-success-600" />
                        <span className="text-secondary-700">
                          Unlimited job postings
                        </span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-success-600" />
                        <span className="text-secondary-700">
                          Access to entire talent pool
                        </span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-success-600" />
                        <span className="text-secondary-700">
                          90-day replacement guarantee
                        </span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-success-600" />
                        <span className="text-secondary-700">
                          Dedicated account manager
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Example Calculation */}
                  <div className="rounded-lg bg-secondary-50 p-6">
                    <h3 className="mb-4 text-lg font-semibold text-secondary-900">
                      Example Calculation
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-secondary-200 pb-3">
                        <span className="text-secondary-600">
                          Candidate Salary
                        </span>
                        <span className="font-semibold text-secondary-900">
                          $150,000
                        </span>
                      </div>
                      <div className="flex items-center justify-between border-b border-secondary-200 pb-3">
                        <span className="text-secondary-600">Fee Rate</span>
                        <span className="font-semibold text-secondary-900">
                          18%
                        </span>
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-lg font-semibold text-secondary-900">
                          Total Fee
                        </span>
                        <span className="text-2xl font-bold text-primary-600">
                          $27,000
                        </span>
                      </div>
                    </div>

                    <div className="mt-6 rounded-md bg-primary-50 p-4">
                      <div className="flex items-start gap-2">
                        <TrendingUp className="h-5 w-5 flex-shrink-0 text-primary-600" />
                        <p className="text-sm text-secondary-700">
                          <strong>Save up to 60%</strong> compared to
                          traditional recruiting agencies (25-30% fee)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 border-t border-secondary-200 pt-8 text-center">
                  <Button variant="primary" size="lg" asChild>
                    <Link href="/employer/jobs/new">
                      Get Started Free
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-secondary-50 py-20">
        <div className="container">
          <div className="mb-12 text-center">
            <Badge variant="primary" className="mb-4">
              Success Stories
            </Badge>
            <h2 className="mb-4 text-3xl font-bold text-secondary-900 md:text-4xl">
              What Our Clients Say
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-secondary-600">
              Join thousands of companies who have successfully hired through
              our platform
            </p>
          </div>

          <div className="mx-auto max-w-4xl">
            <Card className="relative shadow-xl">
              <CardContent className="p-8 md:p-12">
                {/* Testimonial Content */}
                <div className="mb-6 flex justify-center">
                  <div className="flex gap-1">
                    {[...Array(testimonials[currentTestimonial].rating)].map(
                      (_, i) => (
                        <Star
                          key={i}
                          className="h-6 w-6 fill-warning-400 text-warning-400"
                        />
                      )
                    )}
                  </div>
                </div>

                <blockquote className="mb-8 text-center text-xl leading-relaxed text-secondary-700">
                  "{testimonials[currentTestimonial].content}"
                </blockquote>

                <div className="flex flex-col items-center gap-4">
                  <div className="text-5xl">
                    {testimonials[currentTestimonial].image}
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-secondary-900">
                      {testimonials[currentTestimonial].name}
                    </div>
                    <div className="text-sm text-secondary-600">
                      {testimonials[currentTestimonial].role} at{" "}
                      {testimonials[currentTestimonial].company}
                    </div>
                  </div>
                </div>

                {/* Navigation Arrows */}
                <div className="mt-8 flex items-center justify-center gap-4">
                  <button
                    onClick={previousTestimonial}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-secondary-300 text-secondary-600 transition-colors hover:bg-secondary-100"
                    aria-label="Previous testimonial"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>

                  <div className="flex gap-2">
                    {testimonials.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentTestimonial(index)}
                        className={`h-2 w-2 rounded-full transition-all ${
                          index === currentTestimonial
                            ? "w-8 bg-primary-600"
                            : "bg-secondary-300 hover:bg-secondary-400"
                        }`}
                        aria-label={`Go to testimonial ${index + 1}`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={nextTestimonial}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-secondary-300 text-secondary-600 transition-colors hover:bg-secondary-100"
                    aria-label="Next testimonial"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="bg-gradient-to-br from-primary-600 to-accent-600 py-20 text-white">
        <div className="container">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Ready to Build Your AI/ML Dream Team?
            </h2>
            <p className="mb-8 text-xl text-primary-100">
              Join 2,500+ companies hiring top talent through our platform.
              Post your first job for free today.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                variant="secondary"
                size="lg"
                className="bg-white text-primary-600 hover:bg-primary-50"
                asChild
              >
                <Link href="/employer/jobs/new">
                  <Rocket className="mr-2 h-5 w-5" />
                  Post a Job Now
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white/10"
                asChild
              >
                <Link href="/about">Schedule a Demo</Link>
              </Button>
            </div>

            <p className="mt-8 text-sm text-primary-100">
              No credit card required • Post jobs in minutes • 90-day guarantee
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

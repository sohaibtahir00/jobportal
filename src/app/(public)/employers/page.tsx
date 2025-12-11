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
  Star,
  ChevronLeft,
  ChevronRight,
  Search,
  CheckCircle,
} from "lucide-react";
import { Button, Badge, Card, CardContent } from "@/components/ui";

export default function EmployersPage() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [companySearch, setCompanySearch] = useState("");

  const benefits = [
    {
      icon: Users,
      title: "Skills-Verified Talent",
      description:
        "Every candidate tested with proctored exams. Only the top 20% pass our assessments.",
    },
    {
      icon: Shield,
      title: "Zero Risk",
      description:
        "No upfront costs. No retainers. Pay only when you successfully hire.",
    },
    {
      icon: Zap,
      title: "Fast Turnaround",
      description:
        "Reduce your hiring timeline by 50%. Our streamlined process helps you find and hire qualified candidates in weeks, not months.",
    },
    {
      icon: Target,
      title: "Precise Matching",
      description:
        "Our AI-powered matching algorithm connects you with candidates who perfectly fit your technical requirements and company culture.",
    },
  ];

  const claimConvertSteps = [
    {
      step: "1",
      title: "Check if Listed",
      description: "Search for your company's jobs",
    },
    {
      step: "2",
      title: "Claim Jobs",
      description: "See qualified candidates immediately",
    },
    {
      step: "3",
      title: "Review Skills",
      description: "Skills Score Cards show abilities",
    },
    {
      step: "4",
      title: "Interview",
      description: "Interview your top picks",
    },
    {
      step: "5",
      title: "Hire",
      description: "Make your hiring decision",
    },
    {
      step: "6",
      title: "Pay Fee",
      description: "15-20% success fee only",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "VP of Engineering",
      company: "TechVision AI",
      image: "👩‍💼",
      content:
        "We hired three exceptional ML engineers through SkillProof in just two weeks. The quality of candidates was outstanding, and the 18% fee was worth every penny for the time saved.",
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
        "SkillProof transformed our hiring process. The platform is intuitive, candidates are top-notch, and their support team is incredibly responsive. Highly recommend!",
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

  const handleCompanySearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement company search functionality
    console.log("Searching for:", companySearch);
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
              Hire Top AI/ML Engineers in Weeks, Not Months
            </h1>
            <p className="mb-8 text-xl text-primary-100 md:text-2xl">
              Pay only when you hire. 15-20% success fee. Every candidate is skills-verified.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                variant="secondary"
                size="lg"
                className="bg-white text-primary-600 hover:bg-primary-50"
                asChild
              >
                <Link href="/claim">
                  Claim Your Job
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white/10"
                asChild
              >
                <Link href="/about">Schedule a Call</Link>
              </Button>
            </div>

            <p className="mt-6 text-sm text-primary-100">
              Your jobs may already be on our platform with qualified candidates waiting
            </p>

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
                <Card key={index} className="text-center border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                  <CardContent className="p-8">
                    <div className="mb-4 flex justify-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-accent-600 shadow-md">
                        <Icon className="h-8 w-8 text-white" />
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

      {/* Claim & Convert Process */}
      <section className="bg-secondary-50 py-20">
        <div className="container">
          <div className="mb-12 text-center">
            <Badge variant="primary" className="mb-4">
              How It Works
            </Badge>
            <h2 className="mb-4 text-3xl font-bold text-secondary-900 md:text-4xl">
              The Claim & Convert Process
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-secondary-600">
              We&apos;ve already aggregated thousands of jobs from company career pages.
              Yours might be one of them - with candidates already applying.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {claimConvertSteps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-2xl font-bold text-white shadow-lg mx-auto">
                  {step.step}
                </div>
                <h3 className="mb-2 font-semibold text-secondary-900">{step.title}</h3>
                <p className="text-sm text-secondary-600">{step.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Button variant="primary" size="lg" asChild>
              <Link href="/claim">
                Check If Your Jobs Are Listed
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Pricing Section - Tiered */}
      <section className="bg-gradient-to-br from-blue-50 to-purple-50 py-20">
        <div className="container">
          <div className="mb-12 text-center">
            <Badge variant="primary" className="mb-4">
              Transparent Pricing
            </Badge>
            <h2 className="mb-4 text-3xl font-bold text-secondary-900 md:text-4xl">
              Simple Success-Based Pricing
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-secondary-600">
              No upfront costs. Pay only when you hire.
            </p>
          </div>

          <div className="mx-auto max-w-5xl">
            <div className="overflow-hidden rounded-xl bg-white shadow-lg">
              <div className="grid divide-x divide-secondary-200 md:grid-cols-3">
                {/* Junior/Mid Tier */}
                <div className="p-8 text-center">
                  <div className="mb-2 text-4xl font-bold text-blue-600">15%</div>
                  <div className="mb-4 text-sm text-secondary-600">of annual salary</div>
                  <h3 className="mb-2 text-lg font-semibold">Junior/Mid-Level</h3>
                  <p className="text-sm text-secondary-600">$80k - $130k salary</p>
                  <div className="mt-4 border-t border-secondary-200 pt-4">
                    <p className="text-xs text-secondary-500">Example:</p>
                    <p className="font-semibold">$100k hire = $15k fee</p>
                  </div>
                </div>

                {/* Senior Tier */}
                <div className="bg-blue-50 p-8 text-center">
                  <div className="mb-2 text-4xl font-bold text-blue-600">18%</div>
                  <div className="mb-4 text-sm text-secondary-600">of annual salary</div>
                  <h3 className="mb-2 text-lg font-semibold">Senior</h3>
                  <p className="text-sm text-secondary-600">$130k - $170k salary</p>
                  <div className="mt-4 border-t border-blue-200 pt-4">
                    <p className="text-xs text-secondary-500">Example:</p>
                    <p className="font-semibold">$150k hire = $27k fee</p>
                  </div>
                </div>

                {/* Lead/Staff Tier */}
                <div className="p-8 text-center">
                  <div className="mb-2 text-4xl font-bold text-blue-600">20%</div>
                  <div className="mb-4 text-sm text-secondary-600">of annual salary</div>
                  <h3 className="mb-2 text-lg font-semibold">Lead/Staff</h3>
                  <p className="text-sm text-secondary-600">$170k+ salary</p>
                  <div className="mt-4 border-t border-secondary-200 pt-4">
                    <p className="text-xs text-secondary-500">Example:</p>
                    <p className="font-semibold">$200k hire = $40k fee</p>
                  </div>
                </div>
              </div>

              {/* Guarantees */}
              <div className="bg-secondary-50 px-8 py-6">
                <div className="grid gap-4 text-center text-sm md:grid-cols-3">
                  <div>
                    <CheckCircle className="mr-2 inline h-5 w-5 text-green-600" />
                    <span className="font-semibold">90-Day Guarantee</span>
                  </div>
                  <div>
                    <CheckCircle className="mr-2 inline h-5 w-5 text-green-600" />
                    <span className="font-semibold">No Upfront Costs</span>
                  </div>
                  <div>
                    <CheckCircle className="mr-2 inline h-5 w-5 text-green-600" />
                    <span className="font-semibold">Pay Only When You Hire</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Comparison */}
            <div className="mt-8 text-center">
              <p className="text-secondary-600">
                <span className="font-semibold text-green-600">Save up to 60%</span> vs
                traditional agencies charging 25-30%
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Verification Advantage */}
      <section className="bg-white py-20">
        <div className="container">
          <div className="mb-12 text-center">
            <Badge variant="primary" className="mb-4">
              Our Advantage
            </Badge>
            <h2 className="mb-4 text-3xl font-bold text-secondary-900 md:text-4xl">
              Our Skills Score Card Gives You 5x More Signal Than a Resume
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-secondary-600">
              See technical skills, problem-solving ability, and predicted job fit
            </p>
          </div>

          <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
            {/* Left: Description */}
            <div>
              <h3 className="mb-6 text-2xl font-semibold">
                What You&apos;ll See in Every Skills Score Card:
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="mr-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Overall Score (0-100)</h4>
                    <p className="text-sm text-secondary-600">
                      Percentile ranking vs other candidates
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Technical Skills Breakdown</h4>
                    <p className="text-sm text-secondary-600">
                      Scores for each required technology
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Problem-Solving Score</h4>
                    <p className="text-sm text-secondary-600">
                      How they approach complex challenges
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Predicted Job Fit</h4>
                    <p className="text-sm text-secondary-600">
                      Match percentage for your specific role
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Verified by Proctoring</h4>
                    <p className="text-sm text-secondary-600">
                      AI + human review ensures authenticity
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Right: Example Score Card */}
            <div className="rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 p-8 shadow-lg">
              <div className="rounded-lg bg-white p-6">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between border-b pb-4">
                  <div>
                    <h4 className="text-lg font-bold">Sarah Johnson</h4>
                    <p className="text-sm text-secondary-600">Senior ML Engineer</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-green-600">94</div>
                    <div className="text-xs text-secondary-600">Top 6%</div>
                  </div>
                </div>

                {/* Performance Tier */}
                <div className="mb-6">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-semibold">Performance Tier</span>
                    <span className="text-warning-500">⭐⭐⭐⭐⭐</span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary-200">
                    <div
                      className="h-2 rounded-full bg-green-500"
                      style={{ width: "94%" }}
                    ></div>
                  </div>
                </div>

                {/* Skills Breakdown */}
                <div className="space-y-3">
                  <div>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span>Python & TensorFlow</span>
                      <span className="font-semibold">96/100</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-secondary-200">
                      <div
                        className="h-1.5 rounded-full bg-blue-600"
                        style={{ width: "96%" }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span>Machine Learning</span>
                      <span className="font-semibold">95/100</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-secondary-200">
                      <div
                        className="h-1.5 rounded-full bg-blue-600"
                        style={{ width: "95%" }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span>System Design</span>
                      <span className="font-semibold">92/100</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-secondary-200">
                      <div
                        className="h-1.5 rounded-full bg-blue-600"
                        style={{ width: "92%" }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span>Problem Solving</span>
                      <span className="font-semibold">91/100</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-secondary-200">
                      <div
                        className="h-1.5 rounded-full bg-blue-600"
                        style={{ width: "91%" }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Verification Badge */}
                <div className="mt-6 border-t pt-4 text-center">
                  <div className="inline-flex items-center gap-2 text-sm text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="font-semibold">Skills Verified</span>
                  </div>
                  <p className="mt-1 text-xs text-secondary-500">Assessed: March 15, 2025</p>
                </div>
              </div>
            </div>
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
              Join thousands of companies who have successfully hired through our
              platform
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
                  &quot;{testimonials[currentTestimonial].content}&quot;
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

      {/* Companies We've Helped */}
      <section className="bg-white py-20">
        <div className="container">
          <div className="mb-12 text-center">
            <Badge variant="primary" className="mb-4">
              Trusted Worldwide
            </Badge>
            <h2 className="mb-4 text-3xl font-bold text-secondary-900 md:text-4xl">
              Trusted by Leading Companies
            </h2>
            <p className="text-secondary-600">
              Join 500+ companies that have successfully hired through our platform
            </p>
          </div>

          {/* Logo Grid */}
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
              <div
                key={i}
                className="flex h-16 items-center justify-center rounded-lg bg-secondary-200 grayscale transition-all hover:grayscale-0 cursor-pointer"
              >
                <span className="text-xs text-secondary-400">Company {i}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-secondary-600">
              * Actual company logos will be added. These are placeholders.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-20 text-white">
        <div className="container">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-6 text-4xl font-bold">
              Ready to Build Your Dream Team?
            </h2>
            <p className="mb-8 text-xl text-blue-100">
              Check if your jobs are already listed with qualified candidates waiting
            </p>

            {/* Search Form */}
            <form onSubmit={handleCompanySearch} className="mx-auto mb-8 max-w-md">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={companySearch}
                  onChange={(e) => setCompanySearch(e.target.value)}
                  placeholder="Enter your company name..."
                  className="flex-1 rounded-lg px-4 py-3 text-secondary-900"
                />
                <Button type="submit" size="lg" variant="secondary">
                  <Search className="h-5 w-5" />
                </Button>
              </div>
              <p className="mt-2 text-sm text-blue-100">
                We&apos;ll show you if your company&apos;s jobs are on our platform
              </p>
            </form>

            {/* Or Divider */}
            <div className="mb-8 flex items-center gap-4">
              <div className="h-px flex-1 bg-blue-400"></div>
              <span className="text-blue-100">or</span>
              <div className="h-px flex-1 bg-blue-400"></div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-primary-600 hover:bg-primary-50"
                asChild
              >
                <Link href="/claim">Claim Your Jobs</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
              >
                Schedule a Demo
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

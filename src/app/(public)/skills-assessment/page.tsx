"use client";

import Link from "next/link";
import {
  CheckCircle2,
  Code,
  Brain,
  Layout,
  TrendingUp,
  Zap,
  Award,
  Target,
  Eye,
  Download,
  FileText,
  BookOpen,
  Clock,
  ArrowRight,
  Shield,
} from "lucide-react";
import { Button, Badge, Card, CardContent } from "@/components/ui";

export default function SkillsAssessmentPage() {
  const assessmentSections = [
    {
      icon: Code,
      title: "Technical Skills",
      duration: "20 min",
      description: "Language proficiency, framework knowledge, coding fundamentals",
    },
    {
      icon: Brain,
      title: "Practical Coding",
      duration: "25 min",
      description: "Real-world problem solving, code quality, best practices",
    },
    {
      icon: Layout,
      title: "System Design",
      duration: "15 min",
      description: "Architecture decisions, scalability thinking, trade-off analysis",
    },
  ];

  const benefits = [
    {
      icon: TrendingUp,
      title: "Priority Review",
      description: "Your application goes to the top of employer's lists",
      color: "primary",
    },
    {
      icon: Zap,
      title: "Exclusive Jobs",
      description: "Unlock 250+ jobs only available to verified candidates",
      color: "accent",
    },
    {
      icon: Award,
      title: "Higher Salary",
      description: "Verified candidates earn 18% more on average",
      color: "success",
    },
    {
      icon: Target,
      title: "Know Your Level",
      description: "See your percentile ranking vs. other candidates",
      color: "secondary",
    },
  ];

  const steps = [
    {
      number: 1,
      title: "Register and prepare",
      duration: "5 min",
      description: "Review sample questions and get ready",
    },
    {
      number: 2,
      title: "Set up proctoring",
      duration: "5 min",
      description: "Webcam and screen monitoring setup",
    },
    {
      number: 3,
      title: "Complete assessment",
      duration: "60 min",
      description: "3 sections, self-paced within time limits",
    },
    {
      number: 4,
      title: "Get your Score Card",
      duration: "1 hour",
      description: "Detailed breakdown of your skills",
    },
    {
      number: 5,
      title: "Unlock benefits",
      duration: "Immediate",
      description: "Access exclusive jobs, priority ranking",
    },
  ];

  const faqs = [
    {
      question: "How long does it take?",
      answer: "The assessment takes 60 minutes to complete, plus 10 minutes for setup.",
    },
    {
      question: "Can I retake it?",
      answer: "Yes, you can retake the assessment after 30 days if you want to improve your score.",
    },
    {
      question: "What if I fail?",
      answer: "There's no pass/fail - you receive a score from 0-100. All scores unlock benefits, with higher scores giving more advantages.",
    },
    {
      question: "Do I need to take it?",
      answer: "It's optional but highly recommended. 75% of hired candidates had verified scores.",
    },
    {
      question: "How much does it cost?",
      answer: "Free for all candidates. We charge employers when they hire, not you.",
    },
    {
      question: "What equipment do I need?",
      answer: "A computer with a webcam, microphone, and stable internet connection (minimum 5 Mbps).",
    },
  ];

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 py-20 text-white">
        <div className="container">
          <div className="mx-auto max-w-4xl text-center">
            <Badge variant="secondary" className="mb-4">
              Skills Verification
            </Badge>
            <h1 className="mb-6 text-4xl font-bold md:text-5xl lg:text-6xl">
              Prove Your Skills, Land Better Jobs
            </h1>
            <p className="mb-8 text-xl text-primary-100">
              Take our 60-minute skills assessment to unlock exclusive opportunities
              and stand out to employers
            </p>
            <Button
              variant="secondary"
              size="lg"
              className="bg-white text-primary-600 hover:bg-primary-50"
              asChild
            >
              <Link href="#start-assessment">
                Start Your Assessment
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* What the Assessment Tests */}
      <section className="py-20">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-secondary-900 md:text-4xl">
              What the Assessment Tests
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-secondary-600">
              Three comprehensive sections designed to evaluate your real-world skills
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {assessmentSections.map((section, index) => {
              const Icon = section.icon;
              return (
                <Card key={index} className="border-2 border-primary-200">
                  <CardContent className="p-6 text-center">
                    <div className="mb-4 flex justify-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
                        <Icon className="h-8 w-8 text-primary-600" />
                      </div>
                    </div>
                    <h3 className="mb-2 text-xl font-bold text-secondary-900">
                      {section.title}
                    </h3>
                    <Badge variant="primary" size="sm" className="mb-3">
                      {section.duration}
                    </Badge>
                    <p className="text-secondary-600">{section.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Take the Assessment */}
      <section className="bg-white py-20">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-secondary-900 md:text-4xl">
              Why Take the Assessment
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-secondary-600">
              Verified candidates get better opportunities and faster results
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card key={index} className="border-2">
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <div className={`inline-flex h-12 w-12 items-center justify-center rounded-full bg-${benefit.color}-100`}>
                        <Icon className={`h-6 w-6 text-${benefit.color}-600`} />
                      </div>
                    </div>
                    <h3 className="mb-2 text-lg font-bold text-secondary-900">
                      {benefit.title}
                    </h3>
                    <p className="text-sm text-secondary-600">{benefit.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-secondary-900 md:text-4xl">
              How It Works
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-secondary-600">
              Five simple steps from registration to unlocking benefits
            </p>
          </div>

          <div className="mx-auto max-w-3xl">
            <div className="space-y-6">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className="flex gap-6 rounded-lg border-2 border-primary-200 bg-white p-6"
                >
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary-600 text-xl font-bold text-white">
                    {step.number}
                  </div>
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-3">
                      <h3 className="text-lg font-bold text-secondary-900">
                        {step.title}
                      </h3>
                      <Badge variant="secondary" size="sm">
                        {step.duration}
                      </Badge>
                    </div>
                    <p className="text-secondary-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Sample Skills Score Card */}
      <section className="bg-gradient-to-br from-secondary-50 to-primary-50 py-20">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-secondary-900 md:text-4xl">
              Sample Skills Score Card
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-secondary-600">
              Here's what your score card will look like after completing the assessment
            </p>
          </div>

          <div className="mx-auto max-w-2xl">
            <Card className="border-2 border-accent-200 bg-white shadow-xl">
              <CardContent className="p-8">
                {/* Overall Score */}
                <div className="mb-6 text-center">
                  <div className="mb-2 text-6xl font-bold text-secondary-900">
                    88<span className="text-3xl text-secondary-600">/100</span>
                  </div>
                  <Badge variant="success" size="lg" className="mb-2">
                    Top 12%
                  </Badge>
                  <p className="text-sm text-secondary-600">Overall Performance</p>
                </div>

                {/* Performance Tier */}
                <div className="mb-6 rounded-lg bg-accent-50 p-4 text-center">
                  <p className="mb-1 text-sm font-medium text-secondary-700">
                    Performance Tier
                  </p>
                  <div className="mb-1 text-2xl">⭐⭐⭐⭐⭐</div>
                  <p className="font-bold text-accent-700">Advanced</p>
                </div>

                {/* Top 3 Strengths */}
                <div className="mb-6">
                  <h4 className="mb-4 font-bold text-secondary-900">Top Strengths</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="font-medium text-secondary-700">
                          Technical Skills
                        </span>
                        <span className="font-bold text-primary-600">95/100</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-secondary-200">
                        <div
                          className="h-full bg-gradient-to-r from-primary-500 to-primary-600"
                          style={{ width: "95%" }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="font-medium text-secondary-700">
                          Problem Solving
                        </span>
                        <span className="font-bold text-accent-600">92/100</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-secondary-200">
                        <div
                          className="h-full bg-gradient-to-r from-accent-500 to-accent-600"
                          style={{ width: "92%" }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="font-medium text-secondary-700">
                          Code Quality
                        </span>
                        <span className="font-bold text-success-600">88/100</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-secondary-200">
                        <div
                          className="h-full bg-gradient-to-r from-success-500 to-success-600"
                          style={{ width: "88%" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Verification Badge */}
                <div className="flex items-center justify-center gap-2 rounded-lg border-2 border-success-200 bg-success-50 py-3">
                  <Shield className="h-5 w-5 text-success-600" />
                  <span className="font-semibold text-success-700">
                    Skills Verified & Proctored
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How Proctoring Works */}
      <section className="bg-white py-20">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            <div className="mb-12 text-center">
              <Badge variant="primary" className="mb-4">
                Transparency & Privacy
              </Badge>
              <h2 className="mb-4 text-3xl font-bold text-secondary-900 md:text-4xl">
                How Proctoring Works
              </h2>
              <p className="text-lg text-secondary-600">
                We use proctoring to ensure score integrity and build employer trust
              </p>
            </div>

            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Eye className="h-6 w-6 flex-shrink-0 text-primary-600" />
                    <div>
                      <h3 className="mb-2 font-bold text-secondary-900">
                        What we monitor
                      </h3>
                      <p className="text-secondary-600">
                        Face tracking, screen recording, tab switching, and background noise
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Shield className="h-6 w-6 flex-shrink-0 text-success-600" />
                    <div>
                      <h3 className="mb-2 font-bold text-secondary-900">
                        Why it matters
                      </h3>
                      <p className="text-secondary-600">
                        Employers trust verified scores. Unproctored tests are often dismissed
                        as unreliable.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Brain className="h-6 w-6 flex-shrink-0 text-accent-600" />
                    <div>
                      <h3 className="mb-2 font-bold text-secondary-900">
                        What happens
                      </h3>
                      <p className="text-secondary-600">
                        AI flags potential issues, human reviewers verify them. Minor issues
                        result in warnings, major ones invalidate the test.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <CheckCircle2 className="h-6 w-6 flex-shrink-0 text-secondary-600" />
                    <div>
                      <h3 className="mb-2 font-bold text-secondary-900">Privacy</h3>
                      <p className="text-secondary-600">
                        All data is encrypted end-to-end and only used for verification.
                        Recordings are deleted after 90 days.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Prep Resources */}
      <section className="py-20">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-secondary-900 md:text-4xl">
              Prep Resources
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-secondary-600">
              Get ready for the assessment with our free preparation materials
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-2 border-primary-200 transition-all hover:shadow-lg">
              <CardContent className="p-6 text-center">
                <FileText className="mx-auto mb-4 h-12 w-12 text-primary-600" />
                <h3 className="mb-2 font-bold text-secondary-900">
                  Free Practice Test
                </h3>
                <p className="mb-4 text-sm text-secondary-600">
                  10-minute mini assessment
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/skills-assessment/prep/practice">Start Practice</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 border-accent-200 transition-all hover:shadow-lg">
              <CardContent className="p-6 text-center">
                <Download className="mx-auto mb-4 h-12 w-12 text-accent-600" />
                <h3 className="mb-2 font-bold text-secondary-900">Study Guide</h3>
                <p className="mb-4 text-sm text-secondary-600">Comprehensive prep</p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/skills-assessment/prep/study-guide">View Guide</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 border-success-200 transition-all hover:shadow-lg">
              <CardContent className="p-6 text-center">
                <BookOpen className="mx-auto mb-4 h-12 w-12 text-success-600" />
                <h3 className="mb-2 font-bold text-secondary-900">
                  Sample Questions
                </h3>
                <p className="mb-4 text-sm text-secondary-600">By niche category</p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/skills-assessment/prep/sample-questions">View Samples</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 border-secondary-200 transition-all hover:shadow-lg">
              <CardContent className="p-6 text-center">
                <Clock className="mx-auto mb-4 h-12 w-12 text-secondary-600" />
                <h3 className="mb-2 font-bold text-secondary-900">Tips for Success</h3>
                <p className="mb-4 text-sm text-secondary-600">Expert strategies</p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/skills-assessment/prep/tips">Read Tips</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 text-center">
            <Button variant="primary" size="lg" asChild>
              <Link href="/skills-assessment/prep">
                View All Prep Resources
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="bg-secondary-50 py-20">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-secondary-900 md:text-4xl">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="mx-auto max-w-3xl space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <h3 className="mb-2 font-bold text-secondary-900">
                    {faq.question}
                  </h3>
                  <p className="text-secondary-600">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="bg-white py-20">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-secondary-900 md:text-4xl">
              Success Stories
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-secondary-600">
              Hear from candidates who took the assessment and landed great jobs
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="border-2 border-primary-200">
              <CardContent className="p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-xl">
                    👩‍💻
                  </div>
                  <div>
                    <p className="font-bold text-secondary-900">Sarah Chen</p>
                    <p className="text-sm text-secondary-600">ML Engineer</p>
                  </div>
                </div>
                <p className="italic text-secondary-700">
                  "The assessment helped me stand out. I got 3 interview requests within
                  48 hours of verifying my skills. Landed a $180k role!"
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-accent-200">
              <CardContent className="p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-100 text-xl">
                    👨‍💼
                  </div>
                  <div>
                    <p className="font-bold text-secondary-900">Marcus Johnson</p>
                    <p className="text-sm text-secondary-600">Cybersecurity Analyst</p>
                  </div>
                </div>
                <p className="italic text-secondary-700">
                  "I was skeptical at first, but the score card showed me exactly where I
                  stood. Gave me confidence in interviews."
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-success-200">
              <CardContent className="p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success-100 text-xl">
                    👨‍⚕️
                  </div>
                  <div>
                    <p className="font-bold text-secondary-900">Priya Patel</p>
                    <p className="text-sm text-secondary-600">Healthcare IT Developer</p>
                  </div>
                </div>
                <p className="italic text-secondary-700">
                  "The proctored assessment gave my profile so much credibility. Employers
                  knew I was the real deal."
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section
        id="start-assessment"
        className="bg-gradient-to-br from-primary-600 to-accent-600 py-20 text-white"
      >
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Ready to Verify Your Skills?
            </h2>
            <p className="mb-8 text-xl text-primary-100">
              Join thousands of candidates who've unlocked better opportunities
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button
                variant="secondary"
                size="lg"
                className="bg-white text-primary-600 hover:bg-primary-50"
                asChild
              >
                <Link href="#">
                  Start Your Assessment
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white/10"
                asChild
              >
                <Link href="#">
                  <Download className="mr-2 h-5 w-5" />
                  Download Study Guide
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

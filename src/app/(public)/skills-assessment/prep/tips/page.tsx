"use client";

import Link from "next/link";
import {
  Lightbulb,
  Monitor,
  Clock,
  BookOpen,
  FileText,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Eye,
  Camera,
  Wifi,
  Volume2,
  MousePointer,
  ArrowRight,
  Play,
  Target,
  Brain,
  Shield,
  Zap,
  Heart,
  Search,
  Award,
} from "lucide-react";
import { Button, Badge, Card, CardContent } from "@/components/ui";
import { prepTips } from "@/lib/prep-data";

export default function TipsPage() {
  const beforeTestTips = [
    {
      icon: Wifi,
      title: "Test Your Internet Connection",
      description:
        "Ensure you have a stable connection with at least 5 Mbps download speed. Consider using a wired connection for reliability.",
    },
    {
      icon: Camera,
      title: "Check Your Camera & Microphone",
      description:
        "The assessment requires webcam and microphone access for proctoring. Test them beforehand and ensure good lighting.",
    },
    {
      icon: Monitor,
      title: "Use a Supported Browser",
      description:
        "Chrome, Firefox, or Edge are recommended. Make sure your browser is up to date and disable unnecessary extensions.",
    },
    {
      icon: Volume2,
      title: "Find a Quiet Environment",
      description:
        "Choose a private, well-lit space free from distractions. Inform others not to disturb you during the assessment.",
    },
    {
      icon: Clock,
      title: "Schedule Wisely",
      description:
        "Pick a time when you're alert and focused. Avoid starting late at night or when you have other commitments nearby.",
    },
    {
      icon: FileText,
      title: "Have Your ID Ready",
      description:
        "You may need to verify your identity. Keep a valid photo ID handy for the verification process.",
    },
  ];

  const duringTestTips = [
    {
      icon: Clock,
      title: "Watch the Timer",
      description:
        "Keep an eye on the time remaining. Budget approximately 1 minute per question for technical skills, and more for coding challenges.",
    },
    {
      icon: Target,
      title: "Read Questions Carefully",
      description:
        "Don't rush. Understand exactly what's being asked before answering. Look for keywords like 'NOT', 'ALWAYS', 'BEST'.",
    },
    {
      icon: MousePointer,
      title: "Use the Skip Function",
      description:
        "If stuck on a question, mark it and move on. Return to difficult questions after completing easier ones.",
    },
    {
      icon: Brain,
      title: "Show Your Thought Process",
      description:
        "For coding and system design questions, explain your reasoning. Partial credit is given for sound approaches even if incomplete.",
    },
    {
      icon: Search,
      title: "Use Documentation Wisely",
      description:
        "Looking up syntax is allowed. Know where to find information quickly rather than memorizing everything.",
    },
    {
      icon: Eye,
      title: "Stay in Frame",
      description:
        "Keep your face visible in the webcam throughout. Avoid looking away from the screen for extended periods.",
    },
  ];

  const proctoringGuidelines = {
    allowed: [
      "Looking up documentation and syntax references",
      "Using a single external monitor (same content as primary)",
      "Taking brief breaks to stretch (face visible)",
      "Talking through your thought process quietly",
      "Using scratch paper for calculations",
    ],
    notAllowed: [
      "Having another person in the room",
      "Using a phone or secondary device",
      "Copying code from external sources",
      "Using AI assistants like ChatGPT",
      "Taking screenshots or recording the screen",
      "Having multiple browser tabs with code solutions",
    ],
  };

  const commonMistakes = [
    {
      mistake: "Not reading the full question",
      solution: "Take 10-15 seconds to read each question completely, including all options for multiple choice.",
    },
    {
      mistake: "Spending too long on one question",
      solution: "If stuck for more than 2-3 minutes, skip and return later. Don't let one question derail your timing.",
    },
    {
      mistake: "Not testing code before submitting",
      solution: "Always run your code with the provided test cases. Check edge cases if time permits.",
    },
    {
      mistake: "Over-engineering solutions",
      solution: "Start with the simplest working solution. Optimize only if you have extra time.",
    },
    {
      mistake: "Ignoring system design constraints",
      solution: "Pay attention to scale requirements, latency needs, and consistency requirements mentioned in the problem.",
    },
    {
      mistake: "Poor time management in system design",
      solution: "Spend 2 min understanding requirements, 5 min on high-level design, 5 min on deep dives, 3 min on trade-offs.",
    },
  ];

  const scoringInfo = [
    {
      section: "Technical Skills",
      weight: "40%",
      criteria: "Accuracy of answers, depth of knowledge across topics",
    },
    {
      section: "Practical Coding",
      weight: "35%",
      criteria: "Correctness, code quality, efficiency, edge case handling",
    },
    {
      section: "System Design",
      weight: "25%",
      criteria: "Completeness, trade-off analysis, scalability considerations",
    },
  ];

  const afterTestInfo = [
    {
      title: "Results Available",
      description: "Your score and tier will be available immediately after completion.",
    },
    {
      title: "Profile Update",
      description: "Your skills score card will be added to your profile for employers to see.",
    },
    {
      title: "Exclusive Access",
      description: "Passing candidates (70%+) unlock access to exclusive job postings.",
    },
    {
      title: "Retake Policy",
      description: "You can retake the assessment after 30 days to improve your score.",
    },
  ];

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-secondary-200">
        <div className="container py-3">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/skills-assessment" className="text-secondary-600 hover:text-primary-600">
              Skills Assessment
            </Link>
            <span className="text-secondary-400">/</span>
            <Link href="/skills-assessment/prep" className="text-secondary-600 hover:text-primary-600">
              Preparation
            </Link>
            <span className="text-secondary-400">/</span>
            <span className="text-secondary-900 font-medium">Tips & Strategies</span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <section className="bg-gradient-to-br from-primary-600 to-accent-600 py-12 text-white">
        <div className="container">
          <div className="mx-auto max-w-4xl text-center">
            <Lightbulb className="h-12 w-12 mx-auto mb-4 text-yellow-300" />
            <h1 className="mb-3 text-3xl font-bold md:text-4xl">Tips & Strategies</h1>
            <p className="text-lg text-primary-100">
              Expert advice to help you perform your best on the skills assessment
            </p>
          </div>
        </div>
      </section>

      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          {/* Before the Test */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100">
                <Monitor className="h-5 w-5 text-primary-600" />
              </div>
              <h2 className="text-2xl font-bold text-secondary-900">Before the Test</h2>
            </div>
            <p className="text-secondary-600 mb-6">
              Proper preparation of your environment can significantly impact your performance.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {beforeTestTips.map((tip, idx) => {
                const Icon = tip.icon;
                return (
                  <Card key={idx} className="border border-secondary-200">
                    <CardContent className="p-5">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 flex-shrink-0">
                          <Icon className="h-5 w-5 text-primary-600" />
                        </div>
                        <div>
                          <h3 className="font-bold text-secondary-900 mb-1">{tip.title}</h3>
                          <p className="text-sm text-secondary-600">{tip.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>

          {/* During the Test */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-100">
                <Clock className="h-5 w-5 text-accent-600" />
              </div>
              <h2 className="text-2xl font-bold text-secondary-900">During the Test</h2>
            </div>
            <p className="text-secondary-600 mb-6">
              Strategic approaches to maximize your score within the time limit.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {duringTestTips.map((tip, idx) => {
                const Icon = tip.icon;
                return (
                  <Card key={idx} className="border border-secondary-200">
                    <CardContent className="p-5">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-100 flex-shrink-0">
                          <Icon className="h-5 w-5 text-accent-600" />
                        </div>
                        <div>
                          <h3 className="font-bold text-secondary-900 mb-1">{tip.title}</h3>
                          <p className="text-sm text-secondary-600">{tip.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>

          {/* Proctoring Guidelines */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100">
                <Shield className="h-5 w-5 text-yellow-600" />
              </div>
              <h2 className="text-2xl font-bold text-secondary-900">Proctoring Guidelines</h2>
            </div>
            <p className="text-secondary-600 mb-6">
              The assessment uses AI-powered proctoring. Understanding what's allowed helps you
              focus on the test.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-2 border-success-200">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle2 className="h-6 w-6 text-success-600" />
                    <h3 className="font-bold text-success-800">Allowed</h3>
                  </div>
                  <ul className="space-y-3">
                    {proctoringGuidelines.allowed.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-secondary-700">
                        <CheckCircle2 className="h-4 w-4 text-success-600 flex-shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              <Card className="border-2 border-red-200">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <XCircle className="h-6 w-6 text-red-600" />
                    <h3 className="font-bold text-red-800">Not Allowed</h3>
                  </div>
                  <ul className="space-y-3">
                    {proctoringGuidelines.notAllowed.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-secondary-700">
                        <XCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Common Mistakes */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-secondary-900">Common Mistakes to Avoid</h2>
            </div>
            <p className="text-secondary-600 mb-6">
              Learn from others' mistakes to improve your performance.
            </p>
            <Card className="border border-secondary-200">
              <CardContent className="p-0">
                {commonMistakes.map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-5 ${idx !== commonMistakes.length - 1 ? "border-b border-secondary-200" : ""}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-600 font-bold text-sm">
                          {idx + 1}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-red-800 mb-1">{item.mistake}</h4>
                        <p className="text-sm text-secondary-600">
                          <span className="font-medium text-success-700">Solution: </span>
                          {item.solution}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </section>

          {/* How Scoring Works */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success-100">
                <Award className="h-5 w-5 text-success-600" />
              </div>
              <h2 className="text-2xl font-bold text-secondary-900">How Scoring Works</h2>
            </div>
            <p className="text-secondary-600 mb-6">
              Understanding the scoring system helps you prioritize your efforts.
            </p>
            <Card className="border-2 border-primary-200">
              <CardContent className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-secondary-200">
                        <th className="text-left pb-3 font-bold text-secondary-900">Section</th>
                        <th className="text-center pb-3 font-bold text-secondary-900">Weight</th>
                        <th className="text-left pb-3 font-bold text-secondary-900">Scoring Criteria</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scoringInfo.map((item, idx) => (
                        <tr key={idx} className={idx !== scoringInfo.length - 1 ? "border-b border-secondary-100" : ""}>
                          <td className="py-4 font-medium text-secondary-900">{item.section}</td>
                          <td className="py-4 text-center">
                            <Badge variant="primary">{item.weight}</Badge>
                          </td>
                          <td className="py-4 text-secondary-600 text-sm">{item.criteria}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-6 p-4 bg-primary-50 rounded-lg border border-primary-200">
                  <h4 className="font-bold text-primary-900 mb-2">Tier Ratings</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-yellow-600">Elite:</span> 90-100%
                    </div>
                    <div>
                      <span className="font-medium text-primary-600">Advanced:</span> 80-89%
                    </div>
                    <div>
                      <span className="font-medium text-success-600">Proficient:</span> 70-79%
                    </div>
                    <div>
                      <span className="font-medium text-secondary-600">Developing:</span> &lt;70%
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* What Happens After */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100">
                <Zap className="h-5 w-5 text-primary-600" />
              </div>
              <h2 className="text-2xl font-bold text-secondary-900">What Happens After</h2>
            </div>
            <p className="text-secondary-600 mb-6">
              Here's what to expect once you complete the assessment.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {afterTestInfo.map((item, idx) => (
                <Card key={idx} className="border border-secondary-200">
                  <CardContent className="p-5">
                    <h3 className="font-bold text-secondary-900 mb-2">{item.title}</h3>
                    <p className="text-sm text-secondary-600">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* CTA */}
          <Card className="bg-gradient-to-br from-primary-600 to-accent-600 text-white border-0">
            <CardContent className="p-8 text-center">
              <Heart className="h-12 w-12 mx-auto mb-4 text-red-300" />
              <h2 className="text-2xl font-bold mb-3">You've Got This!</h2>
              <p className="text-primary-100 mb-6">
                You're well-prepared. Take a deep breath, stay calm, and show what you know.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="secondary"
                  size="lg"
                  className="bg-white text-primary-600 hover:bg-primary-50"
                  asChild
                >
                  <Link href="/skills-assessment/prep/practice">
                    <Play className="mr-2 h-5 w-5" />
                    Take Practice Test
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white/10"
                  asChild
                >
                  <Link href="/skills-assessment/start">
                    Start Full Assessment
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

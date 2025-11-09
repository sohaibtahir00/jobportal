"use client";

import Link from "next/link";
import {
  BookOpen,
  Download,
  FileText,
  Video,
  Code,
  CheckCircle2,
  Play,
  Clock,
  Target,
  Zap,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { Button, Badge, Card, CardContent } from "@/components/ui";

export default function SkillsAssessmentPrepPage() {
  const studyResources = [
    {
      icon: FileText,
      title: "Comprehensive Study Guide",
      description: "200-page PDF covering all assessment topics in detail",
      type: "PDF",
      duration: "8-10 hours",
      color: "primary",
      downloadUrl: "#",
    },
    {
      icon: Video,
      title: "Video Tutorial Series",
      description: "20 hours of video lessons covering technical concepts",
      type: "Video",
      duration: "20 hours",
      color: "accent",
      downloadUrl: "#",
    },
    {
      icon: Code,
      title: "Practice Coding Challenges",
      description: "50+ coding problems with solutions and explanations",
      type: "Interactive",
      duration: "Self-paced",
      color: "success",
      downloadUrl: "/skills-assessment/start",
    },
    {
      icon: BookOpen,
      title: "System Design Cheat Sheet",
      description: "Quick reference guide for system design questions",
      type: "PDF",
      duration: "2 hours",
      color: "secondary",
      downloadUrl: "#",
    },
  ];

  const topicsCovered = [
    {
      category: "Technical Skills",
      topics: [
        "Data Structures & Algorithms",
        "Object-Oriented Programming",
        "Database Design & SQL",
        "RESTful API Design",
        "Version Control (Git)",
        "Testing & Debugging",
      ],
    },
    {
      category: "Practical Coding",
      topics: [
        "String Manipulation",
        "Array & List Operations",
        "Recursion & Dynamic Programming",
        "Code Optimization",
        "Error Handling",
        "Clean Code Principles",
      ],
    },
    {
      category: "System Design",
      topics: [
        "Scalability Patterns",
        "Caching Strategies",
        "Load Balancing",
        "Database Sharding",
        "Microservices Architecture",
        "Trade-off Analysis",
      ],
    },
  ];

  const sampleQuestions = [
    {
      difficulty: "Easy",
      question: "What is the difference between == and === in JavaScript?",
      topic: "Technical Skills",
    },
    {
      difficulty: "Medium",
      question: "Implement a function to find the longest substring without repeating characters",
      topic: "Practical Coding",
    },
    {
      difficulty: "Hard",
      question: "Design a distributed cache system like Redis that can scale to millions of requests per second",
      topic: "System Design",
    },
  ];

  const tips = [
    {
      icon: Target,
      title: "Focus on Fundamentals",
      description:
        "Master core concepts rather than memorizing solutions. Understanding principles helps you solve any variation.",
    },
    {
      icon: Clock,
      title: "Practice Time Management",
      description:
        "Each section is timed. Practice answering questions within the allocated time to build speed and confidence.",
    },
    {
      icon: Code,
      title: "Write Clean Code",
      description:
        "Even in coding challenges, focus on readability, naming conventions, and proper formatting. It's part of the evaluation.",
    },
    {
      icon: Zap,
      title: "Think Aloud (for System Design)",
      description:
        "Explain your thought process, discuss trade-offs, and consider edge cases. It shows how you approach problems.",
    },
  ];

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-accent-600 py-20 text-white">
        <div className="container">
          <div className="mx-auto max-w-4xl text-center">
            <Badge variant="secondary" className="mb-4">
              Preparation Resources
            </Badge>
            <h1 className="mb-6 text-4xl font-bold md:text-5xl">
              Prepare for Success
            </h1>
            <p className="mb-8 text-xl text-primary-100">
              Free study materials to help you ace the skills assessment
            </p>
            <Button
              variant="secondary"
              size="lg"
              className="bg-white text-primary-600 hover:bg-primary-50"
              asChild
            >
              <Link href="#resources">
                Explore Resources
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Study Resources */}
      <section id="resources" className="py-20">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-secondary-900 md:text-4xl">
              Study Resources
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-secondary-600">
              Everything you need to prepare, completely free
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {studyResources.map((resource, idx) => {
              const Icon = resource.icon;
              return (
                <Card
                  key={idx}
                  className="border-2 border-primary-200 transition-all hover:shadow-lg"
                >
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-start justify-between">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-lg bg-${resource.color}-100`}>
                        <Icon className={`h-6 w-6 text-${resource.color}-600`} />
                      </div>
                      <Badge variant="secondary">{resource.type}</Badge>
                    </div>

                    <h3 className="mb-2 text-xl font-bold text-secondary-900">
                      {resource.title}
                    </h3>
                    <p className="mb-4 text-secondary-600">
                      {resource.description}
                    </p>

                    <div className="mb-4 flex items-center gap-2 text-sm text-secondary-600">
                      <Clock className="h-4 w-4" />
                      <span>{resource.duration}</span>
                    </div>

                    <Button variant="primary" className="w-full" asChild>
                      <Link href={resource.downloadUrl}>
                        {resource.type === "Interactive" ? (
                          <>
                            <Play className="mr-2 h-4 w-4" />
                            Start Practicing
                          </>
                        ) : (
                          <>
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </>
                        )}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Topics Covered */}
      <section className="bg-white py-20">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-secondary-900 md:text-4xl">
              Topics Covered
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-secondary-600">
              Comprehensive coverage of all assessment areas
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {topicsCovered.map((section, idx) => (
              <Card key={idx} className="border-2 border-primary-200">
                <CardContent className="p-6">
                  <h3 className="mb-4 text-xl font-bold text-primary-600">
                    {section.category}
                  </h3>
                  <ul className="space-y-2">
                    {section.topics.map((topic, topicIdx) => (
                      <li
                        key={topicIdx}
                        className="flex items-start gap-2 text-secondary-700"
                      >
                        <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-success-600" />
                        <span>{topic}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Sample Questions */}
      <section className="py-20">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-secondary-900 md:text-4xl">
              Sample Questions
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-secondary-600">
              Get a feel for the types of questions you'll encounter
            </p>
          </div>

          <div className="mx-auto max-w-3xl space-y-4">
            {sampleQuestions.map((q, idx) => (
              <Card key={idx}>
                <CardContent className="p-6">
                  <div className="mb-3 flex items-center gap-3">
                    <Badge
                      variant={
                        q.difficulty === "Easy"
                          ? "success"
                          : q.difficulty === "Medium"
                          ? "warning"
                          : "danger"
                      }
                    >
                      {q.difficulty}
                    </Badge>
                    <Badge variant="secondary">{q.topic}</Badge>
                  </div>
                  <p className="text-secondary-900">{q.question}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Button variant="primary" size="lg" asChild>
              <Link href="/skills-assessment/start">
                <Play className="mr-2 h-5 w-5" />
                Try Full Practice Test
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Tips for Success */}
      <section className="bg-gradient-to-br from-secondary-50 to-primary-50 py-20">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-secondary-900 md:text-4xl">
              Tips for Success
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-secondary-600">
              Expert strategies to maximize your score
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {tips.map((tip, idx) => {
              const Icon = tip.icon;
              return (
                <Card key={idx} className="border-2 border-accent-200">
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-100">
                        <Icon className="h-5 w-5 text-accent-600" />
                      </div>
                      <h3 className="font-bold text-secondary-900">{tip.title}</h3>
                    </div>
                    <p className="text-secondary-600">{tip.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-primary-600 to-accent-600 py-20 text-white">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Ready to Take the Assessment?
            </h2>
            <p className="mb-8 text-xl text-primary-100">
              You've got all the tools you need. Start your journey to better opportunities.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button
                variant="secondary"
                size="lg"
                className="bg-white text-primary-600 hover:bg-primary-50"
                asChild
              >
                <Link href="/skills-assessment/start">
                  Start Assessment
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white/10"
                asChild
              >
                <Link href="/skills-assessment">
                  Learn More
                  <ExternalLink className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

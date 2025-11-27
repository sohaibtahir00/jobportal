"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  FileText,
  Code,
  CheckCircle2,
  Play,
  Clock,
  Target,
  Zap,
  ArrowRight,
  Brain,
  Shield,
  DollarSign,
  Stethoscope,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  HelpCircle,
  Monitor,
  ListChecks,
} from "lucide-react";
import { Button, Badge, Card, CardContent } from "@/components/ui";
import { assessmentSections, prepFAQs, NicheCategory } from "@/lib/prep-data";

export default function SkillsAssessmentPrepPage() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [selectedNiche, setSelectedNiche] = useState<NicheCategory>("AI/ML");

  const niches: { id: NicheCategory; icon: any; name: string; description: string }[] = [
    {
      id: "AI/ML",
      icon: Brain,
      name: "AI & Machine Learning",
      description: "ML algorithms, deep learning, MLOps, and data pipelines",
    },
    {
      id: "Healthcare IT",
      icon: Stethoscope,
      name: "Healthcare IT",
      description: "HIPAA compliance, HL7 FHIR, EHR systems, and clinical workflows",
    },
    {
      id: "Fintech",
      icon: DollarSign,
      name: "Fintech",
      description: "Payment systems, PCI DSS, trading platforms, and blockchain",
    },
    {
      id: "Cybersecurity",
      icon: Shield,
      name: "Cybersecurity",
      description: "OWASP, penetration testing, security architecture, and compliance",
    },
  ];

  const nicheTopics: Record<NicheCategory, string[]> = {
    "AI/ML": [
      "Supervised & Unsupervised Learning",
      "Neural Networks & Deep Learning",
      "Model Evaluation & Metrics",
      "Feature Engineering",
      "MLOps & Model Deployment",
      "Natural Language Processing",
      "Computer Vision Basics",
      "Reinforcement Learning Concepts",
    ],
    "Healthcare IT": [
      "HIPAA Privacy & Security Rules",
      "HL7 & FHIR Standards",
      "EHR/EMR Systems",
      "Clinical Terminology (ICD-10, CPT, SNOMED)",
      "Telemedicine Platforms",
      "Healthcare Data Analytics",
      "Patient Data Security",
      "Interoperability Standards",
    ],
    Fintech: [
      "Payment Processing Systems",
      "PCI DSS Compliance",
      "KYC/AML Regulations",
      "Blockchain & Cryptocurrency",
      "Trading Systems Architecture",
      "Financial Data Security",
      "Real-time Transaction Processing",
      "Fraud Detection Systems",
    ],
    Cybersecurity: [
      "OWASP Top 10 Vulnerabilities",
      "Penetration Testing",
      "Network Security",
      "Identity & Access Management",
      "Security Information & Event Management",
      "Incident Response",
      "Cryptography Fundamentals",
      "Zero Trust Architecture",
    ],
  };

  const quickLinks = [
    {
      icon: FileText,
      title: "Sample Questions",
      description: "Practice with 20+ questions across all niches",
      href: "/skills-assessment/prep/sample-questions",
      color: "primary",
    },
    {
      icon: Play,
      title: "Practice Test",
      description: "10-minute mini assessment with instant feedback",
      href: "/skills-assessment/prep/practice",
      color: "success",
    },
    {
      icon: BookOpen,
      title: "Study Guide",
      description: "Comprehensive guide with resources and checklists",
      href: "/skills-assessment/prep/study-guide",
      color: "accent",
    },
    {
      icon: Lightbulb,
      title: "Tips & Strategies",
      description: "Expert advice for maximizing your score",
      href: "/skills-assessment/prep/tips",
      color: "secondary",
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
            <span className="text-secondary-900 font-medium">Preparation</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-accent-600 py-16 text-white">
        <div className="container">
          <div className="mx-auto max-w-4xl text-center">
            <Badge variant="secondary" className="mb-4 bg-white/20 text-white">
              Free Preparation Resources
            </Badge>
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">
              Prepare for Your Skills Assessment
            </h1>
            <p className="mb-8 text-xl text-primary-100">
              Everything you need to succeed - study guides, sample questions, practice tests, and expert tips
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
                <Link href="/skills-assessment/prep/sample-questions">
                  <FileText className="mr-2 h-5 w-5" />
                  Browse Sample Questions
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-12 -mt-8">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickLinks.map((link, idx) => {
              const Icon = link.icon;
              return (
                <Link key={idx} href={link.href}>
                  <Card className="h-full border-2 border-transparent hover:border-primary-300 hover:shadow-lg transition-all cursor-pointer">
                    <CardContent className="p-5">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-${link.color}-100 mb-3`}>
                        <Icon className={`h-5 w-5 text-${link.color}-600`} />
                      </div>
                      <h3 className="font-bold text-secondary-900 mb-1">{link.title}</h3>
                      <p className="text-sm text-secondary-600">{link.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Assessment Overview */}
      <section className="py-12 bg-white">
        <div className="container">
          <div className="mb-10 text-center">
            <h2 className="mb-3 text-3xl font-bold text-secondary-900">
              What to Expect
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-secondary-600">
              The assessment takes approximately 60 minutes and consists of three sections
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {assessmentSections.map((section, idx) => (
              <Card key={idx} className="border-2 border-primary-100">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="primary" className="text-lg px-3 py-1">
                      {idx + 1}
                    </Badge>
                    <div className="flex items-center gap-1 text-secondary-600">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm font-medium">{section.duration} min</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-secondary-900 mb-2">
                    {section.name}
                  </h3>
                  <p className="text-secondary-600 mb-4 text-sm">
                    {section.description}
                  </p>
                  <div className="space-y-2">
                    {section.topics.map((topic, topicIdx) => (
                      <div key={topicIdx} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0 text-success-600" />
                        <span className="text-secondary-700">{topic}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-secondary-100 text-sm text-secondary-500">
                    {section.questions} questions
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-secondary-600 mb-4">
              Total: 60 minutes | 23 questions | Proctored
            </p>
          </div>
        </div>
      </section>

      {/* Niche-Specific Prep */}
      <section className="py-12">
        <div className="container">
          <div className="mb-10 text-center">
            <h2 className="mb-3 text-3xl font-bold text-secondary-900">
              Niche-Specific Preparation
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-secondary-600">
              Focus your study on your specialty area
            </p>
          </div>

          {/* Niche Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {niches.map((niche) => {
              const Icon = niche.icon;
              return (
                <button
                  key={niche.id}
                  onClick={() => setSelectedNiche(niche.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all ${
                    selectedNiche === niche.id
                      ? "border-primary-600 bg-primary-600 text-white"
                      : "border-secondary-200 bg-white text-secondary-700 hover:border-primary-300"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{niche.name}</span>
                </button>
              );
            })}
          </div>

          {/* Selected Niche Content */}
          <Card className="max-w-4xl mx-auto border-2 border-primary-200">
            <CardContent className="p-8">
              <div className="flex items-start gap-4 mb-6">
                {(() => {
                  const niche = niches.find((n) => n.id === selectedNiche);
                  const Icon = niche?.icon || Brain;
                  return (
                    <>
                      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary-100">
                        <Icon className="h-7 w-7 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-secondary-900">
                          {niche?.name}
                        </h3>
                        <p className="text-secondary-600">{niche?.description}</p>
                      </div>
                    </>
                  );
                })()}
              </div>

              <h4 className="font-bold text-secondary-900 mb-4">Key Topics to Study:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {nicheTopics[selectedNiche].map((topic, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-success-600 flex-shrink-0" />
                    <span className="text-secondary-700">{topic}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="primary" asChild>
                  <Link href={`/skills-assessment/prep/sample-questions?category=${encodeURIComponent(selectedNiche)}`}>
                    <FileText className="mr-2 h-4 w-4" />
                    {selectedNiche} Sample Questions
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/skills-assessment/prep/study-guide">
                    <BookOpen className="mr-2 h-4 w-4" />
                    View Study Guide
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Tips Preview */}
      <section className="py-12 bg-gradient-to-br from-secondary-50 to-primary-50">
        <div className="container">
          <div className="mb-10 text-center">
            <h2 className="mb-3 text-3xl font-bold text-secondary-900">
              Tips for Success
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-secondary-600">
              Expert strategies to maximize your score
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card className="border-2 border-accent-200">
              <CardContent className="p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-100 mb-4">
                  <Monitor className="h-5 w-5 text-accent-600" />
                </div>
                <h3 className="font-bold text-secondary-900 mb-2">Test Your Environment</h3>
                <p className="text-secondary-600 text-sm">
                  Ensure stable internet, working camera/mic, and a quiet space before starting.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-accent-200">
              <CardContent className="p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-100 mb-4">
                  <Clock className="h-5 w-5 text-accent-600" />
                </div>
                <h3 className="font-bold text-secondary-900 mb-2">Manage Your Time</h3>
                <p className="text-secondary-600 text-sm">
                  Don't spend too long on any single question. Mark difficult ones and return later.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-accent-200">
              <CardContent className="p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-100 mb-4">
                  <Target className="h-5 w-5 text-accent-600" />
                </div>
                <h3 className="font-bold text-secondary-900 mb-2">Show Your Work</h3>
                <p className="text-secondary-600 text-sm">
                  For coding and design questions, explain your thought process even if incomplete.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 text-center">
            <Button variant="outline" asChild>
              <Link href="/skills-assessment/prep/tips">
                View All Tips & Strategies
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 bg-white">
        <div className="container">
          <div className="mb-10 text-center">
            <h2 className="mb-3 text-3xl font-bold text-secondary-900">
              Frequently Asked Questions
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-secondary-600">
              Common questions about the skills assessment
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {prepFAQs.slice(0, 6).map((faq, idx) => (
              <Card key={idx} className="border border-secondary-200">
                <CardContent className="p-0">
                  <button
                    onClick={() => setOpenFAQ(openFAQ === idx ? null : idx)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-secondary-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <HelpCircle className="h-5 w-5 text-primary-600 flex-shrink-0" />
                      <span className="font-medium text-secondary-900">{faq.question}</span>
                    </div>
                    {openFAQ === idx ? (
                      <ChevronUp className="h-5 w-5 text-secondary-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-secondary-400" />
                    )}
                  </button>
                  {openFAQ === idx && (
                    <div className="px-4 pb-4 pl-12">
                      <p className="text-secondary-600">{faq.answer}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-primary-600 to-accent-600 py-16 text-white">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <ListChecks className="h-16 w-16 mx-auto mb-4 text-white/80" />
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Ready to Take the Assessment?
            </h2>
            <p className="mb-8 text-xl text-primary-100">
              You've prepared well. Now it's time to showcase your skills and unlock better opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="secondary"
                size="lg"
                className="bg-white text-primary-600 hover:bg-primary-50"
                asChild
              >
                <Link href="/skills-assessment/start">
                  Start Assessment Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white/10"
                asChild
              >
                <Link href="/skills-assessment/prep/practice">
                  Take Practice Test First
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

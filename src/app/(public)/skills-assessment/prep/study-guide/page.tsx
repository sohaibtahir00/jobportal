"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Download,
  ExternalLink,
  CheckCircle2,
  Brain,
  Shield,
  DollarSign,
  Stethoscope,
  Code,
  Layers,
  ArrowRight,
  Play,
  FileText,
  Video,
  Globe,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button, Badge, Card, CardContent } from "@/components/ui";
import { studyTopicsByNiche, assessmentSections, NicheCategory } from "@/lib/prep-data";

export default function StudyGuidePage() {
  const [selectedNiche, setSelectedNiche] = useState<NicheCategory>("AI/ML");
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["technical-skills"]));

  const niches: { id: NicheCategory; icon: any; name: string }[] = [
    { id: "AI/ML", icon: Brain, name: "AI & Machine Learning" },
    { id: "Healthcare IT", icon: Stethoscope, name: "Healthcare IT" },
    { id: "Fintech", icon: DollarSign, name: "Fintech" },
    { id: "Cybersecurity", icon: Shield, name: "Cybersecurity" },
  ];

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const technicalSkillsChecklist = {
    "AI/ML": [
      { topic: "Supervised Learning", subtopics: ["Linear Regression", "Logistic Regression", "Decision Trees", "Random Forests", "SVM"] },
      { topic: "Unsupervised Learning", subtopics: ["K-Means Clustering", "Hierarchical Clustering", "PCA", "t-SNE"] },
      { topic: "Deep Learning", subtopics: ["Neural Networks", "CNNs", "RNNs/LSTMs", "Transformers", "GANs"] },
      { topic: "Model Evaluation", subtopics: ["Cross-validation", "Metrics (Accuracy, Precision, Recall, F1)", "ROC/AUC", "Confusion Matrix"] },
      { topic: "MLOps", subtopics: ["Model Versioning", "Feature Stores", "Model Serving", "Monitoring & Drift Detection"] },
    ],
    "Healthcare IT": [
      { topic: "HIPAA Compliance", subtopics: ["Privacy Rule", "Security Rule", "Breach Notification", "Business Associates"] },
      { topic: "Health Data Standards", subtopics: ["HL7 v2", "HL7 FHIR", "CDA", "DICOM"] },
      { topic: "Clinical Terminology", subtopics: ["ICD-10", "CPT", "SNOMED CT", "LOINC", "RxNorm"] },
      { topic: "EHR Systems", subtopics: ["Epic", "Cerner", "Allscripts", "Meaningful Use", "Interoperability"] },
      { topic: "Healthcare Security", subtopics: ["PHI Protection", "Access Controls", "Audit Trails", "Encryption Requirements"] },
    ],
    Fintech: [
      { topic: "Payment Systems", subtopics: ["Card Networks", "ACH", "Wire Transfers", "Real-time Payments", "Digital Wallets"] },
      { topic: "Compliance", subtopics: ["PCI DSS", "KYC/AML", "SOX", "GDPR", "PSD2"] },
      { topic: "Security", subtopics: ["Tokenization", "Encryption", "Fraud Detection", "3D Secure", "MFA"] },
      { topic: "Trading Systems", subtopics: ["Order Management", "Market Data", "Low Latency", "FIX Protocol"] },
      { topic: "Blockchain", subtopics: ["Distributed Ledger", "Smart Contracts", "Consensus Mechanisms", "Cryptocurrency Basics"] },
    ],
    Cybersecurity: [
      { topic: "Application Security", subtopics: ["OWASP Top 10", "Secure SDLC", "Code Review", "SAST/DAST", "Penetration Testing"] },
      { topic: "Network Security", subtopics: ["Firewalls", "IDS/IPS", "VPNs", "Network Segmentation", "Zero Trust"] },
      { topic: "Identity & Access", subtopics: ["Authentication Methods", "OAuth/OIDC", "SAML", "RBAC/ABAC", "Privileged Access"] },
      { topic: "Security Operations", subtopics: ["SIEM", "Incident Response", "Threat Intelligence", "Vulnerability Management"] },
      { topic: "Compliance", subtopics: ["NIST CSF", "ISO 27001", "SOC 2", "GDPR", "CCPA"] },
    ],
  };

  const codingBestPractices = [
    {
      title: "Write Clean, Readable Code",
      points: [
        "Use meaningful variable and function names",
        "Keep functions small and focused on a single task",
        "Follow consistent formatting and indentation",
        "Add comments for complex logic, not obvious code",
      ],
    },
    {
      title: "Handle Errors Gracefully",
      points: [
        "Use try-catch blocks for error-prone operations",
        "Provide meaningful error messages",
        "Fail fast and fail loudly in development",
        "Log errors with context for debugging",
      ],
    },
    {
      title: "Optimize for Performance",
      points: [
        "Understand time and space complexity",
        "Avoid premature optimization",
        "Use appropriate data structures",
        "Consider caching for expensive operations",
      ],
    },
    {
      title: "Write Testable Code",
      points: [
        "Separate concerns (business logic vs I/O)",
        "Use dependency injection",
        "Keep functions pure when possible",
        "Test edge cases and error paths",
      ],
    },
  ];

  const systemDesignFundamentals = [
    {
      title: "Scalability Patterns",
      content: "Horizontal vs vertical scaling, load balancing, caching strategies, database sharding, CDNs",
    },
    {
      title: "Database Design",
      content: "SQL vs NoSQL trade-offs, indexing, normalization/denormalization, replication, partitioning",
    },
    {
      title: "Distributed Systems",
      content: "CAP theorem, consistency models, consensus algorithms, microservices vs monolith",
    },
    {
      title: "API Design",
      content: "REST principles, GraphQL, gRPC, versioning, rate limiting, authentication",
    },
    {
      title: "Reliability",
      content: "Fault tolerance, circuit breakers, retries with backoff, health checks, graceful degradation",
    },
  ];

  const getResourceIcon = (type: string) => {
    switch (type) {
      case "video":
        return Video;
      case "article":
        return FileText;
      case "docs":
        return Globe;
      default:
        return ExternalLink;
    }
  };

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
            <span className="text-secondary-900 font-medium">Study Guide</span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <section className="bg-gradient-to-br from-primary-600 to-accent-600 py-12 text-white">
        <div className="container">
          <div className="mx-auto max-w-4xl text-center">
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-primary-200" />
            <h1 className="mb-3 text-3xl font-bold md:text-4xl">Comprehensive Study Guide</h1>
            <p className="text-lg text-primary-100 mb-6">
              Everything you need to know to ace the skills assessment
            </p>
            <Button
              variant="secondary"
              className="bg-white text-primary-600 hover:bg-primary-50"
            >
              <Download className="mr-2 h-4 w-4" />
              Download PDF Version (Coming Soon)
            </Button>
          </div>
        </div>
      </section>

      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          {/* Quick Navigation */}
          <Card className="mb-8 border-2 border-primary-200">
            <CardContent className="p-6">
              <h2 className="font-bold text-secondary-900 mb-4">Quick Navigation</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <a
                  href="#technical-checklist"
                  className="flex items-center gap-2 p-3 rounded-lg bg-secondary-50 hover:bg-secondary-100 transition-colors"
                >
                  <CheckCircle2 className="h-4 w-4 text-primary-600" />
                  <span className="text-sm font-medium text-secondary-900">Technical Skills</span>
                </a>
                <a
                  href="#coding-practices"
                  className="flex items-center gap-2 p-3 rounded-lg bg-secondary-50 hover:bg-secondary-100 transition-colors"
                >
                  <Code className="h-4 w-4 text-primary-600" />
                  <span className="text-sm font-medium text-secondary-900">Coding Practices</span>
                </a>
                <a
                  href="#system-design"
                  className="flex items-center gap-2 p-3 rounded-lg bg-secondary-50 hover:bg-secondary-100 transition-colors"
                >
                  <Layers className="h-4 w-4 text-primary-600" />
                  <span className="text-sm font-medium text-secondary-900">System Design</span>
                </a>
                <a
                  href="#resources"
                  className="flex items-center gap-2 p-3 rounded-lg bg-secondary-50 hover:bg-secondary-100 transition-colors"
                >
                  <ExternalLink className="h-4 w-4 text-primary-600" />
                  <span className="text-sm font-medium text-secondary-900">Resources</span>
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Assessment Overview */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-secondary-900 mb-4">Assessment Overview</h2>
            <p className="text-secondary-600 mb-6">
              The skills assessment consists of three sections, each designed to evaluate different aspects
              of your technical capabilities.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {assessmentSections.map((section, idx) => (
                <Card key={idx} className="border border-secondary-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="primary">{idx + 1}</Badge>
                      <span className="text-sm text-secondary-500">{section.duration} min</span>
                    </div>
                    <h3 className="font-bold text-secondary-900 mb-1">{section.name}</h3>
                    <p className="text-sm text-secondary-600">{section.questions} questions</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Technical Skills Checklist */}
          <section id="technical-checklist" className="mb-12">
            <h2 className="text-2xl font-bold text-secondary-900 mb-4">Technical Skills Checklist</h2>
            <p className="text-secondary-600 mb-6">
              Select your niche to see the key topics you should master.
            </p>

            {/* Niche Selector */}
            <div className="flex flex-wrap gap-2 mb-6">
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

            {/* Checklist */}
            <Card className="border-2 border-primary-200">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {technicalSkillsChecklist[selectedNiche].map((item, idx) => (
                    <div key={idx} className="border-b border-secondary-100 pb-4 last:border-0 last:pb-0">
                      <h4 className="font-bold text-secondary-900 mb-2">{item.topic}</h4>
                      <div className="flex flex-wrap gap-2">
                        {item.subtopics.map((subtopic, subIdx) => (
                          <span
                            key={subIdx}
                            className="px-3 py-1 bg-secondary-100 rounded-full text-sm text-secondary-700"
                          >
                            {subtopic}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Coding Best Practices */}
          <section id="coding-practices" className="mb-12">
            <h2 className="text-2xl font-bold text-secondary-900 mb-4">Coding Best Practices</h2>
            <p className="text-secondary-600 mb-6">
              Follow these guidelines during the practical coding section to maximize your score.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {codingBestPractices.map((practice, idx) => (
                <Card key={idx} className="border border-secondary-200">
                  <CardContent className="p-5">
                    <h3 className="font-bold text-secondary-900 mb-3 flex items-center gap-2">
                      <Code className="h-5 w-5 text-primary-600" />
                      {practice.title}
                    </h3>
                    <ul className="space-y-2">
                      {practice.points.map((point, pointIdx) => (
                        <li key={pointIdx} className="flex items-start gap-2 text-sm text-secondary-600">
                          <CheckCircle2 className="h-4 w-4 text-success-600 flex-shrink-0 mt-0.5" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* System Design Fundamentals */}
          <section id="system-design" className="mb-12">
            <h2 className="text-2xl font-bold text-secondary-900 mb-4">System Design Fundamentals</h2>
            <p className="text-secondary-600 mb-6">
              Key concepts to understand for the system design section.
            </p>
            <div className="space-y-3">
              {systemDesignFundamentals.map((item, idx) => (
                <Card key={idx} className="border border-secondary-200">
                  <CardContent className="p-0">
                    <button
                      onClick={() => toggleSection(`sd-${idx}`)}
                      className="w-full flex items-center justify-between p-4 hover:bg-secondary-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Layers className="h-5 w-5 text-primary-600" />
                        <span className="font-bold text-secondary-900">{item.title}</span>
                      </div>
                      {expandedSections.has(`sd-${idx}`) ? (
                        <ChevronUp className="h-5 w-5 text-secondary-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-secondary-400" />
                      )}
                    </button>
                    {expandedSections.has(`sd-${idx}`) && (
                      <div className="px-4 pb-4 pl-12">
                        <p className="text-secondary-600">{item.content}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* External Resources */}
          <section id="resources" className="mb-12">
            <h2 className="text-2xl font-bold text-secondary-900 mb-4">Recommended Resources</h2>
            <p className="text-secondary-600 mb-6">
              External resources to deepen your knowledge in your chosen niche.
            </p>

            <Card className="border-2 border-primary-200">
              <CardContent className="p-6">
                {studyTopicsByNiche[selectedNiche].map((topic, idx) => (
                  <div
                    key={idx}
                    className="mb-6 last:mb-0 pb-6 last:pb-0 border-b last:border-0 border-secondary-200"
                  >
                    <h3 className="font-bold text-secondary-900 mb-2">{topic.title}</h3>
                    <p className="text-sm text-secondary-600 mb-3">{topic.description}</p>
                    <div className="space-y-2">
                      {topic.resources.map((resource, resIdx) => {
                        const Icon = getResourceIcon(resource.type);
                        return (
                          <a
                            key={resIdx}
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 rounded-lg border border-secondary-200 hover:bg-secondary-50 transition-colors"
                          >
                            <Icon className="h-4 w-4 text-primary-600" />
                            <span className="text-secondary-900 flex-1">{resource.title}</span>
                            <Badge variant="secondary" className="text-xs">
                              {resource.type}
                            </Badge>
                            <ExternalLink className="h-4 w-4 text-secondary-400" />
                          </a>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </section>

          {/* CTA */}
          <Card className="bg-gradient-to-br from-primary-600 to-accent-600 text-white border-0">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-3">Ready to Test Your Knowledge?</h2>
              <p className="text-primary-100 mb-6">
                Put your preparation to the test with a practice assessment.
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
                    Browse Sample Questions
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

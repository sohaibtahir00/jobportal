"use client";

import { useState } from "react";
import Link from "next/link";
import {
  DollarSign,
  TrendingUp,
  Briefcase,
  Award,
  CheckCircle2,
  ArrowRight,
  Shield,
  Zap,
  BarChart,
  Lock,
  Users,
  Wallet,
} from "lucide-react";
import { Card, CardContent, Badge, Button, Input } from "@/components/ui";

export default function FintechJobsPage() {
  const [email, setEmail] = useState("");

  const stats = [
    {
      icon: TrendingUp,
      value: "156%",
      label: "Job Growth Since 2023",
      color: "text-success-600",
    },
    {
      icon: Wallet,
      value: "$175k",
      label: "Average Base Salary",
      color: "text-accent-600",
    },
    {
      icon: Briefcase,
      value: "510+",
      label: "Open Positions",
      color: "text-primary-600",
    },
    {
      icon: Shield,
      value: "100%",
      label: "Security Vetted",
      color: "text-yellow-600",
    },
  ];

  const topRoles = [
    {
      title: "Backend Engineer (Fintech)",
      count: 189,
      avgSalary: "$160k - $220k",
      topSkills: ["Python", "Microservices", "SQL"],
    },
    {
      title: "Blockchain Developer",
      count: 97,
      avgSalary: "$170k - $240k",
      topSkills: ["Solidity", "Web3", "Smart Contracts"],
    },
    {
      title: "Payment Systems Engineer",
      count: 134,
      avgSalary: "$150k - $200k",
      topSkills: ["APIs", "Stripe", "PCI-DSS"],
    },
    {
      title: "Quantitative Developer",
      count: 90,
      avgSalary: "$180k - $260k",
      topSkills: ["C++", "Python", "Algorithms"],
    },
  ];

  const featuredJobs = [
    {
      title: "Senior Fintech Platform Engineer",
      company: "PaymentTech Inc",
      location: "New York, NY (Hybrid)",
      salary: "$180k - $240k",
      type: "Full-time",
      verified: 24,
      tags: ["Python", "Microservices", "AWS"],
    },
    {
      title: "Blockchain Smart Contract Developer",
      company: "CryptoFinance LLC",
      location: "Remote",
      salary: "$190k - $260k",
      type: "Full-time",
      verified: 18,
      tags: ["Solidity", "Ethereum", "Web3"],
    },
    {
      title: "Principal Payment Engineer",
      company: "Global Payments",
      location: "San Francisco, CA",
      salary: "$200k - $280k",
      type: "Full-time",
      verified: 21,
      tags: ["Java", "Kafka", "PostgreSQL"],
    },
  ];

  const requiredSkills = [
    { skill: "Python/Java", jobs: 412 },
    { skill: "Microservices", jobs: 367 },
    { skill: "SQL/NoSQL", jobs: 389 },
    { skill: "APIs/REST", jobs: 401 },
    { skill: "Cloud (AWS/GCP)", jobs: 356 },
    { skill: "Blockchain", jobs: 187 },
    { skill: "Security", jobs: 298 },
    { skill: "Kafka/Streaming", jobs: 245 },
  ];

  const whyChooseUs = [
    {
      icon: Shield,
      title: "Security-First Candidates",
      description: "All fintech engineers are background-checked and vetted for security clearance requirements.",
    },
    {
      icon: Zap,
      title: "Payment Systems Expertise",
      description: "Access developers experienced with Stripe, Plaid, payment gateways, and PCI-DSS compliance.",
    },
    {
      icon: BarChart,
      title: "Blockchain & Web3 Talent",
      description: "Find specialized blockchain developers and smart contract engineers for crypto projects.",
    },
    {
      icon: Lock,
      title: "Compliance Ready",
      description: "Candidates understand SOC2, PCI-DSS, KYC/AML, and other financial regulations.",
    },
  ];

  const companies = [
    "Stripe", "Plaid", "Robinhood", "Coinbase", "Square",
    "Ripple", "Chime", "Affirm", "Revolut", "Brex",
  ];

  const categories = [
    { name: "Payments", count: 198 },
    { name: "Blockchain/Crypto", count: 145 },
    { name: "Banking Tech", count: 167 },
    { name: "Trading Platforms", count: 112 },
    { name: "Lending/Credit", count: 98 },
    { name: "Wealth Management", count: 76 },
  ];

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-600 via-yellow-600 to-accent-600 py-20 text-white">
        <div className="container">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                <DollarSign className="h-10 w-10" />
              </div>
            </div>
            <h1 className="mb-6 text-5xl font-bold md:text-6xl">
              Fintech Jobs
            </h1>
            <p className="mb-8 text-xl opacity-95">
              Join the future of finance. Connect with top fintech companies hiring payment engineers, blockchain developers, and more.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button
                variant="secondary"
                size="lg"
                className="bg-white text-primary-600 hover:bg-primary-50"
                asChild
              >
                <Link href="/jobs?category=fintech">
                  Browse 510+ Fintech Jobs
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
                  Get Verified
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="border-b border-secondary-200 bg-white py-12">
        <div className="container">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="text-center">
                  <Icon className={`mx-auto mb-3 h-8 w-8 ${stat.color}`} />
                  <div className="mb-1 text-3xl font-bold text-secondary-900">
                    {stat.value}
                  </div>
                  <div className="text-sm text-secondary-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="py-16">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-secondary-900">
              Fintech Job Categories
            </h2>
            <p className="text-secondary-600">
              Explore different areas of financial technology
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {categories.map((category, idx) => (
              <Card key={idx} className="transition-shadow hover:shadow-md cursor-pointer">
                <CardContent className="p-6 text-center">
                  <h3 className="mb-2 text-lg font-bold text-secondary-900">
                    {category.name}
                  </h3>
                  <p className="text-sm text-secondary-600">
                    {category.count} jobs
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Top Roles Section */}
      <div className="bg-white py-16">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-secondary-900">
              Top Fintech Roles Hiring Now
            </h2>
            <p className="mx-auto max-w-2xl text-secondary-600">
              Explore the most in-demand fintech engineering positions
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {topRoles.map((role, idx) => (
              <Card key={idx} className="transition-shadow hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <h3 className="mb-2 text-xl font-bold text-secondary-900">
                        {role.title}
                      </h3>
                      <p className="text-sm text-secondary-600">
                        {role.count} open positions
                      </p>
                    </div>
                    <Badge variant="primary">{role.avgSalary}</Badge>
                  </div>
                  <div className="mb-4 flex flex-wrap gap-2">
                    {role.topSkills.map((skill, skillIdx) => (
                      <Badge key={skillIdx} variant="secondary" size="sm">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    className="w-full"
                    asChild
                  >
                    <Link href={`/jobs?role=${encodeURIComponent(role.title)}`}>
                      View Jobs
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Jobs */}
      <div className="py-16">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-secondary-900">
              Featured Fintech Opportunities
            </h2>
            <p className="text-secondary-600">
              Handpicked roles from top fintech companies
            </p>
          </div>

          <div className="space-y-4">
            {featuredJobs.map((job, idx) => (
              <Card key={idx} className="transition-shadow hover:shadow-md">
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-3">
                        <h3 className="text-xl font-bold text-secondary-900">
                          {job.title}
                        </h3>
                        <Badge variant="success" size="sm">
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                          {job.verified} verified
                        </Badge>
                      </div>
                      <p className="mb-3 text-secondary-600">
                        {job.company} • {job.location}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {job.tags.map((tag, tagIdx) => (
                          <Badge key={tagIdx} variant="secondary" size="sm">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col gap-3 md:items-end">
                      <div className="text-xl font-bold text-primary-600">
                        {job.salary}
                      </div>
                      <Button variant="primary" asChild>
                        <Link href={`/jobs/${idx + 1}`}>
                          View Details
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Button variant="outline" size="lg" asChild>
              <Link href="/jobs?category=fintech">
                View All 510+ Fintech Jobs
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Required Skills */}
      <div className="bg-gradient-to-br from-yellow-50 to-primary-50 py-16">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-secondary-900">
              Most In-Demand Fintech Skills
            </h2>
            <p className="text-secondary-600">
              Top skills for fintech engineering roles
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {requiredSkills.map((item, idx) => (
              <Card key={idx} className="text-center">
                <CardContent className="p-4">
                  <div className="mb-2 flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-primary-100">
                    <DollarSign className="h-6 w-6 text-primary-600" />
                  </div>
                  <h3 className="mb-1 font-bold text-secondary-900">
                    {item.skill}
                  </h3>
                  <p className="text-sm text-secondary-600">
                    {item.jobs} jobs
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="py-16">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-secondary-900">
              Why Fintech Engineers Choose Us
            </h2>
            <p className="text-secondary-600">
              The leading platform for fintech careers
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {whyChooseUs.map((item, idx) => {
              const Icon = item.icon;
              return (
                <Card key={idx}>
                  <CardContent className="p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
                      <Icon className="h-6 w-6 text-yellow-600" />
                    </div>
                    <h3 className="mb-2 text-xl font-bold text-secondary-900">
                      {item.title}
                    </h3>
                    <p className="text-secondary-600">{item.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Companies Hiring */}
      <div className="bg-white py-16">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-secondary-900">
              Top Fintech Companies Hiring
            </h2>
            <p className="text-secondary-600">
              From unicorns to established fintech leaders
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-8">
            {companies.map((company, idx) => (
              <div
                key={idx}
                className="flex h-16 w-40 items-center justify-center rounded-lg bg-secondary-50 px-6 shadow-sm"
              >
                <span className="font-semibold text-secondary-700">
                  {company}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-primary-600 via-yellow-600 to-accent-600 py-16 text-white">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold">
              Launch Your Fintech Career Today
            </h2>
            <p className="mb-8 text-xl opacity-95">
              Join 15,000+ verified fintech engineers building the future of finance
            </p>

            <div className="mx-auto mb-8 flex max-w-md gap-3">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-white text-secondary-900"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button
                variant="secondary"
                className="whitespace-nowrap bg-white text-primary-600 hover:bg-primary-50"
                asChild
              >
                <Link href="/signup?role=candidate&category=fintech">
                  Sign Up Free
                </Link>
              </Button>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                <span>Security vetted</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                <span>Free forever</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                <span>Top fintech employers</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

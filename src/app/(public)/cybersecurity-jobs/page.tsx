"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Shield,
  TrendingUp,
  DollarSign,
  Briefcase,
  Award,
  CheckCircle2,
  ArrowRight,
  Lock,
  AlertTriangle,
  Eye,
  Bug,
  Users,
  Target,
} from "lucide-react";
import { Card, CardContent, Badge, Button, Input } from "@/components/ui";

export default function CybersecurityJobsPage() {
  const [email, setEmail] = useState("");

  const stats = [
    {
      icon: TrendingUp,
      value: "218%",
      label: "Job Growth Since 2023",
      color: "text-success-600",
    },
    {
      icon: DollarSign,
      value: "$155k",
      label: "Average Base Salary",
      color: "text-accent-600",
    },
    {
      icon: Briefcase,
      value: "380+",
      label: "Open Positions",
      color: "text-primary-600",
    },
    {
      icon: Shield,
      value: "100%",
      label: "Security Cleared",
      color: "text-yellow-600",
    },
  ];

  const topRoles = [
    {
      title: "Security Engineer",
      count: 145,
      avgSalary: "$140k - $190k",
      topSkills: ["Penetration Testing", "SIEM", "Firewall"],
    },
    {
      title: "Application Security Engineer",
      count: 98,
      avgSalary: "$150k - $200k",
      topSkills: ["OWASP", "Code Review", "SAST/DAST"],
    },
    {
      title: "Cloud Security Architect",
      count: 87,
      avgSalary: "$170k - $230k",
      topSkills: ["AWS Security", "Zero Trust", "IAM"],
    },
    {
      title: "Incident Response Analyst",
      count: 72,
      avgSalary: "$130k - $180k",
      topSkills: ["SIEM", "Forensics", "Threat Hunting"],
    },
  ];

  const featuredJobs = [
    {
      title: "Senior Application Security Engineer",
      company: "SecureTech Corp",
      location: "Remote",
      salary: "$160k - $210k",
      type: "Full-time",
      verified: 22,
      tags: ["OWASP", "Penetration Testing", "Python"],
    },
    {
      title: "Cloud Security Architect",
      company: "CloudDefense Inc",
      location: "Seattle, WA (Hybrid)",
      salary: "$180k - $240k",
      type: "Full-time",
      verified: 16,
      tags: ["AWS", "Zero Trust", "Kubernetes"],
    },
    {
      title: "Principal Security Researcher",
      company: "CyberShield Labs",
      location: "Austin, TX",
      salary: "$190k - $260k",
      type: "Full-time",
      verified: 19,
      tags: ["Malware Analysis", "Reverse Engineering", "Threat Intelligence"],
    },
  ];

  const requiredSkills = [
    { skill: "Penetration Testing", jobs: 289 },
    { skill: "SIEM/SOC", jobs: 267 },
    { skill: "Cloud Security", jobs: 298 },
    { skill: "Network Security", jobs: 245 },
    { skill: "Application Security", jobs: 234 },
    { skill: "Incident Response", jobs: 221 },
    { skill: "Security Compliance", jobs: 198 },
    { skill: "Threat Intelligence", jobs: 176 },
  ];

  const whyChooseUs = [
    {
      icon: Shield,
      title: "Background-Verified Talent",
      description: "All cybersecurity professionals undergo thorough background checks and security clearance verification.",
    },
    {
      icon: Award,
      title: "Certified Professionals",
      description: "Access candidates with CISSP, CEH, OSCP, and other industry-recognized security certifications.",
    },
    {
      icon: Eye,
      title: "Penetration Testing Experts",
      description: "Find ethical hackers and pen testers with proven experience in vulnerability assessment and exploitation.",
    },
    {
      icon: Lock,
      title: "Compliance Specialists",
      description: "Hire experts familiar with SOC2, ISO 27001, GDPR, HIPAA, and other security frameworks.",
    },
  ];

  const companies = [
    "CrowdStrike", "Palo Alto Networks", "Cloudflare", "Okta", "Fortinet",
    "Zscaler", "Wiz", "Snyk", "Tenable", "Rapid7",
  ];

  const certifications = [
    { name: "CISSP", description: "Certified Information Systems Security Professional" },
    { name: "CEH", description: "Certified Ethical Hacker" },
    { name: "OSCP", description: "Offensive Security Certified Professional" },
    { name: "CISM", description: "Certified Information Security Manager" },
    { name: "Security+", description: "CompTIA Security Plus" },
    { name: "GIAC", description: "GIAC Security Certifications" },
  ];

  const specializations = [
    { name: "Cloud Security", icon: Shield, count: 156 },
    { name: "Application Security", icon: Bug, count: 134 },
    { name: "Network Security", icon: Lock, count: 129 },
    { name: "Incident Response", icon: AlertTriangle, count: 98 },
    { name: "Threat Intelligence", icon: Eye, count: 87 },
    { name: "Security Compliance", icon: Target, count: 76 },
  ];

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-red-600 via-primary-600 to-accent-600 py-20 text-white">
        <div className="container">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                <Shield className="h-10 w-10" />
              </div>
            </div>
            <h1 className="mb-6 text-5xl font-bold md:text-6xl">
              Cybersecurity Jobs
            </h1>
            <p className="mb-8 text-xl opacity-95">
              Protect organizations from cyber threats. Connect with top companies hiring security engineers, pen testers, and security architects.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button
                variant="secondary"
                size="lg"
                className="bg-white text-primary-600 hover:bg-primary-50"
                asChild
              >
                <Link href="/jobs?category=cybersecurity">
                  Browse 380+ Security Jobs
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

      {/* Specializations */}
      <div className="py-16">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-secondary-900">
              Security Specializations
            </h2>
            <p className="text-secondary-600">
              Find roles across different security domains
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {specializations.map((spec, idx) => {
              const Icon = spec.icon;
              return (
                <Card key={idx} className="transition-shadow hover:shadow-md cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <div className="mb-3 flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-red-100">
                      <Icon className="h-6 w-6 text-red-600" />
                    </div>
                    <h3 className="mb-2 font-bold text-secondary-900">
                      {spec.name}
                    </h3>
                    <p className="text-sm text-secondary-600">
                      {spec.count} jobs
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top Roles Section */}
      <div className="bg-white py-16">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-secondary-900">
              Top Cybersecurity Roles
            </h2>
            <p className="mx-auto max-w-2xl text-secondary-600">
              Explore the most in-demand security positions
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
              Featured Security Opportunities
            </h2>
            <p className="text-secondary-600">
              Handpicked roles from top security companies
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
              <Link href="/jobs?category=cybersecurity">
                View All 380+ Security Jobs
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Required Skills */}
      <div className="bg-gradient-to-br from-red-50 to-primary-50 py-16">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-secondary-900">
              Most In-Demand Security Skills
            </h2>
            <p className="text-secondary-600">
              Top skills for cybersecurity professionals
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {requiredSkills.map((item, idx) => (
              <Card key={idx} className="text-center">
                <CardContent className="p-4">
                  <div className="mb-2 flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-red-100">
                    <Lock className="h-6 w-6 text-red-600" />
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

      {/* Certifications */}
      <div className="py-16">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-secondary-900">
              Top Security Certifications
            </h2>
            <p className="text-secondary-600">
              Industry-recognized certifications that boost your career
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {certifications.map((cert, idx) => (
              <Card key={idx}>
                <CardContent className="p-6">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success-100">
                      <Award className="h-5 w-5 text-success-600" />
                    </div>
                    <h3 className="font-bold text-secondary-900">{cert.name}</h3>
                  </div>
                  <p className="text-sm text-secondary-600">{cert.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="bg-white py-16">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-secondary-900">
              Why Security Professionals Choose Us
            </h2>
            <p className="text-secondary-600">
              The leading platform for cybersecurity careers
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {whyChooseUs.map((item, idx) => {
              const Icon = item.icon;
              return (
                <Card key={idx}>
                  <CardContent className="p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                      <Icon className="h-6 w-6 text-red-600" />
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
      <div className="py-16">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-secondary-900">
              Top Cybersecurity Companies Hiring
            </h2>
            <p className="text-secondary-600">
              From startups to industry leaders
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-8">
            {companies.map((company, idx) => (
              <div
                key={idx}
                className="flex h-16 w-40 items-center justify-center rounded-lg bg-white px-6 shadow-sm"
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
      <div className="bg-gradient-to-br from-red-600 via-primary-600 to-accent-600 py-16 text-white">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold">
              Start Your Cybersecurity Career Today
            </h2>
            <p className="mb-8 text-xl opacity-95">
              Join 9,800+ verified security professionals protecting the digital world
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
                <Link href="/signup?role=candidate&category=cybersecurity">
                  Sign Up Free
                </Link>
              </Button>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                <span>Background verified</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                <span>Free forever</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                <span>Top security employers</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

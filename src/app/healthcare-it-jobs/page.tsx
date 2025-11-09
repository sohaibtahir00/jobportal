"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Heart,
  TrendingUp,
  DollarSign,
  Briefcase,
  Award,
  CheckCircle2,
  ArrowRight,
  Shield,
  Database,
  Cloud,
  Lock,
  Users,
  Activity,
} from "lucide-react";
import { Card, CardContent, Badge, Button, Input } from "@/components/ui";

export default function HealthcareITJobsPage() {
  const [email, setEmail] = useState("");

  const stats = [
    {
      icon: TrendingUp,
      value: "94%",
      label: "Job Growth Since 2023",
      color: "text-success-600",
    },
    {
      icon: DollarSign,
      value: "$145k",
      label: "Average Base Salary",
      color: "text-accent-600",
    },
    {
      icon: Briefcase,
      value: "320+",
      label: "Open Positions",
      color: "text-primary-600",
    },
    {
      icon: Shield,
      value: "100%",
      label: "HIPAA Compliant",
      color: "text-yellow-600",
    },
  ];

  const topRoles = [
    {
      title: "Healthcare Software Engineer",
      count: 142,
      avgSalary: "$130k - $180k",
      topSkills: ["FHIR", "HL7", "HIPAA"],
    },
    {
      title: "Clinical Systems Analyst",
      count: 87,
      avgSalary: "$110k - $155k",
      topSkills: ["Epic", "Cerner", "SQL"],
    },
    {
      title: "Health Data Engineer",
      count: 91,
      avgSalary: "$140k - $190k",
      topSkills: ["Python", "ETL", "FHIR"],
    },
  ];

  const featuredJobs = [
    {
      title: "Senior Healthcare Platform Engineer",
      company: "HealthTech Solutions",
      location: "Boston, MA (Hybrid)",
      salary: "$150k - $200k",
      type: "Full-time",
      verified: 19,
      tags: ["FHIR", "React", "AWS"],
    },
    {
      title: "Epic Integration Specialist",
      company: "MedicalSys Corp",
      location: "Remote",
      salary: "$125k - $175k",
      type: "Full-time",
      verified: 27,
      tags: ["Epic", "HL7", "Integration"],
    },
    {
      title: "Healthcare Cloud Architect",
      company: "CareTech Inc",
      location: "San Diego, CA",
      salary: "$165k - $220k",
      type: "Full-time",
      verified: 15,
      tags: ["AWS", "HIPAA", "Kubernetes"],
    },
  ];

  const requiredSkills = [
    { skill: "FHIR/HL7", jobs: 245 },
    { skill: "Epic/Cerner", jobs: 198 },
    { skill: "HIPAA Compliance", jobs: 287 },
    { skill: "Healthcare APIs", jobs: 176 },
    { skill: "Python/Java", jobs: 234 },
    { skill: "Cloud (AWS/Azure)", jobs: 201 },
    { skill: "SQL/ETL", jobs: 189 },
    { skill: "Security", jobs: 156 },
  ];

  const whyChooseUs = [
    {
      icon: Shield,
      title: "HIPAA-Verified Roles",
      description: "All healthcare IT positions are vetted for HIPAA compliance and security requirements.",
    },
    {
      icon: Award,
      title: "Healthcare-Specific Assessment",
      description: "Candidates complete specialized tests covering FHIR, HL7, and healthcare data standards.",
    },
    {
      icon: Activity,
      title: "Clinical System Experts",
      description: "Access engineers experienced with Epic, Cerner, and other major EHR platforms.",
    },
    {
      icon: Cloud,
      title: "Modern Health Tech Stack",
      description: "Find roles using cutting-edge cloud, AI, and data technologies in healthcare.",
    },
  ];

  const companies = [
    "Epic Systems", "Cerner", "Optum", "CVS Health", "UnitedHealth Group",
    "Teladoc", "Oscar Health", "Zocdoc", "Flatiron Health", "athenahealth",
  ];

  const certifications = [
    "HIPAA Certified",
    "FHIR Certified",
    "Epic Certified",
    "Cerner Certified",
    "HL7 Certified",
    "HITRUST",
  ];

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-accent-600 via-primary-600 to-accent-700 py-20 text-white">
        <div className="container">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                <Heart className="h-10 w-10" />
              </div>
            </div>
            <h1 className="mb-6 text-5xl font-bold md:text-6xl">
              Healthcare IT Jobs
            </h1>
            <p className="mb-8 text-xl opacity-95">
              Connect with leading healthcare technology companies. All candidates verified for HIPAA compliance and healthcare standards.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button
                variant="secondary"
                size="lg"
                className="bg-white text-primary-600 hover:bg-primary-50"
                asChild
              >
                <Link href="/jobs?category=healthcare-it">
                  Browse 320+ Healthcare IT Jobs
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

      {/* Top Roles Section */}
      <div className="py-16">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-secondary-900">
              Top Healthcare IT Roles
            </h2>
            <p className="mx-auto max-w-2xl text-secondary-600">
              Explore high-demand positions in healthcare technology
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {topRoles.map((role, idx) => (
              <Card key={idx} className="transition-shadow hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="mb-4">
                    <h3 className="mb-2 text-xl font-bold text-secondary-900">
                      {role.title}
                    </h3>
                    <p className="text-sm text-secondary-600">
                      {role.count} open positions
                    </p>
                  </div>
                  <Badge variant="primary" className="mb-4">{role.avgSalary}</Badge>
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
      <div className="bg-white py-16">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-secondary-900">
              Featured Healthcare IT Opportunities
            </h2>
            <p className="text-secondary-600">
              Handpicked roles from top healthcare tech companies
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
              <Link href="/jobs?category=healthcare-it">
                View All 320+ Healthcare IT Jobs
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Required Skills */}
      <div className="py-16">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-secondary-900">
              Most In-Demand Healthcare IT Skills
            </h2>
            <p className="text-secondary-600">
              Top skills for healthcare technology professionals
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {requiredSkills.map((item, idx) => (
              <Card key={idx} className="text-center">
                <CardContent className="p-4">
                  <div className="mb-2 flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-accent-100">
                    <Database className="h-6 w-6 text-accent-600" />
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
      <div className="bg-gradient-to-br from-accent-50 to-primary-50 py-16">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-secondary-900">
              Recognized Certifications
            </h2>
            <p className="text-secondary-600">
              Add these certifications to stand out to healthcare employers
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {certifications.map((cert, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 rounded-lg bg-white px-6 py-3 shadow-sm"
              >
                <Shield className="h-5 w-5 text-success-600" />
                <span className="font-semibold text-secondary-700">{cert}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="py-16">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-secondary-900">
              Why Healthcare IT Professionals Choose Us
            </h2>
            <p className="text-secondary-600">
              The leading platform for healthcare technology careers
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {whyChooseUs.map((item, idx) => {
              const Icon = item.icon;
              return (
                <Card key={idx}>
                  <CardContent className="p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent-100">
                      <Icon className="h-6 w-6 text-accent-600" />
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
              Top Healthcare Companies Hiring
            </h2>
            <p className="text-secondary-600">
              From health systems to health tech innovators
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
      <div className="bg-gradient-to-br from-accent-600 to-primary-600 py-16 text-white">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold">
              Start Your Healthcare IT Career Today
            </h2>
            <p className="mb-8 text-xl opacity-95">
              Join 8,500+ verified healthcare IT professionals transforming healthcare through technology
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
                <Link href="/signup?role=candidate&category=healthcare-it">
                  Sign Up Free
                </Link>
              </Button>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                <span>HIPAA Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                <span>Free forever</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                <span>Verified candidates only</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

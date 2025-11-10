"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  Users,
  Award,
  TrendingUp,
  Shield,
  Clock,
  DollarSign,
  Briefcase,
  Building2,
  MapPin,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button, Badge, Card, CardContent, Input } from "@/components/ui";

interface ClaimJobPageProps {
  params: Promise<{ "job-id": string }>;
}

export default function ClaimJobPage({ params }: ClaimJobPageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [jobData, setJobData] = useState<any>(null);

  // Form state
  const [formData, setFormData] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    roleLevel: "",
    salaryMin: "",
    salaryMax: "",
    startDate: "",
    candidatesNeeded: "5",
  });

  useEffect(() => {
    // Simulate API call to get job data
    const fetchJobData = async () => {
      // Mock data - would come from API
      const mockJob = {
        id: resolvedParams["job-id"],
        title: "Senior Machine Learning Engineer",
        company: "TechCorp AI",
        location: "San Francisco, CA (Remote OK)",
        type: "Full-time",
        postedDate: "2 days ago",
        applicantCount: 23,
        verifiedCount: 18,
        averageScore: 82,
        topCandidates: [
          {
            id: "1",
            name: "Sarah Chen",
            title: "ML Engineer",
            score: 95,
            tier: "ELITE",
            experience: "5 years",
          },
          {
            id: "2",
            name: "Marcus Johnson",
            title: "Senior AI Engineer",
            score: 88,
            tier: "ADVANCED",
            experience: "7 years",
          },
          {
            id: "3",
            name: "Priya Patel",
            title: "ML Platform Engineer",
            score: 85,
            tier: "ADVANCED",
            experience: "4 years",
          },
        ],
      };

      await new Promise((resolve) => setTimeout(resolve, 1000));
      setJobData(mockJob);
      setFormData((prev) => ({ ...prev, companyName: mockJob.company }));
      setIsLoading(false);
    };

    fetchJobData();
  }, [resolvedParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Redirect to success page
    router.push("/claim/success");
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary-50">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary-600" />
          <p className="mt-4 text-secondary-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!jobData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary-50">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-600" />
            <h2 className="mb-2 text-xl font-bold text-secondary-900">
              Job Not Found
            </h2>
            <p className="mb-6 text-secondary-600">
              This job posting could not be found or has been removed.
            </p>
            <Button variant="primary" asChild>
              <Link href="/jobs">Browse All Jobs</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50 py-12">
      <div className="container">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <Badge variant="success" className="mb-4">
              Good News!
            </Badge>
            <h1 className="mb-4 text-4xl font-bold text-secondary-900">
              Unlock {jobData.applicantCount} Qualified Candidates
            </h1>
            <p className="text-xl text-secondary-600">
              Your job posting for {jobData.title} is already attracting skilled
              candidates on our platform
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Left Column - Job Info & Candidates */}
            <div className="lg:col-span-2 space-y-6">
              {/* Job Details */}
              <Card>
                <CardContent className="p-6">
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <h2 className="mb-2 text-2xl font-bold text-secondary-900">
                        {jobData.title}
                      </h2>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-secondary-600">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4" />
                          <span>{jobData.company}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>{jobData.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Briefcase className="h-4 w-4" />
                          <span>{jobData.type}</span>
                        </div>
                      </div>
                    </div>
                    <Badge variant="secondary">{jobData.postedDate}</Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="rounded-lg bg-primary-50 p-4 text-center">
                      <Users className="mx-auto mb-2 h-6 w-6 text-primary-600" />
                      <p className="text-2xl font-bold text-primary-600">
                        {jobData.applicantCount}
                      </p>
                      <p className="text-sm text-secondary-600">Total Applicants</p>
                    </div>
                    <div className="rounded-lg bg-success-50 p-4 text-center">
                      <Shield className="mx-auto mb-2 h-6 w-6 text-success-600" />
                      <p className="text-2xl font-bold text-success-600">
                        {jobData.verifiedCount}
                      </p>
                      <p className="text-sm text-secondary-600">Skills Verified</p>
                    </div>
                    <div className="rounded-lg bg-accent-50 p-4 text-center">
                      <Award className="mx-auto mb-2 h-6 w-6 text-accent-600" />
                      <p className="text-2xl font-bold text-accent-600">
                        {jobData.averageScore}
                      </p>
                      <p className="text-sm text-secondary-600">Avg. Score</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Top 3 Candidates Preview */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="mb-4 text-xl font-bold text-secondary-900">
                    Top 3 Candidates Preview
                  </h3>
                  <p className="mb-6 text-sm text-secondary-600">
                    These are just 3 of your {jobData.verifiedCount} skills-verified
                    applicants. Claim this job to see full profiles and contact
                    details.
                  </p>

                  <div className="space-y-4">
                    {jobData.topCandidates.map((candidate: any, idx: number) => (
                      <div
                        key={candidate.id}
                        className="flex items-center gap-4 rounded-lg border-2 border-primary-200 bg-white p-4"
                      >
                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 font-bold text-primary-600">
                          #{idx + 1}
                        </div>
                        <div className="flex-1">
                          <div className="mb-1 flex items-center gap-2">
                            <p className="font-bold text-secondary-900">
                              {candidate.name}
                            </p>
                            <Badge variant="success" size="sm">
                              {candidate.tier}
                            </Badge>
                          </div>
                          <p className="text-sm text-secondary-600">
                            {candidate.title} • {candidate.experience} experience
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary-600">
                            {candidate.score}
                          </p>
                          <p className="text-xs text-secondary-600">Skills Score</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 rounded-lg bg-yellow-50 p-4">
                    <div className="flex items-start gap-3">
                      <Shield className="mt-0.5 h-5 w-5 flex-shrink-0 text-yellow-600" />
                      <div className="text-sm text-yellow-800">
                        <p className="font-semibold">All candidates are verified</p>
                        <p className="mt-1">
                          Each has completed our comprehensive skills assessment with
                          proctoring. You're seeing real, validated talent.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* How It Works */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="mb-4 text-xl font-bold text-secondary-900">
                    How It Works
                  </h3>

                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary-600 text-sm font-bold text-white">
                        1
                      </div>
                      <div>
                        <p className="font-semibold text-secondary-900">
                          Complete the claim form
                        </p>
                        <p className="text-sm text-secondary-600">
                          Takes just 2 minutes to verify details
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary-600 text-sm font-bold text-white">
                        2
                      </div>
                      <div>
                        <p className="font-semibold text-secondary-900">
                          Review candidate profiles
                        </p>
                        <p className="text-sm text-secondary-600">
                          Full access to Skills Score Cards and contact info
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary-600 text-sm font-bold text-white">
                        3
                      </div>
                      <div>
                        <p className="font-semibold text-secondary-900">
                          We'll call you within 24 hours
                        </p>
                        <p className="text-sm text-secondary-600">
                          Personal introduction to your top candidates
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary-600 text-sm font-bold text-white">
                        4
                      </div>
                      <div>
                        <p className="font-semibold text-secondary-900">
                          Interview and hire
                        </p>
                        <p className="text-sm text-secondary-600">
                          Only pay when you make a successful hire
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Claim Form */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <Card className="border-2 border-primary-200">
                  <CardContent className="p-6">
                    <h3 className="mb-4 text-xl font-bold text-secondary-900">
                      Claim This Job
                    </h3>
                    <p className="mb-6 text-sm text-secondary-600">
                      Fill out the form below to unlock full access to all{" "}
                      {jobData.applicantCount} applicants
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label htmlFor="companyName" className="mb-2 block text-sm font-medium text-secondary-700">
                          Company Name
                        </label>
                        <Input
                          id="companyName"
                          value={formData.companyName}
                          onChange={(e) =>
                            setFormData({ ...formData, companyName: e.target.value })
                          }
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="contactName" className="mb-2 block text-sm font-medium text-secondary-700">
                          Your Name
                        </label>
                        <Input
                          id="contactName"
                          value={formData.contactName}
                          onChange={(e) =>
                            setFormData({ ...formData, contactName: e.target.value })
                          }
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="email" className="mb-2 block text-sm font-medium text-secondary-700">
                          Email
                        </label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="phone" className="mb-2 block text-sm font-medium text-secondary-700">
                          Phone
                        </label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="roleLevel" className="mb-2 block text-sm font-medium text-secondary-700">
                          Role Level
                        </label>
                        <select
                          id="roleLevel"
                          className="w-full rounded-lg border-2 border-secondary-200 p-2 focus:border-primary-600 focus:outline-none"
                          value={formData.roleLevel}
                          onChange={(e) =>
                            setFormData({ ...formData, roleLevel: e.target.value })
                          }
                          required
                        >
                          <option value="">Select level</option>
                          <option value="ENTRY">Entry Level</option>
                          <option value="MID">Mid Level</option>
                          <option value="SENIOR">Senior</option>
                          <option value="LEAD">Lead/Principal</option>
                          <option value="EXECUTIVE">Executive</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label htmlFor="salaryMin" className="mb-2 block text-sm font-medium text-secondary-700">
                            Min Salary ($k)
                          </label>
                          <Input
                            id="salaryMin"
                            type="number"
                            placeholder="100"
                            value={formData.salaryMin}
                            onChange={(e) =>
                              setFormData({ ...formData, salaryMin: e.target.value })
                            }
                          />
                        </div>
                        <div>
                          <label htmlFor="salaryMax" className="mb-2 block text-sm font-medium text-secondary-700">
                            Max Salary ($k)
                          </label>
                          <Input
                            id="salaryMax"
                            type="number"
                            placeholder="150"
                            value={formData.salaryMax}
                            onChange={(e) =>
                              setFormData({ ...formData, salaryMax: e.target.value })
                            }
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="startDate" className="mb-2 block text-sm font-medium text-secondary-700">
                          Start Date Needed
                        </label>
                        <Input
                          id="startDate"
                          type="date"
                          value={formData.startDate}
                          onChange={(e) =>
                            setFormData({ ...formData, startDate: e.target.value })
                          }
                        />
                      </div>

                      <div>
                        <label htmlFor="candidatesNeeded" className="mb-2 block text-sm font-medium text-secondary-700">
                          Candidates to Interview
                        </label>
                        <select
                          id="candidatesNeeded"
                          className="w-full rounded-lg border-2 border-secondary-200 p-2 focus:border-primary-600 focus:outline-none"
                          value={formData.candidatesNeeded}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              candidatesNeeded: e.target.value,
                            })
                          }
                        >
                          <option value="3">3 candidates</option>
                          <option value="5">5 candidates</option>
                          <option value="10">10 candidates</option>
                          <option value="15">15+ candidates</option>
                        </select>
                      </div>

                      <div className="rounded-lg bg-primary-50 p-4">
                        <div className="mb-2 flex items-center gap-2">
                          <DollarSign className="h-5 w-5 text-primary-600" />
                          <p className="font-semibold text-primary-900">Pricing</p>
                        </div>
                        <p className="text-sm text-primary-800">
                          <strong>15-20% of first-year salary</strong>
                          <br />
                          Only paid after successful hire
                          <br />
                          90-day replacement guarantee
                        </p>
                      </div>

                      <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        className="w-full"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Claiming...
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="mr-2 h-5 w-5" />
                            Claim Job & View Candidates
                          </>
                        )}
                      </Button>

                      <p className="text-center text-xs text-secondary-600">
                        By claiming, you agree to our Terms of Service
                      </p>
                    </form>
                  </CardContent>
                </Card>

                {/* Trust Badges */}
                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-3 text-sm text-secondary-600">
                    <CheckCircle2 className="h-5 w-5 text-success-600" />
                    <span>No upfront costs or subscription fees</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-secondary-600">
                    <CheckCircle2 className="h-5 w-5 text-success-600" />
                    <span>Only pay when you make a hire</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-secondary-600">
                    <CheckCircle2 className="h-5 w-5 text-success-600" />
                    <span>90-day replacement guarantee</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-secondary-600">
                    <CheckCircle2 className="h-5 w-5 text-success-600" />
                    <span>Cancel anytime, no obligations</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

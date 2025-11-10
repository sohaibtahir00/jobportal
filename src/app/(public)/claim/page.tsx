"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  CheckCircle2,
  Users,
  Calendar,
  Handshake,
  DollarSign,
  Shield,
  Clock,
  TrendingUp,
  Building2,
  Phone,
  Mail,
  Briefcase,
  ChevronDown,
} from "lucide-react";
import { Button, Input, Badge, Card, CardContent, useToast } from "@/components/ui";

const claimFormSchema = z.object({
  companyName: z.string().min(2, "Company name is required"),
  contactName: z.string().min(2, "Your name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  jobTitle: z.string().min(2, "Job title is required"),
  roleLevel: z.string().min(1, "Please select a role level"),
  salaryRange: z.string().min(1, "Please select a salary range"),
  urgency: z.string().min(1, "Please select urgency"),
});

type ClaimFormData = z.infer<typeof claimFormSchema>;

function ClaimPageContent() {
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [candidateCount] = useState(8); // Mock count, would come from API

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ClaimFormData>({
    resolver: zodResolver(claimFormSchema),
  });

  // Pre-fill from URL params
  useEffect(() => {
    const company = searchParams.get("company");
    const jobTitle = searchParams.get("job");

    if (company) setValue("companyName", company);
    if (jobTitle) setValue("jobTitle", jobTitle);
  }, [searchParams, setValue]);

  const onSubmit = async (data: ClaimFormData) => {
    setIsSubmitting(true);

    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setIsSuccess(true);
      showToast(
        "success",
        "Claim submitted!",
        "Our team will contact you within 24 hours to show you qualified candidates."
      );
    } catch (error) {
      showToast(
        "error",
        "Submission failed",
        "There was a problem submitting your claim. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const processSteps = [
    {
      number: 1,
      title: "Review candidate profiles",
      description: `See ${candidateCount} qualified candidates with Skills Score Cards`,
      icon: Users,
    },
    {
      number: 2,
      title: "Request introductions",
      description: "Select your top candidates for interview",
      icon: Handshake,
    },
    {
      number: 3,
      title: "We facilitate interviews",
      description: "We coordinate scheduling and logistics",
      icon: Calendar,
    },
    {
      number: 4,
      title: "Hire your top choice",
      description: "Make an offer to your selected candidate",
      icon: Briefcase,
    },
    {
      number: 5,
      title: "Pay success fee after they start",
      description: "15-20% fee, only when you successfully hire",
      icon: DollarSign,
    },
  ];

  const pricingTiers = [
    {
      range: "Junior/Mid roles",
      salary: "$60k-$130k",
      fee: "15% fee",
      color: "primary",
    },
    {
      range: "Senior roles",
      salary: "$130k-$170k",
      fee: "18% fee",
      color: "accent",
    },
    {
      range: "Lead/Staff roles",
      salary: "$170k+",
      fee: "20% fee",
      color: "success",
    },
  ];

  const faqs = [
    {
      question: "How much does this cost?",
      answer:
        "We only charge a success fee when you hire. No upfront costs, no retainers, no subscription fees. You only pay when we deliver results.",
    },
    {
      question: "When do I pay?",
      answer:
        "Payment is split: 50% when the candidate accepts your offer and starts, and 50% after they've been with you for 30 days.",
    },
    {
      question: "What if the candidate doesn't work out?",
      answer:
        "We offer a 90-day replacement guarantee. If the hire doesn't work out within 90 days, we'll find you a replacement at no additional cost.",
    },
    {
      question: "How many candidates will I see?",
      answer:
        "You'll typically see 5-10 highly qualified, skills-verified candidates who match your role requirements. Quality over quantity is our approach.",
    },
    {
      question: "How are candidates verified?",
      answer:
        "All candidates complete our 60-minute proctored skills assessment covering technical skills, practical coding, and system design. You'll see their full Score Cards.",
    },
  ];

  const companyLogos = ["🚀", "💼", "🏢", "🎯", "⚡", "🔥"];

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-secondary-50 py-20">
        <div className="container">
          <div className="mx-auto max-w-2xl">
            <Card className="border-2 border-success-200">
              <CardContent className="p-12 text-center">
                <div className="mb-6 flex justify-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success-100">
                    <CheckCircle2 className="h-12 w-12 text-success-600" />
                  </div>
                </div>
                <h1 className="mb-4 text-3xl font-bold text-secondary-900">
                  Claim Submitted Successfully!
                </h1>
                <p className="mb-8 text-lg text-secondary-600">
                  Thank you for claiming your job posting. Our team will contact you
                  within 24 hours to show you qualified candidates.
                </p>

                <div className="rounded-lg bg-secondary-50 p-6 text-left">
                  <h3 className="mb-4 font-bold text-secondary-900">
                    What happens next:
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-success-600" />
                      <p className="text-sm text-secondary-700">
                        Our team will call you within 24 hours
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-success-600" />
                      <p className="text-sm text-secondary-700">
                        We'll show you the top 3-5 candidates immediately
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-success-600" />
                      <p className="text-sm text-secondary-700">
                        You'll see their Skills Score Cards and full profiles
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-success-600" />
                      <p className="text-sm text-secondary-700">
                        We'll explain our simple success fee agreement
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 py-16 text-white">
        <div className="container">
          <div className="mx-auto max-w-4xl text-center">
            <Badge variant="secondary" className="mb-4">
              🎉 Job Claim Opportunity
            </Badge>
            <h1 className="mb-6 text-4xl font-bold md:text-5xl">
              Unlock {candidateCount} Qualified Candidates for Your Role
            </h1>
            <p className="mb-8 text-xl text-primary-100">
              Good news! Your job posting has attracted skilled candidates on our
              platform. Here's what happens next:
            </p>
          </div>
        </div>
      </section>

      {/* The Process */}
      <section className="py-16">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-secondary-900">
              How It Works
            </h2>
            <p className="text-lg text-secondary-600">
              Five simple steps from claim to hire
            </p>
          </div>

          <div className="mx-auto max-w-4xl">
            <div className="space-y-4">
              {processSteps.map((step) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.number}
                    className="flex gap-6 rounded-lg border-2 border-primary-200 bg-white p-6 transition-all hover:shadow-lg"
                  >
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-primary-600 text-xl font-bold text-white">
                      {step.number}
                    </div>
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-3">
                        <Icon className="h-6 w-6 text-primary-600" />
                        <h3 className="text-lg font-bold text-secondary-900">
                          {step.title}
                        </h3>
                      </div>
                      <p className="text-secondary-600">{step.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Value Proposition Box */}
          <div className="mx-auto mt-12 max-w-3xl">
            <div className="rounded-xl border-4 border-success-200 bg-gradient-to-br from-success-50 to-success-100 p-8 text-center shadow-lg">
              <Shield className="mx-auto mb-4 h-12 w-12 text-success-600" />
              <h3 className="mb-2 text-2xl font-bold text-secondary-900">
                No risk. No upfront cost.
              </h3>
              <p className="text-xl font-semibold text-success-700">
                You only pay when you hire.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Claim Form */}
      <section className="bg-white py-16">
        <div className="container">
          <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-3">
            {/* Left: Form */}
            <div className="lg:col-span-2">
              <div className="mb-8">
                <Badge variant="primary" className="mb-4">
                  Complete Your Claim
                </Badge>
                <h2 className="mb-2 text-3xl font-bold text-secondary-900">
                  Claim Your Job & View Candidates
                </h2>
                <p className="text-secondary-600">Takes only 2 minutes</p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Company Name */}
                  <Input
                    label="Company Name"
                    placeholder="TechCorp Inc."
                    error={errors.companyName?.message}
                    required
                    {...register("companyName")}
                  />

                  {/* Contact Name */}
                  <Input
                    label="Your Name"
                    placeholder="John Smith"
                    error={errors.contactName?.message}
                    required
                    {...register("contactName")}
                  />

                  {/* Email */}
                  <Input
                    label="Your Email"
                    type="email"
                    placeholder="john@techcorp.com"
                    error={errors.email?.message}
                    required
                    {...register("email")}
                  />

                  {/* Phone */}
                  <Input
                    label="Phone Number"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    error={errors.phone?.message}
                    required
                    {...register("phone")}
                  />
                </div>

                {/* Job Title */}
                <Input
                  label="Job Title"
                  placeholder="Senior Machine Learning Engineer"
                  error={errors.jobTitle?.message}
                  required
                  {...register("jobTitle")}
                />

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  {/* Role Level */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-secondary-700">
                      Role Level
                      <span className="ml-1 text-danger-600">*</span>
                    </label>
                    <select
                      {...register("roleLevel")}
                      className="w-full rounded-lg border border-secondary-300 bg-white px-4 py-2.5 text-secondary-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">Select level</option>
                      <option value="Junior">Junior</option>
                      <option value="Mid">Mid</option>
                      <option value="Senior">Senior</option>
                      <option value="Lead">Lead</option>
                    </select>
                    {errors.roleLevel && (
                      <p className="mt-1 text-sm text-danger-600">
                        {errors.roleLevel.message}
                      </p>
                    )}
                  </div>

                  {/* Salary Range */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-secondary-700">
                      Salary Range
                      <span className="ml-1 text-danger-600">*</span>
                    </label>
                    <select
                      {...register("salaryRange")}
                      className="w-full rounded-lg border border-secondary-300 bg-white px-4 py-2.5 text-secondary-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">Select range</option>
                      <option value="<$100k">&lt;$100k</option>
                      <option value="$100-130k">$100-130k</option>
                      <option value="$130-170k">$130-170k</option>
                      <option value="$170k+">$170k+</option>
                    </select>
                    {errors.salaryRange && (
                      <p className="mt-1 text-sm text-danger-600">
                        {errors.salaryRange.message}
                      </p>
                    )}
                  </div>

                  {/* Urgency */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-secondary-700">
                      When do you need to fill this?
                      <span className="ml-1 text-danger-600">*</span>
                    </label>
                    <select
                      {...register("urgency")}
                      className="w-full rounded-lg border border-secondary-300 bg-white px-4 py-2.5 text-secondary-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">Select urgency</option>
                      <option value="ASAP">ASAP</option>
                      <option value="1 month">1 month</option>
                      <option value="2-3 months">2-3 months</option>
                    </select>
                    {errors.urgency && (
                      <p className="mt-1 text-sm text-danger-600">
                        {errors.urgency.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  loading={isSubmitting}
                  loadingText="Submitting claim..."
                >
                  Claim Job & View Candidates
                </Button>
              </form>

              {/* What Happens Next */}
              <div className="mt-8 rounded-lg border-2 border-primary-200 bg-primary-50 p-6">
                <h3 className="mb-4 font-bold text-secondary-900">
                  What happens after you submit:
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-success-600" />
                    <p className="text-sm text-secondary-700">
                      Our team will call you within 24 hours
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-success-600" />
                    <p className="text-sm text-secondary-700">
                      We'll show you the top 3-5 candidates immediately
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-success-600" />
                    <p className="text-sm text-secondary-700">
                      You'll see their Skills Score Cards and full profiles
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-success-600" />
                    <p className="text-sm text-secondary-700">
                      We'll explain our simple success fee agreement
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Pricing */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <Card className="border-2 border-accent-200">
                  <CardContent className="p-6">
                    <div className="mb-6">
                      <Badge variant="primary" className="mb-3">
                        Transparent Pricing
                      </Badge>
                      <h3 className="mb-2 text-xl font-bold text-secondary-900">
                        Our Pricing
                      </h3>
                      <p className="text-sm text-secondary-600">
                        Simple, transparent success fees
                      </p>
                    </div>

                    <div className="space-y-4">
                      {pricingTiers.map((tier, index) => (
                        <div
                          key={index}
                          className="rounded-lg border-2 border-secondary-200 bg-secondary-50 p-4"
                        >
                          <p className="mb-1 font-bold text-secondary-900">
                            {tier.range}
                          </p>
                          <p className="mb-2 text-sm text-secondary-600">
                            {tier.salary}
                          </p>
                          <Badge variant="primary" size="sm">
                            {tier.fee}
                          </Badge>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 rounded-lg bg-success-50 p-4">
                      <div className="mb-2 flex items-center gap-2">
                        <Shield className="h-5 w-5 text-success-600" />
                        <p className="font-bold text-success-900">
                          90-day replacement guarantee
                        </p>
                      </div>
                      <p className="text-sm text-success-700">
                        If the hire doesn't work out, we'll find a replacement at no
                        additional cost.
                      </p>
                    </div>

                    <div className="mt-6 space-y-3 border-t border-secondary-200 pt-6">
                      <div className="flex items-center gap-3 text-sm">
                        <Clock className="h-5 w-5 text-primary-600" />
                        <p className="text-secondary-700">
                          Payment split: 50% on hire, 50% after 30 days
                        </p>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <TrendingUp className="h-5 w-5 text-success-600" />
                        <p className="text-secondary-700">
                          Average time to hire: 2-3 weeks
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="bg-secondary-50 py-16">
        <div className="container">
          <div className="mx-auto max-w-4xl text-center">
            <p className="mb-6 text-sm font-medium uppercase tracking-wide text-secondary-600">
              Trusted by leading companies
            </p>
            <div className="mb-8 flex flex-wrap items-center justify-center gap-8">
              {companyLogos.map((logo, index) => (
                <div
                  key={index}
                  className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-3xl shadow-md"
                >
                  {logo}
                </div>
              ))}
            </div>
            <p className="text-lg font-semibold text-secondary-900">
              Join 200+ companies who have hired through us
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-white py-16">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-secondary-900">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-secondary-600">
                Everything you need to know about our process
              </p>
            </div>

            <div className="space-y-4">
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
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-to-br from-primary-600 to-accent-600 py-16 text-white">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold">
              Ready to See Your Qualified Candidates?
            </h2>
            <p className="mb-8 text-xl text-primary-100">
              Complete your claim in 2 minutes and we'll contact you within 24 hours
            </p>
            <Button
              variant="secondary"
              size="lg"
              className="bg-white text-primary-600 hover:bg-primary-50"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              Claim Job Now
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function ClaimPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-secondary-50" />}>
      <ClaimPageContent />
    </Suspense>
  );
}

import Link from "next/link";
import {
  CheckCircle2,
  X,
  TrendingUp,
  Users,
  Shield,
  Zap,
  Award,
  ArrowRight,
  Phone,
  Mail,
} from "lucide-react";
import { Button, Badge, Card, CardContent } from "@/components/ui";

export default function PricingPage() {
  const pricingTiers = [
    {
      name: "Standard",
      percentage: "15%",
      description: "Best for most companies",
      bestFor: "Roles under $150k salary",
      features: [
        "Access to all qualified candidates",
        "Skills Score Cards included",
        "Email & phone support",
        "Standard candidate matching",
        "90-day replacement guarantee",
        "Pay only on successful hire",
      ],
      notIncluded: [
        "Priority candidate access",
        "Dedicated account manager",
        "Custom assessment questions",
      ],
      popular: true,
    },
    {
      name: "Premium",
      percentage: "18%",
      description: "For senior and specialized roles",
      bestFor: "Roles $150k-$250k salary",
      features: [
        "Everything in Standard, plus:",
        "Priority candidate access",
        "Dedicated account manager",
        "Custom assessment questions",
        "Advanced filtering & search",
        "Expedited candidate review",
        "Interview scheduling support",
        "Salary negotiation assistance",
      ],
      notIncluded: [],
      popular: false,
    },
    {
      name: "Executive",
      percentage: "20%",
      description: "White-glove service for leadership",
      bestFor: "Roles $250k+ or C-level",
      features: [
        "Everything in Premium, plus:",
        "Executive search team assigned",
        "Passive candidate outreach",
        "Market intelligence reports",
        "Unlimited interview support",
        "Reference check coordination",
        "Offer negotiation support",
        "Onboarding consultation",
        "6-month replacement guarantee",
      ],
      notIncluded: [],
      popular: false,
    },
  ];

  const whatsIncluded = [
    {
      icon: Users,
      title: "Pre-Vetted Candidates",
      description: "All candidates complete comprehensive skills assessments",
    },
    {
      icon: Shield,
      title: "Verified Skills",
      description: "Proctored testing ensures authentic capabilities",
    },
    {
      icon: Award,
      title: "Quality Guarantee",
      description: "90-day replacement if hire doesn't work out",
    },
    {
      icon: Zap,
      title: "Fast Turnaround",
      description: "Most positions filled within 30 days",
    },
  ];

  const faqs = [
    {
      question: "When do I pay?",
      answer:
        "You only pay after your chosen candidate accepts your offer and starts work. No upfront fees, no subscription costs.",
    },
    {
      question: "What if the hire doesn't work out?",
      answer:
        "Our 90-day replacement guarantee means if your hire leaves or is terminated within 90 days, we'll find you a replacement at no additional cost.",
    },
    {
      question: "How is the fee calculated?",
      answer:
        "The fee is based on the candidate's first-year base salary. For example, a $100k role at 15% would be a $15,000 fee, paid only after the hire starts.",
    },
    {
      question: "Are there any hidden costs?",
      answer:
        "No. The percentage fee is all-inclusive. There are no setup fees, subscription costs, or additional charges.",
    },
    {
      question: "Can I negotiate the rate?",
      answer:
        "For high-volume hiring (5+ roles per year) or long-term partnerships, we offer customized pricing. Contact our sales team to discuss.",
    },
  ];

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-600 to-accent-600 py-20 text-white">
        <div className="container">
          <div className="mx-auto max-w-4xl text-center">
            <Badge variant="secondary" className="mb-4">
              Simple, Transparent Pricing
            </Badge>
            <h1 className="mb-6 text-4xl font-bold md:text-5xl lg:text-6xl">
              Only Pay When You Hire
            </h1>
            <p className="mb-8 text-xl text-primary-100">
              No upfront costs. No subscriptions. Just a success fee when you find
              your perfect candidate.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="py-20">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-secondary-900 md:text-4xl">
              Success-Based Pricing
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-secondary-600">
              Choose the tier that matches your hiring needs. All tiers include our
              core features.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {pricingTiers.map((tier, idx) => (
              <Card
                key={idx}
                className={`relative ${
                  tier.popular
                    ? "border-4 border-primary-600 shadow-xl lg:-mt-4 lg:mb-0"
                    : "border-2 border-secondary-200"
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge variant="primary" size="lg">
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardContent className="p-8">
                  <div className="mb-6 text-center">
                    <h3 className="mb-2 text-2xl font-bold text-secondary-900">
                      {tier.name}
                    </h3>
                    <p className="mb-4 text-sm text-secondary-600">
                      {tier.description}
                    </p>
                    <div className="mb-2">
                      <span className="text-5xl font-bold text-primary-600">
                        {tier.percentage}
                      </span>
                    </div>
                    <p className="text-sm text-secondary-600">
                      of first-year salary
                    </p>
                    <div className="mt-4 rounded-lg bg-secondary-50 p-3">
                      <p className="text-sm font-medium text-secondary-700">
                        {tier.bestFor}
                      </p>
                    </div>
                  </div>

                  <div className="mb-6 space-y-3">
                    {tier.features.map((feature, featureIdx) => (
                      <div key={featureIdx} className="flex items-start gap-3">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-success-600" />
                        <span className="text-sm text-secondary-700">
                          {feature}
                        </span>
                      </div>
                    ))}
                    {tier.notIncluded.map((feature, featureIdx) => (
                      <div key={featureIdx} className="flex items-start gap-3">
                        <X className="mt-0.5 h-5 w-5 flex-shrink-0 text-secondary-400" />
                        <span className="text-sm text-secondary-400">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Button
                    variant={tier.popular ? "primary" : "outline"}
                    size="lg"
                    className="w-full"
                    asChild
                  >
                    <Link href="/contact">
                      Get Started
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-secondary-600">
              Looking for volume pricing or custom solutions?{" "}
              <Link
                href="/contact"
                className="font-semibold text-primary-600 hover:underline"
              >
                Contact our sales team
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="bg-white py-20">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-secondary-900 md:text-4xl">
              What's Included
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-secondary-600">
              Every tier includes our core features that make hiring easier
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {whatsIncluded.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
                    <Icon className="h-8 w-8 text-primary-600" />
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-secondary-900">
                    {item.title}
                  </h3>
                  <p className="text-sm text-secondary-600">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Example */}
      <section className="py-20">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            <Card className="border-2 border-primary-200">
              <CardContent className="p-8">
                <h3 className="mb-6 text-2xl font-bold text-secondary-900">
                  Pricing Example
                </h3>

                <div className="space-y-6">
                  <div className="rounded-lg bg-primary-50 p-6">
                    <p className="mb-2 text-sm font-medium text-primary-900">
                      Scenario:
                    </p>
                    <p className="text-secondary-700">
                      You hire a Senior Software Engineer at <strong>$140,000</strong>{" "}
                      base salary using our Standard tier
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between border-b border-secondary-200 pb-3">
                      <span className="text-secondary-700">Base Salary</span>
                      <span className="font-semibold text-secondary-900">
                        $140,000
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-secondary-200 pb-3">
                      <span className="text-secondary-700">Fee Rate (Standard)</span>
                      <span className="font-semibold text-secondary-900">15%</span>
                    </div>
                    <div className="flex justify-between pt-3">
                      <span className="text-lg font-bold text-secondary-900">
                        Total Fee
                      </span>
                      <span className="text-2xl font-bold text-primary-600">
                        $21,000
                      </span>
                    </div>
                  </div>

                  <div className="rounded-lg bg-success-50 p-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-success-600" />
                      <div className="text-sm text-success-800">
                        <p className="font-semibold">Payment Terms:</p>
                        <p className="mt-1">
                          Fee due 30 days after candidate's start date. 90-day
                          replacement guarantee included.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="bg-white py-20">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-secondary-900 md:text-4xl">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="mx-auto max-w-3xl space-y-4">
            {faqs.map((faq, idx) => (
              <Card key={idx}>
                <CardContent className="p-6">
                  <h3 className="mb-2 font-bold text-secondary-900">
                    {faq.question}
                  </h3>
                  <p className="text-secondary-600">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="mb-4 text-secondary-600">
              Have more questions about pricing?
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button variant="outline" size="lg" asChild>
                <Link href="/contact">
                  <Mail className="mr-2 h-5 w-5" />
                  Email Us
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="tel:+15551234567">
                  <Phone className="mr-2 h-5 w-5" />
                  Call (555) 123-4567
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-primary-600 to-accent-600 py-20 text-white">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Ready to Start Hiring?
            </h2>
            <p className="mb-8 text-xl text-primary-100">
              Post your first job for free and only pay when you find the perfect
              candidate
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button
                variant="secondary"
                size="lg"
                className="bg-white text-primary-600 hover:bg-primary-50"
                asChild
              >
                <Link href="/signup">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white/10"
                asChild
              >
                <Link href="/how-it-works">Learn How It Works</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

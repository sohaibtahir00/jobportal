"use client";

import { useState } from "react";
import { ChevronDown, Search, Users, Briefcase } from "lucide-react";
import { Card, CardContent, Input, Badge } from "@/components/ui";

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);

  const categories = [
    { id: "all", label: "All Questions", icon: null },
    { id: "candidate", label: "For Candidates", icon: Users },
    { id: "employer", label: "For Employers", icon: Briefcase },
  ];

  const faqs = [
    {
      category: "candidate",
      question: "How do I create an account?",
      answer:
        'Click "Sign Up" in the top right, choose "Candidate", and fill in your details. You can start applying to jobs immediately.',
    },
    {
      category: "candidate",
      question: "Do I need to take the skills assessment?",
      answer:
        "The skills assessment is optional but highly recommended. Verified candidates get priority review, access to 250+ exclusive jobs, and earn 18% more on average.",
    },
    {
      category: "candidate",
      question: "How long does the assessment take?",
      answer:
        "The comprehensive assessment takes 60 minutes total, split across 3 sections: Technical Skills (20 min), Practical Coding (25 min), and System Design (15 min).",
    },
    {
      category: "candidate",
      question: "Can I retake the skills assessment?",
      answer:
        "Yes, you can retake the assessment after 30 days if you want to improve your score.",
    },
    {
      category: "candidate",
      question: "Is the platform free for candidates?",
      answer:
        "Yes! The platform is completely free for job seekers. We charge employers when they make a hire, not you.",
    },
    {
      category: "employer",
      question: "How much does it cost?",
      answer:
        "We charge 15-20% of the hired candidate's first-year salary, paid only after they start. No upfront costs or subscriptions.",
    },
    {
      category: "employer",
      question: "What is the replacement guarantee?",
      answer:
        "If your hire leaves or is terminated within 90 days, we'll find you a replacement at no additional cost.",
    },
    {
      category: "employer",
      question: "How do Skills Score Cards work?",
      answer:
        "Each candidate completes a proctored assessment covering technical skills, coding, and system design. Their score (0-100) and performance tier (Elite, Advanced, etc.) are displayed on their profile.",
    },
    {
      category: "employer",
      question: "Can I post jobs for free?",
      answer:
        "Yes, you can post jobs and receive applications at no cost. You only pay our success fee when you successfully hire a candidate.",
    },
    {
      category: "employer",
      question: "How long does it take to fill a role?",
      answer:
        "Most positions are filled within 30 days. Executive and highly specialized roles may take 45-60 days.",
    },
    {
      category: "employer",
      question: "What if I don't find anyone?",
      answer:
        "There's no cost if you don't hire. You're free to cancel at any time with no obligations or fees.",
    },
  ];

  const filteredFAQs = faqs.filter((faq) => {
    const matchesCategory =
      activeCategory === "all" || faq.category === activeCategory;
    const matchesSearch =
      searchQuery === "" ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-secondary-50 py-12">
      <div className="container">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-bold text-secondary-900 md:text-5xl">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-secondary-600">
              Find answers to common questions about our platform
            </p>
          </div>

          {/* Search */}
          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-secondary-400" />
              <Input
                type="text"
                placeholder="Search for answers..."
                className="pl-12"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Category Filters */}
          <div className="mb-8 flex flex-wrap gap-3">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                    activeCategory === category.id
                      ? "bg-primary-600 text-white"
                      : "bg-white text-secondary-700 hover:bg-secondary-100"
                  }`}
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  {category.label}
                </button>
              );
            })}
          </div>

          {/* FAQ List */}
          <div className="space-y-3">
            {filteredFAQs.map((faq, idx) => {
              const isOpen = openQuestion === `${faq.category}-${idx}`;
              return (
                <Card key={idx}>
                  <CardContent className="p-0">
                    <button
                      onClick={() =>
                        setOpenQuestion(
                          isOpen ? null : `${faq.category}-${idx}`
                        )
                      }
                      className="flex w-full items-start justify-between p-6 text-left"
                    >
                      <div className="flex-1">
                        <div className="mb-2 flex items-center gap-2">
                          <Badge
                            variant={
                              faq.category === "candidate"
                                ? "primary"
                                : "secondary"
                            }
                            size="sm"
                          >
                            {faq.category === "candidate"
                              ? "Candidate"
                              : "Employer"}
                          </Badge>
                        </div>
                        <h3 className="font-bold text-secondary-900">
                          {faq.question}
                        </h3>
                      </div>
                      <ChevronDown
                        className={`h-5 w-5 flex-shrink-0 text-secondary-400 transition-transform ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="border-t border-secondary-200 px-6 pb-6 pt-4">
                        <p className="text-secondary-700">{faq.answer}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredFAQs.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-secondary-600">
                No questions found. Try a different search or category.
              </p>
            </div>
          )}

          {/* Still have questions */}
          <Card className="mt-12 bg-gradient-to-br from-primary-50 to-accent-50">
            <CardContent className="p-8 text-center">
              <h3 className="mb-2 text-xl font-bold text-secondary-900">
                Still have questions?
              </h3>
              <p className="mb-6 text-secondary-600">
                Can't find what you're looking for? Get in touch with our team.
              </p>
              <a
                href="/contact"
                className="inline-flex items-center rounded-lg bg-primary-600 px-6 py-3 font-semibold text-white hover:bg-primary-700"
              >
                Contact Support
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

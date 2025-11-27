"use client";

import { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ChevronDown,
  ChevronUp,
  Filter,
  Brain,
  Shield,
  DollarSign,
  Stethoscope,
  CheckCircle2,
  Code,
  Layers,
  BookOpen,
  ArrowRight,
  Eye,
  Play,
  Loader2,
} from "lucide-react";
import { Button, Badge, Card, CardContent } from "@/components/ui";
import {
  sampleQuestions,
  NicheCategory,
  QuestionSection,
  Difficulty,
} from "@/lib/prep-data";

// Loading fallback for Suspense
function SampleQuestionsLoading() {
  return (
    <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary-600 mx-auto mb-4" />
        <p className="text-secondary-600">Loading sample questions...</p>
      </div>
    </div>
  );
}

// Main component wrapped in Suspense
export default function SampleQuestionsPage() {
  return (
    <Suspense fallback={<SampleQuestionsLoading />}>
      <SampleQuestionsContent />
    </Suspense>
  );
}

function SampleQuestionsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") as NicheCategory | null;

  const [selectedCategory, setSelectedCategory] = useState<NicheCategory | "all">(
    initialCategory || "all"
  );
  const [selectedSection, setSelectedSection] = useState<QuestionSection | "all">("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | "all">("all");
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());
  const [viewedQuestions, setViewedQuestions] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);

  // Filter questions
  const filteredQuestions = useMemo(() => {
    return sampleQuestions.filter((q) => {
      if (selectedCategory !== "all" && q.category !== selectedCategory) return false;
      if (selectedSection !== "all" && q.section !== selectedSection) return false;
      if (selectedDifficulty !== "all" && q.difficulty !== selectedDifficulty) return false;
      return true;
    });
  }, [selectedCategory, selectedSection, selectedDifficulty]);

  // Toggle question expansion
  const toggleQuestion = (id: string) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
      // Mark as viewed
      const newViewed = new Set(viewedQuestions);
      newViewed.add(id);
      setViewedQuestions(newViewed);
    }
    setExpandedQuestions(newExpanded);
  };

  const categories: { id: NicheCategory | "all"; icon: any; name: string }[] = [
    { id: "all", icon: Filter, name: "All Categories" },
    { id: "AI/ML", icon: Brain, name: "AI/ML" },
    { id: "Healthcare IT", icon: Stethoscope, name: "Healthcare IT" },
    { id: "Fintech", icon: DollarSign, name: "Fintech" },
    { id: "Cybersecurity", icon: Shield, name: "Cybersecurity" },
  ];

  const sections: { id: QuestionSection | "all"; icon: any; name: string }[] = [
    { id: "all", icon: Layers, name: "All Sections" },
    { id: "technical", icon: BookOpen, name: "Technical Skills" },
    { id: "coding", icon: Code, name: "Practical Coding" },
    { id: "system-design", icon: Layers, name: "System Design" },
  ];

  const difficulties: { id: Difficulty | "all"; name: string; color: string }[] = [
    { id: "all", name: "All Difficulties", color: "secondary" },
    { id: "easy", name: "Easy", color: "success" },
    { id: "medium", name: "Medium", color: "warning" },
    { id: "hard", name: "Hard", color: "danger" },
  ];

  const getDifficultyColor = (difficulty: Difficulty) => {
    switch (difficulty) {
      case "easy":
        return "success";
      case "medium":
        return "warning";
      case "hard":
        return "danger";
      default:
        return "secondary";
    }
  };

  const getSectionIcon = (section: QuestionSection) => {
    switch (section) {
      case "technical":
        return BookOpen;
      case "coding":
        return Code;
      case "system-design":
        return Layers;
      default:
        return BookOpen;
    }
  };

  const getCategoryIcon = (category: NicheCategory) => {
    switch (category) {
      case "AI/ML":
        return Brain;
      case "Healthcare IT":
        return Stethoscope;
      case "Fintech":
        return DollarSign;
      case "Cybersecurity":
        return Shield;
      default:
        return Brain;
    }
  };

  const progressPercent = Math.round((viewedQuestions.size / sampleQuestions.length) * 100);

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
            <span className="text-secondary-900 font-medium">Sample Questions</span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <section className="bg-gradient-to-br from-primary-600 to-accent-600 py-12 text-white">
        <div className="container">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-3 text-3xl font-bold md:text-4xl">Sample Questions</h1>
            <p className="text-lg text-primary-100">
              Practice with {sampleQuestions.length}+ questions across all niches and sections
            </p>
          </div>
        </div>
      </section>

      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress Indicator */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-primary-600" />
                  <span className="font-medium text-secondary-900">Your Progress</span>
                </div>
                <span className="text-sm text-secondary-600">
                  {viewedQuestions.size} of {sampleQuestions.length} questions viewed
                </span>
              </div>
              <div className="w-full bg-secondary-200 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center justify-between w-full md:hidden"
              >
                <div className="flex items-center gap-2">
                  <Filter className="h-5 w-5 text-secondary-600" />
                  <span className="font-medium text-secondary-900">Filters</span>
                </div>
                {showFilters ? (
                  <ChevronUp className="h-5 w-5 text-secondary-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-secondary-400" />
                )}
              </button>

              <div className={`${showFilters ? "block" : "hidden"} md:block mt-4 md:mt-0`}>
                <div className="space-y-4">
                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Category
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((cat) => {
                        const Icon = cat.icon;
                        return (
                          <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                              selectedCategory === cat.id
                                ? "bg-primary-600 text-white"
                                : "bg-secondary-100 text-secondary-700 hover:bg-secondary-200"
                            }`}
                          >
                            <Icon className="h-4 w-4" />
                            {cat.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Section Filter */}
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Section
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {sections.map((sec) => {
                        const Icon = sec.icon;
                        return (
                          <button
                            key={sec.id}
                            onClick={() => setSelectedSection(sec.id)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                              selectedSection === sec.id
                                ? "bg-accent-600 text-white"
                                : "bg-secondary-100 text-secondary-700 hover:bg-secondary-200"
                            }`}
                          >
                            <Icon className="h-4 w-4" />
                            {sec.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Difficulty Filter */}
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Difficulty
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {difficulties.map((diff) => (
                        <button
                          key={diff.id}
                          onClick={() => setSelectedDifficulty(diff.id)}
                          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                            selectedDifficulty === diff.id
                              ? diff.id === "easy"
                                ? "bg-success-600 text-white"
                                : diff.id === "medium"
                                  ? "bg-yellow-500 text-white"
                                  : diff.id === "hard"
                                    ? "bg-red-500 text-white"
                                    : "bg-secondary-600 text-white"
                              : "bg-secondary-100 text-secondary-700 hover:bg-secondary-200"
                          }`}
                        >
                          {diff.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Count */}
          <div className="mb-4 text-sm text-secondary-600">
            Showing {filteredQuestions.length} of {sampleQuestions.length} questions
          </div>

          {/* Questions List */}
          <div className="space-y-4">
            {filteredQuestions.map((question) => {
              const isExpanded = expandedQuestions.has(question.id);
              const isViewed = viewedQuestions.has(question.id);
              const SectionIcon = getSectionIcon(question.section);
              const CategoryIcon = getCategoryIcon(question.category);

              return (
                <Card
                  key={question.id}
                  className={`border-2 transition-all ${
                    isExpanded ? "border-primary-300 shadow-md" : "border-secondary-200"
                  }`}
                >
                  <CardContent className="p-0">
                    <button
                      onClick={() => toggleQuestion(question.id)}
                      className="w-full p-4 text-left hover:bg-secondary-50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <Badge variant={getDifficultyColor(question.difficulty) as any}>
                              {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
                            </Badge>
                            <Badge variant="secondary" className="flex items-center gap-1">
                              <CategoryIcon className="h-3 w-3" />
                              {question.category}
                            </Badge>
                            <Badge variant="outline" className="flex items-center gap-1">
                              <SectionIcon className="h-3 w-3" />
                              {question.section === "technical"
                                ? "Technical"
                                : question.section === "coding"
                                  ? "Coding"
                                  : "System Design"}
                            </Badge>
                            {isViewed && (
                              <span className="text-xs text-success-600 flex items-center gap-1">
                                <CheckCircle2 className="h-3 w-3" />
                                Viewed
                              </span>
                            )}
                          </div>
                          <p className="text-secondary-900 font-medium">{question.question}</p>
                          {question.codeSnippet && !isExpanded && (
                            <div className="mt-2 p-2 bg-secondary-100 rounded text-xs text-secondary-600 font-mono truncate">
                              {question.codeSnippet.split("\n")[0]}...
                            </div>
                          )}
                        </div>
                        <div className="flex-shrink-0">
                          {isExpanded ? (
                            <ChevronUp className="h-5 w-5 text-secondary-400" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-secondary-400" />
                          )}
                        </div>
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="px-4 pb-4 border-t border-secondary-200">
                        {/* Code Snippet */}
                        {question.codeSnippet && (
                          <div className="mt-4">
                            <h4 className="text-sm font-medium text-secondary-700 mb-2">Code:</h4>
                            <pre className="p-3 bg-secondary-900 text-secondary-100 rounded-lg text-sm overflow-x-auto">
                              <code>{question.codeSnippet}</code>
                            </pre>
                          </div>
                        )}

                        {/* Multiple Choice Options */}
                        {question.options && (
                          <div className="mt-4">
                            <h4 className="text-sm font-medium text-secondary-700 mb-2">Options:</h4>
                            <div className="space-y-2">
                              {question.options.map((option, idx) => (
                                <div
                                  key={idx}
                                  className={`p-3 rounded-lg border ${
                                    option === question.answer
                                      ? "border-success-300 bg-success-50"
                                      : "border-secondary-200 bg-white"
                                  }`}
                                >
                                  <div className="flex items-start gap-2">
                                    {option === question.answer && (
                                      <CheckCircle2 className="h-5 w-5 text-success-600 flex-shrink-0 mt-0.5" />
                                    )}
                                    <span
                                      className={
                                        option === question.answer
                                          ? "text-success-800 font-medium"
                                          : "text-secondary-700"
                                      }
                                    >
                                      {String.fromCharCode(65 + idx)}. {option}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Answer for non-multiple-choice */}
                        {!question.options && (
                          <div className="mt-4">
                            <h4 className="text-sm font-medium text-secondary-700 mb-2">Answer:</h4>
                            <div className="p-3 bg-success-50 border border-success-200 rounded-lg">
                              {question.answer.includes("\n") ? (
                                <pre className="text-success-800 text-sm whitespace-pre-wrap font-mono">
                                  {question.answer}
                                </pre>
                              ) : (
                                <p className="text-success-800">{question.answer}</p>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Explanation */}
                        <div className="mt-4">
                          <h4 className="text-sm font-medium text-secondary-700 mb-2">Explanation:</h4>
                          <p className="text-secondary-600 bg-primary-50 p-3 rounded-lg border border-primary-100">
                            {question.explanation}
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredQuestions.length === 0 && (
            <Card className="border-2 border-dashed border-secondary-300">
              <CardContent className="p-12 text-center">
                <Filter className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-secondary-900 mb-2">No questions found</h3>
                <p className="text-secondary-600 mb-4">
                  Try adjusting your filters to see more questions.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedCategory("all");
                    setSelectedSection("all");
                    setSelectedDifficulty("all");
                  }}
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          )}

          {/* CTA */}
          <Card className="mt-8 bg-gradient-to-br from-primary-600 to-accent-600 text-white border-0">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-3">Ready to Test Your Knowledge?</h2>
              <p className="text-primary-100 mb-6">
                Take a 10-minute practice test to see how you'd perform on the real assessment.
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
                  <Link href="/skills-assessment/start">
                    Start Full Assessment
                    <ArrowRight className="ml-2 h-5 w-5" />
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

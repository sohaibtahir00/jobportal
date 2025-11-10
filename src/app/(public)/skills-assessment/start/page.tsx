"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Clock,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Flag,
  Loader2,
} from "lucide-react";
import { Button, Badge, Card, CardContent, Progress } from "@/components/ui";

// Mock test questions (would come from API in production)
const TEST_SECTIONS = [
  {
    id: "technical",
    title: "Technical Skills",
    duration: 20,
    questions: [
      {
        id: "q1",
        question: "What is the time complexity of binary search?",
        type: "multiple-choice",
        options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
        correctAnswer: 1,
      },
      {
        id: "q2",
        question:
          "Which of the following is NOT a valid HTTP method?",
        type: "multiple-choice",
        options: ["GET", "POST", "FETCH", "DELETE"],
        correctAnswer: 2,
      },
      {
        id: "q3",
        question: "What does REST stand for in API design?",
        type: "multiple-choice",
        options: [
          "Representational State Transfer",
          "Remote Execution State Transfer",
          "Responsive Environment State Transfer",
          "Relational Endpoint State Transfer",
        ],
        correctAnswer: 0,
      },
      {
        id: "q4",
        question: "Which data structure uses LIFO (Last In, First Out)?",
        type: "multiple-choice",
        options: ["Queue", "Stack", "Array", "Hash Table"],
        correctAnswer: 1,
      },
      {
        id: "q5",
        question: "What is the purpose of middleware in Express.js?",
        type: "multiple-choice",
        options: [
          "To handle database connections",
          "To process requests before reaching route handlers",
          "To compile TypeScript",
          "To render HTML templates",
        ],
        correctAnswer: 1,
      },
    ],
  },
  {
    id: "practical",
    title: "Practical Coding",
    duration: 25,
    questions: [
      {
        id: "q6",
        question:
          "Write a function to reverse a string without using built-in reverse methods:",
        type: "code",
        placeholder: "function reverseString(str) {\n  // Your code here\n}",
      },
      {
        id: "q7",
        question: "Implement a function to check if a number is prime:",
        type: "code",
        placeholder: "function isPrime(num) {\n  // Your code here\n}",
      },
      {
        id: "q8",
        question: "Create a function that removes duplicates from an array:",
        type: "code",
        placeholder:
          "function removeDuplicates(arr) {\n  // Your code here\n}",
      },
    ],
  },
  {
    id: "system-design",
    title: "System Design",
    duration: 15,
    questions: [
      {
        id: "q9",
        question:
          "How would you design a URL shortening service like bit.ly?",
        type: "text",
        placeholder: "Describe your approach...",
      },
      {
        id: "q10",
        question:
          "What caching strategy would you use for a high-traffic e-commerce site?",
        type: "text",
        placeholder: "Explain your strategy...",
      },
    ],
  },
];

export default function SkillsAssessmentStartPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [currentSection, setCurrentSection] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [timeLeft, setTimeLeft] = useState(
    TEST_SECTIONS[0].duration * 60
  ); // in seconds
  const [isStarted, setIsStarted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<string>>(
    new Set()
  );

  // Redirect if not logged in
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?redirect=/skills-assessment/start");
    }
  }, [status, router]);

  // Timer
  useEffect(() => {
    if (!isStarted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isStarted, currentSection]);

  const handleAutoSubmit = () => {
    // Auto-submit when time runs out
    alert("Time's up! Your assessment will be automatically submitted.");
    handleSubmitAssessment();
  };

  const handleStart = () => {
    setIsStarted(true);
  };

  const handleAnswer = (questionId: string, answer: any) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleFlagQuestion = (questionId: string) => {
    setFlaggedQuestions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const handleNext = () => {
    const section = TEST_SECTIONS[currentSection];
    if (currentQuestion < section.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else if (currentSection < TEST_SECTIONS.length - 1) {
      // Move to next section
      setCurrentSection(currentSection + 1);
      setCurrentQuestion(0);
      setTimeLeft(TEST_SECTIONS[currentSection + 1].duration * 60);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    } else if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
      const prevSection = TEST_SECTIONS[currentSection - 1];
      setCurrentQuestion(prevSection.questions.length - 1);
      setTimeLeft(prevSection.duration * 60);
    }
  };

  const handleSubmitAssessment = async () => {
    setIsSubmitting(true);

    // Calculate score (mock scoring)
    const totalQuestions = TEST_SECTIONS.reduce(
      (acc, section) => acc + section.questions.length,
      0
    );
    const answeredQuestions = Object.keys(answers).length;
    const mockScore = Math.floor((answeredQuestions / totalQuestions) * 100);

    // Mock API call to save results
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Redirect to results page
    router.push(`/skills-assessment/results/mock-${Date.now()}?score=${mockScore}`);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary-50">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary-600" />
          <p className="mt-4 text-secondary-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const section = TEST_SECTIONS[currentSection];
  const question = section.questions[currentQuestion];
  const totalQuestions = TEST_SECTIONS.reduce(
    (acc, s) => acc + s.questions.length,
    0
  );
  const answeredCount = Object.keys(answers).length;
  const progress = (answeredCount / totalQuestions) * 100;
  const isLastQuestion =
    currentSection === TEST_SECTIONS.length - 1 &&
    currentQuestion === section.questions.length - 1;

  // Pre-start screen
  if (!isStarted) {
    return (
      <div className="min-h-screen bg-secondary-50 py-12">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            <Card className="border-2 border-primary-200">
              <CardContent className="p-8">
                <div className="mb-6 text-center">
                  <Badge variant="primary" className="mb-4">
                    Skills Assessment
                  </Badge>
                  <h1 className="mb-4 text-3xl font-bold text-secondary-900">
                    Ready to Begin?
                  </h1>
                  <p className="text-lg text-secondary-600">
                    Total duration: 60 minutes | {totalQuestions} questions
                  </p>
                </div>

                {/* Test Sections Preview */}
                <div className="mb-8 space-y-4">
                  {TEST_SECTIONS.map((s, idx) => (
                    <div
                      key={s.id}
                      className="flex items-center justify-between rounded-lg bg-secondary-50 p-4"
                    >
                      <div>
                        <p className="font-semibold text-secondary-900">
                          {idx + 1}. {s.title}
                        </p>
                        <p className="text-sm text-secondary-600">
                          {s.questions.length} questions
                        </p>
                      </div>
                      <Badge variant="secondary">{s.duration} min</Badge>
                    </div>
                  ))}
                </div>

                {/* Important Notes */}
                <div className="mb-8 rounded-lg bg-yellow-50 p-6">
                  <div className="mb-3 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                    <p className="font-semibold text-yellow-900">
                      Important Notes:
                    </p>
                  </div>
                  <ul className="space-y-2 text-sm text-yellow-800">
                    <li>• You must complete all sections in one sitting</li>
                    <li>• The timer will start immediately when you begin</li>
                    <li>• You can flag questions to review later</li>
                    <li>• Do not refresh or close this tab during the test</li>
                    <li>• Your progress is auto-saved</li>
                  </ul>
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  onClick={handleStart}
                >
                  Start Assessment
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Assessment in progress
  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Fixed Header */}
      <div className="sticky top-0 z-40 border-b border-secondary-200 bg-white shadow-sm">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">
                Section {currentSection + 1} of {TEST_SECTIONS.length}
              </p>
              <p className="font-bold text-secondary-900">{section.title}</p>
            </div>

            <div className="flex items-center gap-6">
              {/* Progress */}
              <div className="hidden md:block">
                <p className="text-sm text-secondary-600">
                  {answeredCount} / {totalQuestions} answered
                </p>
                <Progress value={progress} className="mt-1 w-32" />
              </div>

              {/* Timer */}
              <div
                className={`flex items-center gap-2 rounded-lg px-4 py-2 ${
                  timeLeft < 300
                    ? "bg-red-100 text-red-700"
                    : "bg-primary-100 text-primary-700"
                }`}
              >
                <Clock className="h-5 w-5" />
                <span className="font-mono text-lg font-bold">
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Question Content */}
      <div className="container py-8">
        <div className="mx-auto max-w-4xl">
          <Card>
            <CardContent className="p-8">
              {/* Question Header */}
              <div className="mb-6 flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-3">
                    <Badge variant="secondary">
                      Question {currentQuestion + 1} of {section.questions.length}
                    </Badge>
                    {flaggedQuestions.has(question.id) && (
                      <Badge variant="warning">
                        <Flag className="mr-1 h-3 w-3" />
                        Flagged
                      </Badge>
                    )}
                  </div>
                  <h2 className="text-xl font-bold text-secondary-900">
                    {question.question}
                  </h2>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleFlagQuestion(question.id)}
                >
                  <Flag
                    className={`h-4 w-4 ${
                      flaggedQuestions.has(question.id)
                        ? "fill-yellow-500 text-yellow-500"
                        : ""
                    }`}
                  />
                </Button>
              </div>

              {/* Question Content */}
              <div className="mb-8">
                {question.type === "multiple-choice" && "options" in question && (
                  <div className="space-y-3">
                    {question.options.map((option, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleAnswer(question.id, idx)}
                        className={`w-full rounded-lg border-2 p-4 text-left transition-all ${
                          answers[question.id] === idx
                            ? "border-primary-600 bg-primary-50"
                            : "border-secondary-200 hover:border-primary-300"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 ${
                              answers[question.id] === idx
                                ? "border-primary-600 bg-primary-600"
                                : "border-secondary-300"
                            }`}
                          >
                            {answers[question.id] === idx && (
                              <CheckCircle2 className="h-4 w-4 text-white" />
                            )}
                          </div>
                          <span className="text-secondary-900">{option}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {question.type === "code" && "placeholder" in question && (
                  <textarea
                    className="w-full rounded-lg border-2 border-secondary-200 p-4 font-mono text-sm focus:border-primary-600 focus:outline-none"
                    rows={12}
                    placeholder={question.placeholder}
                    value={answers[question.id] || ""}
                    onChange={(e) => handleAnswer(question.id, e.target.value)}
                  />
                )}

                {question.type === "text" && "placeholder" in question && (
                  <textarea
                    className="w-full rounded-lg border-2 border-secondary-200 p-4 text-sm focus:border-primary-600 focus:outline-none"
                    rows={8}
                    placeholder={question.placeholder}
                    value={answers[question.id] || ""}
                    onChange={(e) => handleAnswer(question.id, e.target.value)}
                  />
                )}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between border-t border-secondary-200 pt-6">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentSection === 0 && currentQuestion === 0}
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>

                {isLastQuestion ? (
                  <Button
                    variant="primary"
                    onClick={handleSubmitAssessment}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Assessment"
                    )}
                  </Button>
                ) : (
                  <Button variant="primary" onClick={handleNext}>
                    Next
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Flagged Questions */}
          {flaggedQuestions.size > 0 && (
            <Card className="mt-4 bg-yellow-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-sm text-yellow-800">
                  <Flag className="h-4 w-4" />
                  <span>
                    You have {flaggedQuestions.size} flagged question(s) to review
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

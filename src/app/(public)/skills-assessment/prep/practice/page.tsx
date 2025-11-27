"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft,
  Play,
  Trophy,
  Target,
  AlertCircle,
  RotateCcw,
  Brain,
  Shield,
  DollarSign,
  Stethoscope,
} from "lucide-react";
import { Button, Badge, Card, CardContent } from "@/components/ui";
import { practiceTestQuestions, SampleQuestion, NicheCategory } from "@/lib/prep-data";

type TestState = "intro" | "inProgress" | "results";

interface Answer {
  questionId: string;
  selectedAnswer: string;
  isCorrect: boolean;
}

export default function PracticeTestPage() {
  const [testState, setTestState] = useState<TestState>("intro");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(10 * 60); // 10 minutes in seconds

  const currentQuestion = practiceTestQuestions[currentQuestionIndex];
  const totalQuestions = practiceTestQuestions.length;
  const answeredCount = answers.length;
  const correctCount = answers.filter((a) => a.isCorrect).length;

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (testState === "inProgress" && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setTestState("results");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [testState, timeRemaining]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const startTest = () => {
    setTestState("inProgress");
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setSelectedOption(null);
    setShowFeedback(false);
    setTimeRemaining(10 * 60);
  };

  const submitAnswer = () => {
    if (!selectedOption || !currentQuestion) return;

    const isCorrect = selectedOption === currentQuestion.answer;
    const newAnswer: Answer = {
      questionId: currentQuestion.id,
      selectedAnswer: selectedOption,
      isCorrect,
    };

    setAnswers([...answers, newAnswer]);
    setShowFeedback(true);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setShowFeedback(false);
    } else {
      setTestState("results");
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

  const getScoreMessage = (percentage: number) => {
    if (percentage >= 90) return { message: "Excellent! You're ready for the full assessment.", color: "success" };
    if (percentage >= 70) return { message: "Good job! A bit more practice and you'll ace it.", color: "primary" };
    if (percentage >= 50) return { message: "Not bad! Review the study guide to improve.", color: "warning" };
    return { message: "Keep practicing! Check out our study resources.", color: "danger" };
  };

  // Intro Screen
  if (testState === "intro") {
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
              <span className="text-secondary-900 font-medium">Practice Test</span>
            </nav>
          </div>
        </div>

        <div className="container py-12">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-6 mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary-100">
              <Play className="h-10 w-10 text-primary-600" />
            </div>
            <h1 className="text-3xl font-bold text-secondary-900 mb-4">Practice Test</h1>
            <p className="text-lg text-secondary-600 mb-8">
              Take a 10-minute mini assessment to test your knowledge before the real thing.
            </p>

            <Card className="mb-8 border-2 border-primary-200">
              <CardContent className="p-6">
                <h2 className="font-bold text-secondary-900 mb-4">What to Expect</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 mx-auto mb-2">
                      <Target className="h-6 w-6 text-primary-600" />
                    </div>
                    <p className="font-medium text-secondary-900">{totalQuestions} Questions</p>
                    <p className="text-sm text-secondary-600">Multiple choice</p>
                  </div>
                  <div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-100 mx-auto mb-2">
                      <Clock className="h-6 w-6 text-accent-600" />
                    </div>
                    <p className="font-medium text-secondary-900">10 Minutes</p>
                    <p className="text-sm text-secondary-600">Timed test</p>
                  </div>
                  <div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success-100 mx-auto mb-2">
                      <CheckCircle2 className="h-6 w-6 text-success-600" />
                    </div>
                    <p className="font-medium text-secondary-900">Instant Feedback</p>
                    <p className="text-sm text-secondary-600">After each question</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-8 bg-yellow-50 border-yellow-200">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="text-left">
                    <p className="font-medium text-yellow-800">This is a practice test</p>
                    <p className="text-sm text-yellow-700">
                      No proctoring required. Your results won't affect your profile. Use this to gauge
                      your readiness for the full assessment.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button size="lg" onClick={startTest}>
              <Play className="mr-2 h-5 w-5" />
              Start Practice Test
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Results Screen
  if (testState === "results") {
    const percentage = Math.round((correctCount / totalQuestions) * 100);
    const scoreInfo = getScoreMessage(percentage);

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
              <span className="text-secondary-900 font-medium">Practice Test Results</span>
            </nav>
          </div>
        </div>

        <div className="container py-12">
          <div className="max-w-2xl mx-auto">
            {/* Score Card */}
            <Card className="mb-8 border-2 border-primary-200 overflow-hidden">
              <div className="bg-gradient-to-br from-primary-600 to-accent-600 p-8 text-white text-center">
                <Trophy className="h-16 w-16 mx-auto mb-4 text-yellow-300" />
                <h1 className="text-3xl font-bold mb-2">Practice Test Complete!</h1>
                <p className="text-primary-100">Here's how you did</p>
              </div>
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <div className="text-6xl font-bold text-primary-600 mb-2">{percentage}%</div>
                  <p className="text-lg text-secondary-600">
                    {correctCount} of {totalQuestions} correct
                  </p>
                </div>

                <div
                  className={`p-4 rounded-lg border mb-6 ${
                    scoreInfo.color === "success"
                      ? "bg-success-50 border-success-200"
                      : scoreInfo.color === "primary"
                        ? "bg-primary-50 border-primary-200"
                        : scoreInfo.color === "warning"
                          ? "bg-yellow-50 border-yellow-200"
                          : "bg-red-50 border-red-200"
                  }`}
                >
                  <p
                    className={`text-center font-medium ${
                      scoreInfo.color === "success"
                        ? "text-success-800"
                        : scoreInfo.color === "primary"
                          ? "text-primary-800"
                          : scoreInfo.color === "warning"
                            ? "text-yellow-800"
                            : "text-red-800"
                    }`}
                  >
                    {scoreInfo.message}
                  </p>
                </div>

                {/* Question Breakdown */}
                <h3 className="font-bold text-secondary-900 mb-4">Question Breakdown</h3>
                <div className="space-y-2 mb-8">
                  {answers.map((answer, idx) => {
                    const question = practiceTestQuestions.find((q) => q.id === answer.questionId);
                    const CategoryIcon = question ? getCategoryIcon(question.category) : Brain;
                    return (
                      <div
                        key={answer.questionId}
                        className={`flex items-center gap-3 p-3 rounded-lg ${
                          answer.isCorrect ? "bg-success-50" : "bg-red-50"
                        }`}
                      >
                        {answer.isCorrect ? (
                          <CheckCircle2 className="h-5 w-5 text-success-600 flex-shrink-0" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-secondary-900 truncate">
                            Q{idx + 1}: {question?.question.substring(0, 50)}...
                          </p>
                        </div>
                        <Badge variant="secondary" className="flex-shrink-0">
                          <CategoryIcon className="h-3 w-3 mr-1" />
                          {question?.category}
                        </Badge>
                      </div>
                    );
                  })}
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button variant="outline" className="flex-1" onClick={startTest}>
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Retake Test
                  </Button>
                  <Button variant="primary" className="flex-1" asChild>
                    <Link href="/skills-assessment/start">
                      Take Full Assessment
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Additional Resources */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-secondary-900 mb-4">Continue Preparing</h3>
                <div className="space-y-3">
                  <Link
                    href="/skills-assessment/prep/sample-questions"
                    className="flex items-center justify-between p-3 rounded-lg border border-secondary-200 hover:bg-secondary-50 transition-colors"
                  >
                    <span className="text-secondary-900">Browse More Sample Questions</span>
                    <ArrowRight className="h-4 w-4 text-secondary-400" />
                  </Link>
                  <Link
                    href="/skills-assessment/prep/study-guide"
                    className="flex items-center justify-between p-3 rounded-lg border border-secondary-200 hover:bg-secondary-50 transition-colors"
                  >
                    <span className="text-secondary-900">Review Study Guide</span>
                    <ArrowRight className="h-4 w-4 text-secondary-400" />
                  </Link>
                  <Link
                    href="/skills-assessment/prep/tips"
                    className="flex items-center justify-between p-3 rounded-lg border border-secondary-200 hover:bg-secondary-50 transition-colors"
                  >
                    <span className="text-secondary-900">Read Tips & Strategies</span>
                    <ArrowRight className="h-4 w-4 text-secondary-400" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Test In Progress
  const hasAnswered = answers.some((a) => a.questionId === currentQuestion.id);
  const currentAnswer = answers.find((a) => a.questionId === currentQuestion.id);
  const CategoryIcon = getCategoryIcon(currentQuestion.category);

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Progress Header */}
      <div className="bg-white border-b border-secondary-200 sticky top-0 z-10">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm text-secondary-600">
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </span>
              <div className="w-32 bg-secondary-200 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all"
                  style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
                />
              </div>
            </div>
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                timeRemaining < 60 ? "bg-red-100 text-red-600" : "bg-primary-100 text-primary-600"
              }`}
            >
              <Clock className="h-4 w-4" />
              <span className="font-mono font-bold">{formatTime(timeRemaining)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div className="max-w-3xl mx-auto">
          {/* Question Card */}
          <Card className="mb-6 border-2 border-primary-200">
            <CardContent className="p-6">
              {/* Question Meta */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Badge
                  variant={
                    currentQuestion.difficulty === "easy"
                      ? "success"
                      : currentQuestion.difficulty === "medium"
                        ? "warning"
                        : "danger"
                  }
                >
                  {currentQuestion.difficulty.charAt(0).toUpperCase() +
                    currentQuestion.difficulty.slice(1)}
                </Badge>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <CategoryIcon className="h-3 w-3" />
                  {currentQuestion.category}
                </Badge>
                <Badge variant="outline">
                  {currentQuestion.section === "technical"
                    ? "Technical Skills"
                    : currentQuestion.section === "coding"
                      ? "Coding"
                      : "System Design"}
                </Badge>
              </div>

              {/* Question */}
              <h2 className="text-xl font-bold text-secondary-900 mb-6">{currentQuestion.question}</h2>

              {/* Options */}
              {currentQuestion.options && (
                <div className="space-y-3">
                  {currentQuestion.options.map((option, idx) => {
                    const isSelected = selectedOption === option;
                    const isCorrect = option === currentQuestion.answer;
                    const showCorrect = showFeedback && isCorrect;
                    const showIncorrect = showFeedback && isSelected && !isCorrect;

                    return (
                      <button
                        key={idx}
                        onClick={() => !showFeedback && setSelectedOption(option)}
                        disabled={showFeedback}
                        className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                          showCorrect
                            ? "border-success-500 bg-success-50"
                            : showIncorrect
                              ? "border-red-500 bg-red-50"
                              : isSelected
                                ? "border-primary-500 bg-primary-50"
                                : "border-secondary-200 hover:border-primary-300 hover:bg-secondary-50"
                        } ${showFeedback ? "cursor-default" : "cursor-pointer"}`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                              showCorrect
                                ? "bg-success-600 text-white"
                                : showIncorrect
                                  ? "bg-red-600 text-white"
                                  : isSelected
                                    ? "bg-primary-600 text-white"
                                    : "bg-secondary-200 text-secondary-700"
                            }`}
                          >
                            {String.fromCharCode(65 + idx)}
                          </div>
                          <span
                            className={`flex-1 ${
                              showCorrect
                                ? "text-success-800 font-medium"
                                : showIncorrect
                                  ? "text-red-800"
                                  : "text-secondary-900"
                            }`}
                          >
                            {option}
                          </span>
                          {showCorrect && <CheckCircle2 className="h-5 w-5 text-success-600" />}
                          {showIncorrect && <XCircle className="h-5 w-5 text-red-600" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Feedback */}
              {showFeedback && (
                <div
                  className={`mt-6 p-4 rounded-lg ${
                    currentAnswer?.isCorrect ? "bg-success-50 border border-success-200" : "bg-red-50 border border-red-200"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {currentAnswer?.isCorrect ? (
                      <CheckCircle2 className="h-5 w-5 text-success-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p
                        className={`font-bold ${
                          currentAnswer?.isCorrect ? "text-success-800" : "text-red-800"
                        }`}
                      >
                        {currentAnswer?.isCorrect ? "Correct!" : "Incorrect"}
                      </p>
                      <p className="text-sm text-secondary-700 mt-1">{currentQuestion.explanation}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-between items-center">
            <div className="text-sm text-secondary-600">
              {answeredCount} of {totalQuestions} answered
            </div>
            <div className="flex gap-3">
              {!showFeedback ? (
                <Button onClick={submitAnswer} disabled={!selectedOption}>
                  Submit Answer
                </Button>
              ) : (
                <Button onClick={nextQuestion}>
                  {currentQuestionIndex < totalQuestions - 1 ? (
                    <>
                      Next Question
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  ) : (
                    <>
                      See Results
                      <Trophy className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

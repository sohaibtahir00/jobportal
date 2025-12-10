"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Award,
  TrendingUp,
  Clock,
  AlertCircle,
  ArrowRight,
  BookOpen,
  RefreshCcw,
  Briefcase,
  Shield,
  Loader2,
  Star,
  Download,
  Share2,
  FileQuestion,
  PlayCircle,
  Lightbulb,
  GraduationCap,
} from "lucide-react";
import { Button, Badge, Card, CardContent } from "@/components/ui";
import { SkillsScoreCard, SkillsScoreData } from "@/components/skills";
import { api } from "@/lib/api";

export default function CandidateAssessmentPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [scoreData, setScoreData] = useState<SkillsScoreData | null>(null);
  const [candidateId, setCandidateId] = useState<string | null>(null);
  const [lastTestDate, setLastTestDate] = useState<string | null>(null);
  const [canRetake, setCanRetake] = useState(false);
  const [daysUntilRetake, setDaysUntilRetake] = useState(0);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?redirect=/candidate/assessment");
      return;
    }

    if (status === "authenticated" && session?.user?.role !== "CANDIDATE") {
      router.push("/");
      return;
    }

    const fetchAssessmentData = async () => {
      setIsLoading(true);
      setError("");

      try {
        // First get the candidate profile to get candidateId
        const profileResponse = await api.get("/api/candidates/profile");
        const profile = profileResponse.data;

        if (!profile?.id) {
          setError("Candidate profile not found. Please complete your profile first.");
          setIsLoading(false);
          return;
        }

        setCandidateId(profile.id);

        // Check if candidate has taken the test
        if (!profile.hasTakenTest) {
          setScoreData(null);
          setIsLoading(false);
          return;
        }

        // Fetch test results
        const resultsResponse = await api.get(`/api/tests/results/${profile.id}`);
        const data = resultsResponse.data;

        if (data.hasTakenTest) {
          // Parse section scores
          let sectionScores: Record<string, number> = {};
          if (data.testResults?.[0]?.feedback) {
            try {
              const feedback = typeof data.testResults[0].feedback === 'string'
                ? JSON.parse(data.testResults[0].feedback)
                : data.testResults[0].feedback;
              sectionScores = feedback.sectionScores || {};
            } catch (e) {
              console.error("Failed to parse feedback:", e);
            }
          }

          setScoreData({
            overallScore: data.currentScore || 0,
            percentile: data.currentPercentile || 0,
            tier: data.tierInfo?.tier || "INTERMEDIATE",
            completedAt: data.lastTestDate || new Date().toISOString(),
            sectionScores: {
              technicalSkills: sectionScores["technicalSkills"],
              problemSolving: sectionScores["problemSolving"],
              codeQuality: sectionScores["codeQuality"],
              systemDesign: sectionScores["systemDesign"],
            },
            strengths: generateStrengths(sectionScores),
            growthAreas: generateGrowthAreas(sectionScores),
            proctored: true,
          });

          // Calculate retake eligibility (30 days cooldown)
          if (data.lastTestDate) {
            setLastTestDate(data.lastTestDate);
            const lastTest = new Date(data.lastTestDate);
            const now = new Date();
            const daysSinceTest = Math.floor((now.getTime() - lastTest.getTime()) / (1000 * 60 * 60 * 24));
            const cooldownDays = 30;

            if (daysSinceTest >= cooldownDays) {
              setCanRetake(true);
              setDaysUntilRetake(0);
            } else {
              setCanRetake(false);
              setDaysUntilRetake(cooldownDays - daysSinceTest);
            }
          }
        }
      } catch (err: any) {
        console.error("Failed to fetch assessment data:", err);
        if (err.response?.status === 404) {
          setScoreData(null); // No assessment yet
        } else {
          setError(err.response?.data?.error || "Failed to load assessment data");
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchAssessmentData();
    }
  }, [status, session, router]);

  if (status === "loading" || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary-600" />
          <p className="mt-4 text-secondary-600">Loading assessment data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-8">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6 text-center">
            <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-500" />
            <h2 className="mb-2 text-xl font-bold text-red-800">Error</h2>
            <p className="mb-4 text-red-700">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // No assessment taken yet
  if (!scoreData) {
    return (
      <div className="container py-8">
        <div className="mx-auto max-w-3xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary-100">
              <Award className="h-10 w-10 text-primary-600" />
            </div>
            <h1 className="mb-2 text-3xl font-bold text-secondary-900">
              Skills Assessment
            </h1>
            <p className="text-lg text-secondary-600">
              Take our proctored assessment to verify your skills and unlock exclusive opportunities
            </p>
          </div>

          {/* CTA Card */}
          <Card className="mb-8 border-2 border-primary-200 bg-gradient-to-br from-primary-50 to-blue-50">
            <CardContent className="p-8">
              <div className="text-center">
                <h2 className="mb-4 text-2xl font-bold text-secondary-900">
                  You haven't taken the assessment yet
                </h2>
                <p className="mb-6 text-secondary-600">
                  Complete our skills assessment to showcase your abilities to top employers.
                  The assessment takes about 45-60 minutes and covers technical skills,
                  problem solving, code quality, and system design.
                </p>
                <Button size="lg" className="bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700" asChild>
                  <Link href="/skills-assessment/start">
                    <Award className="mr-2 h-5 w-5" />
                    Start Assessment Now
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Benefits */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <h3 className="mb-4 text-xl font-bold text-secondary-900">
                Why Take the Assessment?
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <BenefitItem
                  icon={TrendingUp}
                  title="Priority Review"
                  description="Your applications are prioritized by employers"
                />
                <BenefitItem
                  icon={Briefcase}
                  title="Exclusive Jobs"
                  description="Access 250+ jobs only for verified candidates"
                />
                <BenefitItem
                  icon={Shield}
                  title="Verified Badge"
                  description="Stand out with a proctored verification badge"
                />
                <BenefitItem
                  icon={Star}
                  title="Higher Salary"
                  description="Verified candidates earn 18% more on average"
                />
              </div>
            </CardContent>
          </Card>

          {/* Prep Resources - Prominent for candidates who haven't taken assessment */}
          <Card className="border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <GraduationCap className="h-6 w-6 text-amber-600" />
                <h3 className="text-xl font-bold text-secondary-900">
                  Preparation Resources
                </h3>
                <Badge variant="warning" className="ml-2">Recommended</Badge>
              </div>
              <p className="text-secondary-600 mb-4">
                Maximize your score with our comprehensive preparation materials. Candidates who prepare score 25% higher on average.
              </p>
              <div className="grid gap-3 md:grid-cols-2">
                <Link
                  href="/skills-assessment/prep/practice"
                  className="flex items-center gap-3 rounded-lg border border-amber-200 bg-white p-4 hover:bg-amber-50 transition-colors"
                >
                  <PlayCircle className="h-6 w-6 text-green-600" />
                  <div>
                    <p className="font-medium text-secondary-900">Practice Test</p>
                    <p className="text-sm text-secondary-600">10-minute mini assessment</p>
                  </div>
                  <ArrowRight className="ml-auto h-5 w-5 text-secondary-400" />
                </Link>
                <Link
                  href="/skills-assessment/prep/sample-questions"
                  className="flex items-center gap-3 rounded-lg border border-amber-200 bg-white p-4 hover:bg-amber-50 transition-colors"
                >
                  <FileQuestion className="h-6 w-6 text-blue-600" />
                  <div>
                    <p className="font-medium text-secondary-900">Sample Questions</p>
                    <p className="text-sm text-secondary-600">20+ practice questions</p>
                  </div>
                  <ArrowRight className="ml-auto h-5 w-5 text-secondary-400" />
                </Link>
                <Link
                  href="/skills-assessment/prep/study-guide"
                  className="flex items-center gap-3 rounded-lg border border-amber-200 bg-white p-4 hover:bg-amber-50 transition-colors"
                >
                  <BookOpen className="h-6 w-6 text-primary-600" />
                  <div>
                    <p className="font-medium text-secondary-900">Study Guide</p>
                    <p className="text-sm text-secondary-600">Topics & resources</p>
                  </div>
                  <ArrowRight className="ml-auto h-5 w-5 text-secondary-400" />
                </Link>
                <Link
                  href="/skills-assessment/prep/tips"
                  className="flex items-center gap-3 rounded-lg border border-amber-200 bg-white p-4 hover:bg-amber-50 transition-colors"
                >
                  <Lightbulb className="h-6 w-6 text-amber-600" />
                  <div>
                    <p className="font-medium text-secondary-900">Tips & Strategies</p>
                    <p className="text-sm text-secondary-600">Expert advice</p>
                  </div>
                  <ArrowRight className="ml-auto h-5 w-5 text-secondary-400" />
                </Link>
              </div>
              <div className="mt-4 text-center">
                <Button variant="outline" asChild>
                  <Link href="/skills-assessment/prep">
                    View All Prep Resources
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Assessment completed - show score card
  return (
    <div className="container py-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-900 mb-2">
            My Skills Assessment
          </h1>
          <p className="text-secondary-600">
            View your verified skills score and track your progress
          </p>
        </div>

        {/* Full Score Card */}
        <div className="mb-8">
          <SkillsScoreCard data={scoreData} variant="full" showActions={true} />
        </div>

        {/* Actions Row */}
        <div className="mb-8 flex flex-wrap gap-4">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Download Certificate
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="mr-2 h-4 w-4" />
            Share on LinkedIn
          </Button>
          <Button variant="primary" size="sm" asChild>
            <Link href="/candidate/exclusive-jobs">
              <Briefcase className="mr-2 h-4 w-4" />
              Browse Exclusive Jobs
            </Link>
          </Button>
        </div>

        {/* Retake Section */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-secondary-900 mb-2">
                  Retake Assessment
                </h3>
                <p className="text-secondary-600 mb-4">
                  You can retake the assessment to improve your score. There's a 30-day
                  cooldown period between attempts.
                </p>
                {lastTestDate && (
                  <p className="text-sm text-secondary-500">
                    Last taken: {new Date(lastTestDate).toLocaleDateString()}
                  </p>
                )}
              </div>
              <div className="text-right">
                {canRetake ? (
                  <Button asChild>
                    <Link href="/skills-assessment/start">
                      <RefreshCcw className="mr-2 h-4 w-4" />
                      Retake Now
                    </Link>
                  </Button>
                ) : (
                  <div>
                    <Badge variant="secondary" className="mb-2">
                      <Clock className="mr-1 h-3 w-3" />
                      {daysUntilRetake} days remaining
                    </Badge>
                    <p className="text-xs text-secondary-500">
                      Available to retake in {daysUntilRetake} days
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Prep Resources for Retake */}
        <Card>
          <CardContent className="p-6">
            <h3 className="mb-4 text-xl font-bold text-secondary-900">
              Improve Your Skills
            </h3>
            <p className="text-secondary-600 mb-4">
              Use these resources to prepare for your next attempt and improve your score.
            </p>
            <div className="grid gap-3 md:grid-cols-2">
              <Link
                href="/skills-assessment/prep/practice"
                className="flex items-center gap-3 rounded-lg border border-secondary-200 p-4 hover:bg-secondary-50 transition-colors"
              >
                <PlayCircle className="h-6 w-6 text-green-600" />
                <div>
                  <p className="font-medium text-secondary-900">Practice Test</p>
                  <p className="text-sm text-secondary-600">10-minute assessment</p>
                </div>
                <ArrowRight className="ml-auto h-5 w-5 text-secondary-400" />
              </Link>
              <Link
                href="/skills-assessment/prep/sample-questions"
                className="flex items-center gap-3 rounded-lg border border-secondary-200 p-4 hover:bg-secondary-50 transition-colors"
              >
                <FileQuestion className="h-6 w-6 text-blue-600" />
                <div>
                  <p className="font-medium text-secondary-900">Sample Questions</p>
                  <p className="text-sm text-secondary-600">Practice by category</p>
                </div>
                <ArrowRight className="ml-auto h-5 w-5 text-secondary-400" />
              </Link>
              <Link
                href="/skills-assessment/prep/study-guide"
                className="flex items-center gap-3 rounded-lg border border-secondary-200 p-4 hover:bg-secondary-50 transition-colors"
              >
                <BookOpen className="h-6 w-6 text-primary-600" />
                <div>
                  <p className="font-medium text-secondary-900">Study Guide</p>
                  <p className="text-sm text-secondary-600">Review materials</p>
                </div>
                <ArrowRight className="ml-auto h-5 w-5 text-secondary-400" />
              </Link>
              <Link
                href="/skills-assessment/prep/tips"
                className="flex items-center gap-3 rounded-lg border border-secondary-200 p-4 hover:bg-secondary-50 transition-colors"
              >
                <Lightbulb className="h-6 w-6 text-amber-600" />
                <div>
                  <p className="font-medium text-secondary-900">Tips & Strategies</p>
                  <p className="text-sm text-secondary-600">Expert advice</p>
                </div>
                <ArrowRight className="ml-auto h-5 w-5 text-secondary-400" />
              </Link>
            </div>
            <div className="mt-4 pt-4 border-t border-secondary-200">
              <Link
                href="/resources"
                className="flex items-center gap-3 rounded-lg border border-secondary-200 p-4 hover:bg-secondary-50 transition-colors"
              >
                <TrendingUp className="h-6 w-6 text-accent-600" />
                <div>
                  <p className="font-medium text-secondary-900">Career Resources</p>
                  <p className="text-sm text-secondary-600">Tips for landing your dream job</p>
                </div>
                <ArrowRight className="ml-auto h-5 w-5 text-secondary-400" />
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Helper component for benefits
function BenefitItem({
  icon: Icon,
  title,
  description
}: {
  icon: any;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-100">
        <Icon className="h-5 w-5 text-primary-600" />
      </div>
      <div>
        <h4 className="font-semibold text-secondary-900">{title}</h4>
        <p className="text-sm text-secondary-600">{description}</p>
      </div>
    </div>
  );
}

// Helper functions
function generateStrengths(sectionScores: any): string[] {
  const strengths: string[] = [];
  if (sectionScores?.technicalSkills >= 80) strengths.push("Technical Skills");
  if (sectionScores?.problemSolving >= 80) strengths.push("Problem Solving");
  if (sectionScores?.codeQuality >= 80) strengths.push("Code Quality");
  if (sectionScores?.systemDesign >= 80) strengths.push("System Design");
  return strengths.slice(0, 3);
}

function generateGrowthAreas(sectionScores: any): string[] {
  const areas: string[] = [];
  if (sectionScores?.technicalSkills < 70) areas.push("Technical Skills");
  if (sectionScores?.problemSolving < 70) areas.push("Problem Solving");
  if (sectionScores?.codeQuality < 70) areas.push("Code Quality");
  if (sectionScores?.systemDesign < 70) areas.push("System Design");
  return areas.slice(0, 2);
}

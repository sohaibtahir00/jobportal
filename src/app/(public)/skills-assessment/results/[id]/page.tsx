"use client";

import { use, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  Award,
  TrendingUp,
  Share2,
  Download,
  CheckCircle2,
  Zap,
  Briefcase,
  ArrowRight,
  Trophy,
  AlertCircle,
} from "lucide-react";
import { Button, Card, CardContent } from "@/components/ui";
import { SkillsScoreCard, SkillsScoreData } from "@/components/skills";
import { api } from "@/lib/api";

interface ResultsPageProps {
  params: Promise<{ id: string }>;
}

export default function SkillsAssessmentResultsPage({ params }: ResultsPageProps) {
  const resolvedParams = use(params);
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  
  const [scoreData, setScoreData] = useState<SkillsScoreData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResults = async () => {
      setIsLoading(true);
      setError("");

      try {
        // If user is logged in, fetch their assessment results
        if (session?.user) {
          const response = await api.get(`/api/tests/results/${resolvedParams.id}`);
          const data = response.data;

          if (data.assessment) {
            // Parse section scores from JSON if stored as string
            let sectionScores: Record<string, number> = {};
            if (data.assessment.sectionScores) {
              sectionScores = typeof data.assessment.sectionScores === 'string'
                ? JSON.parse(data.assessment.sectionScores)
                : data.assessment.sectionScores;
            }

            setScoreData({
              overallScore: data.assessment.score || 0,
              percentile: data.candidate?.testPercentile || calculatePercentile(data.assessment.score || 0),
              tier: data.assessment.tier || data.candidate?.testTier || "INTERMEDIATE",
              completedAt: data.assessment.completedAt || new Date().toISOString(),
              sectionScores: {
                technicalSkills: sectionScores["technicalSkills"],
                problemSolving: sectionScores["problemSolving"],
                codeQuality: sectionScores["codeQuality"],
                systemDesign: sectionScores["systemDesign"],
              },
              strengths: data.assessment.strengths || generateStrengths(sectionScores),
              growthAreas: data.assessment.growthAreas || generateGrowthAreas(sectionScores),
              proctored: true,
            });
          } else if (data.candidate?.hasTakenTest) {
            // Fallback to candidate profile data
            setScoreData({
              overallScore: data.candidate.testScore || 0,
              percentile: data.candidate.testPercentile || calculatePercentile(data.candidate.testScore || 0),
              tier: data.candidate.testTier || "INTERMEDIATE",
              completedAt: data.candidate.lastTestDate || new Date().toISOString(),
              proctored: true,
            });
          } else {
            setError("Assessment results not found");
          }
        } else {
          // For demo/preview - use URL params
          const mockScore = parseInt(searchParams.get("score") || "85");
          setScoreData(generateMockData(mockScore));
        }
      } catch (err: any) {
        console.error("Failed to fetch assessment results:", err);
        
        // If API fails, show demo data
        const mockScore = parseInt(searchParams.get("score") || "85");
        setScoreData(generateMockData(mockScore));
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [resolvedParams.id, session, searchParams]);

  const benefits = [
    {
      icon: TrendingUp,
      title: "Priority Review",
      description: "Your applications go to the top of employer lists",
    },
    {
      icon: Zap,
      title: "Access to 250+ Exclusive Jobs",
      description: "Unlock jobs only available to verified candidates",
    },
    {
      icon: Award,
      title: "Higher Salary Potential",
      description: "Verified candidates earn 18% more on average",
    },
    {
      icon: Share2,
      title: "Shareable Certificate",
      description: "Add to LinkedIn, resume, and your profile",
    },
  ];

  if (status === "loading" || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary-50">
        <div className="text-center">
          <div className="mx-auto mb-6 h-20 w-20 animate-spin rounded-full border-8 border-primary-200 border-t-primary-600"></div>
          <h2 className="mb-2 text-2xl font-bold text-secondary-900">
            Loading Your Results...
          </h2>
          <p className="text-secondary-600">This will only take a moment</p>
        </div>
      </div>
    );
  }

  if (error && !scoreData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary-50">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <AlertCircle className="mx-auto mb-4 h-16 w-16 text-red-500" />
            <h2 className="mb-2 text-xl font-bold text-secondary-900">
              Results Not Found
            </h2>
            <p className="mb-6 text-secondary-600">{error}</p>
            <Button asChild>
              <Link href="/skills-assessment">Take Assessment</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!scoreData) return null;

  return (
    <div className="min-h-screen bg-secondary-50 py-12">
      <div className="container">
        <div className="mx-auto max-w-4xl">
          {/* Success Banner */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-success-100">
              <Trophy className="h-10 w-10 text-success-600" />
            </div>
            <h1 className="mb-2 text-4xl font-bold text-secondary-900">
              Assessment Complete!
            </h1>
            <p className="text-lg text-secondary-600">
              Your skills have been verified and your score card is ready
            </p>
          </div>

          {/* Skills Score Card Component */}
          <div className="mb-8">
            <SkillsScoreCard data={scoreData} variant="full" showActions={true} />
          </div>

          {/* Benefits Unlocked */}
          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="mb-6 text-center">
                <h2 className="mb-2 text-2xl font-bold text-secondary-900">
                  🎉 Benefits Unlocked
                </h2>
                <p className="text-secondary-600">
                  Your verified score gives you these advantages
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {benefits.map((benefit, idx) => {
                  const Icon = benefit.icon;
                  return (
                    <div
                      key={idx}
                      className="flex items-start gap-4 rounded-lg bg-primary-50 p-4"
                    >
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-100">
                        <Icon className="h-5 w-5 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="mb-1 font-bold text-secondary-900">
                          {benefit.title}
                        </h3>
                        <p className="text-sm text-secondary-600">
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Button variant="primary" size="lg" className="w-full" asChild>
              <Link href="/candidate/exclusive-jobs">
                <Briefcase className="mr-2 h-5 w-5" />
                Browse Exclusive Jobs
              </Link>
            </Button>

            <Button variant="outline" size="lg" className="w-full">
              <Download className="mr-2 h-5 w-5" />
              Download Certificate
            </Button>

            <Button variant="outline" size="lg" className="w-full">
              <Share2 className="mr-2 h-5 w-5" />
              Share on LinkedIn
            </Button>
          </div>

          {/* Next Steps */}
          <Card className="mt-8 bg-gradient-to-br from-primary-600 to-accent-600 text-white">
            <CardContent className="p-8">
              <h2 className="mb-4 text-2xl font-bold">What's Next?</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0" />
                  <p>
                    Your score card is now visible to employers when you apply
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0" />
                  <p>You have priority access to 250+ exclusive job postings</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0" />
                  <p>Employers can now search and discover your profile</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0" />
                  <p>
                    You can retake the assessment in 30 days to improve your score
                  </p>
                </div>
              </div>

              <Button
                variant="secondary"
                size="lg"
                className="mt-6 w-full bg-white text-primary-600 hover:bg-primary-50 md:w-auto"
                asChild
              >
                <Link href="/candidate/dashboard">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Footer Note */}
          <div className="mt-8 text-center text-sm text-secondary-600">
            <p>Assessment ID: {resolvedParams.id}</p>
            <p className="mt-1">
              Completed on {new Date(scoreData.completedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper functions
function calculatePercentile(score: number): number {
  if (score >= 90) return 95;
  if (score >= 80) return 88;
  if (score >= 70) return 75;
  if (score >= 60) return 60;
  return 40;
}

function generateStrengths(sectionScores: any): string[] {
  const strengths: string[] = [];
  if (sectionScores.technicalSkills >= 80) strengths.push("Technical Skills");
  if (sectionScores.problemSolving >= 80) strengths.push("Problem Solving");
  if (sectionScores.codeQuality >= 80) strengths.push("Code Quality");
  if (sectionScores.systemDesign >= 80) strengths.push("System Design");
  return strengths.slice(0, 3);
}

function generateGrowthAreas(sectionScores: any): string[] {
  const areas: string[] = [];
  if (sectionScores.technicalSkills < 70) areas.push("Technical Skills");
  if (sectionScores.problemSolving < 70) areas.push("Problem Solving");
  if (sectionScores.codeQuality < 70) areas.push("Code Quality");
  if (sectionScores.systemDesign < 70) areas.push("System Design");
  return areas.slice(0, 2);
}

function generateMockData(score: number): SkillsScoreData {
  return {
    overallScore: score,
    percentile: calculatePercentile(score),
    tier: score >= 90 ? "ELITE" : score >= 80 ? "ADVANCED" : score >= 70 ? "PROFICIENT" : "INTERMEDIATE",
    completedAt: new Date().toISOString(),
    sectionScores: {
      technicalSkills: Math.min(score + 5, 100),
      problemSolving: Math.max(score - 3, 0),
      codeQuality: score,
      systemDesign: Math.min(score + 2, 100),
    },
    strengths: ["Technical Skills", "Problem Solving"],
    growthAreas: ["System Design"],
    proctored: true,
  };
}

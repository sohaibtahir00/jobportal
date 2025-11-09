"use client";

import { use, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Award,
  TrendingUp,
  Share2,
  Download,
  CheckCircle2,
  Target,
  Zap,
  Briefcase,
  ArrowRight,
  Trophy,
  Star,
  Shield,
} from "lucide-react";
import { Button, Badge, Card, CardContent, Progress } from "@/components/ui";

interface ResultsPageProps {
  params: Promise<{ id: string }>;
}

export default function SkillsAssessmentResultsPage({ params }: ResultsPageProps) {
  const resolvedParams = use(params);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data based on score
  const mockScore = parseInt(searchParams.get("score") || "85");

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setScore(mockScore);
      setIsLoading(false);
    }, 1500);
  }, [mockScore]);

  const getTier = (score: number) => {
    if (score >= 90) return { name: "Elite", stars: 5, color: "text-yellow-500" };
    if (score >= 80) return { name: "Advanced", stars: 4, color: "text-accent-600" };
    if (score >= 70) return { name: "Proficient", stars: 3, color: "text-primary-600" };
    if (score >= 60) return { name: "Intermediate", stars: 2, color: "text-secondary-600" };
    return { name: "Beginner", stars: 1, color: "text-secondary-500" };
  };

  const getPercentile = (score: number) => {
    if (score >= 90) return 5;
    if (score >= 80) return 12;
    if (score >= 70) return 25;
    if (score >= 60) return 40;
    return 60;
  };

  const tier = getTier(score);
  const percentile = getPercentile(score);

  const sectionScores = [
    { name: "Technical Skills", score: Math.min(score + 5, 100), maxScore: 100 },
    { name: "Practical Coding", score: Math.max(score - 3, 0), maxScore: 100 },
    { name: "System Design", score: Math.min(score + 2, 100), maxScore: 100 },
  ];

  const benefits = [
    {
      icon: TrendingUp,
      title: "Priority Review",
      description: "Your applications go to the top of employer lists",
    },
    {
      icon: Zap,
      title: `Access to 250+ Exclusive Jobs`,
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

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary-50">
        <div className="text-center">
          <div className="mx-auto mb-6 h-20 w-20 animate-spin rounded-full border-8 border-primary-200 border-t-primary-600"></div>
          <h2 className="mb-2 text-2xl font-bold text-secondary-900">
            Calculating Your Results...
          </h2>
          <p className="text-secondary-600">This will only take a moment</p>
        </div>
      </div>
    );
  }

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

          {/* Overall Score Card */}
          <Card className="mb-8 border-2 border-accent-200 shadow-xl">
            <CardContent className="p-8">
              {/* Main Score */}
              <div className="mb-8 text-center">
                <div className="mb-4 text-7xl font-bold text-secondary-900">
                  {score}
                  <span className="text-3xl text-secondary-600">/100</span>
                </div>
                <Badge variant="success" size="lg" className="mb-3">
                  <Target className="mr-2 h-4 w-4" />
                  Top {percentile}%
                </Badge>
                <p className="text-secondary-600">Overall Performance</p>
              </div>

              {/* Performance Tier */}
              <div className="mb-8 rounded-lg bg-gradient-to-br from-accent-50 to-primary-50 p-6 text-center">
                <p className="mb-2 text-sm font-medium text-secondary-700">
                  Performance Tier
                </p>
                <div className="mb-2 flex justify-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-8 w-8 ${
                        i < tier.stars
                          ? `fill-yellow-400 ${tier.color}`
                          : "text-secondary-300"
                      }`}
                    />
                  ))}
                </div>
                <p className={`text-2xl font-bold ${tier.color}`}>{tier.name}</p>
              </div>

              {/* Section Breakdown */}
              <div className="mb-8">
                <h3 className="mb-4 text-center font-bold text-secondary-900">
                  Section Breakdown
                </h3>
                <div className="space-y-4">
                  {sectionScores.map((section, idx) => (
                    <div key={idx}>
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="font-medium text-secondary-700">
                          {section.name}
                        </span>
                        <span className="font-bold text-primary-600">
                          {section.score}/{section.maxScore}
                        </span>
                      </div>
                      <Progress value={section.score} className="h-3" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Verification Badge */}
              <div className="flex items-center justify-center gap-2 rounded-lg border-2 border-success-200 bg-success-50 py-4">
                <Shield className="h-6 w-6 text-success-600" />
                <span className="font-semibold text-success-700">
                  Skills Verified & Proctored
                </span>
              </div>
            </CardContent>
          </Card>

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
              <Link href="/candidate/jobs">
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
              Completed on {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

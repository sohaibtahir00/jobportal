"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  AlertCircle,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Badge,
} from "@/components/ui";
import { useCandidateProfile } from "@/hooks/useCandidateProfile";

// CountUp Animation Component
function CountUp({ end, duration = 2 }: { end: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = (timestamp - startTime) / (duration * 1000);

      if (progress < 1) {
        setCount(Math.floor(end * progress));
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return <span>{count}</span>;
}

export default function CandidateDashboardPage() {
  const { data: session } = useSession();
  const { profile, profileCompletion, isLoading, isError } = useCandidateProfile();

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" />
          <p className="mt-4 text-secondary-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError || !profile) {
    return (
      <div className="container mx-auto py-8">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6">
          <h2 className="text-xl font-semibold text-red-900">Unable to load dashboard</h2>
          <p className="mt-2 text-red-700">
            There was an error loading your dashboard data. Please try refreshing the page.
          </p>
        </div>
      </div>
    );
  }

  // Calculate stats from profile data
  const stats = {
    applicationsSent: 0,
    testsTaken: 0,
    messages: 0,
    profileCompletion: profileCompletion?.percentage ?? 0,
  };

  const isProfileIncomplete = (profileCompletion?.percentage ?? 0) < 100;

  // Stat cards data
  const statCards = [
    {
      icon: "📄",
      label: "Applications Sent",
      value: stats.applicationsSent,
      gradient: "from-blue-500 to-blue-600",
    },
    {
      icon: "✓",
      label: "Tests Taken",
      value: stats.testsTaken,
      gradient: "from-green-500 to-emerald-600",
    },
    {
      icon: "💬",
      label: "Unread Messages",
      value: stats.messages,
      gradient: "from-purple-500 to-purple-600",
    },
    {
      icon: "📅",
      label: "Profile Completion",
      value: stats.profileCompletion,
      gradient: "from-orange-500 to-orange-600",
    },
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="space-y-6">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl font-bold text-secondary-900 lg:text-3xl">
            Welcome back, {session?.user?.name?.split(" ")[0] || "there"}!
          </h1>
          <p className="mt-1 text-secondary-600">
            Here's what's happening with your job search today
          </p>
        </motion.div>

        {/* Profile Completion Banner */}
        {isProfileIncomplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="border-0 bg-gradient-to-r from-orange-50 to-amber-50 shadow-lg">
              <CardContent className="p-4 lg:p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-amber-500 shadow-md">
                        <AlertCircle className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-secondary-900">
                          Complete Your Profile
                        </h3>
                        <p className="mt-1 text-sm text-secondary-600">
                          Your profile is {profileCompletion?.percentage ?? 0}% complete.
                          Add the following to increase your visibility to
                          employers:
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {profileCompletion?.missingFields.map((field: string) => (
                            <Badge
                              key={field}
                              variant="secondary"
                              size="sm"
                              className="bg-white/80 backdrop-blur-sm shadow-sm"
                            >
                              {field}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    {/* Animated Progress Bar */}
                    <div className="mt-4">
                      <div className="h-3 w-full overflow-hidden rounded-full bg-white/60 shadow-inner">
                        <motion.div
                          className="h-full bg-gradient-to-r from-orange-500 to-amber-500 shadow-sm"
                          initial={{ width: 0 }}
                          animate={{ width: `${profileCompletion?.percentage ?? 0}%` }}
                          transition={{ duration: 1, delay: 0.3 }}
                        />
                      </div>
                      <p className="mt-1 text-xs font-medium text-secondary-600">
                        {profileCompletion?.percentage ?? 0}% Complete
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/candidate/profile"
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-lg bg-gradient-to-r from-orange-600 to-amber-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-orange-500/30 transition-all hover:from-orange-700 hover:to-amber-700 hover:shadow-xl hover:-translate-y-0.5 lg:flex-shrink-0"
                  >
                    Complete Profile
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Animated Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="relative overflow-hidden rounded-xl border border-white/20 bg-white/80 p-6 shadow-md backdrop-blur-sm transition-all hover:shadow-xl group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {/* Gradient Icon */}
              <div
                className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${stat.gradient} text-2xl shadow-md`}
              >
                {stat.icon}
              </div>

              {/* Stats */}
              <div className="mb-1 text-3xl font-bold text-gray-900">
                <CountUp end={stat.value} />
              </div>
              <div className="text-sm font-medium text-gray-600">
                {stat.label}
              </div>

              {/* Hover Gradient Overlay */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 transition-opacity group-hover:opacity-5`}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

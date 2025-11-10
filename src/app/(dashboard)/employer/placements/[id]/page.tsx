"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  ArrowLeft,
  User,
  Briefcase,
  Calendar,
  DollarSign,
  FileText,
  Loader2,
  CheckCircle2,
  Clock,
  TrendingUp,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { Button, Badge, Card, CardContent } from "@/components/ui";
import Link from "next/link";

export default function PlacementDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { data: session, status } = useSession();
  const [placement, setPlacement] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const placementId = params.id as string;

  // Redirect if not logged in or not employer
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?redirect=/employer/placements/" + placementId);
    }
    if (status === "authenticated" && session?.user?.role !== "EMPLOYER") {
      router.push("/");
    }
  }, [status, session, router, placementId]);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "EMPLOYER") {
      fetchPlacement();
    }
  }, [status, session, placementId]);

  const fetchPlacement = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/employer/placements/${placementId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch placement details");
      }
      const data = await response.json();
      setPlacement(data);
    } catch (err: any) {
      setError(err.message || "Failed to load placement details");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge variant="warning" size="lg">
            <Clock className="w-4 h-4 mr-2" />
            Pending Probation
          </Badge>
        );
      case "ACTIVE":
        return (
          <Badge variant="primary" size="lg">
            <TrendingUp className="w-4 h-4 mr-2" />
            Active Placement
          </Badge>
        );
      case "COMPLETED":
        return (
          <Badge variant="success" size="lg">
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Completed
          </Badge>
        );
      default:
        return <Badge variant="secondary" size="lg">{status}</Badge>;
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-secondary-600">Loading placement details...</p>
        </div>
      </div>
    );
  }

  if (error || !placement) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
        <div className="container">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-12 text-center">
              <FileText className="w-16 h-16 text-red-600 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-secondary-900 mb-2">
                Placement Not Found
              </h1>
              <p className="text-secondary-600 mb-6">{error}</p>
              <Link href="/employer/placements">
                <Button>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Placements
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="container">
        {/* Back Button */}
        <Link href="/employer/placements" className="inline-block mb-6">
          <Button variant="ghost">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Placements
          </Button>
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-secondary-900 mb-2">
                Placement Details
              </h1>
              <p className="text-secondary-600">
                Placement ID: {placement.id.slice(0, 8)}
              </p>
            </div>
            {getStatusBadge(placement.status)}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Candidate Information */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-primary-100 rounded-lg">
                    <User className="w-5 h-5 text-primary-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-secondary-900">
                    Candidate Information
                  </h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-secondary-600 mb-1">Full Name</p>
                    <p className="text-lg font-medium text-secondary-900">
                      {placement.candidate.user.name}
                    </p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-sm text-secondary-600 mb-1 flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email
                      </p>
                      <p className="text-secondary-900">
                        {placement.candidate.user.email}
                      </p>
                    </div>

                    {placement.candidate.phone && (
                      <div>
                        <p className="text-sm text-secondary-600 mb-1 flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          Phone
                        </p>
                        <p className="text-secondary-900">
                          {placement.candidate.phone}
                        </p>
                      </div>
                    )}

                    {placement.candidate.location && (
                      <div>
                        <p className="text-sm text-secondary-600 mb-1 flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          Location
                        </p>
                        <p className="text-secondary-900">
                          {placement.candidate.location}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Job Information */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Briefcase className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-secondary-900">
                    Job Information
                  </h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-secondary-600 mb-1">Position</p>
                    <p className="text-lg font-medium text-secondary-900">
                      {placement.job.title}
                    </p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-sm text-secondary-600 mb-1">Niche</p>
                      <Badge variant="secondary">{placement.job.niche}</Badge>
                    </div>

                    <div>
                      <p className="text-sm text-secondary-600 mb-1">
                        Experience Level
                      </p>
                      <Badge variant="secondary">
                        {placement.job.experienceLevel}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-accent-100 rounded-lg">
                    <Calendar className="w-5 h-5 text-accent-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-secondary-900">
                    Timeline
                  </h2>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-4 pb-4 border-b border-secondary-200">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-secondary-900">
                        Placement Created
                      </p>
                      <p className="text-sm text-secondary-600">
                        {new Date(placement.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 pb-4 border-b border-secondary-200">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-secondary-900">Start Date</p>
                      <p className="text-sm text-secondary-600">
                        {new Date(placement.startDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Clock className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-secondary-900">
                        Probation End Date
                      </p>
                      <p className="text-sm text-secondary-600">
                        {new Date(placement.probationEndDate).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Financial Details */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <DollarSign className="w-5 h-5 text-green-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-secondary-900">
                    Financial Details
                  </h2>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                    <p className="text-sm text-secondary-600 mb-1">
                      Placement Fee
                    </p>
                    <p className="text-3xl font-bold text-secondary-900">
                      ${placement.placementFee.toLocaleString()}
                    </p>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-secondary-600">Fee Type:</span>
                      <span className="font-medium text-secondary-900">
                        Success-Based
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary-600">Fee %:</span>
                      <span className="font-medium text-secondary-900">
                        15-20%
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-secondary-900 mb-4">
                  Actions
                </h3>
                <div className="space-y-3">
                  <Link href="/employer/invoices" className="block">
                    <Button variant="outline" className="w-full">
                      <FileText className="w-4 h-4 mr-2" />
                      View Invoices
                    </Button>
                  </Link>
                  <Link
                    href={`/employer/jobs/${placement.job.id}`}
                    className="block"
                  >
                    <Button variant="outline" className="w-full">
                      <Briefcase className="w-4 h-4 mr-2" />
                      View Job Posting
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Users,
  DollarSign,
  Share2,
  Copy,
  Mail,
  CheckCircle2,
  Clock,
  Gift,
  TrendingUp,
  Loader2,
  Award,
  Send,
} from "lucide-react";
import { Button, Badge, Card, CardContent, Input } from "@/components/ui";

interface Referral {
  id: string;
  name: string;
  email: string;
  status: "pending" | "signed_up" | "hired" | "rejected";
  referredDate: string;
  bonus: number;
  bonusStatus: "pending" | "processing" | "paid";
}

export default function CandidateReferralsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const referralCode = "JOB-REF-" + (session?.user?.email?.split("@")[0]?.toUpperCase() || "USER");
  const referralLink = `https://jobportal.com/signup?ref=${referralCode}`;

  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [stats, setStats] = useState({
    totalReferrals: 0,
    signedUp: 0,
    hired: 0,
    totalEarned: 0,
    pending: 0,
  });

  // Redirect if not logged in or not candidate
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?redirect=/candidate/referrals");
    }
    if (status === "authenticated" && session?.user?.role !== "CANDIDATE") {
      router.push("/");
    }
  }, [status, session, router]);

  // Load referrals
  useEffect(() => {
    const loadReferrals = async () => {
      try {
        // Mock data
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const mockReferrals: Referral[] = [
          {
            id: "1",
            name: "Sarah Johnson",
            email: "sarah.j@email.com",
            status: "hired",
            referredDate: "2024-12-15",
            bonus: 500,
            bonusStatus: "paid",
          },
          {
            id: "2",
            name: "Mike Chen",
            email: "mchen@email.com",
            status: "signed_up",
            referredDate: "2025-01-05",
            bonus: 500,
            bonusStatus: "pending",
          },
          {
            id: "3",
            name: "Emily Rodriguez",
            email: "e.rodriguez@email.com",
            status: "pending",
            referredDate: "2025-01-08",
            bonus: 500,
            bonusStatus: "pending",
          },
        ];

        setReferrals(mockReferrals);

        // Calculate stats
        const signedUp = mockReferrals.filter((r) => r.status !== "pending").length;
        const hired = mockReferrals.filter((r) => r.status === "hired").length;
        const totalEarned = mockReferrals
          .filter((r) => r.bonusStatus === "paid")
          .reduce((sum, r) => sum + r.bonus, 0);
        const pending = mockReferrals
          .filter((r) => r.bonusStatus === "pending" || r.bonusStatus === "processing")
          .reduce((sum, r) => sum + r.bonus, 0);

        setStats({
          totalReferrals: mockReferrals.length,
          signedUp,
          hired,
          totalEarned,
          pending,
        });

        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
      }
    };

    if (status === "authenticated") {
      loadReferrals();
    }
  }, [status]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;

    setIsSending(true);

    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSuccessMessage(`Invitation sent to ${emailInput}!`);
      setEmailInput("");
      setIsSending(false);

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setIsSending(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "hired":
        return <Badge variant="success">Hired</Badge>;
      case "signed_up":
        return <Badge variant="primary">Signed Up</Badge>;
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "rejected":
        return <Badge variant="secondary">Not Hired</Badge>;
      default:
        return null;
    }
  };

  const getBonusStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge variant="success">Paid</Badge>;
      case "processing":
        return <Badge variant="primary">Processing</Badge>;
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      default:
        return null;
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary-50">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary-600" />
          <p className="mt-4 text-secondary-600">Loading referrals...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-secondary-50 py-8">
      <div className="container">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold text-secondary-900">
              Referral Program
            </h1>
            <p className="text-secondary-600">
              Earn $500 for every successful referral who gets hired
            </p>
          </div>

          {/* Stats */}
          <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="mx-auto mb-3 h-8 w-8 text-primary-600" />
                <div className="mb-1 text-3xl font-bold text-secondary-900">
                  {stats.totalReferrals}
                </div>
                <div className="text-sm text-secondary-600">Total Referrals</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <CheckCircle2 className="mx-auto mb-3 h-8 w-8 text-success-600" />
                <div className="mb-1 text-3xl font-bold text-secondary-900">
                  {stats.hired}
                </div>
                <div className="text-sm text-secondary-600">Hired</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <DollarSign className="mx-auto mb-3 h-8 w-8 text-green-600" />
                <div className="mb-1 text-3xl font-bold text-secondary-900">
                  ${stats.totalEarned}
                </div>
                <div className="text-sm text-secondary-600">Total Earned</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Clock className="mx-auto mb-3 h-8 w-8 text-yellow-600" />
                <div className="mb-1 text-3xl font-bold text-secondary-900">
                  ${stats.pending}
                </div>
                <div className="text-sm text-secondary-600">Pending Bonus</div>
              </CardContent>
            </Card>
          </div>

          {/* Share Section */}
          <Card className="mb-8 border-2 border-primary-200">
            <CardContent className="p-8">
              <div className="mb-6 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
                  <Gift className="h-8 w-8 text-primary-600" />
                </div>
                <h2 className="mb-2 text-2xl font-bold text-secondary-900">
                  Share Your Referral Link
                </h2>
                <p className="text-secondary-600">
                  Invite friends and colleagues to join the platform
                </p>
              </div>

              {/* Referral Code */}
              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-secondary-700">
                  Your Referral Code
                </label>
                <div className="flex gap-3">
                  <Input value={referralCode} readOnly className="font-mono" />
                  <Button variant="outline" onClick={handleCopyLink}>
                    {copied ? (
                      <>
                        <CheckCircle2 className="mr-2 h-5 w-5" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="mr-2 h-5 w-5" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Referral Link */}
              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-secondary-700">
                  Your Referral Link
                </label>
                <div className="flex gap-3">
                  <Input value={referralLink} readOnly className="text-sm" />
                  <Button variant="primary" onClick={handleCopyLink}>
                    {copied ? "Copied!" : "Copy Link"}
                  </Button>
                </div>
              </div>

              {/* Send Invite */}
              <div>
                <label className="mb-2 block text-sm font-medium text-secondary-700">
                  Send Invite via Email
                </label>
                <form onSubmit={handleSendInvite} className="flex gap-3">
                  <Input
                    type="email"
                    placeholder="friend@email.com"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    required
                  />
                  <Button type="submit" variant="primary" disabled={isSending}>
                    {isSending ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-5 w-5" />
                        Send Invite
                      </>
                    )}
                  </Button>
                </form>
                {successMessage && (
                  <p className="mt-2 text-sm text-success-600">{successMessage}</p>
                )}
              </div>

              {/* Social Share */}
              <div className="mt-6 border-t border-secondary-200 pt-6">
                <p className="mb-3 text-sm font-medium text-secondary-700">
                  Share on Social Media
                </p>
                <div className="flex gap-3">
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href={`https://twitter.com/intent/tweet?text=Join me on this amazing job platform!&url=${encodeURIComponent(referralLink)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Share2 className="mr-2 h-4 w-4" />
                      Twitter
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralLink)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Share2 className="mr-2 h-4 w-4" />
                      LinkedIn
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href={`mailto:?subject=Join me on this job platform&body=I found this great job platform and thought you might be interested: ${referralLink}`}
                    >
                      <Mail className="mr-2 h-4 w-4" />
                      Email
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* How It Works */}
          <Card className="mb-8 bg-gradient-to-br from-primary-50 to-accent-50">
            <CardContent className="p-8">
              <h3 className="mb-6 text-xl font-bold text-secondary-900">
                How It Works
              </h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary-600 text-white">
                    <span className="text-xl font-bold">1</span>
                  </div>
                  <h4 className="mb-2 font-bold text-secondary-900">Share Your Link</h4>
                  <p className="text-sm text-secondary-600">
                    Send your unique referral link to friends and colleagues
                  </p>
                </div>
                <div className="text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary-600 text-white">
                    <span className="text-xl font-bold">2</span>
                  </div>
                  <h4 className="mb-2 font-bold text-secondary-900">They Sign Up</h4>
                  <p className="text-sm text-secondary-600">
                    Your referral creates an account and completes their profile
                  </p>
                </div>
                <div className="text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary-600 text-white">
                    <span className="text-xl font-bold">3</span>
                  </div>
                  <h4 className="mb-2 font-bold text-secondary-900">Earn $500</h4>
                  <p className="text-sm text-secondary-600">
                    Get paid when they're successfully hired through our platform
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Referrals List */}
          <Card>
            <CardContent className="p-6">
              <h3 className="mb-6 text-xl font-bold text-secondary-900">
                Your Referrals
              </h3>

              {referrals.length === 0 ? (
                <div className="py-12 text-center">
                  <Users className="mx-auto mb-4 h-16 w-16 text-secondary-300" />
                  <h3 className="mb-2 text-xl font-bold text-secondary-900">
                    No referrals yet
                  </h3>
                  <p className="text-secondary-600">
                    Start sharing your referral link to earn bonuses!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {referrals.map((referral) => (
                    <div
                      key={referral.id}
                      className="flex flex-col gap-4 rounded-lg border border-secondary-200 p-4 md:flex-row md:items-center md:justify-between"
                    >
                      <div className="flex-1">
                        <h4 className="mb-1 font-bold text-secondary-900">
                          {referral.name}
                        </h4>
                        <p className="mb-2 text-sm text-secondary-600">{referral.email}</p>
                        <div className="flex flex-wrap gap-2">
                          {getStatusBadge(referral.status)}
                          <Badge variant="secondary" size="sm">
                            Referred {new Date(referral.referredDate).toLocaleDateString()}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="mb-1 text-2xl font-bold text-green-600">
                            ${referral.bonus}
                          </p>
                          {getBonusStatusBadge(referral.bonusStatus)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Terms */}
          <div className="mt-8 rounded-lg bg-yellow-50 p-6">
            <h4 className="mb-2 font-bold text-yellow-900">Referral Program Terms</h4>
            <ul className="space-y-1 text-sm text-yellow-800">
              <li>• You'll receive $500 for each referred candidate who gets hired</li>
              <li>• Bonus is paid after the referred candidate completes 30 days of employment</li>
              <li>• There's no limit to how many people you can refer</li>
              <li>• Referred candidates must use your unique link when signing up</li>
              <li>• Bonuses are paid via direct deposit or PayPal</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

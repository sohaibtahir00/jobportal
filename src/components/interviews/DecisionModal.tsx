"use client";

import { useState } from "react";
import { X, Calendar, FileCheck, XCircle, Gift, DollarSign, Loader2, ArrowRight, Star } from "lucide-react";
import { Button, Card, CardContent } from "@/components/ui";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui";

interface DecisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScheduleNextRound: () => void;
  onSendOffer: () => void;
  onRejectCandidate: () => void;
  candidateName: string;
  applicationId?: string;
  jobTitle?: string;
  reviewRating?: number; // Optional: pass interview.review.overallRating
}

export default function DecisionModal({
  isOpen,
  onClose,
  onScheduleNextRound,
  onSendOffer,
  onRejectCandidate,
  candidateName,
  applicationId,
  jobTitle,
  reviewRating,
}: DecisionModalProps) {
  const { showToast } = useToast();
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [isCreatingOffer, setIsCreatingOffer] = useState(false);
  const [offerData, setOfferData] = useState({
    position: "",
    salary: "",
    equity: "",
    signingBonus: "",
    benefits: [] as string[],
    startDate: "",
    expiresAt: "",
    customMessage: "",
  });

  if (!isOpen) return null;

  const handleAction = (action: () => void) => {
    action();
    onClose();
  };

  const handleSendOfferClick = () => {
    // Pre-fill position with job title
    setOfferData((prev) => ({
      ...prev,
      position: jobTitle || "",
    }));
    setShowOfferModal(true);
  };

  const handleMakeOffer = async () => {
    if (!applicationId) {
      alert("Application ID is missing");
      return;
    }

    setIsCreatingOffer(true);
    try {
      // Convert salary from string to cents (multiply by 100)
      const salaryInCents = Math.round(parseFloat(offerData.salary) * 100);
      const signingBonusInCents = offerData.signingBonus
        ? Math.round(parseFloat(offerData.signingBonus) * 100)
        : null;

      // Set expiration date to 7 days from now if not provided
      const expirationDate =
        offerData.expiresAt ||
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

      await api.post("/api/offers", {
        applicationId: applicationId,
        position: offerData.position,
        salary: salaryInCents,
        equity: offerData.equity ? parseFloat(offerData.equity) : null,
        signingBonus: signingBonusInCents,
        benefits: offerData.benefits,
        startDate: offerData.startDate,
        expiresAt: expirationDate,
        customMessage: offerData.customMessage,
      });

      // Success toast
      showToast("success", "Offer sent successfully!");

      setShowOfferModal(false);
      // Reset form
      setOfferData({
        position: "",
        salary: "",
        equity: "",
        signingBonus: "",
        benefits: [],
        startDate: "",
        expiresAt: "",
        customMessage: "",
      });
      onClose();
      // Reload page to reflect new status
      window.location.reload();
    } catch (err: any) {
      console.error("Failed to create offer:", err);
      alert(err.response?.data?.error || "Failed to create offer");
    } finally {
      setIsCreatingOffer(false);
    }
  };

  const handleBenefitToggle = (benefit: string) => {
    setOfferData((prev) => ({
      ...prev,
      benefits: prev.benefits.includes(benefit)
        ? prev.benefits.filter((b) => b !== benefit)
        : [...prev.benefits, benefit],
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-5 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Make Decision
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Choose the next step for <span className="font-semibold">{candidateName}</span>
              </p>

              {/* Show review rating if exists */}
              {reviewRating !== undefined && reviewRating !== null && (
                <div className="mt-3 flex items-center gap-2">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= reviewRating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-gray-700">
                    {reviewRating}/5 Rating
                  </span>
                </div>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Body - Action Cards */}
        <div className="px-6 py-6 space-y-4 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Schedule Next Round Card */}
          <button
            onClick={() => handleAction(onScheduleNextRound)}
            className="w-full text-left p-6 rounded-xl border-2 border-blue-200 bg-white hover:bg-gradient-to-br hover:from-blue-50 hover:to-blue-100 hover:border-blue-400 hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 group"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                  <Calendar className="h-7 w-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1.5">
                    Schedule Next Round
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Move the candidate to the next interview round in the hiring process
                  </p>
                  <div className="mt-2 flex items-center gap-2 text-xs text-blue-600 font-medium">
                    <span>Continue interviews</span>
                    <span>•</span>
                    <span>Round 2: Technical</span>
                  </div>
                </div>
              </div>
              <ArrowRight className="h-6 w-6 text-blue-500 flex-shrink-0 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
            </div>
          </button>

          {/* Send Offer Card */}
          <button
            onClick={handleSendOfferClick}
            className="w-full text-left p-6 rounded-xl border-2 border-green-200 bg-white hover:bg-gradient-to-br hover:from-green-50 hover:to-green-100 hover:border-green-400 hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 group"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
                  <FileCheck className="h-7 w-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1.5">
                    Send Offer
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Create and send a job offer to the candidate
                  </p>
                  <div className="mt-2 flex items-center gap-2 text-xs text-green-600 font-medium">
                    <span>Salary</span>
                    <span>•</span>
                    <span>Equity</span>
                    <span>•</span>
                    <span>Start Date</span>
                  </div>
                </div>
              </div>
              <ArrowRight className="h-6 w-6 text-green-500 flex-shrink-0 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
            </div>
          </button>

          {/* Reject Candidate Card */}
          <button
            onClick={() => handleAction(onRejectCandidate)}
            className="w-full text-left p-6 rounded-xl border-2 border-red-200 bg-white hover:bg-gradient-to-br hover:from-red-50 hover:to-red-100 hover:border-red-400 hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 group"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg">
                  <XCircle className="h-7 w-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1.5">
                    Reject Candidate
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Update application status to rejected and notify the candidate
                  </p>
                  <div className="mt-2 flex items-center gap-2 text-xs text-red-600 font-medium">
                    <span>Close application</span>
                    <span>•</span>
                    <span>Send notification</span>
                  </div>
                </div>
              </div>
              <ArrowRight className="h-6 w-6 text-red-500 flex-shrink-0 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
            </div>
          </button>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Make Offer Modal */}
      {showOfferModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardContent className="p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-secondary-900">
                  Make Job Offer
                </h2>
                <button
                  onClick={() => setShowOfferModal(false)}
                  disabled={isCreatingOffer}
                  className="rounded-lg p-2 hover:bg-secondary-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Position */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-secondary-700">
                    Position <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={offerData.position}
                    onChange={(e) =>
                      setOfferData({ ...offerData, position: e.target.value })
                    }
                    className="w-full rounded-lg border border-secondary-300 p-3 focus:border-primary-500 focus:outline-none"
                    placeholder="e.g., Senior Software Engineer"
                    disabled={isCreatingOffer}
                  />
                </div>

                {/* Salary */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-secondary-700">
                    Annual Salary (USD) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-5 w-5 text-secondary-400" />
                    <input
                      type="number"
                      value={offerData.salary}
                      onChange={(e) =>
                        setOfferData({ ...offerData, salary: e.target.value })
                      }
                      className="w-full rounded-lg border border-secondary-300 p-3 pl-10 focus:border-primary-500 focus:outline-none"
                      placeholder="100000"
                      disabled={isCreatingOffer}
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {/* Equity */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-secondary-700">
                      Equity (%)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={offerData.equity}
                      onChange={(e) =>
                        setOfferData({ ...offerData, equity: e.target.value })
                      }
                      className="w-full rounded-lg border border-secondary-300 p-3 focus:border-primary-500 focus:outline-none"
                      placeholder="0.5"
                      disabled={isCreatingOffer}
                    />
                  </div>

                  {/* Signing Bonus */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-secondary-700">
                      Signing Bonus (USD)
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-5 w-5 text-secondary-400" />
                      <input
                        type="number"
                        value={offerData.signingBonus}
                        onChange={(e) =>
                          setOfferData({
                            ...offerData,
                            signingBonus: e.target.value,
                          })
                        }
                        className="w-full rounded-lg border border-secondary-300 p-3 pl-10 focus:border-primary-500 focus:outline-none"
                        placeholder="10000"
                        disabled={isCreatingOffer}
                      />
                    </div>
                  </div>
                </div>

                {/* Benefits */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-secondary-700">
                    Benefits
                  </label>
                  <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                    {[
                      "Health Insurance",
                      "Dental Insurance",
                      "Vision Insurance",
                      "401(k)",
                      "PTO",
                      "Remote Work",
                      "Gym Membership",
                      "Learning Budget",
                      "Stock Options",
                    ].map((benefit) => (
                      <label
                        key={benefit}
                        className="flex items-center gap-2 rounded-lg border border-secondary-300 p-2 hover:bg-secondary-50"
                      >
                        <input
                          type="checkbox"
                          checked={offerData.benefits.includes(benefit)}
                          onChange={() => handleBenefitToggle(benefit)}
                          disabled={isCreatingOffer}
                          className="h-4 w-4"
                        />
                        <span className="text-sm text-secondary-700">
                          {benefit}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {/* Start Date */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-secondary-700">
                      Start Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={offerData.startDate}
                      onChange={(e) =>
                        setOfferData({
                          ...offerData,
                          startDate: e.target.value,
                        })
                      }
                      className="w-full rounded-lg border border-secondary-300 p-3 focus:border-primary-500 focus:outline-none"
                      disabled={isCreatingOffer}
                    />
                  </div>

                  {/* Expiration Date */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-secondary-700">
                      Offer Expires On
                    </label>
                    <input
                      type="date"
                      value={offerData.expiresAt}
                      onChange={(e) =>
                        setOfferData({
                          ...offerData,
                          expiresAt: e.target.value,
                        })
                      }
                      className="w-full rounded-lg border border-secondary-300 p-3 focus:border-primary-500 focus:outline-none"
                      placeholder="Defaults to 7 days"
                      disabled={isCreatingOffer}
                    />
                    <p className="mt-1 text-xs text-secondary-500">
                      Defaults to 7 days if not specified
                    </p>
                  </div>
                </div>

                {/* Custom Message */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-secondary-700">
                    Personal Message
                  </label>
                  <textarea
                    value={offerData.customMessage}
                    onChange={(e) =>
                      setOfferData({
                        ...offerData,
                        customMessage: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-secondary-300 p-3 focus:border-primary-500 focus:outline-none"
                    rows={4}
                    placeholder="Add a personal message to the candidate..."
                    disabled={isCreatingOffer}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowOfferModal(false)}
                  disabled={isCreatingOffer}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleMakeOffer}
                  disabled={
                    isCreatingOffer ||
                    !offerData.position ||
                    !offerData.salary ||
                    !offerData.startDate
                  }
                  className="flex-1"
                >
                  {isCreatingOffer ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending Offer...
                    </>
                  ) : (
                    <>
                      <Gift className="mr-2 h-4 w-4" />
                      Send Offer
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

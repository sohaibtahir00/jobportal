"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Loader2, Save, CheckCircle2, AlertCircle } from "lucide-react";
import { Button, Card, CardContent, Input } from "@/components/ui";

export default function AdminSettingsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [activeTab, setActiveTab] = useState("platform");
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?redirect=/admin/settings");
    }
    if (status === "authenticated" && session?.user?.role !== "ADMIN") {
      router.push("/");
    }
  }, [status, session, router]);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "ADMIN") {
      fetchSettings();
    }
  }, [status, session]);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/platform-settings");
      if (!response.ok) throw new Error("Failed to fetch settings");

      const data = await response.json();
      setSettings(data.settings);
    } catch (error) {
      console.error("Failed to fetch settings:", error);
      setErrorMessage("Failed to load settings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const response = await fetch("/api/admin/platform-settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (!response.ok) throw new Error("Failed to save settings");

      setSuccessMessage("Settings saved successfully");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      setErrorMessage("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  const updateSetting = (category: string, key: string, value: any) => {
    setSettings((prev: any) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
  };

  if (status === "loading" || isLoading || !settings) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="container max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-900 mb-2">
            Platform Settings
          </h1>
          <p className="text-secondary-600">
            Configure platform-wide settings and preferences
          </p>
        </div>

        {/* Success/Error Messages */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <p className="text-green-800">{successMessage}</p>
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-800">{errorMessage}</p>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6 flex gap-4 border-b border-secondary-200 overflow-x-auto">
          {["platform", "fees", "payment", "security"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 px-4 font-medium whitespace-nowrap ${
                activeTab === tab
                  ? "border-b-2 border-primary-600 text-primary-600"
                  : "text-secondary-600 hover:text-secondary-900"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Platform Settings Tab */}
        {activeTab === "platform" && (
          <Card>
            <CardContent className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Platform Name
                </label>
                <Input
                  value={settings.platform.name}
                  onChange={(e) => updateSetting("platform", "name", e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Platform URL
                </label>
                <Input
                  value={settings.platform.url}
                  onChange={(e) => updateSetting("platform", "url", e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Support Email
                </label>
                <Input
                  type="email"
                  value={settings.platform.supportEmail}
                  onChange={(e) => updateSetting("platform", "supportEmail", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Fees Tab */}
        {activeTab === "fees" && (
          <Card>
            <CardContent className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Junior/Mid Roles Fee (%)
                </label>
                <Input
                  type="number"
                  value={settings.fees.juniorMid}
                  onChange={(e) => updateSetting("fees", "juniorMid", Number(e.target.value))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Senior Roles Fee (%)
                </label>
                <Input
                  type="number"
                  value={settings.fees.senior}
                  onChange={(e) => updateSetting("fees", "senior", Number(e.target.value))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Lead/Staff Roles Fee (%)
                </label>
                <Input
                  type="number"
                  value={settings.fees.leadStaff}
                  onChange={(e) => updateSetting("fees", "leadStaff", Number(e.target.value))}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Payment Tab */}
        {activeTab === "payment" && (
          <Card>
            <CardContent className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Invoice Prefix
                </label>
                <Input
                  value={settings.payment.invoicePrefix}
                  onChange={(e) => updateSetting("payment", "invoicePrefix", e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Guarantee Period (days)
                </label>
                <Input
                  type="number"
                  value={settings.payment.guaranteePeriodDays}
                  onChange={(e) => updateSetting("payment", "guaranteePeriodDays", Number(e.target.value))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Late Fee Percentage (%)
                </label>
                <Input
                  type="number"
                  value={settings.payment.lateFeePercentage}
                  onChange={(e) => updateSetting("payment", "lateFeePercentage", Number(e.target.value))}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Security Tab */}
        {activeTab === "security" && (
          <Card>
            <CardContent className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Password Minimum Length
                </label>
                <Input
                  type="number"
                  value={settings.security.passwordMinLength}
                  onChange={(e) => updateSetting("security", "passwordMinLength", Number(e.target.value))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Session Timeout (minutes)
                </label>
                <Input
                  type="number"
                  value={settings.security.sessionTimeoutMinutes}
                  onChange={(e) => updateSetting("security", "sessionTimeoutMinutes", Number(e.target.value))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Max Failed Login Attempts
                </label>
                <Input
                  type="number"
                  value={settings.security.maxFailedAttempts}
                  onChange={(e) => updateSetting("security", "maxFailedAttempts", Number(e.target.value))}
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="requireSpecialChars"
                  checked={settings.security.requireSpecialChars}
                  onChange={(e) => updateSetting("security", "requireSpecialChars", e.target.checked)}
                  className="w-4 h-4 text-primary-600"
                />
                <label htmlFor="requireSpecialChars" className="text-sm font-medium text-secondary-700">
                  Require Special Characters in Password
                </label>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="requireNumbers"
                  checked={settings.security.requireNumbers}
                  onChange={(e) => updateSetting("security", "requireNumbers", e.target.checked)}
                  className="w-4 h-4 text-primary-600"
                />
                <label htmlFor="requireNumbers" className="text-sm font-medium text-secondary-700">
                  Require Numbers in Password
                </label>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Save Button */}
        <div className="mt-6 flex justify-end">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            size="lg"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-5 w-5" />
                Save Settings
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

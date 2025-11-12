"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  Building2,
  Mail,
  Bell,
  Lock,
  Eye,
  EyeOff,
  Save,
  Trash2,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Upload,
} from "lucide-react";
import { Button, Badge, Card, CardContent, Input } from "@/components/ui";
import { api } from "@/lib/api";

export default function EmployerSettingsPage() {
  const router = useRouter();
  const { data: session, status, update } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Form state
  const [profileData, setProfileData] = useState({
    companyName: "",
    email: "",
    phone: "",
    website: "",
    location: "",
    companySize: "",
    industry: "",
    description: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    newApplications: true,
    interviewReminders: true,
    messages: true,
    placementUpdates: true,
    marketingEmails: false,
  });

  const [privacySettings, setPrivacySettings] = useState({
    showCompanyProfile: true,
    allowCandidateContact: true,
  });

  // Redirect if not logged in or not employer
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?redirect=/employer/settings");
    }
    if (status === "authenticated" && session?.user?.role !== "EMPLOYER") {
      router.push("/");
    }
  }, [status, session, router]);

  // Load settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await api.get("/api/employers/profile");
        const data = response.data;

        // Map employer data to form fields
        setProfileData({
          companyName: data.employer.companyName || "",
          email: session?.user?.email || "",
          phone: data.employer.phone || "",
          website: data.employer.companyWebsite || "",
          location: data.employer.location || "",
          companySize: data.employer.companySize || "",
          industry: data.employer.industry || "",
          description: data.employer.description || "",
        });

        setIsLoading(false);
      } catch (err: any) {
        console.error("Failed to load settings:", err);
        setErrorMessage(err.response?.data?.error || "Failed to load settings");
        setIsLoading(false);
      }
    };

    if (status === "authenticated" && session?.user?.role === "EMPLOYER") {
      loadSettings();
    }
  }, [status, session]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      // Update employer profile
      await api.patch("/api/employers/profile", {
        companyName: profileData.companyName,
        phone: profileData.phone,
        companyWebsite: profileData.website,
        location: profileData.location,
        companySize: profileData.companySize,
        industry: profileData.industry,
        description: profileData.description,
      });

      // Update user name (for display in header/sidebar)
      await api.patch("/api/settings", {
        name: profileData.companyName,
      });

      // Refresh the session to update displayed name
      await update();

      setSuccessMessage("Profile updated successfully!");
      setIsSaving(false);

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err: any) {
      console.error("Failed to update profile:", err);
      setErrorMessage(err.response?.data?.error || "Failed to update profile");
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrorMessage("New passwords don't match");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setErrorMessage("Password must be at least 8 characters");
      return;
    }

    setIsSaving(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await api.post("/api/settings/password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      setSuccessMessage("Password changed successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setIsSaving(false);

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err: any) {
      console.error("Failed to change password:", err);
      setErrorMessage(err.response?.data?.error || "Failed to change password");
      setIsSaving(false);
    }
  };

  const handleNotificationUpdate = async () => {
    setIsSaving(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await api.patch("/api/settings", {
        emailNotifications: notificationSettings.emailNotifications,
      });

      setSuccessMessage("Notification preferences updated!");
      setIsSaving(false);

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err: any) {
      console.error("Failed to update preferences:", err);
      setErrorMessage(err.response?.data?.error || "Failed to update preferences");
      setIsSaving(false);
    }
  };

  const handleAccountDeletion = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );

    if (!confirmed) return;

    const doubleConfirm = window.confirm(
      "This will permanently delete all your job postings, applications, and data. Are you absolutely sure?"
    );

    if (!doubleConfirm) return;

    setIsSaving(true);
    setErrorMessage("");

    try {
      await api.delete("/api/settings");

      // Sign out the user after account deletion
      await signOut({ redirect: false });
      router.push("/");
    } catch (err: any) {
      console.error("Failed to delete account:", err);
      setErrorMessage(err.response?.data?.error || "Failed to delete account");
      setIsSaving(false);
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary-50">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary-600" />
          <p className="mt-4 text-secondary-600">Loading settings...</p>
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
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold text-secondary-900">
              Company Settings
            </h1>
            <p className="text-secondary-600">
              Manage your company profile and account preferences
            </p>
          </div>

          {/* Success/Error Messages */}
          {successMessage && (
            <div className="mb-6 flex items-center gap-3 rounded-lg bg-success-50 border border-success-200 p-4">
              <CheckCircle2 className="h-5 w-5 text-success-600" />
              <p className="text-sm text-success-700">{successMessage}</p>
            </div>
          )}

          {errorMessage && (
            <div className="mb-6 flex items-center gap-3 rounded-lg bg-error-50 border border-error-200 p-4">
              <AlertCircle className="h-5 w-5 text-error-600" />
              <p className="text-sm text-error-700">{errorMessage}</p>
            </div>
          )}

          {/* Company Profile */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100">
                  <Building2 className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-secondary-900">
                    Company Profile
                  </h2>
                  <p className="text-sm text-secondary-600">
                    Update your company information
                  </p>
                </div>
              </div>

              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-secondary-700">
                      Company Name
                    </label>
                    <Input
                      value={profileData.companyName}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          companyName: e.target.value,
                        })
                      }
                      placeholder="Your company name"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-secondary-700">
                      Email
                    </label>
                    <Input
                      type="email"
                      value={profileData.email}
                      onChange={(e) =>
                        setProfileData({ ...profileData, email: e.target.value })
                      }
                      placeholder="company@example.com"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-secondary-700">
                      Phone
                    </label>
                    <Input
                      value={profileData.phone}
                      onChange={(e) =>
                        setProfileData({ ...profileData, phone: e.target.value })
                      }
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-secondary-700">
                      Website
                    </label>
                    <Input
                      value={profileData.website}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          website: e.target.value,
                        })
                      }
                      placeholder="https://example.com"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-secondary-700">
                      Location
                    </label>
                    <Input
                      value={profileData.location}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          location: e.target.value,
                        })
                      }
                      placeholder="City, State"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-secondary-700">
                      Company Size
                    </label>
                    <select
                      value={profileData.companySize}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          companySize: e.target.value,
                        })
                      }
                      className="w-full rounded-lg border border-secondary-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                    >
                      <option value="">Select size</option>
                      <option value="1-10">1-10 employees</option>
                      <option value="11-50">11-50 employees</option>
                      <option value="51-200">51-200 employees</option>
                      <option value="201-500">201-500 employees</option>
                      <option value="501-1000">501-1000 employees</option>
                      <option value="1000+">1000+ employees</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-secondary-700">
                      Industry
                    </label>
                    <Input
                      value={profileData.industry}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          industry: e.target.value,
                        })
                      }
                      placeholder="e.g., Technology, Healthcare, Finance"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-secondary-700">
                      Company Description
                    </label>
                    <textarea
                      value={profileData.description}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          description: e.target.value,
                        })
                      }
                      rows={4}
                      className="w-full rounded-lg border border-secondary-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                      placeholder="Brief description of your company..."
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" variant="primary" disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Change Password */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-warning-100">
                  <Lock className="h-5 w-5 text-warning-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-secondary-900">
                    Change Password
                  </h2>
                  <p className="text-sm text-secondary-600">
                    Update your password to keep your account secure
                  </p>
                </div>
              </div>

              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-secondary-700">
                    Current Password
                  </label>
                  <div className="relative">
                    <Input
                      type={showCurrentPassword ? "text" : "password"}
                      value={passwordData.currentPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          currentPassword: e.target.value,
                        })
                      }
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-secondary-600"
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-secondary-700">
                    New Password
                  </label>
                  <div className="relative">
                    <Input
                      type={showNewPassword ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          newPassword: e.target.value,
                        })
                      }
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-secondary-600"
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-secondary-500">
                    Must be at least 8 characters
                  </p>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-secondary-700">
                    Confirm New Password
                  </label>
                  <Input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        confirmPassword: e.target.value,
                      })
                    }
                    placeholder="Confirm new password"
                  />
                </div>

                <div className="flex justify-end">
                  <Button type="submit" variant="primary" disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Changing...
                      </>
                    ) : (
                      "Change Password"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Notification Preferences */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-100">
                  <Bell className="h-5 w-5 text-accent-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-secondary-900">
                    Notification Preferences
                  </h2>
                  <p className="text-sm text-secondary-600">
                    Choose what updates you want to receive
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {Object.entries(notificationSettings).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-secondary-900">
                        {key
                          .replace(/([A-Z])/g, " $1")
                          .replace(/^./, (str) => str.toUpperCase())}
                      </p>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) =>
                          setNotificationSettings({
                            ...notificationSettings,
                            [key]: e.target.checked,
                          })
                        }
                        className="peer sr-only"
                      />
                      <div className="peer h-6 w-11 rounded-full bg-secondary-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-secondary-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-500/20"></div>
                    </label>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-end">
                <Button
                  variant="primary"
                  onClick={handleNotificationUpdate}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Preferences
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-2 border-error-200">
            <CardContent className="p-6">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-error-100">
                  <Trash2 className="h-5 w-5 text-error-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-error-900">
                    Danger Zone
                  </h2>
                  <p className="text-sm text-error-700">
                    Irreversible and destructive actions
                  </p>
                </div>
              </div>

              <div className="rounded-lg bg-error-50 p-4">
                <h3 className="mb-2 font-bold text-error-900">
                  Delete Account
                </h3>
                <p className="mb-4 text-sm text-error-700">
                  Once you delete your account, there is no going back. All your
                  job postings, applicant data, and account information will be
                  permanently deleted.
                </p>
                <Button
                  variant="outline"
                  onClick={handleAccountDeletion}
                  disabled={isSaving}
                  className="border-error-600 text-error-600 hover:bg-error-50"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Account
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

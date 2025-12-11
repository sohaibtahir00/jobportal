"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  User,
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
} from "lucide-react";
import { Button, Badge, Card, CardContent, Input, ConfirmationModal } from "@/components/ui";
import { api } from "@/lib/api";

export default function CandidateSettingsPage() {
  const router = useRouter();
  const { data: session, status, update } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Delete account modal state
  const [deleteAccountModal, setDeleteAccountModal] = useState(false);
  const [deleteAccountConfirmModal, setDeleteAccountConfirmModal] = useState(false);

  // Form state
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    jobAlerts: true,
    applicationUpdates: true,
    messages: true,
    interviewReminders: true,
    placementUpdates: true,
    weeklyDigest: false,
    marketingEmails: false,
  });

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: "public",
    showEmail: false,
    showPhone: false,
    allowRecruiterContact: true,
  });

  // Redirect if not logged in or not candidate
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?redirect=/candidate/settings");
    }
    if (status === "authenticated" && session?.user?.role !== "CANDIDATE") {
      router.push("/");
    }
  }, [status, session, router]);

  // Load settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        // Load candidate profile
        const profileResponse = await api.get("/api/candidates/profile");
        const profileData = profileResponse.data;

        // Map candidate data to form fields
        setProfileData({
          name: session?.user?.name || "",
          email: session?.user?.email || "",
          phone: profileData.candidate.phone || "",
          location: profileData.candidate.location || "",
        });

        // Load user settings (for notifications and privacy)
        const settingsResponse = await api.get("/api/settings");
        const settingsData = settingsResponse.data;

        if (settingsData.settings) {
          setNotificationSettings({
            emailNotifications: settingsData.settings.emailNotifications ?? true,
            jobAlerts: settingsData.settings.notifyJobAlerts ?? true,
            applicationUpdates: settingsData.settings.notifyApplicationUpdates ?? true,
            messages: settingsData.settings.notifyMessages ?? true,
            interviewReminders: settingsData.settings.notifyInterviewReminders ?? true,
            placementUpdates: settingsData.settings.notifyPlacementUpdates ?? true,
            weeklyDigest: settingsData.settings.notifyWeeklyDigest ?? false,
            marketingEmails: settingsData.settings.notifyMarketingEmails ?? false,
          });

          setPrivacySettings({
            profileVisibility: settingsData.settings.profileVisibility ? "public" : "private",
            showEmail: profileData.candidate.showEmail ?? false,
            showPhone: profileData.candidate.showPhone ?? false,
            allowRecruiterContact: settingsData.settings.allowRecruiterContact ?? true,
          });
        }

        setIsLoading(false);
      } catch (err: any) {
        console.error("Failed to load settings:", err);
        setErrorMessage(err.response?.data?.error || "Failed to load settings");
        setIsLoading(false);
      }
    };

    if (status === "authenticated" && session?.user?.role === "CANDIDATE") {
      loadSettings();
    }
  }, [status, session]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      // Update candidate profile
      await api.patch("/api/candidates/profile", {
        phone: profileData.phone,
        location: profileData.location,
      });

      // Update user name
      await api.patch("/api/settings", {
        name: profileData.name,
      });

      // Refresh session to update displayed name
      await update({
        name: profileData.name,
      });

      setSuccessMessage("Profile updated successfully!");
      setIsSaving(false);

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err: any) {
      console.error("Failed to update profile:", err);
      setErrorMessage(err.response?.data?.error || "Failed to update profile. Please try again.");
      setIsSaving(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setErrorMessage("Password must be at least 8 characters");
      return;
    }

    setIsSaving(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      await api.post("/api/settings/password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      setSuccessMessage("Password updated successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setIsSaving(false);

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err: any) {
      console.error("Failed to update password:", err);
      setErrorMessage(err.response?.data?.error || "Failed to update password. Please try again.");
      setIsSaving(false);
    }
  };

  const handleNotificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      await api.patch("/api/settings", {
        emailNotifications: notificationSettings.emailNotifications,
        notifyJobAlerts: notificationSettings.jobAlerts,
        notifyApplicationUpdates: notificationSettings.applicationUpdates,
        notifyMessages: notificationSettings.messages,
        notifyInterviewReminders: notificationSettings.interviewReminders,
        notifyPlacementUpdates: notificationSettings.placementUpdates,
        notifyWeeklyDigest: notificationSettings.weeklyDigest,
        notifyMarketingEmails: notificationSettings.marketingEmails,
      });

      setSuccessMessage("Notification preferences updated!");
      setIsSaving(false);

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err: any) {
      console.error("Failed to update preferences:", err);
      setErrorMessage(err.response?.data?.error || "Failed to update preferences.");
      setIsSaving(false);
    }
  };

  const handlePrivacySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      // Update user privacy settings
      await api.patch("/api/settings", {
        profileVisibility: privacySettings.profileVisibility === "public",
        allowRecruiterContact: privacySettings.allowRecruiterContact,
      });

      // Update candidate privacy settings (showEmail, showPhone)
      await api.patch("/api/candidates/profile", {
        showEmail: privacySettings.showEmail,
        showPhone: privacySettings.showPhone,
      });

      setSuccessMessage("Privacy settings updated!");
      setIsSaving(false);

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err: any) {
      console.error("Failed to update privacy settings:", err);
      setErrorMessage(err.response?.data?.error || "Failed to update privacy settings.");
      setIsSaving(false);
    }
  };

  // Step 1: Open first confirmation modal
  const initiateAccountDeletion = () => {
    setDeleteAccountModal(true);
  };

  // Step 2: First modal confirmed, show second confirmation
  const confirmFirstDeletion = () => {
    setDeleteAccountModal(false);
    setDeleteAccountConfirmModal(true);
  };

  // Step 3: Final confirmation, delete account
  const handleDeleteAccount = async () => {
    setDeleteAccountConfirmModal(false);
    setIsSaving(true);
    setErrorMessage("");

    try {
      await api.delete("/api/settings");

      // Sign out the user after account deletion
      await signOut({ redirect: false });
      router.push("/");
    } catch (err: any) {
      console.error("Failed to delete account:", err);
      setErrorMessage(err.response?.data?.error || "Failed to delete account.");
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
            <h1 className="mb-2 text-3xl font-bold text-secondary-900">Settings</h1>
            <p className="text-secondary-600">Manage your account settings and preferences</p>
          </div>

          {/* Success/Error Messages */}
          {successMessage && (
            <div className="mb-6 rounded-lg bg-success-50 p-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-success-600" />
                <p className="text-sm text-success-800">{successMessage}</p>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="mb-6 rounded-lg bg-red-50 p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600" />
                <p className="text-sm text-red-800">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Profile Settings */}
          <Card variant="accent" className="mb-6">
            <CardContent className="p-6">
              <div className="mb-6 flex items-center gap-3">
                <User className="h-6 w-6 text-primary-600" />
                <h2 className="text-xl font-bold text-secondary-900">Profile Information</h2>
              </div>

              <form onSubmit={handleProfileSubmit}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="mb-2 block text-sm font-medium text-secondary-700">
                      Full Name
                    </label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="mb-2 block text-sm font-medium text-secondary-700">
                      Email Address
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      disabled
                      className="bg-secondary-50 text-secondary-600 cursor-not-allowed"
                    />
                    <p className="mt-1 text-xs text-secondary-500">
                      Contact support to change your email address
                    </p>
                  </div>

                  <div>
                    <label htmlFor="phone" className="mb-2 block text-sm font-medium text-secondary-700">
                      Phone Number
                    </label>
                    <Input
                      id="phone"
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    />
                  </div>

                  <div>
                    <label htmlFor="location" className="mb-2 block text-sm font-medium text-secondary-700">
                      Location
                    </label>
                    <Input
                      id="location"
                      value={profileData.location}
                      onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                    />
                  </div>
                </div>

                <Button type="submit" variant="primary" className="mt-6" disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-5 w-5" />
                      Save Changes
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Password Settings */}
          <Card variant="accent" className="mb-6">
            <CardContent className="p-6">
              <div className="mb-6 flex items-center gap-3">
                <Lock className="h-6 w-6 text-primary-600" />
                <h2 className="text-xl font-bold text-secondary-900">Change Password</h2>
              </div>

              <form onSubmit={handlePasswordSubmit}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="currentPassword" className="mb-2 block text-sm font-medium text-secondary-700">
                      Current Password
                    </label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showCurrentPassword ? "text" : "password"}
                        value={passwordData.currentPassword}
                        onChange={(e) =>
                          setPasswordData({ ...passwordData, currentPassword: e.target.value })
                        }
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-600"
                      >
                        {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="newPassword" className="mb-2 block text-sm font-medium text-secondary-700">
                      New Password
                    </label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        value={passwordData.newPassword}
                        onChange={(e) =>
                          setPasswordData({ ...passwordData, newPassword: e.target.value })
                        }
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-600"
                      >
                        {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    <p className="mt-1 text-xs text-secondary-500">Must be at least 8 characters</p>
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-secondary-700">
                      Confirm New Password
                    </label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <Button type="submit" variant="primary" className="mt-6" disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Password"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card variant="accent" className="mb-6">
            <CardContent className="p-6">
              <div className="mb-6 flex items-center gap-3">
                <Bell className="h-6 w-6 text-primary-600" />
                <h2 className="text-xl font-bold text-secondary-900">Notification Preferences</h2>
              </div>

              <form onSubmit={handleNotificationSubmit}>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-secondary-900">Email Notifications</p>
                      <p className="text-sm text-secondary-600">Receive email updates</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.emailNotifications}
                      onChange={(e) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          emailNotifications: e.target.checked,
                        })
                      }
                      className="h-4 w-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-600"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-secondary-900">Job Alerts</p>
                      <p className="text-sm text-secondary-600">Get notified about new matching jobs</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.jobAlerts}
                      onChange={(e) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          jobAlerts: e.target.checked,
                        })
                      }
                      className="h-4 w-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-600"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-secondary-900">Application Updates</p>
                      <p className="text-sm text-secondary-600">Status changes on your applications</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.applicationUpdates}
                      onChange={(e) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          applicationUpdates: e.target.checked,
                        })
                      }
                      className="h-4 w-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-600"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-secondary-900">Messages</p>
                      <p className="text-sm text-secondary-600">New messages from employers</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.messages}
                      onChange={(e) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          messages: e.target.checked,
                        })
                      }
                      className="h-4 w-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-600"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-secondary-900">Interview Reminders</p>
                      <p className="text-sm text-secondary-600">Reminders for upcoming interviews</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.interviewReminders}
                      onChange={(e) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          interviewReminders: e.target.checked,
                        })
                      }
                      className="h-4 w-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-600"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-secondary-900">Placement Updates</p>
                      <p className="text-sm text-secondary-600">Updates about your placements</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.placementUpdates}
                      onChange={(e) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          placementUpdates: e.target.checked,
                        })
                      }
                      className="h-4 w-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-600"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-secondary-900">Weekly Digest</p>
                      <p className="text-sm text-secondary-600">Weekly summary of activity</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.weeklyDigest}
                      onChange={(e) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          weeklyDigest: e.target.checked,
                        })
                      }
                      className="h-4 w-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-600"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-secondary-900">Marketing Emails</p>
                      <p className="text-sm text-secondary-600">Tips, resources, and updates</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.marketingEmails}
                      onChange={(e) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          marketingEmails: e.target.checked,
                        })
                      }
                      className="h-4 w-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-600"
                    />
                  </div>
                </div>

                <Button type="submit" variant="primary" className="mt-6" disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Preferences"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <Card variant="accent" className="mb-6">
            <CardContent className="p-6">
              <div className="mb-6 flex items-center gap-3">
                <Eye className="h-6 w-6 text-primary-600" />
                <h2 className="text-xl font-bold text-secondary-900">Privacy Settings</h2>
              </div>

              <form onSubmit={handlePrivacySubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-secondary-700">
                      Profile Visibility
                    </label>
                    <select
                      value={privacySettings.profileVisibility}
                      onChange={(e) =>
                        setPrivacySettings({
                          ...privacySettings,
                          profileVisibility: e.target.value,
                        })
                      }
                      className="w-full rounded-lg border border-secondary-300 px-4 py-2 focus:border-primary-600 focus:outline-none"
                    >
                      <option value="public">Public - Visible to all employers</option>
                      <option value="private">Private - Only visible when you apply</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-secondary-900">Show Email</p>
                      <p className="text-sm text-secondary-600">Display email on public profile</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={privacySettings.showEmail}
                      onChange={(e) =>
                        setPrivacySettings({
                          ...privacySettings,
                          showEmail: e.target.checked,
                        })
                      }
                      className="h-4 w-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-600"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-secondary-900">Show Phone</p>
                      <p className="text-sm text-secondary-600">Display phone on public profile</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={privacySettings.showPhone}
                      onChange={(e) =>
                        setPrivacySettings({
                          ...privacySettings,
                          showPhone: e.target.checked,
                        })
                      }
                      className="h-4 w-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-600"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-secondary-900">Allow Recruiter Contact</p>
                      <p className="text-sm text-secondary-600">Let employers reach out directly</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={privacySettings.allowRecruiterContact}
                      onChange={(e) =>
                        setPrivacySettings({
                          ...privacySettings,
                          allowRecruiterContact: e.target.checked,
                        })
                      }
                      className="h-4 w-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-600"
                    />
                  </div>
                </div>

                <Button type="submit" variant="primary" className="mt-6" disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Settings"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-2 border-red-200">
            <CardContent className="p-6">
              <h2 className="mb-4 text-xl font-bold text-red-600">Danger Zone</h2>
              <p className="mb-4 text-sm text-secondary-600">
                Once you delete your account, there is no going back. Please be certain.
              </p>
              <Button
                variant="outline"
                className="border-red-300 text-red-600 hover:bg-red-50"
                onClick={initiateAccountDeletion}
              >
                <Trash2 className="mr-2 h-5 w-5" />
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Account Confirmation Modals */}
      <ConfirmationModal
        isOpen={deleteAccountModal}
        onClose={() => setDeleteAccountModal(false)}
        onConfirm={confirmFirstDeletion}
        title="Delete Account"
        message="Are you sure you want to delete your account? This action cannot be undone."
        confirmText="Continue"
        cancelText="Cancel"
        variant="danger"
      />

      <ConfirmationModal
        isOpen={deleteAccountConfirmModal}
        onClose={() => setDeleteAccountConfirmModal(false)}
        onConfirm={handleDeleteAccount}
        title="Final Confirmation"
        message="This will permanently delete all your applications, profile data, and saved jobs. Are you absolutely sure?"
        confirmText="Delete My Account"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
}

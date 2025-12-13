"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
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
  Phone,
  MapPin,
  Check,
  XCircle,
  Shield,
} from "lucide-react";
import {
  Button,
  Input,
  ConfirmationModal,
  useToast,
  CollapsibleSection,
  SettingsProgress,
  SectionStatus,
} from "@/components/ui";
import { api } from "@/lib/api";

export default function CandidateSettingsPage() {
  const router = useRouter();
  const { data: session, status, update } = useSession();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Expanded sections state
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

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

  // Password validation
  const passwordValidation = useMemo(() => {
    const password = passwordData.newPassword;
    return {
      minLength: password.length >= 8,
      hasLowercase: /[a-z]/.test(password),
      hasUppercase: /[A-Z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecial: /[^a-zA-Z\d]/.test(password),
      passwordsMatch: password.length > 0 && password === passwordData.confirmPassword,
    };
  }, [passwordData.newPassword, passwordData.confirmPassword]);

  const passwordStrength = useMemo(() => {
    let strength = 0;
    if (passwordValidation.minLength) strength++;
    if (passwordValidation.hasLowercase && passwordValidation.hasUppercase) strength++;
    if (passwordValidation.hasNumber) strength++;
    if (passwordValidation.hasSpecial) strength++;
    return strength;
  }, [passwordValidation]);

  const getPasswordStrengthLabel = () => {
    if (passwordData.newPassword.length === 0) return "";
    if (passwordStrength === 1) return "Weak";
    if (passwordStrength === 2) return "Fair";
    if (passwordStrength === 3) return "Good";
    if (passwordStrength === 4) return "Strong";
    return "Very Weak";
  };

  const getPasswordStrengthColor = (level: number) => {
    if (passwordStrength >= level) {
      if (passwordStrength === 1) return "bg-red-500";
      if (passwordStrength === 2) return "bg-orange-500";
      if (passwordStrength === 3) return "bg-yellow-500";
      return "bg-green-500";
    }
    return "bg-secondary-200";
  };

  // Section status calculations
  const sectionStatuses = useMemo(() => {
    const profileComplete = profileData.name && profileData.email;
    const notificationsComplete = true; // Always complete as defaults are set
    const privacyComplete = true; // Always complete as defaults are set

    return {
      profile: profileComplete ? "complete" : "incomplete",
      password: "complete", // Always complete since it's optional
      notifications: notificationsComplete ? "complete" : "incomplete",
      privacy: privacyComplete ? "complete" : "incomplete",
    } as Record<string, SectionStatus>;
  }, [profileData]);

  // Section toggle handler
  const toggleSection = useCallback((sectionId: string) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  }, []);

  // Handle section click from progress bar
  const handleSectionClick = useCallback((sectionId: string) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      newSet.add(sectionId);
      return newSet;
    });
    // Scroll to section
    setTimeout(() => {
      document.getElementById(`section-content-${sectionId}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  }, []);

  // Progress sections (excluding Password and Danger Zone as they are optional)
  const sections = [
    { id: "profile", name: "Profile", status: sectionStatuses.profile },
    { id: "notifications", name: "Notifications", status: sectionStatuses.notifications },
    { id: "privacy", name: "Privacy", status: sectionStatuses.privacy },
  ];

  // Get summary text for collapsed sections
  const getSummary = (sectionId: string) => {
    switch (sectionId) {
      case "profile":
        return profileData.name || "Not set";
      case "password":
        return "Change your password";
      case "notifications":
        return notificationSettings.emailNotifications ? "Email notifications enabled" : "Notifications disabled";
      case "privacy":
        return privacySettings.profileVisibility === "public" ? "Profile is public" : "Profile is private";
      default:
        return "";
    }
  };

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
        showToast("error", "Load Failed", err.response?.data?.error || "Failed to load settings");
        setIsLoading(false);
      }
    };

    if (status === "authenticated" && session?.user?.role === "CANDIDATE") {
      loadSettings();
    }
  }, [status, session, showToast]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

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

      showToast("success", "Profile Updated", "Your profile has been updated successfully");
      setIsSaving(false);
    } catch (err: any) {
      console.error("Failed to update profile:", err);
      showToast("error", "Update Failed", err.response?.data?.error || "Failed to update profile");
      setIsSaving(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast("error", "Passwords don't match", "New password and confirm password must be the same");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      showToast("error", "Password too short", "Password must be at least 8 characters");
      return;
    }

    // Check password strength
    const hasLowercase = /[a-z]/.test(passwordData.newPassword);
    const hasUppercase = /[A-Z]/.test(passwordData.newPassword);
    const hasNumber = /\d/.test(passwordData.newPassword);

    if (!hasLowercase || !hasUppercase || !hasNumber) {
      showToast("error", "Weak password", "Password must contain at least one uppercase letter, one lowercase letter, and one number");
      return;
    }

    setIsSaving(true);

    try {
      await api.post("/api/settings/password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      showToast("success", "Password Changed", "Your password has been updated successfully");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setIsSaving(false);
    } catch (err: any) {
      console.error("Failed to update password:", err);
      showToast("error", "Password change failed", err.response?.data?.error || "Failed to update password");
      setIsSaving(false);
    }
  };

  const handleNotificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

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

      showToast("success", "Preferences Saved", "Your notification preferences have been updated");
      setIsSaving(false);
    } catch (err: any) {
      console.error("Failed to update preferences:", err);
      showToast("error", "Update Failed", err.response?.data?.error || "Failed to update preferences");
      setIsSaving(false);
    }
  };

  const handlePrivacySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

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

      showToast("success", "Privacy Updated", "Your privacy settings have been updated");
      setIsSaving(false);
    } catch (err: any) {
      console.error("Failed to update privacy settings:", err);
      showToast("error", "Update Failed", err.response?.data?.error || "Failed to update privacy settings");
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

    try {
      await api.delete("/api/settings");

      showToast("success", "Account Deleted", "Your account has been deleted");
      // Sign out the user after account deletion
      await signOut({ redirect: false });
      router.push("/");
    } catch (err: any) {
      console.error("Failed to delete account:", err);
      showToast("error", "Deletion Failed", err.response?.data?.error || "Failed to delete account");
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
          {/* Progress Header */}
          <SettingsProgress
            sections={sections}
            onSectionClick={handleSectionClick}
            title="Candidate Settings"
            description="Manage your profile and account preferences"
          />

          {/* Collapsible Sections */}
          <div className="space-y-4">
            {/* Profile Information */}
            <CollapsibleSection
              id="profile"
              icon={<User className="h-5 w-5" />}
              iconBgColor="bg-primary-100"
              iconColor="text-primary-600"
              title="Profile Information"
              description="Update your personal information"
              summary={getSummary("profile")}
              status={sectionStatuses.profile}
              isExpanded={expandedSections.has("profile")}
              onToggle={() => toggleSection("profile")}
              variant="accent"
            >
              <form onSubmit={handleProfileSubmit}>
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-secondary-700">
                      Full Name <span className="text-error-600">*</span>
                    </label>
                    <Input
                      variant="modern"
                      leftIcon={<User className="h-5 w-5" />}
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      placeholder="John Doe"
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-secondary-700">
                      Email Address
                    </label>
                    <Input
                      variant="modern"
                      leftIcon={<Mail className="h-5 w-5" />}
                      type="email"
                      value={profileData.email}
                      disabled
                      className="bg-secondary-100 cursor-not-allowed"
                    />
                    <p className="mt-1 text-xs text-secondary-500">
                      Contact support to change your email address
                    </p>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-secondary-700">
                      Phone Number
                    </label>
                    <Input
                      variant="modern"
                      leftIcon={<Phone className="h-5 w-5" />}
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-secondary-700">
                      Location
                    </label>
                    <Input
                      variant="modern"
                      leftIcon={<MapPin className="h-5 w-5" />}
                      value={profileData.location}
                      onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                      placeholder="City, Country"
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
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
            </CollapsibleSection>

            {/* Change Password */}
            <CollapsibleSection
              id="password"
              icon={<Lock className="h-5 w-5" />}
              iconBgColor="bg-warning-100"
              iconColor="text-warning-600"
              title="Change Password"
              description="Update your password to keep your account secure"
              summary={getSummary("password")}
              status={sectionStatuses.password}
              isExpanded={expandedSections.has("password")}
              onToggle={() => toggleSection("password")}
              variant="accent"
            >
              <form onSubmit={handlePasswordSubmit}>
                <div className="space-y-5">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-secondary-700">
                      Current Password <span className="text-error-600">*</span>
                    </label>
                    <div className="relative">
                      <Input
                        variant="modern"
                        leftIcon={<Lock className="h-5 w-5" />}
                        type={showCurrentPassword ? "text" : "password"}
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        placeholder="Enter current password"
                        required
                        className="pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-secondary-600 transition-colors"
                      >
                        {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-secondary-700">
                      New Password <span className="text-error-600">*</span>
                    </label>
                    <div className="relative">
                      <Input
                        variant="modern"
                        leftIcon={<Lock className="h-5 w-5" />}
                        type={showNewPassword ? "text" : "password"}
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        placeholder="Enter new password"
                        required
                        className="pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-secondary-600 transition-colors"
                      >
                        {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>

                    {/* Password Strength Indicator */}
                    {passwordData.newPassword.length > 0 && (
                      <div className="mt-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-secondary-500">Password strength</span>
                          <span className={`text-xs font-medium ${
                            passwordStrength <= 1 ? "text-red-500" :
                            passwordStrength === 2 ? "text-orange-500" :
                            passwordStrength === 3 ? "text-yellow-600" : "text-green-500"
                          }`}>
                            {getPasswordStrengthLabel()}
                          </span>
                        </div>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4].map((level) => (
                            <div
                              key={level}
                              className={`h-1.5 flex-1 rounded-full transition-colors ${getPasswordStrengthColor(level)}`}
                            />
                          ))}
                        </div>

                        {/* Validation checklist */}
                        <div className="mt-3 grid grid-cols-2 gap-2">
                          {[
                            { key: "minLength", label: "8+ characters" },
                            { key: "hasLowercase", label: "Lowercase letter" },
                            { key: "hasUppercase", label: "Uppercase letter" },
                            { key: "hasNumber", label: "Number" },
                            { key: "hasSpecial", label: "Special character" },
                          ].map(({ key, label }) => (
                            <div key={key} className="flex items-center gap-1.5">
                              {passwordValidation[key as keyof typeof passwordValidation] ? (
                                <Check className="h-3.5 w-3.5 text-green-500" />
                              ) : (
                                <XCircle className="h-3.5 w-3.5 text-secondary-300" />
                              )}
                              <span className={`text-xs ${
                                passwordValidation[key as keyof typeof passwordValidation]
                                  ? "text-green-600"
                                  : "text-secondary-400"
                              }`}>
                                {label}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-secondary-700">
                      Confirm New Password <span className="text-error-600">*</span>
                    </label>
                    <Input
                      variant="modern"
                      leftIcon={<Lock className="h-5 w-5" />}
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      placeholder="Confirm new password"
                      required
                    />
                    {passwordData.confirmPassword.length > 0 && (
                      <div className="mt-2 flex items-center gap-1.5">
                        {passwordValidation.passwordsMatch ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-green-500" />
                            <span className="text-xs text-green-600">Passwords match</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3.5 w-3.5 text-red-500" />
                            <span className="text-xs text-red-600">Passwords don&apos;t match</span>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <Button type="submit" variant="primary" disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Update Password"
                    )}
                  </Button>
                </div>
              </form>
            </CollapsibleSection>

            {/* Notification Preferences */}
            <CollapsibleSection
              id="notifications"
              icon={<Bell className="h-5 w-5" />}
              iconBgColor="bg-accent-100"
              iconColor="text-accent-600"
              title="Notification Preferences"
              description="Choose what notifications you want to receive"
              summary={getSummary("notifications")}
              status={sectionStatuses.notifications}
              isExpanded={expandedSections.has("notifications")}
              onToggle={() => toggleSection("notifications")}
              variant="accent"
            >
              <form onSubmit={handleNotificationSubmit}>
                <div className="space-y-4">
                  {/* Disable All Notifications Toggle */}
                  <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-secondary-50 to-secondary-100/50 border border-secondary-200">
                    <div>
                      <p className="font-semibold text-secondary-900">Disable All Notifications</p>
                      <p className="text-sm text-secondary-500">Turn off all notification types at once</p>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input
                        type="checkbox"
                        checked={!Object.values(notificationSettings).some(Boolean)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            // Disable all notifications
                            setNotificationSettings({
                              emailNotifications: false,
                              jobAlerts: false,
                              applicationUpdates: false,
                              messages: false,
                              interviewReminders: false,
                              placementUpdates: false,
                              weeklyDigest: false,
                              marketingEmails: false,
                            });
                          } else {
                            // Re-enable default notifications
                            setNotificationSettings({
                              emailNotifications: true,
                              jobAlerts: true,
                              applicationUpdates: true,
                              messages: true,
                              interviewReminders: true,
                              placementUpdates: true,
                              weeklyDigest: false,
                              marketingEmails: false,
                            });
                          }
                        }}
                        className="peer sr-only"
                      />
                      <div className="peer h-6 w-11 rounded-full bg-secondary-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-secondary-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-error-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-error-500/20"></div>
                    </label>
                  </div>

                  <div className="border-t border-secondary-200 pt-4">
                    <p className="text-xs font-medium text-secondary-500 uppercase tracking-wider mb-4">Individual Preferences</p>
                    {/* Other notification options */}
                    <div className="grid gap-3 md:grid-cols-2">
                      {[
                        { key: "emailNotifications", label: "Email Notifications", description: "Receive email updates" },
                        { key: "jobAlerts", label: "Job Alerts", description: "New matching jobs" },
                        { key: "applicationUpdates", label: "Application Updates", description: "Status changes" },
                        { key: "messages", label: "Messages", description: "New messages from employers" },
                        { key: "interviewReminders", label: "Interview Reminders", description: "Upcoming interviews" },
                        { key: "placementUpdates", label: "Placement Updates", description: "Placement status" },
                        { key: "weeklyDigest", label: "Weekly Digest", description: "Weekly summary" },
                        { key: "marketingEmails", label: "Marketing Emails", description: "Tips and resources" },
                      ].map(({ key, label, description }) => (
                        <div key={key} className="flex items-center justify-between rounded-lg border border-secondary-200 bg-white p-3">
                          <div>
                            <p className="text-sm font-medium text-secondary-900">{label}</p>
                            <p className="text-xs text-secondary-500">{description}</p>
                          </div>
                          <label className="relative inline-flex cursor-pointer items-center">
                            <input
                              type="checkbox"
                              checked={notificationSettings[key as keyof typeof notificationSettings] as boolean}
                              onChange={(e) => setNotificationSettings({ ...notificationSettings, [key]: e.target.checked })}
                              className="peer sr-only"
                            />
                            <div className="peer h-5 w-9 rounded-full bg-secondary-300 after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:border after:border-secondary-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-500/20"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <Button type="submit" variant="primary" disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Preferences"
                    )}
                  </Button>
                </div>
              </form>
            </CollapsibleSection>

            {/* Privacy Settings */}
            <CollapsibleSection
              id="privacy"
              icon={<Shield className="h-5 w-5" />}
              iconBgColor="bg-success-100"
              iconColor="text-success-600"
              title="Privacy Settings"
              description="Control your profile visibility and data sharing"
              summary={getSummary("privacy")}
              status={sectionStatuses.privacy}
              isExpanded={expandedSections.has("privacy")}
              onToggle={() => toggleSection("privacy")}
              variant="accent"
            >
              <form onSubmit={handlePrivacySubmit}>
                <div className="space-y-5">
                  {/* Profile Visibility */}
                  <div className="rounded-xl border border-secondary-200 bg-gradient-to-r from-white to-secondary-50/50 p-4">
                    <label className="mb-3 block text-sm font-medium text-secondary-700">
                      Profile Visibility
                    </label>
                    <div className="grid gap-3 md:grid-cols-2">
                      <button
                        type="button"
                        onClick={() => setPrivacySettings({ ...privacySettings, profileVisibility: "public" })}
                        className={`flex items-center gap-3 rounded-lg border-2 p-4 transition-all ${
                          privacySettings.profileVisibility === "public"
                            ? "border-primary-500 bg-primary-50"
                            : "border-secondary-200 bg-white hover:border-secondary-300"
                        }`}
                      >
                        <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                          privacySettings.profileVisibility === "public" ? "bg-primary-100" : "bg-secondary-100"
                        }`}>
                          <Eye className={`h-5 w-5 ${
                            privacySettings.profileVisibility === "public" ? "text-primary-600" : "text-secondary-500"
                          }`} />
                        </div>
                        <div className="text-left">
                          <p className="font-medium text-secondary-900">Public</p>
                          <p className="text-xs text-secondary-500">Visible to all employers</p>
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPrivacySettings({ ...privacySettings, profileVisibility: "private" })}
                        className={`flex items-center gap-3 rounded-lg border-2 p-4 transition-all ${
                          privacySettings.profileVisibility === "private"
                            ? "border-primary-500 bg-primary-50"
                            : "border-secondary-200 bg-white hover:border-secondary-300"
                        }`}
                      >
                        <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                          privacySettings.profileVisibility === "private" ? "bg-primary-100" : "bg-secondary-100"
                        }`}>
                          <EyeOff className={`h-5 w-5 ${
                            privacySettings.profileVisibility === "private" ? "text-primary-600" : "text-secondary-500"
                          }`} />
                        </div>
                        <div className="text-left">
                          <p className="font-medium text-secondary-900">Private</p>
                          <p className="text-xs text-secondary-500">Only when you apply</p>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Privacy toggles */}
                  <div className="space-y-3">
                    {[
                      { key: "showEmail", label: "Show Email", description: "Display email on public profile" },
                      { key: "showPhone", label: "Show Phone", description: "Display phone on public profile" },
                      { key: "allowRecruiterContact", label: "Allow Recruiter Contact", description: "Let employers reach out directly" },
                    ].map(({ key, label, description }) => (
                      <div key={key} className="flex items-center justify-between rounded-lg border border-secondary-200 bg-white p-4">
                        <div>
                          <p className="font-medium text-secondary-900">{label}</p>
                          <p className="text-sm text-secondary-500">{description}</p>
                        </div>
                        <label className="relative inline-flex cursor-pointer items-center">
                          <input
                            type="checkbox"
                            checked={privacySettings[key as keyof typeof privacySettings] as boolean}
                            onChange={(e) => setPrivacySettings({ ...privacySettings, [key]: e.target.checked })}
                            className="peer sr-only"
                          />
                          <div className="peer h-6 w-11 rounded-full bg-secondary-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-secondary-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-500/20"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <Button type="submit" variant="primary" disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Settings"
                    )}
                  </Button>
                </div>
              </form>
            </CollapsibleSection>

          </div>

          {/* Danger Zone - Separate section outside collapsible sections */}
          <div className="overflow-hidden rounded-2xl border-2 border-error-200/60 bg-gradient-to-br from-white via-white to-error-50/30 shadow-sm mt-4">
            <div className="p-5">
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-error-100 shadow-sm">
                  <Trash2 className="h-5 w-5 text-error-600" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-error-700">
                    Danger Zone
                  </h2>
                  <p className="text-sm text-error-600/80">
                    Irreversible and destructive actions
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-error-100/60 p-6">
              <div className="rounded-xl bg-gradient-to-r from-error-50 to-error-100/50 border border-error-200/50 p-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-error-100 border border-error-200/50">
                    <AlertCircle className="h-5 w-5 text-error-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-error-900 mb-1">
                      Delete Account
                    </h3>
                    <p className="text-sm text-error-700/80 mb-4">
                      Once you delete your account, there is no going back. All your
                      applications, profile data, and saved jobs will be
                      permanently deleted.
                    </p>
                    <Button
                      variant="outline"
                      onClick={initiateAccountDeletion}
                      disabled={isSaving}
                      className="border-error-300 text-error-600 hover:bg-error-50 hover:border-error-400 transition-colors"
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
                </div>
              </div>
            </div>
          </div>
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

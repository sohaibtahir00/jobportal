"use client";

import { useProfile } from "@/hooks/useProfile";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { User, Mail, Shield, Calendar, Image as ImageIcon, Loader2 } from "lucide-react";
import { useState } from "react";

export default function CandidateProfilePage() {
  const { profile, loading, error, updateUserProfile } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ name: "" });
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const handleEdit = () => {
    if (profile) {
      setEditData({ name: profile.name });
      setIsEditing(true);
      setUpdateError(null);
      setUpdateSuccess(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setUpdateError(null);
    setUpdateSuccess(false);
  };

  const handleSave = async () => {
    try {
      setUpdateLoading(true);
      setUpdateError(null);
      setUpdateSuccess(false);

      await updateUserProfile({ name: editData.name });

      setUpdateSuccess(true);
      setIsEditing(false);

      // Clear success message after 3 seconds
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (err: any) {
      setUpdateError(err.message || "Failed to update profile");
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading your profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Profile</h2>
            <p className="text-red-700">{error}</p>
            <Button onClick={() => window.location.reload()} className="mt-4" variant="outline">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-6">
            <p className="text-gray-600">No profile data available.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your account information</p>
        </div>

        {/* Success Message */}
        {updateSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 font-medium">✓ Profile updated successfully!</p>
          </div>
        )}

        {/* Error Message */}
        {updateError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 font-medium">✗ {updateError}</p>
          </div>
        )}

        {/* Profile Card */}
        <Card className="mb-6">
          <CardHeader className="border-b border-gray-200">
            <div className="flex items-center justify-between">
              <CardTitle>Basic Information</CardTitle>
              {!isEditing && (
                <Button onClick={handleEdit} variant="outline" size="sm">
                  Edit Profile
                </Button>
              )}
            </div>
          </CardHeader>

          <CardContent className="p-6">
            {/* Profile Image */}
            <div className="mb-6 flex items-center gap-6">
              <div className="relative">
                {profile.image ? (
                  <img
                    src={profile.image}
                    alt={profile.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-gray-100"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center border-4 border-gray-100">
                    <span className="text-3xl font-bold text-white">
                      {profile.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900">{profile.name}</h2>
                <p className="text-gray-600">{profile.role}</p>
                {!isEditing && (
                  <Button variant="ghost" size="sm" className="mt-2" disabled>
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Change Photo (Coming Soon)
                  </Button>
                )}
              </div>
            </div>

            {/* Profile Fields */}
            <div className="space-y-6">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                ) : (
                  <p className="text-gray-900 text-lg">{profile.name}</p>
                )}
              </div>

              {/* Email Field (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Address
                </label>
                <p className="text-gray-900 text-lg">{profile.email}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {profile.emailVerified
                    ? "✓ Verified"
                    : "⚠ Not verified"}
                </p>
              </div>

              {/* Role Field (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Account Type
                </label>
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
                  {profile.role}
                </div>
              </div>

              {/* Status Field (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Account Status
                </label>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  profile.status === 'ACTIVE'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {profile.status}
                </div>
              </div>

              {/* Member Since */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Member Since
                </label>
                <p className="text-gray-900">
                  {new Date(profile.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>

            {/* Edit Mode Actions */}
            {isEditing && (
              <div className="mt-8 flex items-center gap-3 pt-6 border-t border-gray-200">
                <Button
                  onClick={handleSave}
                  disabled={updateLoading || !editData.name.trim()}
                  variant="primary"
                >
                  {updateLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
                <Button
                  onClick={handleCancel}
                  disabled={updateLoading}
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Additional Profile Sections Notice */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <h3 className="font-semibold text-blue-900 mb-2">Complete Your Profile</h3>
            <p className="text-blue-800 text-sm mb-4">
              Add more details to your candidate profile including skills, experience, education, and preferences.
            </p>
            <Button variant="outline" size="sm" disabled>
              Complete Profile (Coming Soon)
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

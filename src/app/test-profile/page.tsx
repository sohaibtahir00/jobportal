"use client";

import { useProfile } from "@/hooks/useProfile";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui";
import { useState } from "react";

/**
 * Test page to verify Profile API connection
 * Visit /test-profile after logging in to test
 */
export default function TestProfilePage() {
  const { data: session, status } = useSession();
  const { profile, loading, error, refreshProfile, updateUserProfile } = useProfile();
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const handleUpdateProfile = async () => {
    try {
      setUpdateLoading(true);
      setUpdateError(null);
      setUpdateSuccess(false);

      await updateUserProfile({
        name: profile?.name + " (Updated)",
      });

      setUpdateSuccess(true);
    } catch (err: any) {
      setUpdateError(err.message);
    } finally {
      setUpdateLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-4">Profile API Test</h1>
        <p className="text-gray-600">Loading session...</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-4">Profile API Test</h1>
        <p className="text-red-600">You must be logged in to test the profile API.</p>
        <a href="/login" className="text-blue-600 hover:underline">
          Go to Login
        </a>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">Profile API Test</h1>

      <div className="mb-8 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Session Info</h2>
        <pre className="text-sm overflow-auto">
          {JSON.stringify(session, null, 2)}
        </pre>
      </div>

      {loading && (
        <div className="p-4 bg-blue-100 text-blue-800 rounded-lg mb-4">
          Loading profile from backend...
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-100 text-red-800 rounded-lg mb-4">
          <strong>Error:</strong> {error}
          <br />
          <Button onClick={refreshProfile} className="mt-2" size="sm">
            Retry
          </Button>
        </div>
      )}

      {profile && (
        <div className="mb-8 p-4 bg-green-100 rounded-lg">
          <h2 className="text-xl font-semibold mb-2 text-green-800">
            ✅ Profile API Connected Successfully!
          </h2>
          <div className="text-sm">
            <p><strong>User ID:</strong> {profile.id}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Name:</strong> {profile.name}</p>
            <p><strong>Role:</strong> {profile.role}</p>
            <p><strong>Status:</strong> {profile.status}</p>
            {profile.image && <p><strong>Image:</strong> {profile.image}</p>}
          </div>

          <div className="mt-4">
            <h3 className="font-semibold mb-2">Full Profile Data:</h3>
            <pre className="text-xs overflow-auto bg-white p-2 rounded">
              {JSON.stringify(profile, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {profile && (
        <div className="mb-8 p-4 bg-white border border-gray-300 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Test Update Profile</h2>

          {updateSuccess && (
            <div className="p-3 bg-green-100 text-green-800 rounded mb-4">
              ✅ Profile updated successfully!
            </div>
          )}

          {updateError && (
            <div className="p-3 bg-red-100 text-red-800 rounded mb-4">
              ❌ Update failed: {updateError}
            </div>
          )}

          <p className="text-sm text-gray-600 mb-4">
            This will append " (Updated)" to your name to test the PATCH /api/profile endpoint.
          </p>

          <Button
            onClick={handleUpdateProfile}
            disabled={updateLoading}
            variant="primary"
          >
            {updateLoading ? "Updating..." : "Test Update Name"}
          </Button>
        </div>
      )}

      <div className="mt-8">
        <Button onClick={refreshProfile} variant="outline">
          Refresh Profile
        </Button>
      </div>
    </div>
  );
}

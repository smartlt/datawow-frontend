"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../utils/api";

// Define API response types
interface UserProfileResponse {
  success: boolean;
  data: UserProfile;
}

// Define user profile type
type UserProfile = {
  id: string;
  username: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  preferences: {
    theme: string;
    notifications: boolean;
    language: string;
  };
};

export default function Dashboard() {
  const { user, accessToken, isAuthenticated, isLoading, logout } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState("");
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  // Fetch user profile when authenticated
  useEffect(() => {
    if (isAuthenticated && accessToken) {
      fetchUserProfile();
    }
  }, [isAuthenticated, accessToken]);

  // Fetch user profile from the API
  const fetchUserProfile = async () => {
    setProfileLoading(true);
    setProfileError("");

    try {
      const response = await api.get<UserProfileResponse>("/user/profile");
      setProfile(response.data);
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      setProfileError("Failed to load user profile. Please try again.");
    } finally {
      setProfileLoading(false);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-main-green-500 text-white">
        <p>Loading...</p>
      </div>
    );
  }

  // If we're not loading and the user is not authenticated, we're being redirected
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-main-green-500 text-white">
        <p>Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-main-green-500 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded transition-colors"
          >
            Logout
          </button>
        </div>

        <div className="bg-main-green-300 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            Welcome, {user?.username}!
          </h2>
          <p>You are successfully logged in.</p>
        </div>

        <div className="bg-main-green-300 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Your Profile</h2>

          {profileLoading && <p>Loading profile data...</p>}

          {profileError && (
            <div className="text-red-300 mb-4">
              {profileError}
              <button onClick={fetchUserProfile} className="ml-2 underline">
                Try again
              </button>
            </div>
          )}

          {profile && !profileLoading && (
            <div className="space-y-2">
              <p>
                <strong>User ID:</strong> {profile.id}
              </p>
              <p>
                <strong>Username:</strong> {profile.username}
              </p>
              <p>
                <strong>Email:</strong> {profile.email}
              </p>
              <p>
                <strong>Name:</strong> {profile.name}
              </p>
              <p>
                <strong>Role:</strong> {profile.role}
              </p>
              <p>
                <strong>Account Created:</strong>{" "}
                {new Date(profile.createdAt).toLocaleDateString()}
              </p>

              <div className="mt-4">
                <h3 className="text-lg font-medium mb-2">Preferences</h3>
                <div className="bg-main-green-400 p-3 rounded">
                  <p>
                    <strong>Theme:</strong> {profile.preferences.theme}
                  </p>
                  <p>
                    <strong>Notifications:</strong>{" "}
                    {profile.preferences.notifications ? "Enabled" : "Disabled"}
                  </p>
                  <p>
                    <strong>Language:</strong> {profile.preferences.language}
                  </p>
                </div>
              </div>
            </div>
          )}

          {!profile && !profileLoading && !profileError && (
            <div>
              <p>No profile data available.</p>
              <button
                onClick={fetchUserProfile}
                className="mt-2 px-3 py-1 bg-main-green-400 rounded"
              >
                Load Profile
              </button>
            </div>
          )}
        </div>

        <div className="bg-main-green-300 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Your Access Token</h2>
          <div className="bg-gray-800 p-4 rounded overflow-x-auto">
            <pre className="text-green-400 text-sm">{accessToken}</pre>
          </div>
          <p className="mt-4 text-sm opacity-75">
            This token is used for authenticating your requests to the API. Keep
            it secure and do not share it with anyone.
          </p>
        </div>
      </div>
    </div>
  );
}

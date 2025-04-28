"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";

export default function BlogPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

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
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto p-4 pt-[3.5rem] md:pt-4 md:pl-[260px]">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h1 className="text-2xl font-bold mb-6">Our Blog</h1>
          <p className="text-gray-700">
            Welcome to our blog section. This is where we share our thoughts,
            ideas, and stories with our community.
          </p>
          <p className="text-gray-700 mt-4">
            Check back soon for more content and features in this section!
          </p>
        </div>
      </div>
    </div>
  );
}

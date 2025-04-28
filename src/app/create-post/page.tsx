"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import CreatePost from "../components/CreatePost";
import useCategories from "../hooks/useCategories";

export default function CreatePostPage() {
  const { isAuthenticated, isLoading: authLoading, accessToken } = useAuth();
  const router = useRouter();

  // Use our custom hook to fetch categories
  const {
    categories,
    isLoading: categoriesLoading,
    error,
  } = useCategories(isAuthenticated, accessToken);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  // Show loading state
  if (authLoading) {
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
    <CreatePost
      categories={categories}
      isLoading={categoriesLoading}
      error={error}
    />
  );
}

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import PostsLayout from "../components/PostsLayout";
import usePostsAndCategories from "../hooks/usePostsAndCategories";

export default function DashboardPage() {
  const { isAuthenticated, isLoading: authLoading, accessToken } = useAuth();
  const router = useRouter();

  // Use our custom hook to fetch posts and categories
  const { posts, categories, isLoading, error, refetch } =
    usePostsAndCategories(isAuthenticated, accessToken);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  // Show loading state while authentication is in progress
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
    <PostsLayout
      posts={posts}
      categories={categories}
      isLoading={isLoading}
      error={error}
      title="All Posts"
      variant="dashboard"
      onPostCreated={refetch}
    />
  );
}

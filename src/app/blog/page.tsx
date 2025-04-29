"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import PostsLayout from "../components/PostsLayout";
import usePostsAndCategories from "../hooks/usePostsAndCategories";

export default function BlogPage() {
  const { isAuthenticated, isLoading: authLoading, accessToken } = useAuth();
  const router = useRouter();

  // Fetch posts and categories
  const {
    posts,
    categories,
    isLoading: dataLoading,
    error,
    refetch,
  } = usePostsAndCategories(isAuthenticated, accessToken);

  // Determine overall loading state
  const isLoading = authLoading || dataLoading;

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  // Show loading state while authentication is in progress
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  // If we're not loading and the user is not authenticated, we're being redirected
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
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
      title="My Blog"
      variant="blog"
      onPostCreated={refetch}
    />
  );
}

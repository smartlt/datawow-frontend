"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import PostsLayout from "../components/PostsLayout";
import useMyPosts from "../hooks/useMyPosts";
import useCategories from "../hooks/useCategories";

export default function BlogPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading, accessToken } = useAuth();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, authLoading, router]);

  // Fetch user's posts
  const {
    posts,
    isLoading: postsLoading,
    error: postsError,
    refetch: refetchPosts,
  } = useMyPosts(isAuthenticated, accessToken);

  // Fetch categories
  const {
    categories,
    isLoading: categoriesLoading,
    error: categoriesError,
    refetch: refetchCategories,
  } = useCategories(isAuthenticated, accessToken);

  // Determine overall loading state
  const isLoading = authLoading || postsLoading || categoriesLoading;

  // Determine error state (prioritize posts error)
  const error = postsError || categoriesError;

  // Combined refetch function
  const refetch = async () => {
    await Promise.all([refetchPosts(), refetchCategories()]);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p>Loading...</p>
      </div>
    );
  }

  // If not authenticated and not loading, we'd redirect (handled by useEffect)
  if (!isAuthenticated && !authLoading) {
    return null;
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

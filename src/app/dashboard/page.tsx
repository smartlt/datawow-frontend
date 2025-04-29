"use client";

import { useAuth } from "../contexts/AuthContext";
import PostsLayout from "../components/PostsLayout";
import usePostsAndCategories from "../hooks/usePostsAndCategories";

export default function DashboardPage() {
  const { isAuthenticated, isLoading: authLoading, accessToken } = useAuth();

  // Use our custom hook to fetch posts and categories
  const { posts, categories, isLoading, error, refetch } =
    usePostsAndCategories(true, accessToken);

  // Show loading state while authentication is in progress or data is loading
  if (isLoading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p>Loading...</p>
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

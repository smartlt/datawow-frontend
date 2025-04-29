"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import usePost from "@/app/hooks/usePost";
import { useAuth } from "@/app/contexts/AuthContext";
import Post from "@/app/components/Post";

export default function PostPage() {
  const { isAuthenticated, isLoading: authLoading, accessToken } = useAuth();
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;

  // Use our custom hook to fetch post data
  const { post, comments, isLoading, error, refetch } = usePost(
    postId,
    isAuthenticated,
    accessToken
  );

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
    <Post
      post={post}
      comments={comments}
      isLoading={isLoading}
      error={error}
      refetch={refetch}
    />
  );
}

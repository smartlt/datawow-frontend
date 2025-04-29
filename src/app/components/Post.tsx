"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Post as PostType, Comment } from "./Dashboard";
import { api } from "../utils/api";
import { timeAgo } from "../utils/timeUtils";
import { CommentSection } from "./CommentSection";

interface PostProps {
  post: PostType | null;
  comments: Comment[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

interface CommentResponse {
  success: boolean;
  message: string;
  data: Comment;
}

export default function Post({
  post,
  comments,
  isLoading,
  error,
  refetch,
}: PostProps) {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 pt-[3.5rem] md:pt-4 md:pl-[260px]">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg p-6 shadow-sm flex justify-center items-center h-64">
            <p className="text-gray-500">Loading post...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 pt-[3.5rem] md:pt-4 md:pl-[260px]">
        <div className="max-w-3xl mx-auto">
          <div className="bg-red-50 text-red-500 p-6 rounded-lg shadow-sm">
            <p>{error}</p>
            <button
              onClick={refetch}
              className="mt-4 bg-main-green-500 text-white px-4 py-2 rounded-md"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 pt-[3.5rem] md:pt-4 md:pl-[260px]">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <p className="text-gray-500">Post not found.</p>
            <button
              onClick={() => router.push("/dashboard")}
              className="mt-4 bg-main-green-500 text-white px-4 py-2 rounded-md"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4 pt-[3.5rem] md:pt-4 md:pl-[260px]">
      <div className="max-w-3xl mx-auto">
        {/* Back button */}
        <button
          onClick={handleBack}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4 bg-main-green-100 p-2 rounded-full"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {/* Post content */}
        <div className="bg-white mb-4">
          {/* Author info */}
          <div className="flex items-center mb-2">
            <div className="h-10 w-10 relative overflow-hidden rounded-full mr-3">
              <div className="bg-gray-200 h-full w-full flex items-center justify-center">
                <span className="text-gray-400 font-medium text-lg">
                  {post.author.username.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
            <div>
              <p className="font-medium">
                {post.author.username}{" "}
                <span className="text-sm text-gray-500">
                  {timeAgo(post.createdAt)}
                </span>
              </p>
            </div>
          </div>

          {/* Category badge */}
          <div className="mb-3">
            <span className="inline-flex items-center rounded-full bg-[#F3F3F3] px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-gray-500/10 ring-inset">
              {post.category.name}
            </span>
          </div>

          {/* Post title and content */}
          <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
          <p className="text-gray-700 mb-4 whitespace-pre-line">
            {post.content}
          </p>

          {/* Comment Section */}
          <CommentSection
            postId={post._id}
            comments={comments}
            refetch={refetch}
          />
        </div>
      </div>
    </div>
  );
}

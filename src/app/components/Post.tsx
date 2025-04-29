"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Post as PostType, Comment } from "./Dashboard";
import { api } from "../utils/api";
import { useComments } from "../hooks/useComments";

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
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const {
    newComment,
    setNewComment,
    isSubmitting,
    error: commentError,
    submitComment,
    resetComment,
  } = useComments({
    postId: post?._id || "",
    onSuccess: () => {
      setShowCommentForm(false);
      refetch();
    },
  });

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkIfMobile();

    // Add event listener
    window.addEventListener("resize", checkIfMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node) &&
        isMobile
      ) {
        setShowCommentForm(false);
      }
    };

    if (showCommentForm && isMobile) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCommentForm, isMobile]);

  const handleBack = () => {
    router.back();
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitComment();
  };

  const handleCancel = () => {
    resetComment();
    setShowCommentForm(false);
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

  const timeAgo = (date: string) => {
    // Simple time ago function - could be replaced with a library
    const now = new Date();
    const past = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} mins ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

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

          {/* Comments count and Add Comments button */}
          <div className="flex items-center justify-between mt-6 mb-4">
            <div className="flex items-center text-gray-500 text-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
              <span>{comments.length} Comments</span>
            </div>
          </div>
          {!showCommentForm && (
            <button
              onClick={() => setShowCommentForm(true)}
              className="bg-transparent hover:bg-success text-success hover:text-white px-4 py-2 rounded-md border border-success"
            >
              Add Comments
            </button>
          )}
        </div>

        {/* Desktop Comment Form */}
        {showCommentForm && !isMobile && (
          <div className="bg-white rounded-lg p-6 shadow-sm mb-4">
            <h2 className="font-bold mb-4">Add Comment</h2>
            <form onSubmit={handleSubmitComment}>
              {commentError && (
                <div className="mb-3 p-3 bg-red-50 text-red-500 rounded-md">
                  {commentError}
                </div>
              )}
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main-green-300 mb-3"
                placeholder="Write your comment here..."
                rows={3}
                disabled={isSubmitting}
                autoFocus
              ></textarea>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#40a575] hover:bg-[#4ab483] text-white px-4 py-2 rounded-md transition-colors"
                  disabled={isSubmitting || !newComment.trim()}
                >
                  {isSubmitting ? "Posting..." : "Post"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Mobile Comment Modal */}
        {showCommentForm && isMobile && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div ref={modalRef} className="bg-white rounded-lg w-full max-w-md">
              <div className="flex justify-between items-center border-b p-4">
                <h2 className="font-bold">Add Comments</h2>
                <button onClick={handleCancel} className="text-gray-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleSubmitComment} className="p-4">
                {commentError && (
                  <div className="mb-3 p-3 bg-red-50 text-red-500 rounded-md">
                    {commentError}
                  </div>
                )}
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main-green-300 mb-3"
                  placeholder="What's on your mind..."
                  rows={3}
                  disabled={isSubmitting}
                  autoFocus
                ></textarea>
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#40a575] hover:bg-[#4ab483] text-white px-4 py-2 rounded-md transition-colors"
                    disabled={isSubmitting || !newComment.trim()}
                  >
                    Post
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Comments list */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="font-bold mb-4">Comments</h2>

          {comments.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              No comments yet. Be the first to comment!
            </p>
          ) : (
            <div className="space-y-6">
              {comments.map((comment) => (
                <div
                  key={comment._id}
                  className="border-b border-gray-100 pb-6 last:border-0 last:pb-0"
                >
                  <div className="flex items-center mb-2">
                    <div className="h-8 w-8 relative overflow-hidden rounded-full mr-3">
                      <div className="bg-gray-200 h-full w-full flex items-center justify-center">
                        <span className="text-gray-400 font-medium text-sm">
                          {comment.author.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="font-medium">{comment.author.username}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 pl-11">{comment.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

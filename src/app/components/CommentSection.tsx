"use client";

import { useState, useEffect } from "react";
import { CommentForm } from "./CommentForm";
import { CommentList } from "./CommentList";
import { Comment } from "./Dashboard";

interface CommentSectionProps {
  postId: string;
  comments: Comment[];
  refetch: () => Promise<void>;
}

export const CommentSection = ({
  postId,
  comments,
  refetch,
}: CommentSectionProps) => {
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

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

  const handleCancel = () => {
    setShowCommentForm(false);
  };

  const handleSuccess = () => {
    setShowCommentForm(false);
    refetch();
  };

  return (
    <>
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
          className="bg-transparent hover:bg-success text-success hover:text-white px-4 py-2 rounded-md border border-success transition-colors"
        >
          Add Comments
        </button>
      )}

      {/* Comment Form */}
      {showCommentForm && (
        <CommentForm
          postId={postId}
          onCancel={handleCancel}
          onSuccess={handleSuccess}
          isMobile={isMobile}
        />
      )}

      {/* Comments list */}
      <div className="bg-white py-6">
        <CommentList comments={comments} />
      </div>
    </>
  );
};

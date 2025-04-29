"use client";

import { useRef, useEffect } from "react";
import { useComments } from "../hooks/useComments";

interface CommentFormProps {
  postId: string;
  onCancel: () => void;
  onSuccess: () => void;
  isMobile: boolean;
}

export const CommentForm = ({
  postId,
  onCancel,
  onSuccess,
  isMobile,
}: CommentFormProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const {
    newComment,
    setNewComment,
    isSubmitting,
    error: commentError,
    submitComment,
  } = useComments({
    postId,
    onSuccess,
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node) &&
        isMobile
      ) {
        onCancel();
      }
    };

    if (isMobile) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobile, onCancel]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitComment();
  };

  if (isMobile) {
    return (
      <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4">
        <div ref={modalRef} className="bg-white rounded-lg w-full max-w-md">
          <div className="flex justify-between items-center p-4">
            <h1 className="font-bold">Add Comments</h1>
            <button onClick={onCancel} className="relative">
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
          <form onSubmit={handleSubmit} className="p-4">
            {commentError && (
              <div className="mb-3 p-3 bg-red-50 text-red-500 rounded-md">
                {commentError}
              </div>
            )}
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full p-3 rounded-md mb-3"
              placeholder="What's on your mind..."
              rows={3}
              disabled={isSubmitting}
              autoFocus
            ></textarea>
            <div className="grid grid-cols-1 gap-2">
              <div className="col-span-1">
                <button
                  type="button"
                  onClick={onCancel}
                  className="w-full bg-transparent hover:bg-success border border-success text-success hover:text-white px-4 py-2 rounded-md transition-colors"
                >
                  Cancel
                </button>
              </div>
              <div className="col-span-1">
                <button
                  type="submit"
                  className="w-full bg-success hover:bg-success-hover text-white px-4 py-2 rounded-md transition-colors"
                  disabled={isSubmitting || !newComment.trim()}
                >
                  Post
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white py-4 mb-4">
      <form onSubmit={handleSubmit}>
        {commentError && (
          <div className="mb-3 p-3 bg-red-50 text-red-500 rounded-md">
            {commentError}
          </div>
        )}
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="w-full p-3 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-main-green-300 mb-3"
          placeholder="What's on your mind..."
          rows={3}
          disabled={isSubmitting}
          autoFocus
        ></textarea>
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onCancel}
            className="bg-transparent border border-success text-success hover:bg-success hover:text-white px-4 py-2 rounded-md transition-colors"
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
  );
};

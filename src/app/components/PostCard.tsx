"use client";

import { useState } from "react";
import { Post } from "./Dashboard";
import Link from "next/link";
import { timeAgo } from "../utils/timeUtils";
import { useAuth } from "../contexts/AuthContext";
import { EditPostModal } from "./EditPostModal";
import { DeleteConfirmationModal } from "./DeleteConfirmationModal";
import { api } from "../utils/api";

interface PostCardProps {
  post: Post;
  truncateLength?: number;
  categories: any[];
  onPostUpdated?: () => void;
  className?: string;
  searchTerm?: string;
}

export const PostCard = ({
  post,
  truncateLength = 200,
  categories = [],
  onPostUpdated,
  className = "",
  searchTerm = "",
}: PostCardProps) => {
  const { user } = useAuth();
  const isAuthor = user?.id === post.author._id;
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Function to truncate content to a specific length
  const truncateContent = (
    content: string,
    maxLength: number = truncateLength
  ) => {
    if (content.length <= maxLength) return content;
    return content.slice(0, maxLength) + "...";
  };

  // Function to highlight matched text in title
  const highlightMatch = (text: string, searchTerm: string) => {
    if (!searchTerm || !text) return <>{text}</>;

    // Case-insensitive search
    const regex = new RegExp(`(${searchTerm})`, "gi");
    const parts = text.split(regex);

    return (
      <>
        {parts.map((part, i) =>
          regex.test(part) ? (
            <span key={i} className="bg-golden text-white font-semibold">
              {part}
            </span>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </>
    );
  };

  // Handle edit button click
  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditModalOpen(true);
  };

  // Handle delete button click
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDeleteModalOpen(true);
  };

  // Handle delete confirmation
  const handleConfirmDelete = async () => {
    try {
      setIsDeleting(true);
      await api.delete(`posts/${post._id}`);
      setIsDeleteModalOpen(false);
      onPostUpdated?.();
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Determine if post title matches search term
  const titleMatches =
    searchTerm && post.title.toLowerCase().includes(searchTerm.toLowerCase());

  return (
    <div
      className={`bg-white p-6 border-b border-gray-100 hover:shadow-md transition-shadow ${className} ${
        titleMatches ? "ring-2 ring-golden" : ""
      }`}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center mb-2">
          <div className="h-10 w-10 relative overflow-hidden rounded-full mr-3">
            <div className="bg-gray-200 h-full w-full flex items-center justify-center">
              <span className="text-gray-400 font-medium text-lg">
                {post.author.username.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
          <div>
            <p className="font-medium">{post.author.username}</p>
          </div>
        </div>

        {isAuthor && (
          <div className="flex space-x-2">
            <button
              className="text-gray-400 hover:text-success"
              onClick={handleEditClick}
              disabled={isDeleting}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
            </button>
            <button
              className="text-gray-400 hover:text-red-500"
              onClick={handleDeleteClick}
              disabled={isDeleting}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        )}
      </div>

      <span className="inline-flex items-center rounded-full bg-[#F3F3F3] px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-gray-500/10 ring-inset">
        {post.category.name}
      </span>

      <Link href={`/posts/${post._id}`} className="block">
        <h2 className="text-xl font-bold mb-2 mt-2 hover:text-main-green-300 transition-colors">
          {searchTerm ? highlightMatch(post.title, searchTerm) : post.title}
        </h2>
        <p className="text-gray-700 mb-4 hover:text-gray-900 transition-colors">
          {truncateContent(post.content)}
        </p>
      </Link>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center text-gray-400">
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
          <span>{post.comments.length} Comments</span>
        </div>
        {/* <span>{timeAgo(post.createdAt)}</span> */}
      </div>

      {/* Edit Post Modal */}
      {isEditModalOpen && (
        <EditPostModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          categories={categories}
          post={post}
          onSuccess={() => {
            onPostUpdated?.();
            setIsEditModalOpen(false);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onCancel={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

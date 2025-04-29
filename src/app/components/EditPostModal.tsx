"use client";

import { useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useEditPost } from "../hooks/useEditPost";
import { Category, Post } from "./Dashboard";
import { PostForm } from "./PostForm";

interface EditPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  post: Post;
  onSuccess?: () => void;
}

export const EditPostModal = ({
  isOpen,
  onClose,
  categories,
  post,
  onSuccess,
}: EditPostModalProps) => {
  const router = useRouter();
  const modalRef = useRef<HTMLDivElement>(null);

  const {
    title,
    setTitle,
    content,
    setContent,
    categoryId,
    setCategoryId,
    isSubmitting,
    error,
    updatePost,
    resetForm,
  } = useEditPost({
    postId: post._id,
    initialData: {
      title: post.title,
      content: post.content,
      categoryId: post.category._id,
    },
    onSuccess: (updatedPost) => {
      onSuccess?.();
      router.push(`/posts/${updatedPost._id}`);
    },
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node) &&
        !isSubmitting
      ) {
        handleCancel();
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isSubmitting) {
        handleCancel();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscapeKey);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isOpen, isSubmitting]);

  const handleCancel = () => {
    if (!isSubmitting) {
      resetForm();
      onClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await updatePost();
    if (success) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/75 bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div
        ref={modalRef}
        className="bg-white rounded-lg w-full max-w-2xl mx-auto"
      >
        <div className="flex justify-between items-center p-4">
          <h2 className="text-xl font-bold">Edit Post</h2>
          <button
            onClick={handleCancel}
            className="text-gray-500 hover:text-gray-700"
            disabled={isSubmitting}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-6">
          <PostForm
            title={title}
            setTitle={setTitle}
            content={content}
            setContent={setContent}
            categoryId={categoryId}
            setCategoryId={setCategoryId}
            categories={categories}
            isSubmitting={isSubmitting}
            error={error}
            onSubmit={handleSubmit}
          />

          <div className="mt-4 flex flex-col md:flex-row justify-end gap-4">
            <button
              type="button"
              onClick={handleCancel}
              className="w-full md:w-auto px-4 py-2 bg-transparent hover:bg-success text-success border border-success hover:text-white rounded-md transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              form="post-form"
              className="w-full md:w-auto px-4 py-2 bg-success hover:bg-success-hover text-white rounded-md transition-colors"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Comfirming..." : "Confirm"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

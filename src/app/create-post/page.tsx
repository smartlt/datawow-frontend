"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "../utils/api";
import { PostForm } from "../components/PostForm";
import { useCreatePost } from "../hooks/useCreatePost";
import { Category } from "../components/Dashboard";
import Link from "next/link";

export default function CreatePostPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  const {
    title,
    setTitle,
    content,
    setContent,
    categoryId,
    setCategoryId,
    isSubmitting,
    error: postError,
    createPost,
  } = useCreatePost({
    onSuccess: (post) => {
      router.push(`/posts/${post._id}`);
    },
  });

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoadingCategories(true);
      setCategoriesError(null);

      try {
        const response = await api.get("categories");
        if (response.success) {
          setCategories(response.data);
        } else {
          setCategoriesError(response.message || "Failed to load categories");
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An unexpected error occurred";
        setCategoriesError(errorMessage);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createPost();
  };

  if (isLoadingCategories) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 pt-[3.5rem] md:pt-4 md:pl-[260px]">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg p-6 shadow-sm flex justify-center items-center h-64">
            <p className="text-gray-500">Loading categories...</p>
          </div>
        </div>
      </div>
    );
  }

  if (categoriesError) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 pt-[3.5rem] md:pt-4 md:pl-[260px]">
        <div className="max-w-3xl mx-auto">
          <div className="bg-red-50 text-red-500 p-6 rounded-lg shadow-sm">
            <p>{categoriesError}</p>
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
    <div className="min-h-screen bg-gray-100 p-4 pt-[3.5rem] md:pt-4 md:pl-[260px]">
      <div className="max-w-3xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => router.back()}
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

        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b p-4">
            <h1 className="text-2xl font-bold">Create New Post</h1>
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
              error={postError}
              onSubmit={handleSubmit}
            />

            <div className="mt-4 flex justify-between">
              <Link
                href="/dashboard"
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                form="post-form"
                className="px-4 py-2 bg-success hover:bg-success-hover text-white rounded-md transition-colors"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create Post"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

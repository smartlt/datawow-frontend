"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../utils/api";
import Dropdown, { DropdownOption } from "./Dropdown";
import { Category } from "./Dashboard";

interface CreatePostProps {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
}

interface CreatePostResponse {
  success: boolean;
  message: string;
  data: {
    _id: string;
  };
}

export default function CreatePost({
  categories,
  isLoading,
  error: categoriesError,
}: CreatePostProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Convert categories to option format for dropdown
  const categoryOptions: DropdownOption[] = categories.map((cat) => ({
    id: cat._id,
    name: cat.name,
  }));

  // Handle category selection
  const handleCategoryChange = (option: DropdownOption | null) => {
    setCategoryId(option ? option.id : "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim() || !categoryId) {
      setError("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      // Send the post data to the API with category ID
      await api.post<CreatePostResponse>("/posts", {
        title,
        content,
        category: categoryId,
      });

      // Redirect to dashboard after successful post creation
      router.push("/dashboard");
    } catch (err) {
      console.error("Error creating post:", err);
      setError("Failed to create post. Please try again.");

      // For development/demo, simulate successful creation anyway
      if (process.env.NODE_ENV === "development") {
        // Wait 1 second to simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        router.push("/dashboard");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gray-100 min-h-screen">
        <div className="max-w-3xl mx-auto p-4 pt-[3.5rem] md:pt-4 md:pl-[260px]">
          <div className="bg-white rounded-lg p-6 shadow-sm flex justify-center items-center h-64">
            <p className="text-gray-500">Loading categories...</p>
          </div>
        </div>
      </div>
    );
  }

  if (categoriesError) {
    return (
      <div className="bg-gray-100 min-h-screen">
        <div className="max-w-3xl mx-auto p-4 pt-[3.5rem] md:pt-4 md:pl-[260px]">
          <div className="bg-red-50 text-red-500 p-6 rounded-lg shadow-sm">
            <p>{categoriesError}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-3xl mx-auto p-4 pt-[3.5rem] md:pt-4 md:pl-[260px]">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h1 className="text-2xl font-bold mb-6">Create New Post</h1>

          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-md mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="title" className="block mb-2 font-medium">
                Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main-green-300"
                placeholder="Enter post title"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="category" className="block mb-2 font-medium">
                Category
              </label>
              <Dropdown
                options={categoryOptions}
                selectedOption={categoryId}
                placeholder="Select a category"
                onChange={handleCategoryChange}
                disabled={isSubmitting}
                className="w-full"
              />
              {/* Hidden input to hold the value for form submission */}
              <input type="hidden" value={categoryId} required />
            </div>

            <div className="mb-6">
              <label htmlFor="content" className="block mb-2 font-medium">
                Content
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main-green-300 min-h-[200px]"
                placeholder="Write your post content here..."
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#40a575] hover:bg-[#4ab483] text-white rounded-md transition-colors"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Posting..." : "Create Post"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

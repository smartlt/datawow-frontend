"use client";

import { useState } from "react";
import Link from "next/link";
import Dropdown, { DropdownOption } from "./Dropdown";
import { CreatePostModal } from "./CreatePostModal";
import { PostCard } from "./PostCard";
import { Post, Category } from "./Dashboard";

interface PostsLayoutProps {
  posts: Post[];
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  title: string;
  variant?: "dashboard" | "blog";
  onPostCreated?: () => void;
}

export default function PostsLayout({
  posts,
  categories,
  isLoading,
  error,
  title,
  variant = "dashboard",
  onPostCreated,
}: PostsLayoutProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Filter posts based on search term and category
  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author.username.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory
      ? post.category._id === selectedCategory
      : true;

    return matchesSearch && matchesCategory;
  });

  // Convert categories to option format for dropdown
  const categoryOptions: DropdownOption[] = categories.map((cat) => ({
    id: cat._id,
    name: cat.name,
  }));

  // Handle category selection
  const handleCategoryChange = (option: DropdownOption | null) => {
    setSelectedCategory(option ? option.id : null);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto p-4 pt-[3.5rem] md:pt-4 md:pl-[260px]">
        {/* Search and Filter Bar */}
        <div className="items-center justify-between mb-6 space-y-4 md:space-y-0">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-1 relative">
              <input
                type="text"
                placeholder="Search"
                className="w-full p-2 pl-10 rounded-md border border-main-green-100 focus:outline-none focus:ring-2 focus:ring-main-green-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute left-3 top-2.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-black"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
            <div className="col-span-1 flex justify-end">
              <div className="flex items-center space-x-4">
                {/* Dropdown Component */}
                <Dropdown
                  options={categoryOptions}
                  selectedOption={selectedCategory}
                  placeholder="Community"
                  onChange={handleCategoryChange}
                  showAllOption={true}
                  allOptionText="All Categories"
                  className="w-48"
                />
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="bg-success hover:bg-success-hover text-white px-4 py-2 rounded-md transition-colors"
                >
                  Create +
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Header for view mode */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold">{title}</h2>
        </div>

        {/* CreatePostModal */}
        <CreatePostModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          categories={categories}
          onSuccess={() => {
            onPostCreated?.();
          }}
        />

        {/* Posts Section */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-black">Loading posts...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-500 p-6 rounded-lg shadow-sm">
            <p>{error}</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <p className="text-black text-center">
              {variant === "blog"
                ? "You haven't created any posts yet."
                : "No posts found. Try adjusting your search."}
            </p>
            {variant === "blog" && (
              <div className="text-center mt-4">
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="bg-success hover:bg-success-hover text-white px-4 py-2 rounded-md transition-colors"
                >
                  Create Your First Post
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="">
            {filteredPosts.map((post, index) => (
              <PostCard
                key={post._id}
                post={post}
                categories={categories}
                onPostUpdated={onPostCreated}
                className={`${index === 0 ? "rounded-t-lg" : ""} ${
                  index === filteredPosts.length - 1 ? "rounded-b-lg" : ""
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

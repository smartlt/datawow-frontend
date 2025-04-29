"use client";

import { useState } from "react";
import Link from "next/link";
import Dropdown, { DropdownOption } from "./Dropdown";
import { CreatePostModal } from "./CreatePostModal";
import { PostCard } from "./PostCard";
import { Post, Category } from "./Dashboard";
import { useAuth } from "../contexts/AuthContext";

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
  const { isAuthenticated } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Filter posts based on category only, not search term
  const filteredPosts = posts.filter((post) => {
    const matchesCategory = selectedCategory
      ? post.category._id === selectedCategory
      : true;

    return matchesCategory;
  });

  // Check if search should be active (minimum 2 characters)
  const isSearchActive = searchTerm.length >= 2;

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
      <div className="max-w-6xl mx-auto md:pt-4 md:ps-[280px]">
        {/* Search and Filter Bar */}
        <div className="items-center justify-between mx-4 py-4">
          <div className="flex flex-row items-center justify-between w-full gap-2 relative">
            <div
              className={`relative transition-all duration-300 ease-in-out ${
                isSearchFocused ? "w-full" : "w-[35%] md:w-[45%]"
              } z-10`}
            >
              <input
                type="text"
                placeholder="Search"
                className="w-full p-2 pl-8 text-sm rounded-md border border-main-green-100 focus:outline-none focus:ring-2 focus:ring-main-green-100"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
              />
              <div className="absolute left-2 top-2.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-black"
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

            {/* Dropdown Component */}
            <div
              className={`transition-opacity duration-300 ${
                isSearchFocused
                  ? "opacity-0 invisible absolute"
                  : "opacity-100 visible"
              } w-[35%]`}
            >
              <Dropdown
                options={categoryOptions}
                selectedOption={selectedCategory}
                placeholder="Community"
                onChange={handleCategoryChange}
                showAllOption={true}
                allOptionText="All Categories"
                className="w-full"
              />
            </div>

            {/* Button */}
            <div
              className={`transition-opacity duration-300 ${
                isSearchFocused
                  ? "opacity-0 invisible absolute"
                  : "opacity-100 visible"
              } w-[25%]`}
            >
              <button
                onClick={() => setIsCreateModalOpen(true)}
                disabled={!isAuthenticated}
                className={`bg-success hover:bg-success-hover text-white px-3 py-2 text-sm rounded-md transition-colors w-full overflow-hidden text-ellipsis text-center ${
                  !isAuthenticated ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <span className="block truncate">Create +</span>
              </button>
            </div>
          </div>
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
            {variant === "blog" && isAuthenticated && (
              <div className="text-center mt-4">
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="bg-success hover:bg-success-hover text-white px-4 py-2 rounded-md transition-colors"
                >
                  Create Your First Post
                </button>
              </div>
            )}
            {variant === "blog" && !isAuthenticated && (
              <div className="text-center mt-4">
                <Link
                  href="/login"
                  className="bg-main-green-500 hover:bg-main-green-600 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Sign in to create posts
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="mx-4 pb-10">
            {filteredPosts.map((post, index) => (
              <PostCard
                key={post._id}
                post={post}
                categories={categories}
                onPostUpdated={onPostCreated}
                searchTerm={isSearchActive ? searchTerm : ""}
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

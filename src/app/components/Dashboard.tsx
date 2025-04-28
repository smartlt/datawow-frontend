"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Dropdown, { DropdownOption } from "./Dropdown";

// Define types for our data
export interface Author {
  _id: string;
  username: string;
}

export interface Category {
  _id: string;
  name: string;
}

export interface Comment {
  author: Author;
  content: string;
  _id: string;
}

export interface Post {
  _id: string;
  title: string;
  content: string;
  category: Category;
  author: Author;
  comments: Comment[];
  createdAt: string;
}

interface DashboardProps {
  posts: Post[];
  categories: Category[];
  isLoading: boolean;
  error: string | null;
}

export default function Dashboard({
  posts,
  categories,
  isLoading,
  error,
}: DashboardProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Filter posts based on search term and category
  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author.username.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory
      ? post.category._id === selectedCategory // Filter by category ID instead of name
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
                />
                <Link
                  href="/create-post"
                  className=" bg-success hover:bg-success-hover text-white px-4 py-2 rounded-md transition-colors"
                >
                  Create +
                </Link>
              </div>
            </div>
          </div>
        </div>

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
              No posts found. Try adjusting your search.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredPosts.map((post) => (
              <div key={post._id} className="bg-white rounded-lg p-6 shadow-sm">
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
                <span className="inline-flex items-center rounded-full bg-[#F3F3F3] px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-gray-500/10 ring-inset">
                  {post.category.name}
                </span>
                <h2 className="text-xl font-bold mb-2">{post.title}</h2>
                <p className="text-gray-700 mb-4">{post.content}</p>

                <div className="flex items-center text-gray-300 text-sm">
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

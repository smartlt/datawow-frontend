"use client";

import { useState } from "react";
import { api } from "../utils/api";
import { Post } from "../components/Dashboard";

interface CreatePostData {
  title: string;
  content: string;
  categoryId: string;
}

interface CreatePostResponse {
  title: string;
  content: string;
  category: string;
  author: string;
  comments: string[];
  createdAt: string;
  updatedAt: string;
  _id: string;
}

interface UseCreatePostProps {
  onSuccess?: (post: Post) => void;
  onError?: (error: string) => void;
}

export const useCreatePost = ({
  onSuccess,
  onError,
}: UseCreatePostProps = {}) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setTitle("");
    setContent("");
    setCategoryId("");
    setError(null);
  };

  const validateForm = (): boolean => {
    if (!title.trim()) {
      setError("Title is required");
      return false;
    }

    if (!content.trim()) {
      setError("Content is required");
      return false;
    }

    if (!categoryId) {
      setError("Please select a category");
      return false;
    }

    return true;
  };

  const createPost = async (): Promise<boolean> => {
    if (!validateForm()) {
      return false;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const postData: CreatePostData = {
        title: title.trim(),
        content: content.trim(),
        categoryId,
      };

      const response = await api.post<CreatePostResponse>("posts", postData);

      if (response) {
        resetForm();
        const newPost: Post = {
          _id: response._id,
          title: response.title,
          content: response.content,
          category: { _id: response.category, name: "" },
          author: { _id: response.author, username: "" },
          comments: [],
          createdAt: response.createdAt,
          updatedAt: response.updatedAt,
        };
        onSuccess?.(newPost);
        return true;
      } else {
        const errorMessage = response || "Failed to create post";
        setError(errorMessage);
        onError?.(errorMessage);
        return false;
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      onError?.(errorMessage);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    title,
    setTitle,
    content,
    setContent,
    categoryId,
    setCategoryId,
    isSubmitting,
    error,
    createPost,
    resetForm,
  };
};

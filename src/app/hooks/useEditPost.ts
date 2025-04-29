"use client";

import { useState, useEffect } from "react";
import { api } from "../utils/api";
import { Post } from "../components/Dashboard";

interface EditPostData {
  title: string;
  content: string;
  categoryId: string;
}

interface EditPostResponse {
  title: string;
  content: string;
  category: string;
  author: string;
  comments: string[];
  createdAt: string;
  updatedAt: string;
  _id: string;
}

interface UseEditPostProps {
  postId: string;
  initialData?: {
    title: string;
    content: string;
    categoryId: string;
  };
  onSuccess?: (post: Post) => void;
  onError?: (error: string) => void;
}

export const useEditPost = ({
  postId,
  initialData,
  onSuccess,
  onError,
}: UseEditPostProps) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(!initialData);

  // Fetch post data if not provided initially
  useEffect(() => {
    const fetchPostData = async () => {
      if (initialData) return; // Skip if initial data was provided

      setIsLoading(true);
      try {
        const response = await api.get<Post>(`posts/${postId}`);
        if (response) {
          setTitle(response.title);
          setContent(response.content);
          setCategoryId(response.category._id);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load post data";
        setError(errorMessage);
        onError?.(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    if (postId) {
      fetchPostData();
    }
  }, [postId, initialData]);

  const resetForm = () => {
    if (initialData) {
      setTitle(initialData.title);
      setContent(initialData.content);
      setCategoryId(initialData.categoryId);
    } else {
      setTitle("");
      setContent("");
      setCategoryId("");
    }
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

  const updatePost = async (): Promise<boolean> => {
    if (!validateForm()) {
      return false;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const postData: EditPostData = {
        title: title.trim(),
        content: content.trim(),
        categoryId,
      };

      const response = await api.patch<EditPostResponse>(
        `posts/${postId}`,
        postData
      );

      if (response) {
        const updatedPost: Post = {
          _id: response._id,
          title: response.title,
          content: response.content,
          category: { _id: response.category, name: "" },
          author: { _id: response.author, username: "" },
          comments: [],
          createdAt: response.createdAt,
          updatedAt: response.updatedAt,
        };
        onSuccess?.(updatedPost);
        return true;
      } else {
        const errorMessage = response || "Failed to update post";
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
    isLoading,
    error,
    updatePost,
    resetForm,
  };
};

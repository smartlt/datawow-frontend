import { useState } from "react";
import { api } from "../utils/api";
import { Comment } from "../components/Dashboard";

interface CommentResponse {
  success: boolean;
  message: string;
  data: Comment;
}

interface UseCommentsProps {
  postId: string;
  onSuccess?: () => void;
}

export const useComments = ({ postId, onSuccess }: UseCommentsProps) => {
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const submitComment = async () => {
    if (!newComment.trim() || !postId) return;

    setIsSubmitting(true);
    setError("");

    try {
      // Send the comment to the API
      await api.post<CommentResponse>(`/comments`, {
        content: newComment,
        postId,
      });

      setNewComment("");
      onSuccess?.();
    } catch (err) {
      console.error("Error submitting comment:", err);
      setError("Failed to post comment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetComment = () => {
    setNewComment("");
    setError("");
  };

  return {
    newComment,
    setNewComment,
    isSubmitting,
    error,
    submitComment,
    resetComment,
  };
};

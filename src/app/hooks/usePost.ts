import { useEffect, useState } from "react";
import { api } from "../utils/api";
import { Post, Comment } from "../components/Dashboard";

interface PostResponse {
  success: boolean;
  data: Post;
}

interface UsePostResult {
  post: Post | null;
  comments: Comment[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export default function usePost(
  postId: string,
  isAuthenticated: boolean,
  accessToken: string | null
): UsePostResult {
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPost = async () => {
    if (!isAuthenticated || !accessToken || !postId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get<Post>(`/posts/${postId}`);
      setPost(response);

      // Extract comments from the post
      if (response.comments) {
        setComments(response.comments);
      }
    } catch (err) {
      console.error("Error fetching post:", err);
      setError("Failed to load post. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [isAuthenticated, accessToken, postId]);

  return {
    post,
    comments,
    isLoading,
    error,
    refetch: fetchPost,
  };
}

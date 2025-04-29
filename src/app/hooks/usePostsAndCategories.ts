import { useEffect, useState } from "react";
import { api } from "../utils/api";
import { Post, Category } from "../components/Dashboard";

interface CategoriesResponse {
  success: boolean;
  data: Category[];
}

interface UsePostsAndCategoriesResult {
  posts: Post[];
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export default function usePostsAndCategories(
  shouldFetch: boolean,
  accessToken: string | null
): UsePostsAndCategoriesResult {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!shouldFetch) return;

    setIsLoading(true);
    setError(null);

    try {
      // Using separate try-catch blocks for each request to handle auth errors gracefully
      let postsResponse: Post[] = [];
      let categoriesResponse: Category[] = [];

      try {
        postsResponse = await api.get<Post[]>("/posts");
      } catch (err) {
        console.warn("Could not fetch posts:", err);
        // Continue with empty posts
      }

      try {
        categoriesResponse = await api.get<Category[]>("/categories");
      } catch (err) {
        console.warn("Could not fetch categories:", err);
        // Continue with empty categories
      }

      setPosts(postsResponse || []);
      setCategories(categoriesResponse || []);
    } catch (err) {
      console.error("Error in data fetching:", err);
      setError("Failed to load data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [shouldFetch, accessToken]);

  return {
    posts,
    categories,
    isLoading,
    error,
    refetch: fetchData,
  };
}

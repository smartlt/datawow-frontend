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
  isAuthenticated: boolean,
  accessToken: string | null
): UsePostsAndCategoriesResult {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!isAuthenticated || !accessToken) return;

    setIsLoading(true);
    setError(null);

    try {
      // Fetch both posts and categories in parallel
      const [postsResponse, categoriesResponse] = await Promise.all([
        api.get<Post[]>("/posts"),
        api.get<Category[]>("/categories"),
      ]);

      setPosts(postsResponse || []);
      setCategories(categoriesResponse || []);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isAuthenticated, accessToken]);

  return {
    posts,
    categories,
    isLoading,
    error,
    refetch: fetchData,
  };
}

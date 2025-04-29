import { useEffect, useState } from "react";
import { api } from "../utils/api";
import { Category } from "../components/Dashboard";

interface CategoriesResponse {
  success: boolean;
  data: Category[];
}

interface UseCategoriesResult {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export default function useCategories(
  isAuthenticated: boolean,
  accessToken: string | null
): UseCategoriesResult {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    if (!isAuthenticated || !accessToken) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get<CategoriesResponse>("/categories");
      setCategories(response.data || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("Failed to load categories. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [isAuthenticated, accessToken]);

  return {
    categories,
    isLoading,
    error,
    refetch: fetchCategories,
  };
}

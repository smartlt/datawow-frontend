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
      const response = await api.get<CategoriesResponse>("/posts/categories");
      setCategories(response.data || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("Failed to load categories. Please try again later.");

      // Mock categories for development
      if (process.env.NODE_ENV === "development") {
        const mockCategories: Category[] = [
          { _id: "cat-1", name: "History" },
          { _id: "cat-2", name: "Exercise" },
          { _id: "cat-3", name: "Technology" },
          { _id: "cat-4", name: "Travel" },
          { _id: "cat-5", name: "Food" },
          { _id: "cat-6", name: "Pets" },
          { _id: "cat-7", name: "Health" },
          { _id: "cat-8", name: "Fashion" },
          { _id: "cat-9", name: "Others" },
        ];
        setCategories(mockCategories);
      }
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

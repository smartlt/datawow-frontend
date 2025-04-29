import { useEffect, useState } from "react";
import { api } from "../utils/api";
import { Post } from "../components/Dashboard";

interface UseMyPostsResult {
  posts: Post[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export default function useMyPosts(
  isAuthenticated: boolean,
  accessToken: string | null
): UseMyPostsResult {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMyPosts = async () => {
    if (!isAuthenticated || !accessToken) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get<Post[]>("/posts/my-posts");
      setPosts(response || []);
    } catch (err) {
      console.error("Error fetching my posts:", err);
      setError("Failed to load your posts. Please try again later.");

      // Mock data for development
      if (process.env.NODE_ENV === "development") {
        const mockPosts: Post[] = [
          {
            _id: "post-1",
            title: "The Beginning of the End of the World",
            content:
              "The afterlife sitcom The Good Place comes to its culmination, the show's two protagonists, Eleanor and Chidi, contemplate their future. Having lived and experienced virtually everything this life has to offer, they're faced with an existential choice.",
            category: { _id: "cat-1", name: "History" },
            author: { _id: "user-1", username: "Jessica" },
            comments: [],
            createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
            updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
          },
          {
            _id: "post-2",
            title: "The Power of Pets",
            content:
              "Nothing compares to the joy of coming home to a loyal companion. The unconditional love of a pet can do more than keep you company. Pets may also decrease stress, improve heart health, and even help children with their emotional and social skills.",
            category: { _id: "cat-6", name: "Pets" },
            author: { _id: "user-1", username: "Jessica" },
            comments: [
              {
                _id: "comment-1",
                author: { _id: "user-2", username: "Alex" },
                content: "I couldn't agree more! My dog has changed my life.",
                createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
              },
            ],
            createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            updatedAt: new Date(Date.now() - 86400000).toISOString(),
          },
        ];
        setPosts(mockPosts);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyPosts();
  }, [isAuthenticated, accessToken]);

  return {
    posts,
    isLoading,
    error,
    refetch: fetchMyPosts,
  };
}

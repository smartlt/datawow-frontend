"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { api } from "../utils/api";

// Define user type
type User = {
  id: string;
  username: string;
};

// Login response type
interface LoginResponse {
  success: boolean;
  message: string;
  accessToken: string;
  user: User;
  username: string;
  id: string;
}

// Define auth context state type
interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string) => Promise<void>;
  logout: () => void;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  logout: () => {},
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check if user is authenticated on initial load
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = localStorage.getItem("accessToken");
        if (storedToken) {
          // Decode the token to get user information
          // In a real app, you might want to validate the token on the server
          const decodedToken = JSON.parse(atob(storedToken));

          // Check if token is expired
          if (decodedToken.exp < Date.now()) {
            localStorage.removeItem("accessToken");
            setUser(null);
            setAccessToken(null);
          } else {
            // Fetch user details or use the info from the token
            setUser({
              id: decodedToken.userId,
              username: decodedToken.username,
            });
            setAccessToken(storedToken);
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        // Clear invalid auth data
        localStorage.removeItem("accessToken");
        setUser(null);
        setAccessToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // Login function
  const login = async (username: string) => {
    setIsLoading(true);
    try {
      const response = await api.post<LoginResponse>("/auth/login", {
        username,
      });
      const data = response;

      // Save token and user info
      localStorage.setItem("accessToken", data.accessToken);
      setAccessToken(data.accessToken);
      const newUser = { id: data.id, username: data.username };
      setUser(newUser);

      router.push("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.message || "Login failed");
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("accessToken");
    setUser(null);
    setAccessToken(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

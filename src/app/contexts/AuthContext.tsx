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

// Function to safely parse JWT without relying on exact structure
const parseJwt = (token: string) => {
  try {
    // Split the token and get the payload (second part)
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map((c) => `%${("00" + c.charCodeAt(0).toString(16)).slice(-2)}`)
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error parsing JWT token:", error);
    return null;
  }
};

// Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check if user is authenticated on initial load
  useEffect(() => {
    const initAuth = async () => {
      if (typeof window === "undefined") {
        setIsLoading(false);
        return;
      }

      try {
        const storedToken = localStorage.getItem("accessToken");
        if (storedToken) {
          // Set the access token state
          setAccessToken(storedToken);

          // Retrieve user information from local storage if available
          const storedUser = localStorage.getItem("user");
          if (storedUser) {
            try {
              const parsedUser = JSON.parse(storedUser);
              setUser(parsedUser);
            } catch (e) {
              console.error("Error parsing stored user:", e);
              // Try to extract user info from token as fallback
              const decodedToken = parseJwt(storedToken);
              if (
                decodedToken &&
                decodedToken.userId &&
                decodedToken.username
              ) {
                const userFromToken = {
                  id: decodedToken.userId,
                  username: decodedToken.username,
                };
                setUser(userFromToken);
                // Update stored user
                localStorage.setItem("user", JSON.stringify(userFromToken));
              } else {
                // If we can't get user info, clear auth state
                localStorage.removeItem("accessToken");
                localStorage.removeItem("user");
              }
            }
          } else {
            // If no stored user info, try to get it from the token
            const decodedToken = parseJwt(storedToken);
            if (decodedToken && decodedToken.userId && decodedToken.username) {
              const userFromToken = {
                id: decodedToken.userId,
                username: decodedToken.username,
              };
              setUser(userFromToken);
              // Store user info for future use
              localStorage.setItem("user", JSON.stringify(userFromToken));
            }
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        // Clear invalid auth data
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
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

      // Save token
      localStorage.setItem("accessToken", data.accessToken);
      setAccessToken(data.accessToken);

      // Save user info
      const newUser = { id: data.id, username: data.username };
      localStorage.setItem("user", JSON.stringify(newUser));
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
    localStorage.removeItem("user");
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

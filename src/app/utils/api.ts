/**
 * Utility functions for making API requests using Axios
 */

import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";

// Define error response type
interface ErrorResponse {
  message?: string;
}

// Base API URL - in a real app, this would be your API endpoint
const API_BASE_URL = "http://localhost:3003/";

// Create an Axios instance with default configurations
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds timeout
});

// Add request interceptor to include the auth token
axiosInstance.interceptors.request.use(
  (config) => {
    // Get the access token from local storage (only in browser)
    if (typeof window !== "undefined") {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken && config.headers) {
        config.headers["Authorization"] = `Bearer ${accessToken}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle auth errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ErrorResponse>) => {
    // Handle unauthorized responses (expired or invalid token)
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        // Clear the token
        localStorage.removeItem("accessToken");

        // Redirect to login page
        window.location.href = "/login";
      }
      return Promise.reject(new Error("Session expired. Please log in again."));
    }

    // Handle other error responses
    const errorMessage =
      error.response?.data?.message || error.message || "API request failed";

    return Promise.reject(new Error(errorMessage));
  }
);

/**
 * Make an authenticated API request
 * @param endpoint The API endpoint to call
 * @param options Request options
 * @returns Promise with the response data
 */
export async function fetchWithAuth<T = any>(
  endpoint: string,
  options: AxiosRequestConfig = {}
): Promise<T> {
  try {
    const response: AxiosResponse<T> = await axiosInstance({
      url: endpoint,
      ...options,
    });

    return response.data;
  } catch (error) {
    console.error("API request error:", error);
    throw error;
  }
}

/**
 * Helper functions for common request types
 */
export const api = {
  get: <T = any>(endpoint: string, options: AxiosRequestConfig = {}) =>
    fetchWithAuth<T>(endpoint, { ...options, method: "GET" }),

  post: <T = any>(
    endpoint: string,
    data: any,
    options: AxiosRequestConfig = {}
  ) =>
    fetchWithAuth<T>(endpoint, {
      ...options,
      method: "POST",
      data,
    }),

  put: <T = any>(
    endpoint: string,
    data: any,
    options: AxiosRequestConfig = {}
  ) =>
    fetchWithAuth<T>(endpoint, {
      ...options,
      method: "PUT",
      data,
    }),

  patch: <T = any>(
    endpoint: string,
    data: any,
    options: AxiosRequestConfig = {}
  ) =>
    fetchWithAuth<T>(endpoint, {
      ...options,
      method: "PATCH",
      data,
    }),

  delete: <T = any>(endpoint: string, options: AxiosRequestConfig = {}) =>
    fetchWithAuth<T>(endpoint, { ...options, method: "DELETE" }),
};

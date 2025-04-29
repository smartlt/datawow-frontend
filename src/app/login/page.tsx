"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const { login, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username.trim()) {
      setError("Username is required");
      return;
    }

    try {
      await login(username);
      // The redirect is handled in the AuthContext
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An error occurred during login"
      );
    }
  };

  return (
    <div>
      <div className="block md:hidden w-full min-h-screen ">
        <div className="bg-main-green-500 min-h-screen grid grid-cols-1 ">
          <div className="bg-main-green-300 rounded-b-[36px] flex flex-col items-center justify-center">
            <div className="mb-12 text-center">
              <div className="flex justify-center mb-2">
                <div className="relative w-24 h-24">
                  <Image
                    src="/board.png"
                    alt="Board Icon"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
              <p className="italic text-lg text-white font-castoro">a Board</p>
            </div>
          </div>
          <div className="flex flex-col items-left justify-center px-6 py-12 lg:px-8">
            <div className="item-left text-left">
              <h1 className="text-2xl font-semibold mb-6 text-white">
                Sign in
              </h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <input
                  type="text"
                  id="username-mobile"
                  placeholder="Username"
                  className="w-full p-3 rounded bg-white border-0 focus:ring-0 focus:outline-none text-black"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              {error && <div className="text-red-500 text-sm">{error}</div>}

              <button
                type="submit"
                className={`w-full bg-success hover:bg-success-hover text-white py-3 rounded transition-colors duration-200 ${
                  isLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
                disabled={isLoading}
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="hidden md:block w-full min-h-screen ">
        <div className="bg-main-green-500 min-h-screen grid grid-cols-2 ">
          <div className="flex flex-col items-left justify-center px-6 py-12 lg:px-8">
            <div className="item-left text-left">
              <h1 className="text-2xl font-semibold mb-6 text-white">
                Sign in
              </h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <input
                  type="text"
                  id="username-desktop"
                  placeholder="Username"
                  className="w-full p-3 rounded bg-white border-0 focus:ring-0 focus:outline-none text-black"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              {error && <div className="text-red-500 text-sm">{error}</div>}

              <button
                type="submit"
                className={`w-full bg-success hover:bg-success-hover text-white py-3 rounded transition-colors duration-200 ${
                  isLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
                disabled={isLoading}
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </button>
            </form>
          </div>
          <div className="bg-main-green-300 rounded-l-[36px] flex flex-col items-center justify-center">
            <div className="mb-12 text-center">
              <div className="flex justify-center mb-2">
                <div className="relative w-24 h-24">
                  <Image
                    src="/board.png"
                    alt="Board Icon"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
              <p className="italic text-lg text-white font-castoro">a Board</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "../contexts/AuthContext";

interface NavbarProps {
  onMenuToggle?: () => void;
}

export default function Navbar({ onMenuToggle }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
    if (onMenuToggle) {
      onMenuToggle();
    }
  };

  return (
    <>
      {/* Mobile Navbar - Top bar */}
      <nav className="bg-main-green-500 text-white w-full block md:hidden">
        <div className="flex justify-between items-center px-4 py-3">
          <div className="flex items-center">
            <Link href="/dashboard" className="italic text-lg font-medium">
              a Board
            </Link>
          </div>

          <button
            onClick={handleMenuToggle}
            className="p-2 focus:outline-none"
            aria-label="Toggle menu"
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              <span
                className={`h-0.5 w-full bg-white transition-all duration-300 ${
                  isMenuOpen ? "rotate-45 translate-y-2" : ""
                }`}
              ></span>
              <span
                className={`h-0.5 w-full bg-white transition-all duration-300 ${
                  isMenuOpen ? "opacity-0" : "opacity-100"
                }`}
              ></span>
              <span
                className={`h-0.5 w-full bg-white transition-all duration-300 ${
                  isMenuOpen ? "-rotate-45 -translate-y-2" : ""
                }`}
              ></span>
            </div>
          </button>
        </div>

        {isMenuOpen && (
          <div className="absolute left-30 right-0 bg-main-green-500 shadow-lg z-50 ">
            <div className="flex flex-col p-4 space-y-3">
              <Link
                href="/dashboard"
                className="flex items-center space-x-2 hover:bg-main-green-300 p-2 rounded-md"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                <span>Home</span>
              </Link>
              <Link
                href="/blog"
                className="flex items-center space-x-2 hover:bg-main-green-300 p-2 rounded-md"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z"
                    clipRule="evenodd"
                  />
                  <path d="M15 7h1a2 2 0 012 2v5.5a1.5 1.5 0 01-3 0V7z" />
                </svg>
                <span>Our Blog</span>
              </Link>
              {isAuthenticated && (
                <>
                  <button
                    onClick={logout}
                    className="text-left hover:bg-red-600 p-2 rounded-md"
                  >
                    Logout
                  </button>
                </>
              )}
              {!isAuthenticated && (
                <Link
                  href="/login"
                  className="hover:bg-main-green-300 p-2 rounded-md"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Desktop Layout */}
      <div className="hidden md:flex flex-col">
        {/* Top Navbar for Desktop */}
        <div className="bg-main-green-500 text-white w-full">
          <div className="flex justify-between items-center px-6 py-3">
            <div className="flex items-center">
              <Link href="/dashboard" className="italic text-lg font-medium">
                a Board
              </Link>
            </div>

            <div className="flex items-center">
              {isAuthenticated ? (
                <div className="flex items-center space-x-2">
                  <span className="mr-2">{user?.username}</span>
                  <div className="h-10 w-10 relative overflow-hidden rounded-full mr-3">
                    <div className="bg-gray-200 h-full w-full flex items-center justify-center">
                      <span className="text-gray-400 font-medium text-lg">
                        {user?.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="bg-[#40a575] hover:bg-[#4ab483] px-3 py-1 rounded-md"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Left Sidebar */}
        <div className="flex">
          <div className="bg-gray-100 text-black h-[calc(100vh-3.5rem)] w-48 fixed left-0 flex flex-col">
            <nav className="flex flex-col mt-6 px-4">
              <div className="flex flex-col space-y-4">
                <Link
                  href="/dashboard"
                  className="flex items-center space-x-2 hover:bg-main-green-300 p-2 rounded-md"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                  <span>Home</span>
                </Link>

                <Link
                  href="/blog"
                  className="flex items-center space-x-2 hover:bg-main-green-300 p-2 rounded-md"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z"
                      clipRule="evenodd"
                    />
                    <path d="M15 7h1a2 2 0 012 2v5.5a1.5 1.5 0 01-3 0V7z" />
                  </svg>
                  <span>Our Blog</span>
                </Link>
              </div>
            </nav>
          </div>

          {/* Add margin to main content area */}
          <div className="ml-48  w-[calc(100%-12rem)]">
            {/* Main content will be here */}
          </div>
        </div>
      </div>
    </>
  );
}

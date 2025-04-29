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

        <div
          className={`fixed left-30 right-0 bottom-0 bg-main-green-500 shadow-lg z-50 h-screen transform transition-transform duration-300 ease-in-out ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex flex-col p-4 space-y-3">
            <button
              onClick={handleMenuToggle}
              className="flex items-center space-x-2 hover:bg-main-green-300 p-2 rounded-md mb-2"
              aria-label="Close menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

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
              <span>My Blog</span>
            </Link>
            {isAuthenticated && (
              <>
                <button
                  onClick={logout}
                  className="flex items-center space-x-2 text-white hover:bg-red-600 p-2 rounded-md"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Logout</span>
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
          <div className="bg-gray-100 text-black h-screen w-[280px] fixed left-0 flex flex-col">
            <nav className="flex flex-col mt-6 px-4">
              <div className="flex flex-col space-y-4">
                <Link
                  href="/dashboard"
                  className="flex items-center space-x-2 hover:bg-gray-300 p-2 rounded-md"
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
                  className="flex items-center space-x-2 hover:bg-gray-300 p-2 rounded-md"
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
                  <span>My Blog</span>
                </Link>

                {isAuthenticated && (
                  <button
                    onClick={logout}
                    className="flex items-center space-x-2 hover:bg-gray-300 p-2 rounded-md mt-4"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Logout</span>
                  </button>
                )}

                {!isAuthenticated && (
                  <Link
                    href="/login"
                    className="flex items-center space-x-2 hover:bg-main-green-300 p-2 rounded-md mt-4"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Sign In</span>
                  </Link>
                )}
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

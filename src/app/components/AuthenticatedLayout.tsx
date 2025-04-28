"use client";

import { ReactNode } from "react";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "./Navbar";
import { usePathname } from "next/navigation";

interface AuthenticatedLayoutProps {
  children: ReactNode;
}

export default function AuthenticatedLayout({
  children,
}: AuthenticatedLayoutProps) {
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();

  // Don't show navbar on login page
  const isLoginPage = pathname === "/login";

  return (
    <>
      {isAuthenticated && !isLoginPage && <Navbar />}
      {children}
    </>
  );
}

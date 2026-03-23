"use client";

import React from "react";
import { usePathname } from "next/navigation";
import GuestHeader from "./GuestHeader";
import AuthenticatedHeader from "./AuthenticatedHeader";

export default function Header() {
  const pathname = usePathname();

  // 비보호된 페이지 경로 (랜딩 페이지) - 비회원도 접근가능)
  const isUnprotectedRoute = pathname === "/" || pathname.startsWith("/signup");

  // 유저
  const isAuthRoute = pathname.startsWith("/signin");

  // 보호된 페이지 경로 (main app)
  const isProtectedRoute =
    pathname.startsWith("/cart") ||
    pathname.startsWith("/my") ||
    pathname.startsWith("/order") ||
    pathname.startsWith("/products") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/manage");

  if (isAuthRoute) {
    return null;
  }

  if (isUnprotectedRoute) {
    return <GuestHeader />;
  }

  if (isProtectedRoute) {
    return <AuthenticatedHeader />;
  }

  return null;
}

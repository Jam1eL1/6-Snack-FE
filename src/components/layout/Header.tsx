"use client";

import React from "react";
import { usePathname } from "next/navigation";
import GuestHeader from "./GuestHeader";
import AuthenticatedHeader from "./AuthenticatedHeader";

export default function Header() {
  const pathname = usePathname();

  // Public page paths that guests can access.
  const isUnprotectedRoute = pathname === "/" || pathname.startsWith("/signup");

  // Authentication page paths.
  const isAuthRoute = pathname.startsWith("/signin");

  // Protected main application paths.
  const isProtectedRoute =
    pathname.startsWith("/cart") ||
    pathname.startsWith("/my") ||
    pathname.startsWith("/order") ||
    pathname.startsWith("/products") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/payments") ||
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

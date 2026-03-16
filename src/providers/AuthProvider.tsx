"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getUserApi } from "@/lib/api/user.api";
import { loginApi, logoutApi, registerApi } from "@/lib/api/auth.api";
import { usePathname, useRouter } from "next/navigation";
import { TUser, TAuthContextType } from "@/types/auth.types";

const AuthContext = createContext<TAuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<TUser | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const excludedRoutes = ["/", "/login", "/signup"];

  const getUser = async () => {
    try {
      const userData = await getUserApi();
      setUser(userData);
    } catch (error) {
      console.log("Failed to fetch user info:", error);
      setUser(null);
    }
  };

  const register = async () => {
    await registerApi();
  };

  const login = async (email: string, password: string) => {
    const userData = await loginApi(email, password);
    setUser(userData);
  };

  const logout = async () => {
    await logoutApi();
    setUser(null);
    router.push("/");
  };
  // Whenever path changes check auth status except for non-protected routes
  useEffect(() => {
    const shouldSkipAuthCheck = excludedRoutes.some((route) =>
      route === "/" ? pathname === "/" : pathname.startsWith(route),
    );
    if (shouldSkipAuthCheck) return;
    console.log("Checking authentication state:", pathname);
    getUser();
  }, [pathname]);

  return <AuthContext.Provider value={{ user, login, logout, register }}>{children}</AuthContext.Provider>;
}

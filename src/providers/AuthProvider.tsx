"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getUserApi } from "@/lib/api/user.api";
import { loginApi, logoutApi } from "@/lib/api/auth.api";
import { usePathname, useRouter } from "next/navigation";
import { TUser, TAuthContextType } from "@/types/auth.types";
import { SessionExpiredError } from "@/lib/api/auth.errors";

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
      if (error instanceof SessionExpiredError) {
        setUser(null);
        router.push("/login");
        return;
      }
      setUser(null);
      console.log("Failed to fetch user info:", error);
    }
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
  // Re-check auth state on route changes except for public routes.
  useEffect(() => {
    const shouldSkipAuthCheck = excludedRoutes.some((route) =>
      route === "/" ? pathname === "/" : pathname.startsWith(route),
    );
    if (shouldSkipAuthCheck) return;
    console.log("Checking authentication state:", pathname);
    getUser();
  }, [pathname]);

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

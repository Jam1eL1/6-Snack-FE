"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getUser } from "@/lib/api/user.api";
import { login, logout } from "@/lib/api/auth.api";
import { usePathname, useRouter } from "next/navigation";
import { TUser, TAuthContextType } from "@/types/auth.types";
import { SessionExpiredError } from "@/lib/api/auth.errors";

const AuthContext = createContext<TAuthContextType | undefined>(undefined);
const excludedRoutes = ["/", "/signin", "/signup"];

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

  const signIn = async (email: string, password: string) => {
    const userData = await login(email, password);
    setUser(userData);
  };

  const signOut = async () => {
    await logout();
    setUser(null);
    router.push("/");
  };
  // Re-check auth state on route changes except for public routes.
  useEffect(() => {
    const shouldSkipAuthCheck = excludedRoutes.some((route) =>
      route === "/" ? pathname === "/" : pathname.startsWith(route),
    );
    if (shouldSkipAuthCheck) return;

    const loadUser = async () => {
      try {
        const userData = await getUser();
        setUser(userData);
      } catch (error) {
        if (error instanceof SessionExpiredError) {
          setUser(null);
          router.push("/signin");
          return;
        }
        setUser(null);
        console.log("Failed to fetch user info:", error);
      }
    };

    console.log("Checking authentication state:", pathname);
    loadUser();
  }, [pathname, router]);

  return <AuthContext.Provider value={{ user, signIn, signOut }}>{children}</AuthContext.Provider>;
}

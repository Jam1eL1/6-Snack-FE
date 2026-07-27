"use client";

import Button from "@/components/ui/Button";
import Image from "next/image";
import React, { useEffect } from "react";
import img_dog_error from "@/assets/images/img_dog_error.png";
import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";

const requiredRole: Record<string, string> = {
  USER: "This page is available to admins only.",
  ADMIN: "This page is available to super admins only.",
};

export default function GlobalErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const { user } = useAuth();
  const router = useRouter();

  const handleClick = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/products");
    }
  };

  useEffect(() => {
    const removePreviousPath = () => {
      sessionStorage.removeItem("previousPath");
    };
    window.addEventListener("beforeunload", removePreviousPath);
    return () => {
      window.removeEventListener("beforeunload", removePreviousPath);
    };
  }, []);

  return (
    <div className="flex flex-col h-screen justify-center items-center gap-[20px] -mb-[24px]">
      <section className="flex flex-col gap-[16px] justify-center items-center">
        <div className="relative w-[40vw] h-[30vh] max-w-[300px] aspect-[7/8]">
          <Image src={img_dog_error} alt="Dog illustration indicating an error" fill className="object-contain" />
        </div>
        <div role="status" className="text-center font-medium text-[16px]/[24px] sm:text-[20px]/[30px]">
          <h2>Something went wrong.</h2>
          {user?.role ? (
            sessionStorage.getItem("previousPath") === "/cart/order" ? (
              <>
                <p>This page is for regular users only.</p>
                <p>Administrators cannot access it.</p>
              </>
            ) : (
              <>
                <p>You do not have access to this page.</p>
                <p>{requiredRole[user.role] ?? "You do not have permission to view it."}</p>
              </>
            )
          ) : (
            <p>{error?.message || "An unexpected error occurred."}</p>
          )}
        </div>
      </section>
      <div className="flex gap-4">
        <Button
          type="black"
          label="Go Back"
          onClick={handleClick}
          className="font-semibold text-[16px]/[20px] tracking-tight w-44 max-w-[230px] min-h-[56px] sm:max-w-[310px] sm:h-[64px]"
        />
        <Button
          type="white"
          label="Try Again"
          onClick={reset}
          className="font-semibold text-[16px]/[20px] tracking-tight w-44 max-w-[230px] min-h-[56px] sm:max-w-[310px] sm:h-[64px]"
        />
      </div>
    </div>
  );
}

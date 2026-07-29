"use client";

import Button from "@/components/ui/Button";
import Image from "next/image";
import React from "react";
import img_dog_error from "@/assets/images/img_dog_error.png";
import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";

type TRole = "USER" | "ADMIN";

type TErrorPageContentProps = {
  from?: string;
};

export default function UnauthorizedErrorPageContent({ from }: TErrorPageContentProps) {
  const { user } = useAuth();
  const router = useRouter();

  const requiredRole = {
    USER: "administrators or higher",
    ADMIN: "super administrators",
  } as const;

  const handleClick = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/products");
    }
  };

  return (
    <div className="flex flex-col h-screen justify-center items-center gap-[20px] -mb-[24px]">
      {user?.role && (
        <>
          <section className="flex flex-col gap-[16px] justify-center items-center">
            <div className="relative w-[40vw] h-[30vh] max-w-[300px] aspect-[7/8]">
              <Image
                src={img_dog_error}
                alt="Dog illustration indicating an access error"
                fill
                className="object-contain"
              />
            </div>

            <div role="status" className="text-center font-medium text-[16px]/[24px] sm:text-[20px]/[30px]">
              {from === "order" && user.role !== "USER" ? (
                <>
                  <h2>This page is for regular users only.</h2>
                  <p>Administrators cannot access this page.</p>
                </>
              ) : (
                <>
                  <h2>You don’t have access to this page.</h2>
                  <p>Only {requiredRole[user.role as TRole]} can access it.</p>
                </>
              )}
            </div>
          </section>

          <Button
            type="black"
            label="Go back"
            onClick={handleClick}
            className="font-semibold text-[16px]/[20px] tracking-tight w-full max-w-[230px] min-h-[56px] sm:max-w-[310px] sm:h-[64px]"
          />
        </>
      )}
    </div>
  );
}

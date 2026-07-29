"use client";

import Button from "@/components/ui/Button";
import Image from "next/image";
import React, { useEffect } from "react";
import img_dog_error from "@/assets/images/img_dog_error.png";
import { useRouter } from "next/navigation";

export default function NotFoundPage() {
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
          <Image
            src={img_dog_error}
            alt="Dog illustration indicating the page was not found"
            fill
            className="object-contain"
          />
        </div>
        <div role="status" className="text-center font-medium text-[16px]/[24px] sm:text-[20px]/[30px]">
          <h2>Page not found</h2>
          <p>The page you’re looking for doesn’t exist or may have moved.</p>
        </div>
      </section>
      <div className="flex gap-4">
        <Button
          type="black"
          label="Go back"
          onClick={handleClick}
          className="font-semibold text-[16px]/[20px] tracking-tight w-44 max-w-[230px] min-h-[56px] sm:max-w-[310px] sm:h-[64px]"
        />
        <Button
          type="white"
          label="Go home"
          onClick={() => router.push("/products")}
          className="font-semibold text-[16px]/[20px] tracking-tight w-44 max-w-[230px] min-h-[56px] sm:max-w-[310px] sm:h-[64px]"
        />
      </div>
    </div>
  );
}

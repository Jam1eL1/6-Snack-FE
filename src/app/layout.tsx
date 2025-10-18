import type { Metadata } from "next";
import React from "react";
import localFont from "next/font/local";
import "./globals.css";
// import DevNavBar from "@/app/(devTools)/DevTools";
import { TChildrenProps } from "@/types/children.types";
import Header from "@/components/layout/Header";
import Providers from "./Providers";
import GeneralLayout from "@/components/layout/GeneralLayout";

const suit = localFont({
  src: "../assets/fonts/suit_variable.woff2",
  weight: "100 900",
  variable: "--font-suit",
});

export const metadata: Metadata = {
  title: "스낵(Snack)",
  description: "여러 플랫폼에서 구매한 간식 내역을 한곳에 모아 관리할 수 있는 원스톱 간식 관리 서비스",
};

export default function RootLayout({ children }: TChildrenProps) {
  return (
    <html lang="ko">
      <body className={`${suit.variable} min-h-screen flex flex-col`}>
        <Providers>
          <Header />
          {/* 개발용 네비게이션 바*/}
          {/* <DevNavBar /> */}
          <main className="relative flex-1">
            <GeneralLayout>{children}</GeneralLayout>
          </main>
        </Providers>
      </body>
    </html>
  );
}

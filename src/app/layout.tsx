import type { Metadata } from "next";
import React from "react";
import localFont from "next/font/local";
import "./globals.css";
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
  title: "Snack",
  description: "A comprehensive one-stop office procurement and management service.",
};

export default function RootLayout({ children }: TChildrenProps) {
  return (
    <html lang="en">
      <body className={`${suit.variable} min-h-screen flex flex-col`}>
        <Providers>
          <Header />
          <main className="relative flex-1">
            <GeneralLayout>{children}</GeneralLayout>
          </main>
        </Providers>
      </body>
    </html>
  );
}

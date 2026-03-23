"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ic_lock from "@/assets/icons/ic_lock.svg";
import img_logo from "@/assets/images/img_logo.webp";
import { usePathname, useRouter } from "next/navigation";
import { TSideMenuItem } from "@/types/sideMenu.types";
import HamburgerMenuIconSvg from "../svg/HamburgerMenuIconSvg";
import SideMenu from "../common/SideMenu";

export default function GuestHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { id: "signin", label: "Log In", href: "/signin" },
    { id: "super-admin-signup", label: "Company Admin Sign Up", href: "/signup/super-admin" },
  ];

  // Hamburger menu button click handler
  const handleMenuClick = () => {
    setIsMenuOpen(true);
  };

  // Handler when a nav item is selected from the sidebar menu
  const handleItemClick = (item: TSideMenuItem) => {
    if (item.href) {
      router.push(item.href);
      setIsMenuOpen(false);
    }
  };
  return (
    <header className="w-full h-14 sm:h-25 md:h-[90px] sm:px-[24px] sm:py-[32px] md:px-[100px] flex justify-between items-center overflow-hidden pl-[10px] pr-[24px] pt-[16px] pb-[16px] bg-white/90 shadow-[0px_4px_6px_0px_rgba(0,0,0,0.02)] ">
      <Link href="/">
        <div className="relative w-[102.75px] h-[44px]">
          <Image src={img_logo} fill alt="Snack Logo" className="object-contain" />
        </div>
      </Link>
      <HamburgerMenuIconSvg className="sm:hidden text-primary-400" onClick={handleMenuClick} />

      <SideMenu
        items={menuItems}
        isOpen={isMenuOpen}
        currentPath={pathname}
        onItemClick={handleItemClick}
        onClose={() => setIsMenuOpen(false)}
      />

      {/* tablet view */}
      {/* Log In + Company Admin Sign Up section */}
      <div className="hidden sm:block">
        <div className="flex items-center gap-10">
          {/* Log In */}
          <Link href="/signin" className="flex items-center gap-1">
            <div className="relative w-[24px] h-[24px]">
              <Image src={ic_lock} alt="Lock Icon" fill className="object-contain" />
            </div>
            <p className="font-normal text-primary-950">Log In</p>
          </Link>
          {/* Company Admin Sign Up */}
          <Link href="/signup/super-admin" className="flex gap-1 items-center">
            <p className="font-normal text-primary-950">Company Admin Sign Up</p>
          </Link>
        </div>
      </div>
    </header>
  );
}

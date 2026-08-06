"use client";

import React, { useState } from "react";
import Image from "next/image";
import ic_cart from "@/assets/icons/ic_cart.svg";
import ProfileAvatar from "../common/ProfileAvatar";
import VerticalBarIconSvg from "../svg/VerticalBarIconSvg";
import Link from "next/link";
import LikeIconSvg from "../svg/LikeIconSvg";
import HamburgerMenuIconSvg from "../svg/HamburgerMenuIconSvg";
import SideMenu from "../common/SideMenu";
import MobileCategoryMenu from "../common/MobileCategoryMenu";
import { usePathname } from "next/navigation";
import { TSideMenuItem } from "@/types/sideMenu.types";
import { useRouter } from "next/navigation";
import ArrowIconSvg from "../svg/ArrowIconSvg";
import { TCategoryItem } from "@/types/subCategoryMenu.types";
import { useCategoryStore } from "@/stores/categoryStore";
import { CATEGORIES } from "@/lib/constants/categories";
import img_logo from "@/assets/images/img_logo.webp";
import { useAuth } from "@/providers/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { getCartItems } from "@/lib/api/cart.api";
import { queryKeys } from "@/lib/queryKeys";
import { useDeviceType } from "@/hooks/useDeviceType";
import clsx from "clsx";

export default function AuthenticatedHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const { selectedCategory, setSelectedCategory, clearSelectedCategory } = useCategoryStore();

  const { user, signOut } = useAuth();
  const { isMobile } = useDeviceType();

  const { data: cartItems } = useQuery({
    queryKey: queryKeys.cartItems.all,
    queryFn: () => getCartItems(),
  });

  const cartItemCount = cartItems?.cart.length ?? 0;

  const commonMenuItems: TSideMenuItem[] = [
    { id: "products", label: "Products", href: "/products" },
    { id: "my-order-list", label: "My Orders", href: "/my/order-list" },
    { id: "my-products", label: "My Listings", href: "/my/products" },
  ];

  const adminMenuItems = [
    { id: "order-manage", label: "Manage Orders", href: "/order-manage" },
    { id: "order-history", label: "Order History", href: "/order-history" },
  ];

  const superAdminMenuItems = [{ id: "manage-users", label: "Administration", href: "/manage/users" }];

  const getCommonMenuItems = () => {
    let menuItems = [...commonMenuItems];

    if (user?.role === "ADMIN" || user?.role === "SUPER_ADMIN") {
      menuItems = [...menuItems, ...adminMenuItems];
    }

    if (user?.role === "SUPER_ADMIN") {
      menuItems = [...menuItems, ...superAdminMenuItems];
    }

    return menuItems;
  };

  const getSideMenuItems = () => {
    const commonItems = getCommonMenuItems();

    commonItems.push({ id: "my-favorites", label: "Favorites", href: "/my/favorites" });

    if (isMobile) {
      commonItems.push({ id: "profile", label: "Account", href: "/profile" });
    }

    commonItems.push({ id: "logout", label: "Sign Out", href: "" });

    return commonItems;
  };

  const navItems = getCommonMenuItems();
  const sideMenuItems = getSideMenuItems();

  const isMenuActive = (menuHref: string, currentPath: string) => {
    if (menuHref === "/manage/users") {
      return currentPath.startsWith("/manage");
    }
    return currentPath === menuHref;
  };

  const handleMenuClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleCategoryMenuClick = () => {
    setIsCategoryMenuOpen(!isCategoryMenuOpen);
  };

  const handleItemClick = (item: TSideMenuItem) => {
    if (item.id === "logout") {
      signOut();
      setIsMenuOpen(false);
    } else if (item.href) {
      router.push(item.href);
      setIsMenuOpen(false);
    }
  };

  const handleCategoryItemClick = (item: TCategoryItem) => {
    setIsCategoryMenuOpen(false);

    const parentCategory = CATEGORIES.parentCategory.find((parent) => parent.id === item.parentId);
    setSelectedCategory({
      parent: parentCategory?.name || "",
      child: item.name,
      id: item.id,
    });

    router.push(`/products?category=${item.id}`);
  };

  const handleAllCategoriesClick = () => {
    setIsCategoryMenuOpen(false);
    clearSelectedCategory();
    router.push("/products");
  };

  const currentCategoryName = selectedCategory?.parent || "All";
  return (
    <header className="sticky top-0 w-full h-14 sm:h-25 md:h-[90px] flex justify-between items-center overflow-hidden pl-[10px] pr-[24px] pt-[16px] pb-[16px] sm:px-[24px] sm:py-[28px] md:px-[100px] md:py-[32px] bg-white/90 shadow-[0px_4px_6px_0px_rgba(0,0,0,0.02)] backdrop-blur-lg z-200">
      <div className="flex items-center justify-center md:gap-10">
        <Link href="/products">
          <div className="relative w-[102.75px] h-[44px]">
            <Image src={img_logo} fill alt="Snack logo" loading="eager" className="object-contain" />
          </div>
        </Link>
        <div className="hidden md:block">
          <nav className="flex items-center justify-center gap-[30px]">
            {navItems.map((item) => (
              <Link key={item.id} href={item.href || "#"} className="px-2.5">
                <p
                  className={clsx(
                    "text-primary-950 tracking-tight text-base/[20px]",
                    item.href && isMenuActive(item.href, pathname) ? "font-extrabold" : "font-normal",
                  )}
                >
                  {item.label}
                </p>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <div className="block sm:hidden">
        <button
          className={`flex gap-1 items-center ${
            pathname.startsWith("/products") ? "cursor-pointer" : "cursor-default opacity-0 pointer-events-none"
          }`}
          onClick={pathname.startsWith("/products") ? handleCategoryMenuClick : undefined}
          aria-expanded={isCategoryMenuOpen}
          aria-haspopup="true"
        >
          <p className="font-bold">{currentCategoryName}</p>
          <ArrowIconSvg direction={isCategoryMenuOpen ? "up" : "down"} className="w-5 h-5 text-black" />
        </button>
      </div>

      <div className="flex items-center gap-5 sm:gap-10 md:gap-7.5">
        <div className="hidden md:block">
          <Link href="/my/favorites">
            <div className="flex items-center justify-center p-1 gap-0.5">
              <LikeIconSvg isLiked={pathname === "/my/favorites"} className="pointer-events-none" />
              <p
                className={`text-primary-950 text-sm/[17px] tracking-tight ${pathname === "/my/favorites" ? "font-bold" : "font-normal"}`}
              >
                Favorites
              </p>
            </div>
          </Link>
        </div>
        <div className="flex items-center sm:gap-5">
          <Link href="/cart">
            <div className="relative w-[24px] h-[24px]">
              <Image src={ic_cart} alt="Shopping cart" fill className="object-contain" />
              {cartItemCount > 0 && (
                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                  {cartItemCount}
                </div>
              )}
            </div>
          </Link>

          <div className="hidden sm:block">
            <Link href="/profile">
              <ProfileAvatar label={user?.name?.[0] || ""} />
            </Link>
          </div>
          <VerticalBarIconSvg className="hidden sm:block text-primary-100" />
          <button
            onClick={signOut}
            className="cursor-pointer hidden sm:block font-normal text-primary-950 hover:font-bold transition-all"
          >
            Sign Out
          </button>
        </div>

        <HamburgerMenuIconSvg className="md:hidden text-primary-400" onClick={handleMenuClick} />

        <SideMenu
          items={sideMenuItems}
          isOpen={isMenuOpen}
          currentPath={pathname}
          onItemClick={handleItemClick}
          onClose={() => setIsMenuOpen(false)}
          className=""
        />

        <MobileCategoryMenu
          items={CATEGORIES.parentCategory}
          isOpen={isCategoryMenuOpen}
          currentCategory={selectedCategory?.id?.toString()}
          onItemClick={handleCategoryItemClick}
          onAllCategoriesClick={handleAllCategoriesClick}
          onClose={() => setIsCategoryMenuOpen(false)}
        />
      </div>
    </header>
  );
}

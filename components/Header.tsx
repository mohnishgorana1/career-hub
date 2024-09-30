"use client";
import React, { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "./ui/button";
import { AlignJustify, MoonIcon } from "lucide-react";
import Link from "next/link";
import { SignedIn, UserButton, useUser } from "@clerk/nextjs";
import { fetchProfileAction } from "@/lib/actions/profile.action";
import { useTheme } from "next-themes";

function Header({ profileInfo }: any) {
  const { user, isLoaded } = useUser();
  let currentUser: any;

  const { theme, setTheme } = useTheme();

  if (isLoaded) {
    currentUser = user;
  }

  const menuItems = [
    {
      label: "Home",
      path: "/",
      show: true,
    },
    {
      label: "Login",
      path: "/sign-in",
      show: !currentUser,
    },
    {
      label: "Register",
      path: "/sign-up",
      show: !currentUser,
    },
    {
      label: "Jobs",
      path: "/jobs",
      show: currentUser,
    },
    {
      label: "Activity",
      path: "/activity",
      show: profileInfo?.role === "candidate",
    },

    {
      label: "Feed",
      path: "/feed",
      show: profileInfo?.role === "candidate",
    },
    {
      label: "Membership",
      path: "/membership",
      show: profileInfo?.role === "recruiter",
    },
    {
      label: "Account",
      path: "/account",
      show: currentUser,
    },
  ];

  return (
    <div className="">
      <header className="flex items-center justify-between h-16 w-full">
        <Link href={"/"} className="">
          <h3 className="dark:text-white text-3xl sm:text-4xl font-bold">
            CAREER HUB
          </h3>
        </Link>

        {/* mobile */}
        <div className="md:hidden flex items-center justify-between gap-x-2 ">
          <Sheet>
            <SheetTrigger asChild>
              <Button>
                <AlignJustify className="h-4 w-4" />
                <span className="sr-only text-red-800">
                  Toggle Navigation Menu
                </span>
              </Button>
            </SheetTrigger>

            <SheetContent side={"right"}>
              <div className="h-full flex flex-col justify-between gap-y-8 py-6 ">
                <Link
                  href={"#"}
                  className="mr-6 w-full text-center dark:text-white"
                >
                  <h3 className="text-xl border-b pb-1 dark:border-white font-bold">
                    CAREER HUB
                  </h3>
                </Link>

                <div className="flex flex-col justify-between gap-y-1 ">
                  {menuItems.map(
                    (menuItem, idx) =>
                      menuItem.show && (
                        <Link
                          key={idx}
                          href={menuItem.path}
                          className="w-fit flex items-center my-1 text-lg font-semibold dark:text-white border-b dark:hover:border-b-white hover:border-b-gray-950 duration-200"
                        >
                          {menuItem.label}
                        </Link>
                      )
                  )}
                </div>

                <span className="flex flex-col gap-y-6 ">
                  <div className="flex items-center justify-between gap-x-4">
                    <h1 className="dark:text-white font-bold">Theme</h1>
                    <MoonIcon
                      className="cursor-pointer"
                      fill={theme === "dark" ? "light" : "dark"}
                      onClick={() =>
                        setTheme(theme === "light" ? "dark" : "light")
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between gap-x-4">
                    <h1 className="dark:text-white font-bold">Profile</h1>
                    <SignedIn>
                      <UserButton />
                    </SignedIn>
                  </div>
                </span>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* desktop */}
        <div className="hidden md:flex items-center gap-x-12 ">
          <nav className="flex gap-x-8 items-center">
            {menuItems.map(
              (menuItem, idx) =>
                menuItem.show && (
                  <Link
                    key={idx}
                    href={menuItem.path}
                    className="dark:text-white text-black font-medium bg-transparent px-2 rounded-md border-b-transparent border-b-2 dark:hover:border-white hover:border-black hover:border-b-2"
                  >
                    {menuItem.label}
                  </Link>
                )
            )}
          </nav>
          <MoonIcon
            className="cursor-pointer text-white"
            fill={theme === "dark" ? "light" : "dark"}
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          />
          <div className="hidden md:flex">
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </header>
    </div>
  );
}

export default Header;

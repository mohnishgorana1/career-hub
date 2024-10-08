"use client";
import React, { useEffect, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
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
      label: "Jobs",
      path: "/jobs",
      show: currentUser,
    },
    {
      label: "Activity",
      path: "/activity",
      show: currentUser &&  profileInfo?.role === "candidate",
    },

    {
      label: "Feed",
      path: "/feed",
      show: currentUser,
    },
    {
      label: "Membership",
      path: "/membership",
      show: currentUser && profileInfo?.role === "recruiter",
    },
    {
      label: "Account",
      path: "/account",
      show: currentUser,
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
  ];

  return (
    <div className="">
      <header className="flex items-center justify-between h-16 w-[102%] sm:w-full">
        <Link href={"/"} className="flex items-center space-x-2">
          {/* You can include an optional icon before the text */}
          {/* <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-blue-600 dark:text-white" // Icon color
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11V5a1 1 0 10-2 0v2H7a1 1 0 000 2h2v2a1 1 0 102 0V9h2a1 1 0 000-2h-2z"
              clipRule="evenodd"
            />
          </svg> */}

          <h3 className="dark:text-white text-[30px] sm:text-4xl font-extrabold tracking-wide brightness-125">
            <span className="text-blue-600 dark:text-blue-400">CAREER</span>
            <span className="text-gray-900 dark:text-white"> HUB</span>
          </h3>
        </Link>

        {/* mobile */}
        <div className="md:hidden flex items-center justify-between gap-x-2 ">
          <Sheet>
            <SheetTrigger asChild>
              <GiHamburgerMenu className="dark:text-white text-xl" />
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

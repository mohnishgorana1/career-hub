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
import { AlignJustify } from "lucide-react";
import Link from "next/link";
import { SignedIn, UserButton, useUser } from "@clerk/nextjs";
import { fetchProfileAction } from "@/lib/actions/profile.action";

function Header({ profileInfo }: any) {
  const { user, isLoaded } = useUser();
  let currentUser: any;

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
          <h3 className="text-3xl font-bold">CAREER HUB</h3>
        </Link>

        {/* mobile */}
        <div className="md:hidden flex items-center justify-between gap-x-4">
          <SignedIn>
            <UserButton />
          </SignedIn>

          <Sheet>
            <SheetTrigger asChild>
              <Button>
                <AlignJustify className="h-6 w-6" />
                <span className="sr-only text-red-800">
                  Toggle Navigation Menu
                </span>
              </Button>
            </SheetTrigger>
            <SheetContent side={"right"}>
              <Link href={"#"} className="mr-6 hidden lg:flex">
                <h3 className="text-2xl font-bold">CAREER HUB</h3>
              </Link>
              <div className="grid gap-2 py-6">
                {menuItems.map(
                  (menuItem, idx) =>
                    menuItem.show && (
                      <Link
                        key={idx}
                        href={menuItem.path}
                        className="w-full flex items-center py-2 text-lg font-semibold"
                      >
                        {menuItem.label}
                      </Link>
                    )
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* desktop */}
        <div className="hidden lg:flex items-center gap-x-4">
          <nav className="">
            {menuItems.map(
              (menuItem, idx) =>
                menuItem.show && (
                  <Link
                    key={idx}
                    href={menuItem.path}
                    className="group inline-flex h-9 items-center rounded-md bg-white px-4 py-2  font-medium"
                  >
                    {menuItem.label}
                  </Link>
                )
            )}
          </nav>
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

"use client";
import React, { useEffect, useState } from "react";
import Header from "./Header";
import { fetchProfileAction } from "@/lib/actions/profile.action";
import { useUser } from "@clerk/nextjs";

function CommonLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { user, isLoaded } = useUser();
  let currentUser: any;
  if (isLoaded) {
    currentUser = user;
  }

  const [profileInfo, setProfileInfo] = useState<any>();
  const [isFetchingProfile, setIsFetchingProfile] = useState(true);

  useEffect(() => {
    const getProfileDetails = async () => {
      const data = await fetchProfileAction(currentUser?.id);
      setProfileInfo(data);
      setIsFetchingProfile(false);
    };

    getProfileDetails();
  }, [isLoaded, user]);

  return (
    <div className="mx-auto max-w-7xl p-6 lg:px-8">
      <Header profileInfo={profileInfo} />
      {/* main content */}
      <main>{children}</main>
    </div>
  );
}

export default CommonLayout;

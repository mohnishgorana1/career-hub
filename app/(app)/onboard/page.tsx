"use client";
import OnBoard from "@/components/OnBoard";
import { fetchProfileAction } from "@/lib/actions/profile.action";
import { useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React, { useEffect, useState } from "react";

function OnboardPage() {
  const { user, isLoaded } = useUser();
  const [profileInfo, setProfileInfo] = useState<any>();



  useEffect(() => {
    if (isLoaded && user) {
      const getProfileDetails = async () => {
        const data = await fetchProfileAction(user.id);
        setProfileInfo(data);
      };

      getProfileDetails();
    }
  }, [isLoaded, user]);

  
  if (profileInfo?._id) {
    if (profileInfo.role === "recruiter" && !profileInfo.isPremiumUser) {
      redirect("/membership");
    } else {
      redirect("/");
    }
    return null; // Prevent further rendering after redirect
  }

  return <OnBoard />;
}

export default OnboardPage;

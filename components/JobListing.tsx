"use client";
import { fetchProfileAction } from "@/lib/actions/profile.action";
import { useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import PostNewJob from "./PostNewJob";

function JobListing() {
  const currentAuthUser = useUser();
  const { user, isLoaded } = currentAuthUser;
  const [profileInfo, setProfileInfo] = useState<any>();
  const [isProfileFetched, setIsProfileFetched] = useState(false);
  useEffect(() => {
    if (isLoaded && user) {
      const getProfileDetails = async () => {
        const data = await fetchProfileAction(user.id);
        setProfileInfo(data);
        setIsProfileFetched(true);
      };

      getProfileDetails();
    }
  }, [isLoaded, user]);

  return (
    <div className="">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-baseline justify-between border-b border-gray-200 pt-6 pb-24">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            {profileInfo?.role === "candidate"
              ? "Explore All Jobs"
              : "Jobs Dashboard"}
          </h1>
          <div className="flex items-center">
            {profileInfo?.role === "candidate" ? <p>Filter</p> : <PostNewJob />}
          </div>
        </div>
        
        <div className="">Job Listing Job ListingJob ListingJob Listing</div>
      </div>
    </div>
  );
}

export default JobListing;

"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "./ui/button";

function HomepageButtonControls({ user, profileInfo }) {
  const router = useRouter();

  useEffect(() => {
    router.refresh();
  }, []);

  return (
    <div className="flex space-x-4">
      <Button
        onClick={() => router.push("/jobs")}
        className="flex h-11 items-center justify-center px-3 sm:px-5 font-bold dark:bg-transparent border border-transparent dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-blue-950 "
      >
        {user
          ? profileInfo?.role === "candidate"
            ? "Browse Jobs"
            : "Jobs Dasboard"
          : "Find Jobs"}
      </Button>
      <Button
        onClick={() =>
          router.push(
            user
              ? profileInfo?.role === "candidate"
                ? "/activity"
                : "/jobs"
              : "/jobs"
          )
        }
        className="flex h-11 items-center justify-center px-3 sm:px-5 font-bold dark:bg-transparent border border-transparent dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-blue-950 "
      >
        {user
          ? profileInfo?.role === "candidate"
            ? "Your Activity"
            : "Post New Job"
          : "Post New Job"}
      </Button>
    </div>
  );
}

export default HomepageButtonControls;

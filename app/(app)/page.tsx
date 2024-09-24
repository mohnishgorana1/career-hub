"use client";

import { fetchProfileAction } from "@/lib/actions/profile.action";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function Home() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [profileInfo, setProfileInfo] = useState<any>();
  const [isloading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && user) {
      const getProfileDetails = async () => {
        const data = await fetchProfileAction(user.id);
        setProfileInfo(data);
        setIsLoading(false);
      };

      getProfileDetails();
    }
  }, [isLoaded, user]);

  if (isloading || !isLoaded) {
    return <div>Loading...</div>; // Show loading state while fetching profile info
  }

  if (!profileInfo) {
    router.push('/onboard')
    return null; // Prevent rendering while redirecting
  }

  return (
    <section className="">
      <h1>Home</h1>
    </section>
  );
}

export default Home;

"use client";

import HomepageButtonControls from "@/components/HomePageButtonControls";
import { fetchProfileAction } from "@/lib/actions/profile.action";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
import Loading from "../Loading";

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
    return <div><Loading /></div>; // Show loading state while fetching profile info
  }

  if (!profileInfo) {
    router.push("/onboard");
    return null; // Prevent rendering while redirecting
  }

  return (
    <Fragment>
      <section className="relative w-full h-full min-h-screen">
        <div className="w-full h-full relative">
          <div className="flex flex-col-reverse items-center lg:flex-row gap-10 mt-16 ">
            <section className="w-full lg:w-[50%] flex flex-col items-center justify-center md:px-2 lg:px-0 p-5 lg:p-10">
              <div className="w-full flex justify-start flex-col h-auto lg:pt-7">
                <span className="flex space-x-2">
                  <span className="block w-14 mb-2 dark:border-white border-b-2 border-gray-700"></span>
                  <span className="font-medium dark:text-white text-gray-600">
                    One Stop Solution to Find Jobs
                  </span>
                </span>
                <h1 className="text-3xl dark:text-white mt-5 lg:text-7xl text-black font-extrabold">
                  Build your best job community starting from here.
                </h1>
                <div className="w-full mt-6 flex items-center text-white justify-start gap-2">
                  <HomepageButtonControls
                    user={JSON.parse(JSON.stringify(user))}
                    profileInfo={profileInfo}
                  />
                </div>
              </div>
            </section>
            <section className="relative w-full lg:w-[50%] flex items-center justify-end">
              <Image
                // src="https://utfs.io/f/4c9f7186-8ad0-4680-aece-a5abea608705-k6t10e.png"
                src={"/assets/images/recruiter-hero.jpg"}
                alt="Hero"
                className="dark:hidden h-full w-full sm:h-[580px] sm:ml-20 object-contain z-10 "
                width={800}
                height={800}
              />
               <Image
                // src="https://utfs.io/f/4c9f7186-8ad0-4680-aece-a5abea608705-k6t10e.png"
                // src={"/assets/images/recruiter-hero.jpg"}
                src={"/assets/images/businessman.png"}
                alt="Hero"
                className="hidden dark:flex h-full w-full sm:h-[580px] sm:ml-20 object-contain z-10 brightness-125 "
                width={800}
                height={800}
              />
            </section>
          </div>
        </div>
      </section>
    </Fragment>
  );
}

export default Home;

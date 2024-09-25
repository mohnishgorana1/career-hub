"use client";
import { fetchProfileAction } from "@/lib/actions/profile.action";
import { useUser } from "@clerk/nextjs";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import PostNewJob from "./PostNewJob";
import Loading from "@/app/Loading";
import {
  fetchAllJobsForCandidateAction,
  fetchAllJobsForRecruiterAction,
} from "@/lib/actions/job.action";
import RecruiterJobCard from "./RecruiterJobCard";
import CandidateJobCard from "./CandidateJobCard";
import { fetchApplicationForCandidatesAction } from "@/lib/actions/application.action";

function JobListing() {
  const { user, isLoaded } = useUser();
  const [profileInfo, setProfileInfo] = useState<any>();
  // const [isProfileFetched, setIsProfileFetched] = useState(false);
  const [jobList, setJobList] = useState();
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [jobApplications, setJobApplications] = useState();

  // Memoized profile fetching function
  const fetchProfile = useCallback(async () => {
    try {
      if (user) {
        const profileData = await fetchProfileAction(user.id);
        setProfileInfo(profileData);
      }
    } catch (error) {
      setHasError(true);
      console.error("Error fetching profile:", error);
    }
  }, [user]);

  // Fetch jobs based on user role
  const fetchJobs = useCallback(async (role: string, userId: string) => {
    try {
      let jobs;
      if (role === "candidate") {
        jobs = await fetchAllJobsForCandidateAction();
      } else {
        jobs = await fetchAllJobsForRecruiterAction(userId);
      }
      setJobList(jobs || []);
    } catch (error) {
      setHasError(true);
      console.error("Error fetching jobs:", error);
    }
  }, []);

  // fetch Applications
  const fetchJobApplications = useCallback(
    async (role: string, userId: string) => {
      try {
        if (role === "candidate") {
          const applicationsForCandidate =
            await fetchApplicationForCandidatesAction(userId);
          setJobApplications(applicationsForCandidate);
        } else if (role === "recruiter") {
          const applicationsForRecruiter = await fetchAllJobsForRecruiterAction(
            userId
          );
          setJobApplications(applicationsForRecruiter);
        }
      } catch (error) {
        setHasError(true);
        console.error("Error fetching job Applications:", error);
      }
    },
    []
  );

  useEffect(() => {
    const fetchData = async () => {
      if (isLoaded && user) {
        await fetchProfile();
      }
    };
    fetchData();
  }, [isLoaded, user, fetchProfile]);

  useEffect(() => {
    if (profileInfo?.role && user?.id) {
      fetchJobs(profileInfo.role, user.id).finally(() => setIsLoading(false));
      fetchJobApplications(profileInfo.role, user.id).finally(() =>
        setIsLoading(false)
      );
    }
  }, [profileInfo, user, fetchJobs]);

  // useEffect(() => {
  //   if (isLoaded && user) {
  //     const getProfileDetails = async () => {
  //       const data = await fetchProfileAction(user.id);
  //       setProfileInfo(data);
  //       setIsProfileFetched(true);
  //       return data;
  //     };
  //     const getJobs = async () => {
  //       const profileData = await fetchProfileAction(user.id);
  //       try {
  //         console.log("profile Info", profileData);
  //         const jobs =
  //           profileData && profileData?.role === "candidate"
  //             ? await fetchAllJobsForCandidateAction()
  //             : await fetchAllJobsForRecruiterAction(user?.id);
  //         console.log("Jobs fetched:", jobs);
  //         setJobList(jobs); // Set the fetched jobs in state
  //       } catch (error) {
  //         console.error("Error fetching jobs:", error);
  //       }
  //     };
  //     getProfileDetails();
  //     getJobs();
  //   }
  // }, [isLoaded, user]);

  // if (!isProfileFetched) {
  //   return <Loading />;
  // }
  // if (!jobList) {
  //   return (
  //     <>
  //       <h1>Loading Jobs</h1>
  //       <Loading />;
  //     </>
  //   );
  // }

  // Memoize JSX for job list

  if (isLoading) {
    return <Loading />;
  }

  if (hasError) {
    return <p>There was an error loading your jobs. Please try again later.</p>;
  }

  if (profileInfo)
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
              {profileInfo?.role === "candidate" ? (
                <p>Filter</p>
              ) : (
                <PostNewJob profileInfo={profileInfo} />
              )}
            </div>
          </div>

          <div className="pt-6 pb-24">
            <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-3">
              <div className="lg:col-span-4">
                <div className="container mx-auto p-0 space-y-8">
                  <div className="grid grid-cols-1 gap-x-4 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
                    {jobList && jobList.length! > 0 ? (
                      jobList.map((jobItem, idx) =>
                        profileInfo?.role === "candidate" ? (
                          <CandidateJobCard
                            key={idx}
                            jobItem={jobItem}
                            profileInfo={profileInfo}
                            jobApplications={jobApplications}
                          />
                        ) : (
                          <RecruiterJobCard
                            key={idx}
                            jobItem={jobItem}
                            profileInfo={profileInfo}
                            jobApplications={jobApplications}
                          />
                        )
                      )
                    ) : (
                      // show job cards
                      <>
                        <p>No Jobs Please Create a new Job</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}

export default JobListing;

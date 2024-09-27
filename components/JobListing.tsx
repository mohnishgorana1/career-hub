"use client";
import { fetchProfileAction } from "@/lib/actions/profile.action";
import { useUser } from "@clerk/nextjs";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import PostNewJob from "./PostNewJob";
import Loading from "@/app/Loading";
import {
  createFilterCategoryAction,
  fetchAllJobsForCandidateAction,
  fetchAllJobsForRecruiterAction,
} from "@/lib/actions/job.action";
import RecruiterJobCard from "./RecruiterJobCard";
import CandidateJobCard from "./CandidateJobCard";
import {
  fetchApplicationForCandidatesAction,
  fetchApplicationForRecruitersAction,
} from "@/lib/actions/application.action";
import { filterMenusDataArray } from "@/utils";

function JobListing() {
  const { user, isLoaded } = useUser();
  const [profileInfo, setProfileInfo] = useState<any>();

  const [jobList, setJobList] = useState();
  const [jobApplications, setJobApplications] = useState();

  const [filterCategories, setFilterCategories] = useState();
  const [filterMenus, setFilterMenus] = useState()

  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
          const applicationsForRecruiter =
            await fetchApplicationForRecruitersAction(userId);
          setJobApplications(applicationsForRecruiter);
        }
      } catch (error) {
        setHasError(true);
        console.error("Error fetching job Applications:", error);
      }
    },
    []
  );

  // fetch Filters
  const fetchFilterCategories = useCallback(async () => {
    if (!jobList) return;

    const filterResult = await createFilterCategoryAction();
    setFilterCategories(filterResult);
  }, [jobList]);

  // create filters
  const createFilterMenus = () => {
    const menus = filterMenusDataArray.map((item) => ({
      id: item.id,
      name: item.label,
      options: [
        ...new Set(filterCategories.map((listItem) => listItem[item.id])),
      ],
    }));
    console.log(menus);
    
    setFilterMenus(menus)
  };
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

  useEffect(() => {
    if (jobList) {
      fetchFilterCategories();
    }
  }, [jobList]);

  useEffect(() => {
    if (filterCategories) {
      createFilterMenus();
    }
  }, [filterCategories]);

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

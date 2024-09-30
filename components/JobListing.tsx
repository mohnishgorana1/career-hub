"use client";
import { fetchProfileAction } from "@/lib/actions/profile.action";
import { useUser } from "@clerk/nextjs";
import React, { useCallback, useEffect, useState } from "react";
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
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { Label } from "./ui/label";
import { Skeleton } from "./ui/skeleton";

function JobListing() {
  const { user, isLoaded } = useUser();
  const [profileInfo, setProfileInfo] = useState<any>();

  const [jobList, setJobList] = useState();
  const [jobApplications, setJobApplications] = useState();

  const [filterCategories, setFilterCategories] = useState();
  const [filterMenus, setFilterMenus] = useState();
  const [filterParams, setFilterParams] = useState({});

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
  const fetchJobs = useCallback(
    async (role: string, userId: string, filters: any) => {
      try {
        let jobs;
        if (role === "candidate") {
          jobs = await fetchAllJobsForCandidateAction(filters);
        } else {
          jobs = await fetchAllJobsForRecruiterAction(userId);
        }
        setJobList(jobs || []);
      } catch (error) {
        setHasError(true);
        console.error("Error fetching jobs:", error);
      }
    },
    []
  );

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
      name: item.name,
      options: [
        ...new Set(filterCategories.map((listItem) => listItem[item.id])),
      ],
    }));
    console.log("menus", menus);

    setFilterMenus(menus);
  };

  function handleFilter(filterMenuSectionId: any, currentOption: any) {
    console.log("filterParams", filterParams);

    console.log("filter request", filterMenuSectionId, currentOption);

    let cpyFilterParams = { ...filterParams };

    const indexOfCurrentSection =
      Object.keys(cpyFilterParams).indexOf(filterMenuSectionId);

    if (indexOfCurrentSection === -1) {
      cpyFilterParams = {
        ...cpyFilterParams,
        [filterMenuSectionId]: [currentOption], // title: dataAnalytics
      };
    } else {
      const indexOfCurrentOption =
        cpyFilterParams[filterMenuSectionId].indexOf(currentOption);

      if (indexOfCurrentOption === -1) {
        cpyFilterParams[filterMenuSectionId].push(currentOption);
      } else {
        cpyFilterParams[filterMenuSectionId].splice(indexOfCurrentOption, 1);
      }
    }

    console.log("cpyFilterParams", cpyFilterParams);

    setFilterParams(cpyFilterParams);
    sessionStorage.setItem("filterParams", JSON.stringify(cpyFilterParams));
  }

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
      fetchJobs(profileInfo.role, user.id, filterParams).finally(() =>
        setIsLoading(false)
      );
      fetchJobApplications(profileInfo.role, user.id).finally(() =>
        setIsLoading(false)
      );
    }
  }, [profileInfo, user, fetchJobs, filterParams]);

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
          <div className="flex flex-col sm:flex-row items-center gap-y-4 justify-between border-b border-gray-200 pt-6 pb-16">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white my-5 border-b">
              {profileInfo?.role === "candidate"
                ? "Explore All Jobs"
                : "Jobs Dashboard"}
            </h1>

            <div className="flex items-center dark:text-white">
              {profileInfo?.role === "candidate" ? (
                <Menubar className="border border-black dark:border-white w-[95vw] md:w-auto">
                  {filterMenus &&
                    filterMenus.map((filterMenu, idx) => {
                      const size = filterMenus.length;
                      return (
                        <MenubarMenu key={idx}>
                          <div>
                            <MenubarTrigger
                              className={`truncate rounded-none border-r border-r-black dark:border-r-white ${
                                idx === size - 1 && "border-none "
                              }`}
                            >
                              {filterMenu.name.split(" ")[0]}
                            </MenubarTrigger>
                          </div>
                          <MenubarContent>
                            {filterMenu.options.map((option, optionIdx) => (
                              <MenubarItem
                                key={optionIdx}
                                onClick={() =>
                                  handleFilter(filterMenu.id, option)
                                }
                                className="flex items-center "
                              >
                                <div
                                  className={`h-4 w-4 dark:border-white border rounded border-gray-900 ${
                                    filterParams &&
                                    Object.keys(filterParams).length > 0 &&
                                    filterParams[filterMenu.id] &&
                                    filterParams[filterMenu.id].indexOf(
                                      option
                                    ) > -1
                                      ? "bg-black dark:bg-white"
                                      : ""
                                  } `}
                                />
                                <Label className="ml-3 cursor-pointer text-sm text-gray-600 dark:text-gray-400">
                                  {option}
                                </Label>
                              </MenubarItem>
                            ))}
                          </MenubarContent>
                        </MenubarMenu>
                      );
                    })}
                </Menubar>
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
                        <Skeleton className="bg-zinc-500 mt-5" />
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

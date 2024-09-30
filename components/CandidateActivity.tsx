"use client";

import { fetchApplicationForCandidatesAction } from "@/lib/actions/application.action";
import { fetchAllJobsForCandidateAction } from "@/lib/actions/job.action";
import { fetchProfileAction } from "@/lib/actions/profile.action";
import { useUser } from "@clerk/nextjs";
import { useCallback, useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CommonCard from "./CommonCard";
import JobIcon from "./JobIcon";
import { Button } from "./ui/button";
import ActivityListItem from "./ActivityListItem";

function CandidateActivity() {
  const { user, isLoaded } = useUser();
  const [profileInfo, setProfileInfo] = useState<any>();

  const [jobList, setJobList] = useState();
  const [myJobApplications, setMyJobApplications] = useState();

  const [appliedJobApplication, setAppliedJobApplications] = useState();
  const [selectedJobApplications, setSelectedJobApplications] = useState();
  const [rejectedJobApplications, setRejectedJobApplications] = useState();

  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Memoized profile fetching function
  const fetchProfile = useCallback(async () => {
    try {
      if (user) {
        console.log("user");
        const profileData = await fetchProfileAction(user.id);
        setProfileInfo(profileData);
      }
    } catch (error) {
      setHasError(true);
      console.error("Error fetching profile:", error);
    }
  }, [user]);

  const fetchJobs = useCallback(async () => {
    try {
      const jobs = await fetchAllJobsForCandidateAction({});
      setJobList(jobs || "No Jobs");
    } catch (error) {
      setHasError(true);
      console.error("Error fetching jobs:", error);
    }
  }, []);

  const fetchJobApplications = useCallback(async (userId: string) => {
    try {
      const applicationsForCandidate =
        await fetchApplicationForCandidatesAction(userId);
      setMyJobApplications(applicationsForCandidate);
    } catch (error) {
      setHasError(true);
      console.error("Error fetching job Applications:", error);
    }
  }, []);

  //   const segregateJobApplications = useCallback(() => {
  //     if (!myJobApplications || myJobApplications.length === 0) return;

  //     console.log(myJobApplications);

  //     const applied = myJobApplications.filter(
  //       (application) => application.status === "applied"
  //     );
  //     const selected = myJobApplications.filter(
  //       (application) => application.status === "selected"
  //     );
  //     const rejected = myJobApplications.filter(
  //       (application) => application.status === "rejected"
  //     );

  //     setAppliedJobApplications(applied);
  //     setSelectedJobApplications(selected);
  //     setRejectedJobApplications(rejected);
  //   }, [myJobApplications]);

  const segregateApplicationsByStatus = useCallback(() => {
    if (!jobList || !myJobApplications) return;

    const findJobDetails = (jobId) => {
      return jobList.find((job) => job._id === jobId);
    };

    // Segregating applications by status
    const applied =
      myJobApplications &&
      myJobApplications
        .filter((application) => application.status === "applied")
        .map((application) => {
          const jobDetails = findJobDetails(application.jobId);
          return {
            ...application,
            jobDetails, // Attach the job details to the application
          };
        });

    const selected =
      myJobApplications &&
      myJobApplications
        .filter((application) => application.status === "selected")
        .map((application) => {
          const jobDetails = findJobDetails(application.jobId);
          return {
            ...application,
            jobDetails, // Attach the job details to the application
          };
        });

    const rejected =
      myJobApplications &&
      myJobApplications
        .filter((application) => application.status === "rejected")
        .map((application) => {
          const jobDetails = findJobDetails(application.jobId);
          return {
            ...application,
            jobDetails, // Attach the job details to the application
          };
        });

    console.log("applied", applied);
    console.log("sele", selected);
    console.log("reje", rejected);

    setAppliedJobApplications(applied);
    setSelectedJobApplications(selected);
    setRejectedJobApplications(rejected);
  }, [myJobApplications, jobList]);

  useEffect(() => {
    const fetchData = async () => {
      if (isLoaded && user) {
        await fetchProfile();
      }
    };
    fetchData();
  }, [isLoaded, user, fetchProfile]);

  useEffect(() => {
    if (profileInfo && user?.id) {
      fetchJobs().finally(() => setIsLoading(false));
      fetchJobApplications(user.id).finally(() => setIsLoading(false));
      function segregateJobApplications();
    }
  }, [profileInfo, user, fetchJobs]);

  useEffect(() => {
    if (myJobApplications && jobList) {
      segregateApplicationsByStatus();
    }
  }, [myJobApplications, segregateApplicationsByStatus, jobList]);

  return (
    <div className="mx-auto sm:max-w-7xl">
      <Tabs defaultValue="applied" className="w-full p-0">

        <div className="flex items-baseline justify-between flex-col md:flex-row border-b pb-3 md:pt-24 pt-12 gap-y-8">
          <h1 className="text-4xl font-bold tracking-tight text-gray-950 dark:text-white">
            You Activities
          </h1>

          <TabsList className="grid grid-cols-3 bg-black dark:bg-white self-center">
            <TabsTrigger value="applied" className="text-gray-700">
              Applied
            </TabsTrigger>
            <TabsTrigger value="selected" className="text-green-700">
              Selected
            </TabsTrigger>
            <TabsTrigger value="rejected" className="text-red-700">
              Rejected
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="pb-24 pt-6">
          <div className="container mx-auto p-0 space-y-8">
            <div className="flex flex-col gap-y-4">
              <TabsContent value="applied">
                <ul className="flex flex-col gap-y-5">
                  {appliedJobApplication?.map((appliedJobApplication, idx) => (
                    <ActivityListItem
                      key={idx}
                      jobApplication={appliedJobApplication}
                    />
                  ))}
                </ul>
              </TabsContent>
              <TabsContent value="selected">
                <ul className="flex flex-col gap-y-5">
                  {selectedJobApplications?.map(
                    (selectedJobApplication, idx) => (
                      <ActivityListItem
                        key={idx}
                        jobApplication={selectedJobApplication}
                      />
                    )
                  )}
                </ul>
              </TabsContent>
              <TabsContent value="rejected">
                <ul className="flex flex-col gap-y-5">
                  {rejectedJobApplications?.map(
                    (rejectedJobApplication, idx) => (
                      <ActivityListItem
                        key={idx}
                        jobApplication={rejectedJobApplication}
                      />
                    )
                  )}
                </ul>
              </TabsContent>
            </div>
          </div>
        </div>
      </Tabs>
    </div>
  );
}

export default CandidateActivity;

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
      const jobs = await fetchAllJobsForCandidateAction();
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
    // <div className="mx-auto max-w-7xl">
    //   <h1>Candidate Activity</h1>
    //   <div className="flex items-center justify-between gap-x-8">
    //     <div className="flex flex-col gap-y-2">
    //       <h1>Applied</h1>
    //       <ul className="flex items-end text-gray-700">
    //         {appliedJobApplication?.map((appliedJob, idx) => (
    //           <li key={idx}>
    //             JOB ID {appliedJob.jobId} {appliedJob.status}
    //           </li>
    //         ))}
    //       </ul>
    //     </div>

    //     <div className="flex flex-col gap-y-2">
    //       <h1>Selected</h1>
    //       <ul className="flex items-end text-green-700">
    //         {selectedJobApplications?.map((selectedJob, idx) => (
    //           <li key={idx}>
    //             JOB ID {selectedJob.jobId} {selectedJob.status}
    //           </li>
    //         ))}
    //       </ul>
    //     </div>

    //     <div className="flex flex-col gap-y-2">
    //       <h1>Rejected</h1>
    //       <ul className="flex items-end text-red-700">
    //         {rejectedJobApplications?.map((rejectedJob, idx) => (
    //           <li key={idx}>
    //             JOB ID {rejectedJob.jobId} {rejectedJob.status}
    //           </li>
    //         ))}
    //       </ul>
    //     </div>
    //   </div>
    // </div>

    <div className="mx-auto max-w-7xl">
      <Tabs defaultValue="Applied" className="w-full">
        <div className="flex items-baseline justify-between border-b pb-6 pt-24">
          <h1 className="text-4xl font-bold tracking-tight text-gray-950">
            You Activity
          </h1>
          <TabsList className="grid grid-cols-3 bg-black">
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
            <div className="flex flex-col gap-4">
              <TabsContent value="applied">
                <ul className="flex flex-col gap-y-2">
                  {appliedJobApplication?.map((appliedJobApplication, idx) => (
                    <ActivityListItem
                      key={idx}
                      jobApplication={appliedJobApplication}
                    />
                  ))}
                </ul>
              </TabsContent>
              <TabsContent value="selected">
                <ul className="flex flex-col gap-y-2">
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
                <ul className="flex flex-col gap-y-2">
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

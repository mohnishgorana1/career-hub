"use client";

import React, { Fragment, useState } from "react";
import CommonCard from "./CommonCard";
import JobIcon from "./JobIcon";
import { Button } from "./ui/button";
import { createJobApplicationAction } from "@/lib/actions/application.action";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

function CandidateJobCard({
  jobItem,
  profileInfo,
  jobApplications,
}: {
  jobItem: any;
  profileInfo: any;
  jobApplications: any;
}) {
  const [showJobDetailsDialog, setShowJobDetailsDialog] = useState(false);

  const createJobApplication = async () => {
    await createJobApplicationAction(
      {
        recuiterUserId: jobItem?.recruiterId,
        name: profileInfo?.candidateInfo?.name,
        email: profileInfo?.email,
        candidateUserId: profileInfo?.userId,
        status: "applied",
        jobId: jobItem?._id,
        jobAppliedDate: Date.now(),
      },
      "/jobs"
    );
    setShowJobDetailsDrawer(false);
  };
  // <Drawer
  // open={showJobDetailsDrawer}
  // onOpenChange={setShowJobDetailsDrawer}
  // >

  return (
    <Fragment>
      <CommonCard
        icon={<JobIcon />}
        title={jobItem?.title}
        companyName={jobItem?.companyName}
        footerContent={
          <Button
            onClick={() => setShowJobDetailsDialog(true)}
            className="dark:bg-transparent border dark:text-white dark:border-white dark:hover:bg-white dark:hover:text-gray-950 duration-500"
          >
            View Details
          </Button>
        }
      />

      <Dialog
        open={showJobDetailsDialog}
        onOpenChange={setShowJobDetailsDialog}
      >
        <DialogContent className="drawer h-[100vh] sm:w-[90vw] min-h-max max-h-[90vh] px-2 sm:px-4 py-8 sm:py-8 ">
          <div className="flex sm:flex-row flex-col sm:justify-between sm:px-8 gap-y-3 overflow-y-scroll drawer px-2 pr-4">
            <section className="flex flex-col gap-y-3">
              <DialogTitle className="flex flex-col gap-y-2">
                <h1 className="text-2xl underline sm:text-3xl font-extrabold text-gray-800 dark:text-white">
                  {jobItem?.title}
                </h1>
                <p className="font-bold text-gray-600">
                  {jobItem?.companyName}
                </p>
              </DialogTitle>

              <div className="text-start flex flex-col gap-y-1 sm:mt-8 mt-2 ">
                <div className=" md:text-xl flex flex-col gap-y-1">
                  <p className="sm:flex text-lg font-bold text-gray-900 dark:text-gray-100 underline">
                    Job Description
                  </p>
                  <span className="px-2 sm:px-4 font-medium text-justify tracking-tighter text-gray-800 dark:text-gray-300 text-[14px] sm:text-[16px]  bg-gray-200 dark:bg-gray-950">
                    {jobItem?.jobDescription}
                    {jobItem?.jobDescription}
                    {jobItem?.jobDescription}
                    {jobItem?.jobDescription}
                    {jobItem?.jobDescription}
                    {jobItem?.jobDescription}
                    {jobItem?.jobDescription}
                    {jobItem?.jobDescription}
                    {jobItem?.jobDescription}
                  </span>
                </div>

                <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-x-5">
                  <div className="">
                    <span className="flex items-baseline gap-x-2 mt-4">
                      <p className="text-sm sm:text-lg font-bold text-gray-900 dark:text-gray-100 underline">
                        Location:{" "}
                      </p>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-300">
                        {jobItem?.location}
                      </span>
                    </span>

                    <h3 className="text-sm md:text-lg font-bold text-black dark:text-white ">
                      Experience: {jobItem?.experience} years
                    </h3>
                  </div>
                  <div className="w-[150px] flex justify-center items-center sm:py-2 bg-gray-800 dark:bg-transparent border dark:border-white  rounded-[10px]">
                    <h2 className="md:text-xl font-bold text-white ">
                      {jobItem?.type} Time
                    </h2>
                  </div>
                </section>
              </div>

              <div className="flex flex-col flex-wrap gap-y-1">
                <h2 className="text-gray-950 font-bold text-sm md:text-lg dark:text-white">
                  Skills Required
                </h2>
                <ul className="p-[1px] flex flex-wrap gap-2">
                  {jobItem?.skills.split(",").map((skill) => (
                    <li
                      key={skill}
                      className="text-center py-[1px] sm:py-2 px-2 sm:px-4 bg-gray-900 rounded-xl text-[11px] sm:text-[13px] text-gray-300"
                    >
                      {skill}
                    </li>
                  ))}
                {jobItem?.skills.split(",").map((skill) => (
                    <li
                      key={skill}
                      className="text-center py-[1px] sm:py-2 px-2 sm:px-4 bg-gray-900 rounded-xl text-[11px] sm:text-[13px] text-gray-300"
                    >
                      {skill}
                    </li>
                  ))}
                 
                </ul>
              </div>
            </section>
            <div className="w-full sm:w-24 flex sm:flex-col gap-x-3 gap-y-3">
              <Button
                className="w-full h-6 sm:h-8 text-sm sm:py-2 px-1 sm:px-4 sm:text-lg bg-green-700 hover:bg-green-800 text-white disabled:opacity-40"
                onClick={createJobApplication}
                disabled={
                  jobApplications &&
                  jobApplications.findIndex(
                    (application) => application.jobId === jobItem?._id
                  ) > -1
                    ? true
                    : false
                }
              >
                {jobApplications &&
                jobApplications.findIndex(
                  (application) => application.jobId === jobItem?._id
                ) > -1
                  ? "Applied"
                  : "Apply"}
              </Button>
              <Button
                className="w-full h-6 sm:h-8 text-sm sm:py-2 px-1 sm:px-4 sm:text-lg bg-red-700 hover:bg-red-800 text-white"
                onClick={() => setShowJobDetailsDialog(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
}

export default CandidateJobCard;

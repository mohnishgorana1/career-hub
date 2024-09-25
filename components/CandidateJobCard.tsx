"use client";

import React, { Fragment, useState } from "react";
import CommonCard from "./CommonCard";
import JobIcon from "./JobIcon";
import { Button } from "./ui/button";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { createJobApplicationAction } from "@/lib/actions/application.action";

function CandidateJobCard({
  jobItem,
  profileInfo,
  jobApplications,
}: {
  jobItem: any;
  profileInfo: any;
  jobApplications: any;
}) {
  const [showJobDetailsDrawer, setShowJobDetailsDrawer] = useState(false);

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

  console.log("props", jobItem);

  return (
    <Fragment>
      <Drawer
        open={showJobDetailsDrawer}
        onOpenChange={setShowJobDetailsDrawer}
      >
        <CommonCard
          icon={<JobIcon />}
          title={jobItem?.title}
          companyName={jobItem?.companyName}
          footerContent={
            <DrawerTrigger>
              <Button>View Details</Button>
            </DrawerTrigger>
          }
        />
        <DrawerContent className="p-6 w-full ">
          <div className="flex justify-between">
            <DrawerHeader className="p-0 flex flex-col items-start">
              <DrawerTitle className="text-3xl font-extrabold text-gray-800">
                {jobItem?.title}
              </DrawerTitle>
              <DrawerDescription className="text-xl font-medium text-gray-600 flex flex-col ">
                {jobItem?.jobDescription}
                <span className="text-lg font-normal text-gray-500 ">
                  Location: {jobItem?.location}
                </span>
              </DrawerDescription>
              <div className="w-[150px] mt-6 flex justify-center items-center h-[40px] bg-gray-950 bg-opacity-80 rounded-[10px]">
                <h2 className="text-xl font-bold text-white">
                  {jobItem?.type} Time
                </h2>
              </div>
              <div className="">
                <h3 className="text-2xl font-medium text-black mt-3">
                  Experience: {jobItem?.experience} years
                </h3>
              </div>
              <div className="flex gap-4 flex-wrap mt-6">
                {jobItem?.skills.split(",").map((skill) => (
                  <p
                    key={skill}
                    className="text-center py-2 px-4 bg-gray-900 rounded-xl text-[13px] font-medium text-gray-300"
                  >
                    {skill}
                  </p>
                ))}
              </div>
            </DrawerHeader>
            <div className="flex gap-3 flex-col">
              <Button
                className="bg-green-700 hover:bg-green-800 text-white disabled:opacity-40"
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
                className="bg-red-700 hover:bg-red-800 text-white"
                onClick={() => setShowJobDetailsDrawer(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </Fragment>
  );
}

export default CandidateJobCard;

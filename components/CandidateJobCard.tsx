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

function CandidateJobCard({ jobItem }: { jobItem: any }) {
  const [showJobDetailsDrawer, setshowJobDetailsDrawer] = useState(false);

  return (
    <Fragment>
      <Drawer
        open={showJobDetailsDrawer}
        onOpenChange={setshowJobDetailsDrawer}
      >
        <CommonCard
          icon={<JobIcon />}
          title={jobItem?.title}
          description={jobItem?.companyName}
          footerContent={
            <DrawerTrigger>
              <Button>View Details</Button>
            </DrawerTrigger>
          }
        />
        <DrawerContent className="p-6 w-full ">
          <div className="flex justify-between ">
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
                <h2 className="text-xl font-bold text-white">{jobItem?.type} Time</h2>
              </div>
              <div className="">
                <h3 className="text-2xl font-medium text-black mt-3">Experience: {jobItem?.experience} years</h3>
              </div>
              <div className="flex gap-4 mt-6">
                {
                  jobItem?.skills.split(",").map((skill) => (
                    <div key={skill} className="w-[100px] flex justify-center items-center h-[35px] bg-gray-900 rounded-xl">
                      <h2 className="text-[14px] font-medium text-gray-300">{skill}</h2>
                    </div>
                  ))
                }
              </div>
            </DrawerHeader>
            <div className="flex gap-3 flex-col">
              <Button className="bg-green-700 hover:bg-green-800 text-white">
                Apply
              </Button>
              <Button
                className="bg-red-700 hover:bg-red-800 text-white"
                onClick={() => setshowJobDetailsDrawer(false)}
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

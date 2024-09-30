"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import JobIcon from "./JobIcon";
import { timeAgo } from "@/utils/utilityFunctions";

function ActivityListItem({ jobApplication }) {
  const { status, jobAppliedDate } = jobApplication;
  const {
    experience,
    jobDescription,
    location,
    skills,
    title,
    type,
    companyName,
  } = jobApplication?.jobDetails;
  const totalApplicantsToJob = jobApplication?.jobDetails?.applicants.length;

  let cardShadowColor;
  if (status === "selected") {
    cardShadowColor = "sm:shadow-green-600 hover:shadow-lg hover:shadow-green-700";
  } else if (status === "rejected") {
    cardShadowColor = "sm:shadow-red-500 hover:shadow-lg hover:shadow-red-700";
  } else if (status === "applied") {
    cardShadowColor = "sm:shadow-blue-500 hover:shadow-lg hover:shadow-blue-700 ";
  } else {
    cardShadowColor = "shadow-blue-500 hover:shadow-lg hover:shadow-blue-500";
  }

  let applicationBadgeBgColor;
  if (status === "selected") {
    applicationBadgeBgColor = "bg-green-700";
  } else if (status === "rejected") {
    applicationBadgeBgColor = "bg-red-600";
  } else if (status === "applied") {
    applicationBadgeBgColor = "bg-blue-800 ";
  } else {
    applicationBadgeBgColor = "bg-blue-500";
  }
  return (
    <Card className={`sm:shadow-md ${cardShadowColor} duration-300`}>
      <div className="px-2 sm:px-5 py-2 sm:py-6 min-h-max drawer flex flex-col gap-y-4">
        <CardHeader className="p-0">
          <section className="flex flex-col md:flex-row md:items-start md:justify-between gap-y-3">
            <div className="flex items-center gap-x-4">
              <JobIcon className={"w-6 h-6 sm:w-8 sm:h-8"} />
              <CardTitle className="flex flex-col gap-y-1">
                <h1 className="font-bold text-2xl sm:text-3xl">
                  {title && `${title}`}
                </h1>
                <p className="font-extrabold text-gray-600 text-sm sm:text-lg">
                  {companyName && `${companyName}`}
                </p>
              </CardTitle>
            </div>
            <div className="flex items-baseline sm:flex-col gap-x-4 justify-center">
              <div
                className={`${applicationBadgeBgColor} px-3 py-1 rounded-md text-white capitalize text-sm`}
              >
                {status}
              </div>
              <div className="text-blue-500 text-sm sm:text-lg font-bold">
                Total Applicants: {totalApplicantsToJob}
              </div>
            </div>
          </section>
        </CardHeader>

        <CardContent className="p-0">
          <CardDescription className="flex flex-col gap-y-3">
            <div className="flex flex-col gap-1 ">
              <h1 className="text-lg sm:text-xl font-bold underline text-gray-950 dark:text-white">Job Description:</h1>
              <span className="text-[16px] sm:text-[19px] px-2 font-normal text-gray-950 tracking-wide sm:leading-7 text-justify dark:bg-gray-700 dark:text-gray-200 bg-gray-200 font-serif">
                {jobDescription && `${jobDescription}`}
              </span>
            </div>

            <div className="flex flex-col gap-y-1">
              <h1 className="text-lg sm:text-xl font-bold text-gray-950 dark:text-white">
                Required Experience:{" "}
                <p className="text-[16px] sm:text-[19px] font-normal dark:text-gray-400 text-gray-700 tracking-wider font-serif">
                  {experience && `${experience}`} Year
                </p>
              </h1>
              <h1 className="text-lg sm:text-xl  font-bold text-gray-950 dark:text-white">
                Work Location:{" "}
                <p className="text-[16px] sm:text-[19px] font-normal dark:text-gray-400 text-gray-700 tracking-wider font-serif">
                  {location && `${location}`}
                </p>
              </h1>
              <h1 className="text-lg sm:text-xl  font-bold text-gray-950 dark:text-white">
                Type:{" "}
                <p className="text-[16px] sm:text-[19px] font-normal dark:text-gray-400 text-gray-700 tracking-wider font-serif">
                  {type && `${type}`} Time
                </p>
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-lg sm:text-xl font-bold text-gray-950 dark:text-white ">Skills Required:{" "}</h1>
              <ul className="flex gap-3 flex-wrap">
                {skills.split(",").map((skill) => (
                  <p
                    key={skill}
                    className="text-center py-[1px] sm:py-[3px] px-3 bg-gray-900 dark:bg-gray-200 dark:text-gray-950 rounded-xl text-[14px] sm:text-[16px] font-medium text-gray-300"
                  >
                    {skill.trim() !== "" && skill}
                  </p>
                ))}
              </ul>
            </div>
          </CardDescription>
        </CardContent>

        <CardFooter className="p-0 flex flex-row-reverse justify-between">
          <div className="text-xs">
            <h1 className="text-gray-950 dark:text-gray-500 font-semibold">
              Applied:{" "}
              <span className="font-normal">{timeAgo(jobAppliedDate)}</span>
            </h1>
          </div>
        </CardFooter>
      </div>
    </Card>
  );
}

export default ActivityListItem;

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

  console.log(
    "jobApplicationListItem",
    status,
    jobAppliedDate,
    experience,
    jobDescription,
    location,
    skills,
    title,
    type,
    totalApplicantsToJob
  );
  let cardShadowColor;
  if (status === "selected") {
    cardShadowColor = "shadow-teal-400 hover:shadow-lg hover:shadow-teal-400";
  } else if (status === "rejected") {
    cardShadowColor = "shadow-red-500 hover:shadow-lg hover:shadow-red-500";
  } else if (status === "applied") {
    cardShadowColor =
      "shadow-slate-500 hover:shadow-lg hover:shadow-slate-500 ";
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
    <Card className={`shadow-md ${cardShadowColor} duration-300`}>
      <CardHeader>
        <section className="flex flex-col md:items-baseline md:flex-row md:justify-between gap-y-3">
          <div className="flex items-center gap-x-4">
            <JobIcon />
            <CardTitle className="flex flex-col gap-y-1">
              <h1 className="font-bold text-3xl">{title && `${title}`}</h1>
              <p className="font-extrabold text-gray-600">{companyName && `${companyName}`}</p>
            </CardTitle>
          </div>
          <div className="ml-14 flex items-baseline gap-x-4 justify-between">
            <div
              className={`${applicationBadgeBgColor} px-4 pt-[2px] pb-[4px] rounded-md text-white capitalize text-sm`}
            >
              {status}
            </div>
            <div className="text-blue-500 font-bold">
              Total Applicants: {totalApplicantsToJob}
            </div>
          </div>
        </section>
      </CardHeader>
      <CardContent className="mt-2">
        <CardDescription className="font-bold text-gray-800 text-lg">
          <h1>
            Job Description:{" "}
            <span className="font-normal text-gray-950 tracking-wider font-serif">
              {jobDescription && `${jobDescription}`}
            </span>
          </h1>
          <h1>
            Required Experience:{" "}
            <span className="font-normal text-gray-950 tracking-wider font-serif">
              {experience && `${experience}`} Year
            </span>
          </h1>
          <h1>
            Work Location:{" "}
            <span className="font-normal text-gray-950 tracking-wider font-serif">
              {location && `${location}`}
            </span>
          </h1>
          <h1>
            Type:{" "}
            <span className="font-normal text-gray-950 tracking-wider font-serif">
              {type && `${type}`} Time
            </span>
          </h1>
          <h1 className="flex flex-wrap items-center gap-3">
            Skills Required:{" "}
            <ul className="flex gap-3 flex-wrap ">
              {skills.split(",").map((skill) => (
                <p
                  key={skill}
                  className="text-center py-[1px] px-3 bg-gray-900 rounded-xl text-[14px] font-medium text-gray-300"
                >
                  {skill.trim() !== "" && skill}
                </p>
              ))}
            </ul>
          </h1>
        </CardDescription>
      </CardContent>
      <CardFooter className="flex flex-row-reverse justify-between">
        <div className="text-xs">
          <h1 className="text-gray-950 font-semibold">
            Applied:{" "}
            <span className="font-normal">{timeAgo(jobAppliedDate)}</span>
          </h1>
        </div>
      </CardFooter>
    </Card>
  );
}

export default ActivityListItem;

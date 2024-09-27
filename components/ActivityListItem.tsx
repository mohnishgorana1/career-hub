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
  const { experience, jobDescription, location, skills, title, type } =
    jobApplication?.jobDetails;
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
    cardShadowColor = "shadow-teal-400";
  } else if (status === "rejected") {
    cardShadowColor = "shadow-red-500";
  } else if (status === "applied") {
    cardShadowColor = "shadow-slate-500 ";
  } else {
    cardShadowColor = "shadow-blue-500";
  }

  let applicationBadgeBgColor;
  if (status === "selected") {
    applicationBadgeBgColor = "bg-teal-800";
  } else if (status === "rejected") {
    applicationBadgeBgColor = "bg-red-500";
  } else if (status === "applied") {
    applicationBadgeBgColor = "bg-slate-800 ";
  } else {
    applicationBadgeBgColor = "bg-blue-500";
  }
  return (
    <Card className={`shadow-md ${cardShadowColor}`}>
      <CardHeader>
        <section className="flex justify-between">
          <div className="flex gap-6 items-center">
            <JobIcon />
            <div className="flex gap-10 items-baseline">
              <CardTitle className=" font-bold text-3xl">
                {title && `${title}`}
              </CardTitle>
              <div
                className={`${applicationBadgeBgColor} px-4 py-[2px] rounded-md text-white capitalize text-sm`}
              >
                {status}
              </div>
            </div>
          </div>
          <div className="text-blue-500 font-bold">
            Total Applicants: {totalApplicantsToJob}
          </div>
        </section>
      </CardHeader>
      <CardContent>
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
            Applied: <span className="font-normal">{timeAgo(jobAppliedDate)}</span>
          </h1>
        </div>
      </CardFooter>
    </Card>
  );
}

export default ActivityListItem;

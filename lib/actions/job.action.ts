"use server";

import Job from "@/models/job.model";
import { revalidatePath } from "next/cache";
import dbConnect from "../dbConnect";

export const postNewJobAction = async (
  formData: createNewJob,
  pathToRevalidate: string
) => {
  await dbConnect();
  console.log("formData for new Job", formData, pathToRevalidate);

  try {
    const newJob = await Job.create(formData);
    if (!newJob) {
      console.log("Cant create new Job");
    }
    console.log("Check out new Job", newJob);
  } catch (error) {
    console.log("Error Creating New Job", error);
  }
  revalidatePath(pathToRevalidate);
};

//  fetch all Job

//                                          1 recruiter(own posted jobs)
export const fetchAllJobsForRecruiterAction = async (
  recruiterProfileId: string
) => {
  try {
    await dbConnect();
    console.log("recruiterProfileId", recruiterProfileId);

    const data = await Job.find({ recruiterId: recruiterProfileId });
    console.log("All Jobs For Recruiter", data);

    return JSON.parse(JSON.stringify(data));
  } catch (error) {
    console.error("Error fetching jobs:", error);
    throw error;
  }
};

//                                          2. candidate(all jobs) seperate

export const fetchAllJobsForCandidateAction = async (filterParams: any) => {
  await dbConnect();

  const query: any = {};
  if (filterParams.companyName && filterParams.companyName.length > 0) {
    query.companyName = { $in: filterParams.companyName };
  }
  if (filterParams.title && filterParams.title.length > 0) {
    query.title = { $in: filterParams.title };
  }
  if (filterParams.type && filterParams.type.length > 0) {
    query.type = { $in: filterParams.type };
  }
  if (filterParams.location && filterParams.location.length > 0) {
    query.location = { $in: filterParams.location };
  }
  console.log("query", query);
  


  try {
    const result = await Job.find(query);
    console.log("fetchAllJobsForCandidateAction", result);

    return JSON.parse(JSON.stringify(result));
  } catch (error) {
    console.log("Cant Fetch Jobs for Candidate", error);
    return {
      status: "404",
      message: "Cant Fetch Jobs for Candidate",
    };
  }
};

// filter
export const createFilterCategoryAction = async () => {
  try {
    await dbConnect();
    const result = await Job.find({});

    console.log("", result);

    return JSON.parse(JSON.stringify(result));
  } catch (error) {
    console.log("Error Creating Filter", error);
    return {
      status: "500",
      message: "Error Creating Filter",
    };
  }
};

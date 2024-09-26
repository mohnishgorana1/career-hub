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
export const fetchAllJobsForCandidateAction = async () => {
  await dbConnect();

  try {
    const result = await Job.find({});
    console.log("fetchAllJobsForCandidateAction", result);
    
    return JSON.parse(JSON.stringify(result));
  } catch (error) { 
    console.log("Cant Fetch Jobs for Candidate", error);
    return {
      status: "404",
      message: "Cant Fetch Jobs for Candidate"
    }
  }
};

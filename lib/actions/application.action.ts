"use server";

import Application from "@/models/application.model";
import dbConnect from "../dbConnect";
import { revalidatePath } from "next/cache";
import Job from "@/models/job.model";

//                                               ACTIONS
//                                  1. Create JobApplication
//                                  2. Fetch JobApplication for recruiter
//                                  3. Fetch JobApplication for candidate

export const createJobApplicationAction = async (
  data: any,
  pathToRevalidate: string
) => {
  if (!data) {
    return {
      success: false,
      message: "Invalid Request for createJobApplication",
    };
  }

  await dbConnect();
  try {
    const newJobApplication = await Application.create(data);

    if (newJobApplication) {
      const applicantDetails = {
        name: data.name,
        email: data.email,
        userId: data.candidateUserId,
        status: "applied",
      };

      // Push the applicant details to the job's applicants array
      await Job.findByIdAndUpdate(
        data.jobId,
        {
          $push: { applicants: applicantDetails },
        },
        { new: true }
      );

      revalidatePath(pathToRevalidate);
    }
  } catch (error) {
    console.log("Error Creating Job", error);
    return {
      success: false,
      message: "Error Creating Job",
    };
  }
};

export const fetchApplicationForCandidatesAction = async (
  candidateId: string
) => {
  if (!candidateId) {
    return {
      success: false,
      message: "Invalid Request for fetchApplicationForCandidates",
    };
  }

  await dbConnect();
  try {
    const applications = await Application.find({
      candidateUserId: candidateId,
    });
    if (applications) {
      console.log(applications);
      return JSON.parse(JSON.stringify(applications));
    }
  } catch (error) {
    console.log("Error Fetching Jobs for Candidates", error);
    return {
      success: false,
      message: "Error Fetching Jobs for Candidates",
    };
  }
};

export const fetchApplicationForRecruitersAction = async (
  recruiterId: string
) => {
  if (!recruiterId) {
    return {
      success: false,
      message:
        "Invalid Request for fetchApplicationForCandidates! Not recieving recruiterId at server end",
    };
  }

  await dbConnect();
  try {
    const applications = await Application.find({
      recuiterUserId: recruiterId,
    });
    if (applications) {
      console.log(applications);
      return JSON.parse(JSON.stringify(applications));
    }
  } catch (error) {
    console.log("Error Fetching Jobs for Recruiters", error);
    return {
      success: false,
      message: "Error Fetching Jobs for Recruiters",
    };
  }
};

export const updateApplicationAction = async (
  applicationUpdateData: any,
  pathToRevalidate: string
) => {
  if (!applicationUpdateData) {
    return {
      success: false,
      message:
        "Invalid Request for updateApplication! Missing Request data at server end",
    };
  }

  const { candidateUserId, statusToUpdate, jobId } = applicationUpdateData;
  console.log("data", applicationUpdateData);

  await dbConnect();
  try {
    const updatedApplication = await Application.findOneAndUpdate(
      { candidateUserId: candidateUserId, jobId: jobId },
      { status: statusToUpdate },
      { new: true }
    );
    if (!updatedApplication) {
      return {
        success: false,
        message: "Cann't update application",
      };
    } else {
      console.log("Application updated to ", statusToUpdate);
    }

    const updatedJobApplicantStatus = await Job.findOneAndUpdate(
      {
        _id: jobId,
        "applicants.userId": candidateUserId,
      },
      {
        $set: { "applicants.$.status": statusToUpdate },
      },
      { new: true }
    );
    if (!updatedJobApplicantStatus) {
      return {
        success: false,
        message: "Can't update job applicants status",
      };
    } else {
      console.log("Job Applicants status updated to ", statusToUpdate);
    }

    console.log("response", {
      success: true,
      message: `Job Applicants status updated to ${statusToUpdate}`,
      updatedApplication: JSON.parse(JSON.stringify(updatedApplication)),
      updatedJobApplicantStatus: JSON.parse(
        JSON.stringify(updatedJobApplicantStatus)
      ),
    });

    const dataToReturn = {
      success: true,
      message: `Job Applicants status updated to ${statusToUpdate}`,
      updatedApplication,
      updatedJobApplicantStatus,
    };
    revalidatePath(pathToRevalidate);
    return JSON.parse(JSON.stringify(dataToReturn));
  } catch (error) {
    console.log("Error Updating Application", error);
    return {
      success: false,
      message: "Error Updating Application",
    };
  }
};

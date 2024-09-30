"use client";
import React, { Dispatch, Fragment, SetStateAction, useState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogFooter } from "./ui/dialog";
import { fetchProfileAction } from "@/lib/actions/profile.action";
import { createClient } from "@supabase/supabase-js";
import {
  NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_SUPABASE_URL,
} from "@/lib/supabase.config";
import { updateApplicationAction } from "@/lib/actions/application.action";
import { useRouter } from "next/navigation";

interface CandidateListProps {
  currentCandidateDetails: any;
  setCurrentCandidateDetails: Dispatch<SetStateAction<any>>; // Update type to accept any setter
  showCurrentCandidateDetailsModal: boolean;
  setShowCurrentCandidateDetailsModal: Dispatch<SetStateAction<boolean>>; // Update type to accept boolean setter
  jobItem: any;
  jobApplications: any;
  profileInfo: any;
}

const supabaseClient = createClient(
  NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY
);

function CandidateList({
  currentCandidateDetails,
  setCurrentCandidateDetails,
  jobApplications,
  jobItem,
  showCurrentCandidateDetailsModal,
  setShowCurrentCandidateDetailsModal,
  profileInfo,
}: CandidateListProps) {
  const router = useRouter();
  const handleFetchCandidateDetails = async (userId: string) => {
    const result = await fetchProfileAction(userId);

    if (result) {
      setCurrentCandidateDetails(result);
      setShowCurrentCandidateDetailsModal(true);
    }
  };

  const handleSelectOrRejectCandidate = async (
    statusToUpdate: "selected" | "rejected"
  ) => {
    try {
      console.log("ststus to upate", statusToUpdate);

      const result = await updateApplicationAction(
        {
          candidateUserId: currentCandidateDetails?.userId,
          statusToUpdate: statusToUpdate,
          jobId: jobItem?._id,
        },
        "/"
      );

      // Check if result is null or undefined
      if (!result) {
        console.log("No response from server action.");
      } else {
        console.log("Result from server:", result);
        setShowCurrentCandidateDetailsModal(false);
        router.refresh();
      }
    } catch (error) {
      console.error("Error calling server action:", error);
    }
  };

  const handlePreviewResume = async () => {
    const { data } = supabaseClient.storage
      .from("job-board-public")
      .getPublicUrl(currentCandidateDetails?.candidateInfo?.resume);
    console.log(data);

    const a = document.createElement("a");
    a.href = data?.publicUrl;
    a.setAttribute("download", "Resume.pdf");
    a.setAttribute("target", "_blank");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <Fragment>
      <div className="p-10 grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 py-1 px-4 bg-gray-200 ">
        {jobItem &&
          jobItem.applicants &&
          jobItem.applicants.map((applicant, idx) => (
            <div
              key={idx}
              className="bg-white shadow-lg w-full max-w-sm rounded-lg overflow-hidden mx-auto mt-4"
            >
              <div className="px-4 my-6 flex items-start justify-between">
                <div className="flex flex-col gap-y-2 ">
                  <h3 className="text-lg font-bold">{applicant.name}</h3>
                  <h1
                    className={`font-bold ${applicant.status === "selected" ? "text-green-600" : "text-red-600"}`}
                    onClick={() =>
                      handleFetchCandidateDetails(applicant.userId)
                    }
                  >
                    {applicant.status === "selected" && "Selected"}
                    {applicant.status === "rejected" && "Rejected"}
                    {!applicant.status && null}

                  </h1>
                </div>
                <Button
                  className="bg-blue-700 hover:bg-blue-800"
                  onClick={() => handleFetchCandidateDetails(applicant.userId)}
                >
                  View Profile
                </Button>
              </div>
            </div>
          )
        )}
      </div>

      <Dialog
        open={showCurrentCandidateDetailsModal}
        onOpenChange={() => {
          setCurrentCandidateDetails(null);
          setShowCurrentCandidateDetailsModal(false);
        }}
      >
        <DialogContent className="p-1 sm:p-4 my-2 sm:my-4 bg-white flex flex-col gap-[1px] text-[10px] sm:text-sm font-medium overflow-y-clip">
          <section className="mx-auto ">
            <Button
              onClick={handlePreviewResume}
              className="bg-zinc-700 hover:bg-zinc-950"
            >
              Click to View Resume
            </Button>
          </section>
          <section className="grid grid-cols-4 py-1 px-2 sm:px-4 bg-gray-200 ">
            <h1 className="col-span-2">Name</h1>
            <p className="col-span-2 flex flex-wrap">
              {currentCandidateDetails?.candidateInfo?.name}
            </p>
          </section>
          <section className="grid grid-cols-4 py-1 px-2 sm:px-4 bg-gray-200 ">
            <h1 className="col-span-2">Email</h1>
            <p className="col-span-2 flex flex-wrap ">
              {currentCandidateDetails?.email}
            </p>
          </section>
          <section className="grid grid-cols-4 py-1 px-2 sm:px-4 bg-gray-200 ">
            <h1 className="col-span-2">Skills</h1>
            <p className="col-span-2 flex flex-wrap">
              {currentCandidateDetails?.candidateInfo?.skills}
            </p>
          </section>
          <section className="grid grid-cols-4 py-1 px-2 sm:px-4 bg-gray-200 ">
            <h1 className="col-span-2">Current Job Location</h1>
            <p className="col-span-2 flex flex-wrap">
              {currentCandidateDetails?.candidateInfo?.currentJobLocation}
            </p>
          </section>
          <section className="grid grid-cols-4 py-1 px-2 sm:px-4 bg-gray-200 ">
            <h1 className="col-span-2">Preferred Job Location</h1>
            <p className="col-span-2 flex flex-wrap">
              {currentCandidateDetails?.candidateInfo?.preferredJobLocation}
            </p>
          </section>
          <section className="grid grid-cols-4 py-1 px-2 sm:px-4 bg-gray-200 ">
            <h1 className="col-span-2">Current Salary</h1>
            <p className="col-span-2 flex flex-wrap">
              {currentCandidateDetails?.candidateInfo?.currentSalary}
            </p>
          </section>

          <section className="grid grid-cols-4 py-1 px-2 sm:px-4 bg-gray-200 ">
            <h1 className="col-span-2">Current Company</h1>
            <p className="col-span-2 flex flex-wrap">
              {currentCandidateDetails?.candidateInfo?.currentCompany}
            </p>
          </section>
          <section className="grid grid-cols-4 py-1 px-2 sm:px-4 bg-gray-200 ">
            <h1 className="col-span-2">Notice Period</h1>
            <p className="col-span-2 flex flex-wrap">
              {currentCandidateDetails?.candidateInfo?.noticePeriod}
            </p>
          </section>
          <section className="grid grid-cols-4 py-1 px-2 sm:px-4 bg-gray-200 ">
            <h1 className="col-span-2">Previous Companies</h1>
            <p className="col-span-2 flex flex-wrap">
              {currentCandidateDetails?.candidateInfo?.previousCompanies}
            </p>
          </section>
          <section className="grid grid-cols-4 py-1 px-2 sm:px-4 bg-gray-200 ">
            <h1 className="col-span-2">Total Experience</h1>
            <p className="col-span-2 flex flex-wrap">
              {currentCandidateDetails?.candidateInfo?.totalExperience}
            </p>
          </section>
          <section className="grid grid-cols-4 py-1 px-2 sm:px-4 bg-gray-200 ">
            <h1 className="col-span-2">College</h1>
            <p className="col-span-2 flex flex-wrap">
              {currentCandidateDetails?.candidateInfo?.college}
            </p>
          </section>
          <section className="grid grid-cols-4 py-1 px-2 sm:px-4 bg-gray-200 ">
            <h1 className="col-span-2">College Location</h1>
            <p className="col-span-2 flex flex-wrap">
              {currentCandidateDetails?.candidateInfo?.collegeLocation}
            </p>
          </section>
          <section className="grid grid-cols-4 py-1 px-2 sm:px-4 bg-gray-200 ">
            <h1 className="col-span-2">Graduated Year</h1>
            <p className="col-span-2 flex flex-wrap">
              {currentCandidateDetails?.candidateInfo?.graduatedYear}
            </p>
          </section>
          <section className="grid grid-cols-4 py-1 px-2 sm:px-4 bg-gray-200 ">
            <h1 className="col-span-2">Github Profile</h1>
            <p className="col-span-2 flex flex-wrap">
              {currentCandidateDetails?.candidateInfo?.githubProfile}
            </p>
          </section>
          <section className="grid grid-cols-4 py-1 px-2 sm:px-4 bg-gray-200 ">
            <h1 className="col-span-2">LinkedIn Profile</h1>
            <p className="col-span-2 flex flex-wrap">
              {currentCandidateDetails?.candidateInfo?.linkedInProfile}
            </p>
          </section>

          <DialogFooter className="mt-2 self-center">
            <div className="flex gap-3">
              <button
                onClick={() => handleSelectOrRejectCandidate("selected")}
                className="bg-green-600 hover:bg-green-800 px-2 sm:px-4 py-1  sm:py-2 rounded-lg text-white"
              >
                Select
              </button>
              <button
                onClick={() => handleSelectOrRejectCandidate("rejected")}
                className="bg-red-600 hover:bg-red-800   px-2 sm:px-4 py-1  sm:py-2 rounded-lg text-white"
              >
                Reject
              </button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
}

export default CandidateList;

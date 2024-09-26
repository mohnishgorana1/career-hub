"use client";
import React, { useState } from "react";
import CommonCard from "./CommonCard";
import JobIcon from "./JobIcon";
import { Button } from "./ui/button";
import JobApplicants from "./JobApplicants";

function RecruiterJobCard({
  jobItem,
  profileInfo,
  jobApplications,
}: {
  jobItem: any;
  profileInfo: any;
  jobApplications: any;
}) {
  const applicants = jobItem?.applicants.length;

  const [showApplicantsDrawer, setShowApplicantsDrawer] =
    useState<boolean>(false);
  const [currentCandidateDetails, setCurrentCandidateDetails] = useState<
    null | any
  >(null);
  const [
    showCurrentCandidateDetailsModal,
    setShowCurrentCandidateDetailsModal,
  ] = useState<boolean>(false);

  return (
    <div>
      <CommonCard
        icon={<JobIcon />}
        title={jobItem?.title}
        companyName={jobItem?.companyName}
        footerContent={
          <Button
            className={`${
              applicants <= 0
                ? "bg-red-700 hover:bg-red-900 disabled:opacity-45"
                : "bg-green-600 hover:bg-green-700"
            }`}
            disabled={applicants <= 0}
            onClick={() => setShowApplicantsDrawer(true)}
          >
            {applicants} Applicants
          </Button>
        }
      />
      <JobApplicants
        showApplicantsDrawer={showApplicantsDrawer}
        setShowApplicantsDrawer={setShowApplicantsDrawer}
        currentCandidateDetails={currentCandidateDetails}
        setCurrentCandidateDetails={setCurrentCandidateDetails}
        showCurrentCandidateDetailsModal={showCurrentCandidateDetailsModal}
        setShowCurrentCandidateDetailsModal={
          setShowCurrentCandidateDetailsModal
        }
        jobItem = {jobItem}
        jobApplications={jobApplications}
        profileInfo={profileInfo}
      />
    </div>
  );
}

export default RecruiterJobCard;

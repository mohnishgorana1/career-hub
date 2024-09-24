import React from "react";
import CommonCard from "./CommonCard";
import JobIcon from "./JobIcon";
import { Button } from "./ui/button";

function CandidateJobCard({ jobItem }: { jobItem: any }) {
  return (
    <CommonCard
      icon={<JobIcon />}
      title={jobItem?.title}
      description={jobItem?.companyName}
      footerContent={<Button>View Details</Button>}
    />
  );
}

export default CandidateJobCard;

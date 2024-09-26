"use client";
import React, { Dispatch, SetStateAction } from "react";
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
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import CandidateList from "./CandidateList";

interface JobApplicantsProps {
  showApplicantsDrawer: boolean;
  setShowApplicantsDrawer: Dispatch<SetStateAction<boolean>>; // Update type to accept boolean setter
  currentCandidateDetails: any;
  setCurrentCandidateDetails: Dispatch<SetStateAction<any>>; // Update type to accept any setter
  showCurrentCandidateDetailsModal: boolean;
  setShowCurrentCandidateDetailsModal: Dispatch<SetStateAction<boolean>>; // Update type to accept boolean setter
  jobItem: any;
  jobApplications: any;
  profileInfo: any
}

function JobApplicants({
  showApplicantsDrawer,
  setShowApplicantsDrawer,
  currentCandidateDetails,
  setCurrentCandidateDetails,
  showCurrentCandidateDetailsModal,
  setShowCurrentCandidateDetailsModal,
  jobItem,
  jobApplications,
  profileInfo
}: JobApplicantsProps) {
  console.log("job", jobItem, jobApplications);
  
  return (
    <Drawer open={showApplicantsDrawer} onOpenChange={setShowApplicantsDrawer}>
      <DrawerContent className="max-h-[50vh]">
        <ScrollArea className="h-auto overflow-y-auto">
          <CandidateList
            currentCandidateDetails={currentCandidateDetails}
            setCurrentCandidateDetails={setCurrentCandidateDetails}
            jobApplications={jobApplications}
            jobItem = {jobItem}
            showCurrentCandidateDetailsModal = {showCurrentCandidateDetailsModal}
            setShowCurrentCandidateDetailsModal = {setShowCurrentCandidateDetailsModal}
            profileInfo={profileInfo}
          />
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
}

export default JobApplicants;

"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CommonForm from "./CommonForm";
import { initialPostNewJobFormData, postNewJobFormControls } from "@/utils";
import { postNewJobAction } from "@/lib/actions/job.action";

function PostNewJob({ profileInfo }: { profileInfo: any }) {
  const [showJobDialog, setShowJobDialog] = useState(false);
  const [jobFormData, setJobFormData] = useState({
    ...initialPostNewJobFormData,
    companyName: profileInfo?.recruiterInfo?.companyName,
  });

  function handlePostNewJobBtnValidation() {
    return Object.keys(jobFormData).every(
      (control) => jobFormData[control]?.trim() !== ""
    );
  }

  async function postNewJob() {
    console.log("Sending request", {
      ...jobFormData,
      recruiterId: profileInfo?.userId,
      applicants: [],
    });

    try {
      const response = await postNewJobAction(
        {
          ...jobFormData,
          recruiterId: profileInfo?.userId,
          applicants: [],
        },
        "/jobs"
      );
      console.log("response", response);
    } catch (error) {
      console.log("Error Creating a New Job", error);
    } finally {
      setJobFormData({
        ...initialPostNewJobFormData,
        companyName: profileInfo?.recruiterInfo?.companyName,
      });
      setShowJobDialog(false);
    }
  }

  return (
    <div className="">
      <Button onClick={() => setShowJobDialog(true)}>Post a New Job</Button>

      <Dialog
        open={showJobDialog}
        onOpenChange={() => {
          setShowJobDialog(false);
          setJobFormData({
            ...initialPostNewJobFormData,
            companyName: profileInfo?.recruiterInfo?.companyName,
          });
        }}
      >
        <DialogTrigger></DialogTrigger>

        <DialogContent className="sm:max-w-screen-md h-[600px] overflow-auto">
          <DialogHeader>
            <DialogTitle>Post New Job</DialogTitle>
            <div className="flex gap-4 py-4">
              <CommonForm
                formControls={postNewJobFormControls}
                formData={jobFormData}
                setFormData={setJobFormData}
                buttonText="Add"
                btnType="submit"
                action={postNewJob}
                isButtonDisabled={!handlePostNewJobBtnValidation()}
              />
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default PostNewJob;

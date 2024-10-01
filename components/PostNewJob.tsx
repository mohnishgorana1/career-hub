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
      <Button onClick={() => setShowJobDialog(true)} className="border border-transparent dark:bg-pink-700 dark:text-white dark:hover:bg-transparent dark:hover:border-pink-700 dark:hover:text-pink-700 dark:hover:shadow-sm dark:hover:shadow-pink-700 ">Post a New Job</Button>

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
        <DialogContent className="h-[80vh] w-[95vw] sm:w-[80vw]  overflow-auto candidate-details-dialog-scrollbar">
          <div className="">
            <DialogHeader>
              <DialogTitle className="dark:text-pink-700 text-2xl sm:text-3xl text-center ">
                Post New Job
              </DialogTitle>
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
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default PostNewJob;

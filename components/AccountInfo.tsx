"use client";
import {
  fetchProfileAction,
  updateProfileAction,
} from "@/lib/actions/profile.action";
import { useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import Loading from "@/app/Loading";
import CommonForm from "./CommonForm";
import {
  candidateOnboardFormControls,
  initialCandidateAccountFormData,
  initialRecruiterFormData,
  recruiterOnboardFormControls,
} from "@/utils/index";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { createClient } from "@supabase/supabase-js";
import {
  NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_SUPABASE_URL,
} from "@/lib/supabase.config";

const supabaseClient = createClient(
  NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY
);

function AccountInfo() {
  const { user, isLoaded } = useUser();
  const [profileInfo, setProfileInfo] = useState<any>();
  const [isloading, setIsLoading] = useState(true);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [newResumeFile, setNewResumeFile] = useState(null);
  const [uploadResumePublicLink, setUploadResumePublicLink] = useState(null);

  const [candidateFormData, setCandidateFormData] = useState(
    initialCandidateAccountFormData
  );
  const [recruiterFormData, setRecruiterFormData] = useState(
    initialRecruiterFormData
  );

  const handlePreviewResume = async () => {
    console.log("RESUME LINK", profileInfo?.candidateInfo?.resume);

    const { data } = supabaseClient.storage
      .from("job-board-public")
      .getPublicUrl(profileInfo?.candidateInfo?.resume);
    console.log(data);

    const a = document.createElement("a");
    a.href = data?.publicUrl;
    a.setAttribute("download", "Resume.pdf");
    a.setAttribute("target", "_blank");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  function handleFileChange(e: any) {
    e.preventDefault();
    setNewResumeFile(e.target.files[0]);
  }

  async function handleUploadPdfToSupabase() {
    const { data, error } = await supabaseClient.storage
      .from("job-board-public")
      .upload(`/public/${newResumeFile?.name}`, newResumeFile!, {
        cacheControl: "3600",
        upsert: false,
      });
    console.log(data, error);

    if (data) {
      setUploadResumePublicLink(data.path);
    }
  }

  async function handleUpdateAccount() {
    try {
      setIsUpdatingProfile(true);
      console.log("Update data to sent", uploadResumePublicLink);

      const response = await updateProfileAction(
        profileInfo?.role === "candidate"
          ? {
              _id: profileInfo?._id,
              userId: profileInfo?.userId,
              email: profileInfo?.email,
              role: profileInfo?.role,
              isPremiumUser: profileInfo?.isPremiumUser,
              memberShipType: profileInfo?.memberShipType,
              memberShipStartDate: profileInfo?.memberShipStartDate,
              memberShipEndDate: profileInfo?.memberShipEndDate,
              candidateInfo: {
                ...candidateFormData,
                resume: uploadResumePublicLink
                  ? uploadResumePublicLink
                  : profileInfo?.candidateInfo?.resume,
              },
            }
          : {
              _id: profileInfo?._id,
              userId: profileInfo?.userId,
              email: profileInfo?.email,
              role: profileInfo?.role,
              isPremiumUser: profileInfo?.isPremiumUser,
              memberShipType: profileInfo?.memberShipType,
              memberShipStartDate: profileInfo?.memberShipStartDate,
              memberShipEndDate: profileInfo?.memberShipEndDate,
              recruiterInfo: {
                ...recruiterFormData,
              },
            },
        "/account"
      );
      if (response && response?.success === true) {
        console.log(response?.message);
        toast.success(response?.message);
      }
      if (response && response?.success === false) {
        console.log(response?.message);
        toast.error(response?.message);
      }
    } catch (error) {
      console.log("Error Updating Profile", error);
      toast.error("Something Went Wrong");
    } finally {
      setIsUpdatingProfile(false);
    }
  }

  useEffect(() => {
    if (isLoaded && user) {
      const getProfileDetails = async () => {
        const data = await fetchProfileAction(user.id);
        setProfileInfo(data);
        setIsLoading(false);
      };

      getProfileDetails();
    }
  }, [isLoaded, user]);

  useEffect(() => {
    if (profileInfo?.role === "recruiter")
      setRecruiterFormData(profileInfo?.recruiterInfo);

    if (profileInfo?.role === "candidate")
      setCandidateFormData(profileInfo?.candidateInfo);
  }, [profileInfo]);

  useEffect(() => {
    if (newResumeFile) handleUploadPdfToSupabase();
  }, [newResumeFile]);

  if (isloading || !isLoaded) {
    return (
      <div>
        <Loading />
      </div>
    ); // Show loading state while fetching profile info
  }

  return (
    <main className="mx-auto max-w-7xl flex flex-col items-center mt-4 pt-8 w-full ">
      <h1 className="text-gray-700 font-extrabold text-3xl md:text-4xl">
        Manage Account 
      </h1>
      <div className={`w-full h-auto flex flex-col `}>
        {profileInfo.role === "candidate" && (
          <section
            className={`mt-12 mb-5 flex flex-col md:flex-row items-center justify-between gap-y-4`}
          >
            <>
              <Button
                onClick={handlePreviewResume}
                className={`w-full sm:w-fit border ease-linear border-green-700 hover:text-white text-green-700 bg-transparent hover:bg-green-700 duration-300`}
              >
                Download Old Resume
              </Button>
              <div className="md:w-[500px] grid grid-cols-2 sm:grid-cols-3 gap-3 items-center">
                <Label className="col-span-1 text-sm text-gray-800 font-bold">
                  Upload New Resume
                </Label>
                <Input
                  type={"file"}
                  placeholder="Upload Resume"
                  onChange={handleFileChange}
                  className="col-span-1 sm:col-span-2 text-center text-xs flex items-center justify-center "
                />
              </div>
            </>
          </section>
        )}
        <div className="container mx-auto p-0">
          <CommonForm
            action={handleUpdateAccount}
            formControls={
              profileInfo?.role === "candidate"
                ? candidateOnboardFormControls.filter(
                    (formControl) => formControl.name !== "resume"
                  )
                : recruiterOnboardFormControls
            }
            formData={
              profileInfo?.role === "candidate"
                ? candidateFormData
                : recruiterFormData
            }
            setFormData={
              profileInfo?.role === "candidate"
                ? setCandidateFormData
                : setRecruiterFormData
            }
            buttonText="Update Profile"
            isShowLoadingButton={isUpdatingProfile}
          />
        </div>
      </div>
    </main>
  );
}

export default AccountInfo;

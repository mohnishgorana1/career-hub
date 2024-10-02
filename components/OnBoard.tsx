"use client";
import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CommonForm from "./CommonForm";
import {
  candidateOnboardFormControls,
  initialRecruiterFormData,
  initialCandidateFormData,
  recruiterOnboardFormControls,
} from "@/utils";

import { useUser } from "@clerk/nextjs";
import { createProfileAction } from "@/lib/actions/profile.action";
import { createClient } from "@supabase/supabase-js";
import {
  NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_SUPABASE_URL,
} from "@/lib/supabase.config";
import { useRouter } from "next/navigation";

const supabaseClient = createClient(
  NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY
);

function OnBoard() {
  const router = useRouter()
  const currentAuthUser = useUser();
  const { user } = currentAuthUser;
  const [currentTab, setCurrentTab] = useState<string>("candidate");

  // RECRUITER_FORMDATA : name, companyName, companyRole
  const [recruiterFormData, setRecruiterFormData] = useState(
    initialRecruiterFormData
  );
  const [candidateFormData, setCandidateFormData] = useState(
    initialCandidateFormData
  );

  // file
  const [file, setFile] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);

  const handleTabChange = (value: string) => {
    setCurrentTab(value);
  };

  function handleRecruiterFormValidation() {
    return (
      recruiterFormData &&
      recruiterFormData.name.trim() !== "" &&
      recruiterFormData.companyName.trim() !== "" &&
      recruiterFormData.companyRole.trim() !== ""
    );
  }
  function handleCandidateFormValidation() {
    return Object.keys(candidateFormData).every(
      (key) => candidateFormData[key].trim() !== "" && file
    );
  }




  function handleFileChange(e:any) {
    e.preventDefault();
    setFile(e.target.files[0]);
  }

  async function handleUploadPdfToSupabase() {

    const uniqueFileName = `${profileInfo?.userId}__${file?.name}`


    const { data, error } = await supabaseClient.storage
      .from("job-board-public")
      .upload(`/public/${uniqueFileName}`, file!, {
        cacheControl: "3600",
        upsert: false,
      });
    console.log(data, error);


    if (data) {
      setCandidateFormData({
        ...candidateFormData,
        resume: data.path,
      });
    }
  }

  async function createProfile() {
    const data =
      currentTab === "candidate"
        ? {
            candidateInfo: candidateFormData,
            role: "candidate",
            userId: user?.id,
            email: user?.emailAddresses[0].emailAddress!,
            isPremiumUser: false,
          }
        : {
            userId: user?.id,
            role: "recruiter",
            email: user?.emailAddresses[0].emailAddress!,
            isPremiumUser: false,
            recruiterInfo: recruiterFormData,
          };

    await createProfileAction(data, "/onboard");
    router.push("/")
  }

  useEffect(() => {
    if (file) handleUploadPdfToSupabase();
  }, [file]);

 console.log("data", candidateFormData);
 
  return (
    <div className="bg-white">
      <Tabs value={currentTab} onValueChange={handleTabChange}>
        <div className="w-full">
          <div className="flex items-baseline justify-between border-b pb-6 pt-24">
            <h1 className="text-xl sm:text-4xl font-bold tracking-tight text-gray-900">
              Welcome to Onboarding
            </h1>
            <TabsList className="bg-gray-600">
              <TabsTrigger value="candidate">Candidate</TabsTrigger>
              <TabsTrigger value="recruiter">Recruiter</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="candidate">
            <CommonForm
              formControls={candidateOnboardFormControls}
              buttonText={"Onboard as Candidate"}
              formData={candidateFormData}
              setFormData={setCandidateFormData}
              handleFileChange={handleFileChange}
              isButtonDisabled={!handleCandidateFormValidation()}
              action={createProfile}
            />
          </TabsContent>
          <TabsContent value="recruiter">
            <CommonForm
              formControls={recruiterOnboardFormControls}
              buttonText={"Onboard as Recruiter"}
              formData={recruiterFormData}
              setFormData={setRecruiterFormData}
              isButtonDisabled={!handleRecruiterFormValidation()}
              action={createProfile}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

export default OnBoard;

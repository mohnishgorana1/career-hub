"use client";
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CommonForm from "./CommonForm";
import {
  candidateOnboardFormConrols,
  initalRecuiterFormData,
  initialCandidateFormData,
  recruiterOnboardFormControls,
} from "@/utils";

import { useUser } from "@clerk/nextjs";
import { createProfileAction } from "@/lib/actions/profile.action";

function OnBoard() {
  const currentAuthUser = useUser();
  const { user } = currentAuthUser;
  const [currentTab, setCurrentTab] = useState<string>("candidate");

  // RECRUITER_FORMDATA : name, companyName, companyRole
  const [recruiterFormData, setRecruiterFormData] = useState(
    initalRecuiterFormData
  );
  const [candidateFormData, setCandidateFormData] = useState(
    initialCandidateFormData
  );

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

  async function createProfile() {
    const data = {
      userId: user?.id,
      role: "recruiter",
      email: user?.emailAddresses[0].emailAddress!,
      isPremiumUser: false,
      recruiterInfo: recruiterFormData,
    };

    await createProfileAction(data, "/onboard");
  }

  // useEffect(() => {
  //   console.log("recruiter form Data", recruiterFormData);
  //   console.log("candidate form data", candidateFormData);
  // }, [recruiterFormData, candidateFormData]);

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
              formControls={candidateOnboardFormConrols}
              buttonText={"Onboard as Recruiter"}
              formData={candidateFormData}
              setFormData={setCandidateFormData}
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

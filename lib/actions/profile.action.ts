"use server";

import Profile from "@/models/profile.model";
import dbConnect from "../dbConnect";
import { revalidatePath } from "next/cache";

// create profile action
export const createProfileAction = async (
  profileData: CreateProfile,
  pathToRevalidate: string
) => {
  try {
    await dbConnect();
    const newProfile = await Profile.create(profileData);
    if (!newProfile) {
      console.log("Failed to create new Profile");
    }
    console.log("Profile Created SuccessFully");

    revalidatePath(pathToRevalidate);
  } catch (error) {
    console.log("Error Creating New Profile", error);
  }
};

export const fetchProfileAction = async (id: string) => {
  await dbConnect();

  try {
    const result = await Profile.findOne({ userId: id });

    if (!result) {
      console.log("Profle result cannt find", result);
    }
    console.log("Profle result", result);

    return JSON.parse(JSON.stringify(result));
  } catch (error) {
    console.log("Error Fetching Profile Details", error);
  }
};

export const updateProfileAction = async (
  data: any,
  pathToRevalidate: string
) => {
  await dbConnect();
  const {
    userId,
    role,
    email,
    isPremiumUser,
    memberShipType,
    memberShipStartDate,
    memberShipEndDate,
    recruiterInfo,
    candidateInfo,
    _id,
  } = data;
  try {
    const updatedProfile = await Profile.findOneAndUpdate(
      { _id: _id },
      {
        userId,
        role,
        email,
        isPremiumUser,
        memberShipType,
        memberShipStartDate,
        memberShipEndDate,
        recruiterInfo,
        candidateInfo,
      },
      {
        new: true,
      }
    );

    if (!updatedProfile) {
      console.log("Profle updatedProfile cannt find", updatedProfile);
      return {
        success: false,
        message: "Error Updating your profile",
      };
    }

    revalidatePath(pathToRevalidate);
    console.log("Profle Updated Successfully", updatedProfile);
    return {
      success: true,
      message: "Profle Updated Successfully",
    };
  } catch (error) {
    console.log("Error Updating your profile", error);
  }
};

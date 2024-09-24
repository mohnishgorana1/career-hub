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

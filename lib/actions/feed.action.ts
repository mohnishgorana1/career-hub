"use server";

import Feed from "@/models/feed.model";
import dbConnect from "../dbConnect";
import { revalidatePath } from "next/cache";

// create post
// fetch all posts
// update post action: like

interface createFeedPostParams {
  userId: string;
  userName: string;
  userRole: "candidate" | "recruiter";
  message: string;
  image: string;
  likes: [];
}

export const createFeedPostAction = async (
  data: createFeedPostParams,
  pathToRevalidate: string
) => {
  await dbConnect();
  try {
    if (!data) {
      return {
        success: false,
        message: "Invalid/Missing Request Data",
      };
    }
    console.log("crater feed", data);
    
    const newFeedPost = await Feed.create(data);
    if (!newFeedPost) {
      console.log("Unable Creating New Feed Post");
      return {
        success: false,
        message: "Unable Creating New Feed Post",
      };
    } else {
      console.log("new Feed Post", newFeedPost);
      revalidatePath(pathToRevalidate);
      return {
        success: true,
        message: "New Feed Post Created Successfully",
        newFeedPost: JSON.parse(JSON.stringify(newFeedPost)),
      };
    }
  } catch (error) {
    console.log("Error Creating New Feed Post", error);
    return {
      success: false,
      message: "Error Creating New Feed Post",
      error,
    };
  }
};

export const fetchAllFeedPostsAction = async (id: any) => {
  await dbConnect();
  try {
    if (!id) {
      return {
        success: false,
        message: "Invalid/Missing Request Data",
      };
    }

    const result = await Feed.find({});

    if (!result) {
      console.log("No Feed Post Found");
      return {
        success: false,
        message: "No Feed Post Found",
      };
    } else {
      console.log("feed resuly", JSON.parse(JSON.stringify(result)));
      return {
        success: true,
        message: "Feed Posts Found",
        feedPosts: JSON.parse(JSON.stringify(result)),
      };
    }
  } catch (error) {
    console.log("Error Creating New Feed Post", error);
    return {
      success: false,
      message: "Error Creating New Feed Post",
    };
  }
};

export const updateFeedPostLikesAction = async (updateFeedData: any) => {
  await dbConnect();
  try {
    if (!updateFeedData) {
      return {
        success: false,
        message: "Invalid/Missing Request Data",
      };
    }
    const { postId, reactorUserId, reactorUserName } = updateFeedData;
    console.log("updateFeedData", updateFeedData);

    const existingPost = await Feed.findById(postId);
    if (!existingPost) {
      console.log("Feed post not found.");
      return {
        success: false,
        message: "Feed post not found",
      };
    }
    const hasLiked = existingPost.likes.some(
      (like) => like.reactorUserId === reactorUserId
    );

    let updatedPost;

    if (hasLiked) {
      updatedPost = await Feed.findByIdAndUpdate(
        postId,
        {
          $pull: {
            likes: { reactorUserId: reactorUserId },
          },
        },
        { new: true }
      );
      console.log("User disliked the post.");
    } else {
      updatedPost = await Feed.findByIdAndUpdate(
        postId,
        {
          $addToSet: {
            likes: {
              reactorUserId: reactorUserId,
              reactorUserName: reactorUserName,
            },
          },
        },
        { new: true }
      );
      console.log("User liked the post.");
    }

    if (!updatedPost) {
      console.log("Can't Like/Dislike Feed Post");
      return {
        success: false,
        message: "Can't Like/Dislike Feed Post",
      };
    } else {
      console.log("Like / Dislike result",JSON.parse(JSON.stringify(updatedPost)));

      return {
        success: true,
        message: `Feed Post ${hasLiked ? "Disliked" : "Liked"} Successfully`,
        updatedPost: JSON.parse(JSON.stringify(updatedPost)),
      };
    }
  } catch (error) {
    console.log("Error Updating Like/Dislike Feed Post", error);
    return {
      success: false,
      message: "Error Updating Like/Dislike Feed Post",
    };
  }
};

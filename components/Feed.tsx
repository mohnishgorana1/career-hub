"use client";

import Loading from "@/app/Loading";
import { fetchProfileAction } from "@/lib/actions/profile.action";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogFooter } from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { CirclePlus, Heart } from "lucide-react";
import { Input } from "./ui/input";

import { createClient } from "@supabase/supabase-js";
import {
  NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_SUPABASE_URL,
} from "@/lib/supabase.config";
import Image from "next/image";
import {
  createFeedPostAction,
  fetchAllFeedPostsAction,
  handleUpdateFeedPostLikes,
  updateFeedPostLikesAction,
} from "@/lib/actions/feed.action";
import { toast } from "sonner";
import { timeAgo } from "@/utils/utilityFunctions";
import { BiSolidLike } from "react-icons/bi";

const supabaseClient = createClient(
  NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY
);

function Feed() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [profileInfo, setProfileInfo] = useState<any>();
  const [isloading, setIsLoading] = useState(true);

  const [showPostDialog, setShowPostDialog] = useState(false);
  const [formData, setFormData] = useState({
    message: "",
    imageUrl: "",
  });
  const [imageData, setImageData] = useState(null);

  const [allFeedPosts, setAllFeedPosts] = useState([]);

  const [showProfileModal, setShowProfileModal] = useState(false);

  const fetchFeedData = useCallback(async () => {
    try {
      const response = fetchAllFeedPostsAction("i");
      if (response) {
        console.log("Resposne", (await response).success);

        if ((await response).success) {
          console.log("Sucess true");
          if ((await response).feedPosts) {
            console.log("feedd post data resposne", (await response).feedPosts);
            setAllFeedPosts((await response).feedPosts);
          }
          toast.success("Feed Post Fetched");
        } else {
          console.log("Sucess false");
          toast.error((await response).message);
        }
      } else {
        console.log("no response");
        toast.error("No Response from server for fetching feed");
      }
    } catch (error) {
      console.log("Error fetching feed posts", error);
    }
  }, []);

  const handleFileOnChange = (event: any) => {
    event.preventDefault();
    setImageData(event.target.files[0]);
  };

  const handleFetchImagePublicUrl = async (getData) => {
    const { data } = supabaseClient.storage
      .from("job-board-public")
      .getPublicUrl(getData.path);

    console.log("fetched image data", data);

    if (data) {
      setFormData({
        ...formData,
        imageUrl: data.publicUrl,
      });
    }
  };

  const handleUploadImageToSupabase = async () => {
    console.log("uploading");

    const { data, error } = await supabaseClient.storage
      .from("job-board-public")
      .upload(`/public/${imageData?.name}`, imageData!, {
        cacheControl: "3600",
        upsert: false,
      });
    console.log("data | error", data, error);

    if (data) {
      console.log("data | error", data, error);
      handleFetchImagePublicUrl(data);
    }
  };

  const handleCreateNewPostButton = async () => {
    console.log("formData", formData, {
      userId: profileInfo?.userId,
      userName:
        profileInfo?.candidateInfo?.name || profileInfo?.recruiterInfo?.name,
      message: formData?.message,
      userRole: profileInfo?.role,
      image: formData?.imageUrl,
      likes: [],
    });
    try {
      const newPostData = await createFeedPostAction(
        {
          userId: profileInfo?.userId,
          userName:
            profileInfo?.candidateInfo?.name ||
            profileInfo?.recruiterInfo?.name,
          message: formData?.message,
          userRole: profileInfo?.role,
          image: formData?.imageUrl,
          likes: [],
        },
        "/feed"
      );
      if (newPostData) {
        if (newPostData.success === false) {
          toast.error(newPostData?.message);
        } else {
          toast.success(newPostData?.message);
        }
      }
    } catch (error) {
      console.log("error creating new feed post", error);
      toast.error("Some Server Failure to create new Feed");
    } finally {
      setFormData({
        message: "",
        imageUrl: "",
      });
      setShowPostDialog(false);
    }
  };

  const handleUpdateFeedPostLikes = async (
    feedPostItem,
    isLikedByCurrentUser
  ) => {
    const updateFeedData = {
      postId: feedPostItem?._id,
      feedCreatorId: feedPostItem?.userId,
      reactorUserId: profileInfo?.userId,
      reactorUserName:
        profileInfo?.role === "candidate"
          ? profileInfo?.candidateInfo?.name
          : profileInfo?.recruiterInfo?.name,
    };

    try {
      const response = await updateFeedPostLikesAction(updateFeedData);
      if (response) {
        console.log("response", response);
        if (response?.success === true) {
          toast.success(response?.message);

          setAllFeedPosts((prevPosts: any) =>
            prevPosts.map((post: any) =>
              post._id === feedPostItem._id
                ? {
                    ...post,
                    likes: isLikedByCurrentUser
                      ? post.likes.filter(
                          (like) => like.reactorUserId !== profileInfo?.userId
                        ) // If already liked, remove the like
                      : [
                          ...post.likes,
                          { reactorUserId: profileInfo?.userId }, // If not liked, add the like
                        ],
                  }
                : post
            )
          );
        } else {
          toast.error(response?.message);
        }
      } else {
        toast.warning("No Response From Server");
      }
    } catch (error) {
      console.log("Error Like/Dislike Feed", error);
      toast.error("Error Like/Dislike Feed! See Console For more information");
    }
  };

  const handlePreviewResume = async () => {
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
    if (imageData) handleUploadImageToSupabase();
  }, [imageData]);

  useEffect(() => {
    if (profileInfo) {
      fetchFeedData();
    }
  }, [profileInfo]);

  if (isloading || !isLoaded) {
    return (
      <div>
        <Loading />
      </div>
    ); // Show loading state while fetching profile info
  }

  if (isLoaded && !profileInfo) {
    router.push("/");
    return null; // Prevent rendering while redirecting
  }

  return (
    <>
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between border-b pb-6 pt-24">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-950 dark:text-white">
            Explore Feed
          </h1>
          <div className="flex items-center">
            <Button
              onClick={() => setShowPostDialog(true)}
              className="sm:hidden flex h-9 items-center justify-center px-2 text-xs bg-blue-600 hover:bg-blue-700 dark:text-white"
            >
              Add New Post
            </Button>
            <Button
              onClick={() => setShowPostDialog(true)}
              className="hidden sm:flex sm:h-11 items-center justify-center sm:px-5  sm:text-sm bg-blue-600 hover:bg-blue-700 dark:text-white"
            >
              Add New Post
            </Button>
          </div>
        </div>

        <div className="py-12">
          <div className="container m-auto p-0 flex flex-col gap-20 text-gray-700">
            {allFeedPosts && allFeedPosts.length > 0 ? (
              allFeedPosts.map((feedPostItem) => {
                const isLikedByCurrentUser = feedPostItem?.likes?.some(
                  (like) => like.reactorUserId === profileInfo?.userId
                );
                return (
                  <div
                    key={feedPostItem._id}
                    className="group relative -mx-4 p-6 rounded-3xl bg-gray-200 dark:bg-gray-800 hover:bg-white hover:dark:bg-gray-900 hover:shadow-2xl cursor-auto shadow-2xl shadow-transparent gap-12 flex flex-col sm:flex-row items-center sm:items-start "
                  >
                    <div className="sm:w-2/6 rounded-3xl overflow-hidden transition-all duration-500 group-hover:rounded-xl">
                      <Image
                        width={1000}
                        height={1000}
                        src={feedPostItem?.image}
                        alt="Post"
                        className="h-60 sm:h-80 w-full object-cover object-top transition duration-500 group-hover:scale-105"
                      />
                    </div>

                    <div className="sm:p-2 sm:pl-0 sm:w-4/6 flex flex-col">
                      <div className="min-h-64 flex flex-col">
                        <div className="flex justify-between items-center w-full mt-4 mb-4 ">
                          <span className="inline-block font-bold text-2xl sm:text-3xl text-gray-900 dark:text-white sm:mt-0">
                            {feedPostItem?.userName}
                          </span>
                          {profileInfo?.role === "recruiter" &&
                            feedPostItem?.userRole === "candidate" && (
                              <span
                                className="px-4 py-1 text-sm cursor-pointer border border-black rounded-3xl bg-white font-semibold text-black dark:bg-blue-500 dark:text-white dark:border-white dark:hover:bg-white dark:hover:text-black hover:bg-black  hover:text-white duration-500"
                                onClick={() => setShowProfileModal(true)}
                              >
                                View Profile
                              </span>
                            )}
                        </div>

                        <h3 className="mb-6 sm:mb-12 text-sm sm:text-lg font-medium text-gray-750 text-justify dark:text-gray-300 max-h-[50vh] overflow-auto drawer pr-4">
                          {feedPostItem?.message}
                        </h3>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex gap-5 items-center">
                          <BiSolidLike
                            onClick={() =>
                              handleUpdateFeedPostLikes(
                                feedPostItem,
                                isLikedByCurrentUser
                              )
                            }
                            className={`${
                              isLikedByCurrentUser
                                ? "text-red-700 dark:text-blue-700"
                                : "dark:text-white"
                            } size-6 cursor-pointer`}
                          />
                          <span className="font-semibold text-xl dark:text-gray-300">
                            {feedPostItem?.likes?.length}
                          </span>
                        </div>

                        <p className="text-[12px] dark:text-gray-400  font-semibold">
                          Posted : {timeAgo(feedPostItem?.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <h1>No posts found!</h1>
            )}
          </div>
        </div>
      </div>

      {/* create post dialog */}
      <Dialog
        open={showPostDialog}
        onOpenChange={() => {
          setShowPostDialog(!showPostDialog);
          setFormData({
            message: "",
            imageUrl: "",
          });
        }}
      >
        <DialogContent className="w-[90vw] sm:w-[85vw] md:w-[75vw]">
          <Textarea
            name="message"
            value={formData?.message}
            onChange={(e) => {
              setFormData({
                ...formData,
                message: e.target.value,
              });
            }}
            placeholder="Write your post message here!"
            className="border-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0 h-[200px] text-[20px] md:text-[25px]"
          />
          {formData?.imageUrl !== "" && (
            <Image
              src={formData?.imageUrl && formData?.imageUrl}
              alt="image"
              width={100}
              height={100}
              className={`${!formData?.imageUrl && "hidden"}`}
            />
          )}

          <div className="flex gap-5 items-center justify-between">
            <Label for="imageUrl">
              <CirclePlus />
              <Input
                id="imageUrl"
                type="file"
                className="hidden"
                onChange={handleFileOnChange}
              />
            </Label>
            <Button
              onClick={handleCreateNewPostButton}
              className="w-40 flex items-center justify-center px-5 bg-blue-600 hover:bg-blue-700"
            >
              Post
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* view profile dialog*/}
      <Dialog
        open={showProfileModal}
        onOpenChange={() => {
          setShowProfileModal(false);
        }}
      >
        <DialogContent className="w-[80vw] p-1 sm:p-4 my-2 sm:my-4 bg-white flex flex-col gap-[1px] text-[10px] sm:text-sm font-medium overflow-y-clip">
          <section className="mx-auto ">
            <Button
              onClick={handlePreviewResume}
              className="bg-zinc-700 hover:bg-zinc-950"
            >
              Click to View Resume
            </Button>
          </section>
          <section className="grid grid-cols-4 py-1 px-2 sm:px-4 bg-gray-200 ">
            <h1 className="col-span-2">Name</h1>
            <p className="col-span-2 flex flex-wrap">
              {profileInfo?.candidateInfo?.name}
            </p>
          </section>
          <section className="grid grid-cols-4 py-1 px-2 sm:px-4 bg-gray-200 ">
            <h1 className="col-span-2">Email</h1>
            <p className="col-span-2 flex flex-wrap ">{profileInfo?.email}</p>
          </section>
          <section className="grid grid-cols-4 py-1 px-2 sm:px-4 bg-gray-200 ">
            <h1 className="col-span-2">Skills</h1>
            <p className="col-span-2 flex flex-wrap">
              {profileInfo?.candidateInfo?.skills}
            </p>
          </section>
          <section className="grid grid-cols-4 py-1 px-2 sm:px-4 bg-gray-200 ">
            <h1 className="col-span-2">Current Job Location</h1>
            <p className="col-span-2 flex flex-wrap">
              {profileInfo?.candidateInfo?.currentJobLocation}
            </p>
          </section>
          <section className="grid grid-cols-4 py-1 px-2 sm:px-4 bg-gray-200 ">
            <h1 className="col-span-2">Preferred Job Location</h1>
            <p className="col-span-2 flex flex-wrap">
              {profileInfo?.candidateInfo?.preferredJobLocation}
            </p>
          </section>
          <section className="grid grid-cols-4 py-1 px-2 sm:px-4 bg-gray-200 ">
            <h1 className="col-span-2">Current Salary</h1>
            <p className="col-span-2 flex flex-wrap">
              {profileInfo?.candidateInfo?.currentSalary}
            </p>
          </section>

          <section className="grid grid-cols-4 py-1 px-2 sm:px-4 bg-gray-200 ">
            <h1 className="col-span-2">Current Company</h1>
            <p className="col-span-2 flex flex-wrap">
              {profileInfo?.candidateInfo?.currentCompany}
            </p>
          </section>
          <section className="grid grid-cols-4 py-1 px-2 sm:px-4 bg-gray-200 ">
            <h1 className="col-span-2">Notice Period</h1>
            <p className="col-span-2 flex flex-wrap">
              {profileInfo?.candidateInfo?.noticePeriod}
            </p>
          </section>
          <section className="grid grid-cols-4 py-1 px-2 sm:px-4 bg-gray-200 ">
            <h1 className="col-span-2">Previous Companies</h1>
            <p className="col-span-2 flex flex-wrap">
              {profileInfo?.candidateInfo?.previousCompanies}
            </p>
          </section>
          <section className="grid grid-cols-4 py-1 px-2 sm:px-4 bg-gray-200 ">
            <h1 className="col-span-2">Total Experience</h1>
            <p className="col-span-2 flex flex-wrap">
              {profileInfo?.candidateInfo?.totalExperience}
            </p>
          </section>
          <section className="grid grid-cols-4 py-1 px-2 sm:px-4 bg-gray-200 ">
            <h1 className="col-span-2">College</h1>
            <p className="col-span-2 flex flex-wrap">
              {profileInfo?.candidateInfo?.college}
            </p>
          </section>
          <section className="grid grid-cols-4 py-1 px-2 sm:px-4 bg-gray-200 ">
            <h1 className="col-span-2">College Location</h1>
            <p className="col-span-2 flex flex-wrap">
              {profileInfo?.candidateInfo?.collegeLocation}
            </p>
          </section>
          <section className="grid grid-cols-4 py-1 px-2 sm:px-4 bg-gray-200 ">
            <h1 className="col-span-2">Graduated Year</h1>
            <p className="col-span-2 flex flex-wrap">
              {profileInfo?.candidateInfo?.graduatedYear}
            </p>
          </section>
          <section className="grid grid-cols-4 py-1 px-2 sm:px-4 bg-gray-200 ">
            <h1 className="col-span-2">Github Profile</h1>
            <p className="col-span-2 flex flex-wrap">
              {profileInfo?.candidateInfo?.githubProfile}
            </p>
          </section>
          <section className="grid grid-cols-4 py-1 px-2 sm:px-4 bg-gray-200 ">
            <h1 className="col-span-2">LinkedIn Profile</h1>
            <p className="col-span-2 flex flex-wrap">
              {profileInfo?.candidateInfo?.linkedInProfile}
            </p>
          </section>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default Feed;

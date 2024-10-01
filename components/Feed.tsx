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
import { ScrollArea } from "./ui/scroll-area";

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
  const [requestedUserProfile, setRequestedUserProfile] = useState();

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

  const fetchRequestedProfileInfo = async (userId: string) => {
    const result = await fetchProfileAction(userId);
    if (result) {
      setRequestedUserProfile(result);
      setShowProfileModal(true);
    } else {
      toast.error("Can't Get Profile Data");
      setShowPostDialog(false);
    }
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
                        <div className="w-full my-4 flex sm:flex-row flex-col items-baseline justify-between ">
                          <span className="inline-block font-bold text-2xl sm:text-3xl text-gray-900 dark:text-white sm:mt-0">
                            {feedPostItem?.userName}
                          </span>
                          {profileInfo?.role === "recruiter" &&
                            feedPostItem?.userRole === "candidate" && (
                              <span
                                className=" text-blue-700 font-bold underline cursor-pointer mt-1 sm:mt-0 hover:text-blue-800"
                                onClick={() =>
                                  fetchRequestedProfileInfo(
                                    feedPostItem?.userId
                                  )
                                }
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
        <DialogContent className="w-[90vw] sm:w-[85vw] md:w-[75vw] p-0 px-2 py-4 pb-8 my-4">
          <div className="my-6 sm:mx-2 flex flex-col justify-between items-center gap-y-4 max-h-[90vh] overflow-auto drawer">
            <h1 className="dark:text-white font-bold text-xl sm:text-2xl">Upload Feed Post</h1>
            
            <section className="w-full flex flex-col gap-y-3">
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
                className="border-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0 h-[200px] sm:h-[250px] text-[15px] md:text-[25px] dark:text-white drawer bg-gray-300 dark:bg-gray-800 drawer overflow-y-scroll drawer"
              />

              {/* image */}
              <section className="w-full min-h-max max-h-36 flex items-center flex-col gap-y-4 relative">
                <Label for="imageUrl">
                  <h1 className={`dark:text-white font-bold py-2 px-4 border rounded-lg border-black dark:border-white`}>
                    {formData?.imageUrl ? "Upload Different Image" :  "Upload Image"}
                  </h1>
                  <Input
                    id="imageUrl"
                    type="file"
                    className="hidden"
                    onChange={handleFileOnChange}
                  />
                </Label>
                <Image
                  src={formData?.imageUrl && formData?.imageUrl}
                  alt="image"
                  width={70}
                  height={70}
                  className={`${
                    !formData?.imageUrl && "hidden"
                  }`}
                />
              </section>
            </section>

            <div className="mt-2 sm:mt-4 w-full flex items-center justify-center">
              <Button
                onClick={handleCreateNewPostButton}
                className="w-full sm:w-1/2 flex items-center justify-center px-5 bg-blue-600 hover:bg-blue-700 text-white"
              >
                Post
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* view profile dialog*/}
      <Dialog
        open={showProfileModal}
        onOpenChange={() => {
          setShowProfileModal(null);
        }}
      >
        <DialogContent className="sm:w-[90vw] mx-auto h-[95vh] p-0">
          <div
            className="flex flex-col gap-[1px] text-[13px] sm:text-[17px] overflow-scroll max-h-[90%] 
          sm:m-0 bg-white dark:bg-gray-800 font-medium overflow-x-auto candidate-details-dialog-scrollbar"
          >
            <section className="mx-auto my-2">
              <Button
                onClick={handlePreviewResume}
                className="bg-green-600 hover:bg-green-700 text-white py-1 px-2 sm:px-6 h-6 sm:h-9 my-1 mb-2"
              >
                Click to View Resume
              </Button>
            </section>
            <section className="grid grid-cols-4 py-1 px-2 sm:px-4 bg-gray-200 dark:bg-gray-950 dark:text-gray-100 ">
              <h1 className="col-span-2">Name</h1>
              <p className="col-span-2 flex flex-wrap text-[11px] sm:text-[16px]">
                {requestedUserProfile?.candidateInfo?.name}
              </p>
            </section>
            <section className="grid grid-cols-4 py-1 px-2 sm:px-4 bg-gray-200 dark:bg-gray-950 dark:text-gray-100 ">
              <h1 className="col-span-2">Email</h1>
              <p className="col-span-2 flex flex-wrap text-[11px] sm:text-[16px] ">
                {requestedUserProfile?.email}
              </p>
            </section>
            <section className="grid grid-cols-4 py-1 px-2 sm:px-4 bg-gray-200 dark:bg-gray-950 dark:text-gray-100 ">
              <h1 className="col-span-2">Skills</h1>
              <p className="col-span-2 flex flex-wrap text-[11px] sm:text-[16px]">
                {requestedUserProfile?.candidateInfo?.skills}
              </p>
            </section>
            <section className="grid grid-cols-4 py-1 px-2 sm:px-4 bg-gray-200 dark:bg-gray-950 dark:text-gray-100 ">
              <h1 className="col-span-2">Current Job Location</h1>
              <p className="col-span-2 flex flex-wrap text-[11px] sm:text-[16px]">
                {requestedUserProfile?.candidateInfo?.currentJobLocation}
              </p>
            </section>
            <section className="grid grid-cols-4 py-1 px-2 sm:px-4 bg-gray-200 dark:bg-gray-950 dark:text-gray-100 ">
              <h1 className="col-span-2">Preferred Job Location</h1>
              <p className="col-span-2 flex flex-wrap text-[11px] sm:text-[16px]">
                {requestedUserProfile?.candidateInfo?.preferredJobLocation}
              </p>
            </section>
            <section className="grid grid-cols-4 py-1 px-2 sm:px-4 bg-gray-200 dark:bg-gray-950 dark:text-gray-100 ">
              <h1 className="col-span-2">Current Salary</h1>
              <p className="col-span-2 flex flex-wrap text-[11px] sm:text-[16px]">
                {requestedUserProfile?.candidateInfo?.currentSalary}
              </p>
            </section>

            <section className="grid grid-cols-4 py-1 px-2 sm:px-4 bg-gray-200 dark:bg-gray-950 dark:text-gray-100 ">
              <h1 className="col-span-2">Current Company</h1>
              <p className="col-span-2 flex flex-wrap text-[11px] sm:text-[16px]">
                {requestedUserProfile?.candidateInfo?.currentCompany}
              </p>
            </section>
            <section className="grid grid-cols-4 py-1 px-2 sm:px-4 bg-gray-200 dark:bg-gray-950 dark:text-gray-100 ">
              <h1 className="col-span-2">Notice Period</h1>
              <p className="col-span-2 flex flex-wrap text-[11px] sm:text-[16px]">
                {requestedUserProfile?.candidateInfo?.noticePeriod}
              </p>
            </section>
            <section className="grid grid-cols-4 py-1 px-2 sm:px-4 bg-gray-200 dark:bg-gray-950 dark:text-gray-100 ">
              <h1 className="col-span-2">Previous Companies</h1>
              <p className="col-span-2 flex flex-wrap text-[11px] sm:text-[16px]">
                {requestedUserProfile?.candidateInfo?.previousCompanies}
              </p>
            </section>
            <section className="grid grid-cols-4 py-1 px-2 sm:px-4 bg-gray-200 dark:bg-gray-950 dark:text-gray-100 ">
              <h1 className="col-span-2">Total Experience</h1>
              <p className="col-span-2 flex flex-wrap text-[11px] sm:text-[16px]">
                {requestedUserProfile?.candidateInfo?.totalExperience}
              </p>
            </section>
            <section className="grid grid-cols-4 py-1 px-2 sm:px-4 bg-gray-200 dark:bg-gray-950 dark:text-gray-100 ">
              <h1 className="col-span-2">College</h1>
              <p className="col-span-2 flex flex-wrap text-[11px] sm:text-[16px]">
                {requestedUserProfile?.candidateInfo?.college}
              </p>
            </section>
            <section className="grid grid-cols-4 py-1 px-2 sm:px-4 bg-gray-200 dark:bg-gray-950 dark:text-gray-100 ">
              <h1 className="col-span-2">College Location</h1>
              <p className="col-span-2 flex flex-wrap text-[11px] sm:text-[16px]">
                {requestedUserProfile?.candidateInfo?.collegeLocation}
              </p>
            </section>
            <section className="grid grid-cols-4 py-1 px-2 sm:px-4 bg-gray-200 dark:bg-gray-950 dark:text-gray-100 ">
              <h1 className="col-span-2">Graduated Year</h1>
              <p className="col-span-2 flex flex-wrap text-[11px] sm:text-[16px]">
                {requestedUserProfile?.candidateInfo?.graduatedYear}
              </p>
            </section>
            <section className="grid grid-cols-4 py-1 px-2 sm:px-4 bg-gray-200 dark:bg-gray-950 dark:text-gray-100 ">
              <h1 className="col-span-2">Github Profile</h1>
              <p className="col-span-2 flex flex-wrap text-[11px] sm:text-[16px]">
                {requestedUserProfile?.candidateInfo?.githubProfile}
              </p>
            </section>
            <section className="grid grid-cols-4 py-1 px-2 sm:px-4 bg-gray-200 dark:bg-gray-950 dark:text-gray-100 ">
              <h1 className="col-span-2">LinkedIn Profile</h1>
              <p className="col-span-2 flex flex-wrap text-[11px] sm:text-[16px]">
                {requestedUserProfile?.candidateInfo?.linkedInProfile}
              </p>
            </section>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default Feed;

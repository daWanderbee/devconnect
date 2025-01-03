"use client";
import React, { useEffect, useState, useRef } from "react";
import { getSession } from "next-auth/react";
import axios from "axios";
import Labels from "@/src/components/profile/Labels";
import MyPosts from "@/src/components/profile/MyPosts";
import { DirectionAwareHoverDemo } from "@/src/components/profile/Profilepic";
import ProfileUpdateForm from "@/src/components/ui/updateProfile";
import PasswordUpdateForm from "@/src/components/ui/updatePasswordForm";
import Followers from "@/src/components/profile/Followers";
import Following from "@/src/components/profile/Following";
import FollowersFollowing from "@/src/components/profile/FollowersFollowing";

const Page = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [followers, setFollowers] = useState();
  const [following, setFollowing] = useState();
  const [image, setImage] = useState();
  const [coverImg, setCoverImg] = useState();
  const [opacity, setOpacity] = useState(1); // State to track opacity
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false); // State for showing profile update form
  const scrollContainerRef = useRef(null); // Ref for the scrollable container
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [followersOpen, setFollowersOpen] = useState(false);
  const [followingOpen, setFollowingOpen] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      const session = await getSession();

      if (session?.user?._id) {
        const apiUrl = `/api/profile?id=${session.user._id}`;

        try {
          const response = await axios.get(apiUrl);

          if (response.data) {
            setFullName(response.data.user.fullName);
            setBio(response.data.user.bio);
            setFollowers(response.data.user.followers);
            setFollowing(response.data.user.following);
            setImage(response.data.user.profileImg);
            setCoverImg(response.data.user.coverImg);
            setLoading(false);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    // Add event listener to track scroll on the container
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        const scrollPosition = scrollContainerRef.current.scrollTop;
        const newOpacity = Math.max(1 - scrollPosition / 200, 0);
        setOpacity(newOpacity);
      }
    };

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  const setOnFollwersorFollowingButton = (followersOrFollowing) => {
    if(followersOrFollowing === "followers"){
      setFollowersOpen(!followersOpen);
    }
    else{
      setFollowingOpen(!followingOpen);
    }
  };
  const closeFollowUnfollow = (x) => {
    if(x === "followers"){
      setFollowersOpen(false);
    }else
    {
      setFollowingOpen(false);
    }
  };
  // Handle showing the profile update form
  const handleOpenProfileUpdate = () => {
    setIsUpdatingProfile(true); // Show the form
  };

  // Handle closing the profile update form
  const handleCloseProfileUpdate = () => {
    setIsUpdatingProfile(false); // Hide the form
  };

  const handleOpenPasswordUpdate = () => {
    setIsUpdatingPassword(true); // Show the form
  }
  const handleClosePasswordUpdate = () => {
    setIsUpdatingPassword(false); // Hide the form
  }

  return (
    <div ref={scrollContainerRef} className="w-full h-screen overflow-y-scroll">
      <div className="bg-slate-400 w-full h-64 ">
        {coverImg && (
          <img
            src={coverImg}
            alt="User's cover"
            className="mt-4 rounded-lg w-full object-cover max-h-96"
          />
        )}
      </div>
      <div
        className="mx-auto top-0 fixed right-5 transition-opacity duration-50 ease-in-out"
        style={{ opacity }} // Bind opacity to the calculated value
      >
        <DirectionAwareHoverDemo img={image} fullname={fullName} />
      </div>
      <div >
        <div className="w-10 pt-32 m-10 text-3xl font-bold text-yellow-50 mt-5 mb-4">
          {fullName}
        </div>
        <div className="m-10  w-40 ext-l font-bold text-yellow-50 mt-5">
          {bio}
        </div>
      </div>
      <div className="flex justify-items-center w-full p-5 m-0 gap-2">
        {/* Button to open Profile Update form */}
        <button
          onClick={handleOpenProfileUpdate}
          className="px-6 mx-2 py-2 rounded-lg bg-stone-900 hover:bg-stone-500 text-white"
        >
          Update Profile
        </button>


        {/* Profile Update Form Modal */}
        {isUpdatingProfile && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="rounded-lg shadow-lg p-6 w-11/12 md:w-3/5 lg:w-2/5">
              {/* Close Button */}
              <button
                onClick={handleCloseProfileUpdate}
                className="absolute top-4 right-4 text-black hover:text-red-600 font-bold text-2xl"
                aria-label="Close Update Profile"
              >
                &times;
              </button>

              {/* Render ProfileUpdateForm */}
              <ProfileUpdateForm handleCloseProfile={handleCloseProfileUpdate} />
            </div>
          </div>
        )}

        {/* Button to open Profile Update form */}
        <button
          onClick={handleOpenPasswordUpdate}
          className="px-6 mx-0 py-2 rounded-lg bg-stone-900 hover:bg-stone-500 text-white"
        >
          Update Password
        </button>


      </div>
      <div className="flex justify-center w-full gap-10">
        <button onClick={()=>setOnFollwersorFollowingButton("followers")} className="px-6 py-2  rounded-lg  hover:bg-stone-500 text-white"><Followers followers={followers} /></button>
        <button onClick={()=>setOnFollwersorFollowingButton("following")} className="px-6 py-2  rounded-lg  hover:bg-stone-500 text-white"><Following following={following}/></button>
      </div>

      {/* Followers/Following Modal */}
      {followersOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="rounded-lg shadow-lg p-6 w-11/12 md:w-3/5 lg:w-2/5">
            {/* Close Button */}
           
            {/* Render Followers */}
            <FollowersFollowing FollowersorFollowingClicked={"Followers"} FollowersFollowinglist={followers} closeAll={()=>closeFollowUnfollow('followers')} FollowingList={following}  />
          </div>
        </div>
      )}

      {followingOpen && (
        <div className=" fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="rounded-lg shadow-lg p-6 w-11/12 md:w-3/5 lg:w-2/5">
            {/* Render Following */}
            <FollowersFollowing FollowersorFollowingClicked={"Following"} FollowersFollowinglist={following} closeAll={()=>closeFollowUnfollow('following')}  />
          </div>
        </div>
      )}

      {/* Following Modal */}
      {/* Profile Update Form Modal */}
      {isUpdatingPassword && (
        <div className="fixed inset-0 m-0 flex items-center justify-center bg-black bg-opacity-50 ">
          <div className="rounded-lg shadow-lg p-6 w-11/12 md:w-3/5 lg:w-2/5">
            {/* Close Button */}
            <button
              onClick={handleClosePasswordUpdate}
              className="absolute top-4 right-2 text-black hover:text-red-600 font-bold text-2xl"
              aria-label="Close Update Profile"
            >
              &times;
            </button>
            {/* Render ProfileUpdateForm */}
            <PasswordUpdateForm
              handleCloseProfile={handleClosePasswordUpdate}
              currentProfile={{
                profileImg: image,
                coverImg: coverImg,
              }}
            />
          </div>
        </div>
      )}

      
      <Labels />
      <div>
        <MyPosts />
        My posts
      </div>
    </div>
  );
};

export default Page;

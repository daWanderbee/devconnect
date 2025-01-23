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

const Modal = ({ children, onClose }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-stone-900/50 backdrop-blur-sm z-50">
    <div className=" rounded-xl  p-6 w-11/12 md:w-3/5 lg:w-2/5 relative transform transition-all duration-300 ease-out">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-stone-500 hover:text-red-600 transition-colors duration-200 
          w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-50"
        aria-label="Close modal"
      >
        ×
      </button>
      {children}
    </div>
  </div>
);

const ActionButton = ({ onClick, children }) => (
  <button
    onClick={onClick}
    className="px-6 py-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-100 transition-colors 
      duration-200 ease-in-out shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
  >
    {children}
  </button>
);

const Page = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [followers, setFollowers] = useState();
  const [following, setFollowing] = useState();
  const [image, setImage] = useState();
  const [coverImg, setCoverImg] = useState();
  const [isVisible, setIsVisible] = useState(true);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [followersOpen, setFollowersOpen] = useState(false);
  const [followingOpen, setFollowingOpen] = useState(false);
  const scrollContainerRef = useRef(null);
  const lastScrollPosition = useRef(0);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      const session = await getSession();

      if (session?.user?._id) {
        try {
          const response = await axios.get(`/api/profile?id=${session.user._id}`);
          if (response.data) {
            const { fullName, bio, followers, following, profileImg, coverImg } = response.data.user;
            setFullName(fullName);
            setBio(bio);
            setFollowers(followers);
            setFollowing(following);
            setImage(profileImg);
            setCoverImg(coverImg);
            setLoading(false);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setLoading(false);
        }
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        const currentScrollPosition = scrollContainerRef.current.scrollTop;
        
        // Only show the profile picture when at the top of the page
        setIsVisible(currentScrollPosition < 100);
        
        lastScrollPosition.current = currentScrollPosition;
      }
    };

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
      return () => scrollContainer.removeEventListener("scroll", handleScroll);
    }
  }, []);

  const handleFollowersFollowing = (type) => {
    if (type === "followers") {
      setFollowersOpen(!followersOpen);
    } else {
      setFollowingOpen(!followingOpen);
    }
  };

  const closeFollowUnfollow = (type) => {
    if (type === "followers") {
      setFollowersOpen(false);
    } else {
      setFollowingOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-stone-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-stone-300"></div>
      </div>
    );
  }

  return (
    <div ref={scrollContainerRef} className="w-full h-screen overflow-y-scroll bg-gradient-to-b from-stone-900 via-stone-800 to-stone-900">
      {/* Cover Image Section */}
      <div className="relative w-full h-96">
        {coverImg ? (
          <img
            src={coverImg}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-stone-800 to-stone-700" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-stone-900/50 to-stone-900"></div>
        
        {/* Profile Picture - Moved up and added transition */}
        <div
          className={`absolute right-8 -bottom-20 top-10 transition-all duration-300 ease-in-out transform ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <DirectionAwareHoverDemo img={image} fullname={fullName} />
        </div>
      </div>

      {/* Profile Section */}
      <div className="relative px-6 -mt-32">
        {/* User Info */}
        <div className="mt-40 space-y-4">
          <h1 className="text-5xl font-bold text-stone-100 tracking-tight">
            {fullName}
          </h1>
          <p className="text-lg text-stone-300 max-w-2xl font-light">
            {bio}
          </p>
        </div>

        {/* Rest of the component remains the same */}
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mt-8">
          <ActionButton onClick={() => setIsUpdatingProfile(true)}>
            Update Profile
          </ActionButton>
          <ActionButton onClick={() => setIsUpdatingPassword(true)}>
            Update Password
          </ActionButton>
        </div>

        {/* Followers/Following Section */}
        <div className="flex justify-start gap-8 mt-8 mb-12">
          <button
            onClick={() => handleFollowersFollowing("followers")}
            className="group flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-stone-700 
              transition-colors duration-200 text-stone-100"
          >
            <Followers followers={followers} />
          </button>
          <button
            onClick={() => handleFollowersFollowing("following")}
            className="group flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-stone-700 
              transition-colors duration-200 text-stone-100"
          >
            <Following following={following} />
          </button>
        </div>

        {/* Labels and Posts */}
        <div className="space-y-8 mb-20">
          <div className="bg-stone-800/50 rounded-xl p-6 backdrop-blur-sm">
            <Labels />
          </div>
          <div className="bg-stone-800/50 rounded-xl p-6 backdrop-blur-sm">
            <h2 className="text-2xl font-semibold text-stone-100 mb-6">My Posts</h2>
            <MyPosts />
          </div>
        </div>
      </div>

      {/* Modals */}
      {isUpdatingProfile && (
        <Modal onClose={() => setIsUpdatingProfile(false)}>
          <ProfileUpdateForm handleCloseProfile={() => setIsUpdatingProfile(false)} />
        </Modal>
      )}

      {isUpdatingPassword && (
        <Modal onClose={() => setIsUpdatingPassword(false)}>
          <PasswordUpdateForm
            handleCloseProfile={() => setIsUpdatingPassword(false)}
            currentProfile={{ profileImg: image, coverImg }}
          />
        </Modal>
      )}

      {followersOpen && (
        <Modal onClose={() => closeFollowUnfollow("followers")}>
          <FollowersFollowing
            FollowersorFollowingClicked="Followers"
            FollowersFollowinglist={followers}
            closeAll={() => closeFollowUnfollow("followers")}
            FollowingList={following}
          />
        </Modal>
      )}

      {followingOpen && (
        <Modal onClose={() => closeFollowUnfollow("following")}>
          <FollowersFollowing
            FollowersorFollowingClicked="Following"
            FollowersFollowinglist={following}
            closeAll={() => closeFollowUnfollow("following")}
          />
        </Modal>
      )}
    </div>
  );
};

export default Page;
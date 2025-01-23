"use client";

import React, { useEffect, useState, useRef } from "react";
import PropTypes from 'prop-types';
import Labels from "@/src/components/profile/Labels";
import { DirectionAwareHoverDemo } from "@/src/components/profile/Profilepic";
import UserLabels from "@/src/components/profile/UserLabels";

const Modal = ({ children, onClose }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-stone-900/50 backdrop-blur-sm z-50">
    <div className="rounded-xl bg-stone-800 p-6 w-11/12 md:w-3/5 lg:w-2/5 relative">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-stone-500 hover:text-red-600 transition-colors duration-200 
          w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-50"
      >
        ×
      </button>
      {children}
    </div>
  </div>
);

const FollowerCard = ({ user }) => (
  <div className="flex items-center space-x-4 p-4 hover:bg-stone-700/50 rounded-lg transition-colors duration-200">
    <img
      src={user.profileImg || "/default-avatar.png"}
      alt={user.fullName}
      className="w-12 h-12 rounded-full object-cover"
    />
    <div>
      <h3 className="text-stone-100 font-medium">{user.fullName}</h3>
      <p className="text-stone-400 text-sm">{user.bio}</p>
    </div>
  </div>
);

const ViewProfile = ({ profileData, closeProfile }) => {
  const [opacity, setOpacity] = useState(1);
  const [followersOpen, setFollowersOpen] = useState(false);
  const [followingOpen, setFollowingOpen] = useState(false);
  const scrollContainerRef = useRef(null);

  const { fullName, bio, profileImg: image, coverImg, followers = [], following = [] } = profileData;

  useEffect(() => {
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

  return (
    <div ref={scrollContainerRef} className="w-full bg-gradient-to-b from-stone-900 via-stone-800 to-stone-900 h-screen overflow-y-scroll">
      {/* Cover Image Section */}
      <div className="relative w-full h-64">
        {coverImg ? (
          <img
            src={coverImg}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-stone-800 to-stone-700" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-stone-900/50 to-stone-900" />
      </div>

      {/* Profile Picture */}
      <div
        className="fixed right-8 top-10 transition-all duration-300 ease-in-out transform"
        style={{ opacity }}
      >
        <DirectionAwareHoverDemo img={image} fullname={fullName} />
      </div>

      {/* Profile Content */}
      <div className="px-8 -mt-32 relative">
        {/* User Info */}
        <div className="mt-40 space-y-4">
          <h1 className="text-5xl font-bold text-stone-100 tracking-tight">
            {fullName}
          </h1>
          <p className="text-lg text-stone-300 max-w-2xl font-light">
            {bio}
          </p>
        </div>

        {/* Followers/Following Section */}
        <div className="flex gap-8 mt-8 mb-12">
          <button
            onClick={() => setFollowersOpen(true)}
            className="group flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-stone-700 
              transition-colors duration-200 text-stone-100"
          >
            <span className="font-semibold">{followers.length}</span>
            <span className="text-stone-400 group-hover:text-stone-100">Followers</span>
          </button>
          <button
            onClick={() => setFollowingOpen(true)}
            className="group flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-stone-700 
              transition-colors duration-200 text-stone-100"
          >
            <span className="font-semibold">{following.length}</span>
            <span className="text-stone-400 group-hover:text-stone-100">Following</span>
          </button>
        </div>

        {/* Labels Section */}
        <div className="space-y-8 mb-20 w-1/2">
          <div className="bg-stone-800/50 rounded-xl p-6 backdrop-blur-sm">
            <UserLabels id={profileData._id} />
          </div>
        </div>

        {/* Close Button */}
        <button 
          onClick={closeProfile}
          className="fixed bottom-8 right-8 px-6 py-2 rounded-lg bg-stone-900 hover:bg-stone-700 
            text-stone-100 transition-colors duration-200 shadow-lg hover:shadow-xl"
        >
          Close
        </button>
      </div>

      {/* Modals */}
      {followersOpen && (
        <Modal onClose={() => setFollowersOpen(false)}>
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-stone-100 mb-6">Followers</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {followers.map((follower) => (
                <FollowerCard key={follower._id} user={follower} />
              ))}
            </div>
          </div>
        </Modal>
      )}

      {followingOpen && (
        <Modal onClose={() => setFollowingOpen(false)}>
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-stone-100 mb-6">Following</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {following.map((user) => (
                <FollowerCard key={user._id} user={user} />
              ))}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

ViewProfile.propTypes = {
  profileData: PropTypes.shape({
    fullName: PropTypes.string,
    bio: PropTypes.string,
    profileImg: PropTypes.string,
    coverImg: PropTypes.string,
    _id: PropTypes.string.isRequired,
    followers: PropTypes.array,
    following: PropTypes.array,
  }).isRequired,
  closeProfile: PropTypes.func.isRequired,
};

export default ViewProfile;
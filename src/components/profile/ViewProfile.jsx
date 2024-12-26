"use client";
import React, { useEffect, useState, useRef } from "react";
import PropTypes from 'prop-types';
import Labels from "@/src/components/profile/Labels";
import { DirectionAwareHoverDemo } from "@/src/components/profile/Profilepic";
import UserLabels from "@/src/components/profile/UserLabels";

const ViewProfile = ({profileData,closeProfile}) => {
  const [user, setUser] = useState(null);
  const [fullName, setFullName] = useState(profileData.fullName);
  const [bio, setBio] = useState(profileData.bio);
  const [image, setImage] = useState(profileData.profileImg);
  const [coverImg, setCoverImg] = useState(profileData.coverImg);
  const [opacity, setOpacity] = useState(1); // State to track opacity
  const scrollContainerRef = useRef(null); // Ref for the scrollable container


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
        console.log("Profile data ki id", profileData._id)
      scrollContainer.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  return (
    <div ref={scrollContainerRef} className="w-full bg-stone-800 h-screen overflow-y-scroll">
      <div className="bg-slate-400 w-full h-64">
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
      <div>
        <div className="w-auto pt-32 m-10 text-3xl font-bold text-yellow-50 mt-5 mb-4">
          {fullName}
        </div>
        <div className="m-10 w-auto text-l font-bold text-yellow-50 mt-5">
          {bio}
        </div>
      </div>

      {/* Labels Section */}
      <UserLabels id={profileData._id} />

        <div className="w-full justify-items-center justify-between flex flex-col">
      <button onClick={closeProfile} className="bg-stone-900  text-white p-2 rounded-lg m-10">Close</button>
    </div>
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
  }).isRequired,
};

export default ViewProfile;

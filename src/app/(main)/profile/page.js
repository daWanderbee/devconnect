"use client";
import React, { useEffect, useState, useRef } from "react";
import { getSession } from "next-auth/react";
import axios from "axios";
import Labels from "@/src/components/profile/Labels";
import MyPosts from "@/src/components/profile/MyPosts";
import { DirectionAwareHoverDemo } from "@/src/components/profile/Profilepic";

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
  const scrollContainerRef = useRef(null); // Ref for the scrollable container

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
            setImage(response.data.user.coverImg);
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

  return (
    <div ref={scrollContainerRef} className="w-full h-screen overflow-y-scroll">
      <div className="bg-slate-400 w-full h-64"></div>
      <div
        className="mx-auto top-0 fixed right-5 transition-opacity duration-50 ease-in-out"
        style={{ opacity }} // Bind opacity to the calculated value
      >
        <DirectionAwareHoverDemo img={image} fullname={fullName} />
      </div>
      <div>
      <div className="w-10 m-10 text-3xl font-bold text-yellow-50 mt-5 mb-4">
        {fullName}
      </div>
      <div className="m-10 w-40 ext-l font-bold text-yellow-50 mt-5">
        {bio}
      </div>
      </div>
      <Labels />
      <div>
        <MyPosts />
        My posts
      </div>
    </div>
  );
};

export default Page;

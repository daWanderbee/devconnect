import React, { useState, useEffect } from "react";
import { getSession } from "next-auth/react";
import axios from "axios";
import ThreeDotsMenu from "@/src/components/threeDotsMenu";
// ThreeDotsMenu Component


// Simple SVG icons as components
const HeartIcon = ({ filled }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className={`w-6 h-6 ${filled ? "fill-current" : "fill-none"} stroke-current`}
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
    />
  </svg>
);

const TeamIcon = ({ isMember }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className={`w-6 h-6 ${isMember ? "fill-current" : "fill-none"} stroke-current`}
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d={isMember 
        ? "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
        : "M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM20 8v6M23 11h-6"
      }
    />
  </svg>
);

const Post = ({
  author,          // Author ID
  date,            // Post creation date
  desc,            // Post description/content
  img,             // Optional post image URL
  likes = [],      // Array of likes
  team = false     // Whether user is part of team
}) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes.length);
  const [authorName, setAuthorName] = useState("Anonymous");
  const [isTeamMember, setIsTeamMember] = useState(team);
  const [authordata, setAuthordata] = useState(null);
  const [user, setUser] = useState(null);

  // Fetch user session
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const session = await getSession();
        if (session?.user) {
          setUser(session.user);
        }
      } catch (error) {
        console.error("Error fetching session:", error);
      }
    };
    fetchUser();
  }, []);

  // Fetch author's data when component mounts or author changes
  useEffect(() => {
    const fetchAuthorData = async () => {
      try {
        const response = await axios.get(`/api/profile?id=${author}`);
        const data = response.data;
        if (data?.user) {
          setAuthordata(data.user);
          setAuthorName(data.user.fullName || "Anonymous");
        }
      } catch (error) {
        console.error("Failed to fetch author data:", error);
      }
    };

    if (author) {
      fetchAuthorData();
    }
  }, [author]);

  // Format date to relative time
  const getRelativeTime = (dateString) => {
    const MINUTE = 60 * 1000;
    const HOUR = 60 * MINUTE;
    const DAY = 24 * HOUR;
    const WEEK = 7 * DAY;

    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;

    if (diff < HOUR) {
      const minutes = Math.floor(diff / MINUTE);
      return `${minutes} minutes ago`;
    }
    if (diff < DAY) {
      const hours = Math.floor(diff / HOUR);
      return `${hours} hours ago`;
    }
    if (diff < WEEK) {
      const days = Math.floor(diff / DAY);
      return `${days} days ago`;
    }

    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Handle like toggle
  const handleLike = () => {
    setLiked((prev) => !prev);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  // Handle team membership toggle
  const handleTeamToggle = () => {
    setIsTeamMember((prev) => !prev);
  };

  const handleUpdate = () => {
    console.log("Update post");
  };

  const handleDelete = () => {
    console.log("Delete post");
  };

  return (
    <div className="bg-stone-800 border border-slate-600 rounded-lg shadow-lg p-6 max-w-2xl mx-auto my-6">
      {/* Author Profile Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 overflow-hidden bg-gray-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
            {authordata?.profileImg ? (
              <img
                src={authordata.profileImg}
                alt="Author Avatar"
                className="rounded-full"
              />
            ) : (
              authorName[0]?.toUpperCase() || "?"
            )}
          </div>
          <div>
            <h2 className="text-rose-200 font-bold text-lg">{authorName}</h2>
            <p className="text-gray-400 text-sm">{getRelativeTime(date)}</p>
          </div>
        </div>
        {user?._id === author && <ThreeDotsMenu onUpdate={handleUpdate} onDelete={handleDelete} />}
      </div>

      {/* Post Content */}
      <div className="mt-4">
        <p className="text-gray-300 text-base">{desc}</p>
        {img && (
          <img
            src={img}
            alt="Post content"
            className="mt-4 rounded-lg w-full object-cover max-h-96"
          />
        )}
      </div>

      {/* Interaction Buttons */}
      <div className="mt-4 flex items-center justify-between">
        {/* Like Button */}
        <button
          onClick={handleLike}
          className={`flex items-center space-x-2 ${
            liked ? "text-red-500" : "text-gray-400"
          }`}
        >
          <HeartIcon filled={liked} />
          <span className="font-semibold">{likeCount}</span>
        </button>

        {/* Team Membership Button */}
        <button
          onClick={handleTeamToggle}
          className={`flex items-center space-x-2 ${
            isTeamMember ? "text-green-500" : "text-gray-400"
          }`}
        >
          <TeamIcon isMember={isTeamMember} />
          <span className="font-semibold">
            {isTeamMember ? "Leave Team" : "Join Team"}
          </span>
        </button>
      </div>
    </div>
  );
};

export default Post;

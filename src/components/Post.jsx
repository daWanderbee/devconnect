import React, { useState, useEffect } from "react";
import axios from "axios";

const Post = ({ author, date, desc, img, likes, team }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes.length);
  const [name, setName] = useState();
  const [description, setDescription] = useState(desc);
  const [image, setImage] = useState(null);
  const [joined, setJoined] = useState(team);

  useEffect(() => {
    // Fetch user profile data
    const fetchUserData = async () => {
      try {
        const response = await axios.get("/api/profile?id=" + author);
        if (response?.data?.user?.fullName) {
          setName(response.data.user.fullName);
        }
        if(img){
          setImage(img)
        }
        
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [author]);

  // Calculate date display
  const formatRelativeDate = (dateString) => {
    const currentDate = new Date();
    const postDate = new Date(dateString);
    const timeDifference = currentDate - postDate; // Difference in milliseconds

    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days < 1 && hours >= 1) {
      return `${hours} hours ago`;
    } else if (hours < 1) {
      return `${minutes} minutes ago`;
    } else if (days <= 7) {
      return `${days} days ago`;
    } else {
      // Older than 7 days, display full date
      const options = { day: "numeric", month: "long", year: "numeric" };
      return postDate.toLocaleDateString("en-US", options);
    }
  };

  return (
    <div className="bg-stone-800 border border-slate-600 rounded-lg shadow-lg p-6 max-w-2xl mx-auto my-6">
      {/* Header Section */}
      <div className="flex items-center space-x-4">
        <div className="h-12 w-12 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
          {name?.[0] || "A"}
        </div>
        <div>
          <h2 className="text-rose-200 font-bold text-lg">{name || "Anonymous"}</h2>
          <p className="text-gray-400 text-sm">{formatRelativeDate(date)}</p>
        </div>
      </div>

      {/* Content Section */}
      <p className="text-gray-300 mt-4 text-base">{description}</p>
      {image && (
        <img
          src={image}
          alt={description}
          className="mt-4 rounded-lg w-full object-cover max-h-96"
        />
      )}

      {/* Footer Section */}
      <div className="mt-4 flex items-center justify-between">
        <button
          onClick={() => {
            setLiked(!liked);
            setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
          }}
          className={`${
            liked ? "text-red-500" : "text-gray-400"
          } font-semibold flex items-center space-x-2`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-6 w-6 ${liked ? "fill-red-500" : "fill-none"} stroke-current`}
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5.121 19.121A8.454 8.454 0 0 1 4 14.25C4 9.615 7.589 6 12 6s8 3.615 8 8.25c0 1.905-.673 3.788-1.879 5.25l-.621.621a3.25 3.25 0 0 1-4.6 0l-.621-.621A8.454 8.454 0 0 1 12 14.25c0-1.03.202-2.014.578-2.914M12 6V4"
            />
          </svg>
          <span>{likeCount}</span>
        </button>
        <button
          onClick={() => {
            setJoined(!joined);
          }}
          className={`${
            joined ? "text-green-500" : "text-gray-400"
          } font-semibold flex items-center space-x-2`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-6 w-6 ${joined ? "fill-green-500" : "fill-none"} stroke-current`}
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 5v14M5 12h14"
            />
          </svg>
          <span>{joined ? "Leave Team" : "Join Team"}</span>
        </button>
      </div>
    </div>
  );
};

export default Post;

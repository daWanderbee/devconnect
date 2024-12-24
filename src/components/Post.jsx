import React, { useState, useEffect } from "react";
import ThreeDotsMenu from "@/src/components/ThreeDotsMenu";
import UpdatePost from "@/src/components/ui/UpdatePost";
import axios from "axios";
import toast from "react-hot-toast";
import { set } from "mongoose";

const HeartIcon = ({ filled }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className={`w-6 h-6 ${filled ? "fill-red-500" : "stroke-current"}`}
    strokeWidth="2"
    fill={filled ? "currentColor" : "none"}
  >
    <path
      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const TeamIcon = ({ isMember }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className={`w-6 h-6 ${isMember ? "fill-green-500" : "stroke-current"}`}
    strokeWidth="2"
    fill={isMember ? "currentColor" : "none"}
  >
    <path
      d={isMember 
        ? "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
        : "M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM20 8v6M23 11h-6"
      }
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Post = ({
  postId,
  author,
  date,
  desc,
  img,
  likes = [],
  team = false,
  onPostUpdate = () => {return "onPostUpdate not implemented";},
//todo add onPostUpdate
}) => {
  
  const [likeCount, setLikeCount] = useState(likes.length);
  const [authorName, setAuthorName] = useState("Anonymous");
  const [isTeamMember, setIsTeamMember] = useState(team);
  const [user, setUser] = useState(null);
  const [isUpdateVisible, setIsUpdateVisible] = useState(false);
  const [currentDesc, setCurrentDesc] = useState(desc);
  const [currentImg, setCurrentImg] = useState(img);
  const [authordata, setAuthorData] = useState(null);
  const [liked, setLiked] = useState(false);

  // Fetch user session
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/auth/session");
        const session = await response.json();
        setUser(session?.user || null);
        setLiked(likes.includes(session?.user?._id));
      } catch (error) {
        console.error("Error fetching session:", error);
      }
    };
    fetchUser();
  }, []);

  // Fetch author data
  useEffect(() => {
    const fetchAuthor = async () => {
      if (author) {
        try {
          const response = await fetch(`/api/profile?id=${author}`);
          const data = await response.json();
          setAuthorName(data?.user?.fullName || "Anonymous");
          setAuthorData(data?.user);
        } catch (error) {
          console.error("Failed to fetch author data:", error);
        }
      }
    };
    fetchAuthor();
  }, [author]);

  const handleUpdateSuccess = () => {
    setIsUpdateVisible(false);
    setCurrentDesc(desc);
    setCurrentImg(img);
    onPostUpdate(postId, desc, img);
    
  };
  const onPostDelete = async (postId) => {
    try {
      const res = await axios.delete("api/deletePost", { data: { postId } });
      console.log("Post deleted:", res.data);
      toast.success("Post deleted successfully");

      
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  }; 

  const handleLikeUnlikePost = async (postId) => {
    try {
      const res = await axios.post("api/likeUnlike", { postId });
      setLiked(!liked);
      console.log("Post liked/unliked:", res.data);
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleShowUpdate = () => setIsUpdateVisible(true);
  const handleLike = () => {
    setLiked(prev => !prev);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
    handleLikeUnlikePost(postId);
  };
  const handleTeamToggle = () => {
    setIsTeamMember(prev => !prev);
  }

  const getRelativeTime = (dateString) => {
    const diff = new Date() - new Date(dateString);
    if (diff < 60 * 60 * 1000) return `${Math.floor(diff / (60 * 1000))} minutes ago`;
    if (diff < 24 * 60 * 60 * 1000) return `${Math.floor(diff / (60 * 60 * 1000))} hours ago`;
    return new Date(dateString).toLocaleDateString("en-US", { 
      day: "numeric", 
      month: "long", 
      year: "numeric" 
    });
  };

  return (
    <div className="bg-stone-800 border border-slate-600 rounded-lg shadow-lg p-6 max-w-2xl mx-auto my-6">
      {/* Author and Menu */}
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
            <h2 className="text-rose-200 font-bold">{authorName}</h2>
            <p className="text-gray-400 text-sm">{getRelativeTime(date)}</p>
          </div>
        </div>
        {user?._id === author && (
          <ThreeDotsMenu
            onShowUpdate={handleShowUpdate}
            onDelete={() => onPostDelete(postId)}
          />
        )}
      </div>

      {/* Content */}
      <p className="text-gray-300 mt-4">{currentDesc}</p>
      {currentImg && (
        <img 
          src={currentImg} 
          alt="Post content" 
          className="mt-4 rounded-lg w-full object-cover max-h-96" 
        />
      )}

      {/* Interaction Buttons */}
      <div className="flex items-center justify-between mt-4">
        <button 
          onClick={handleLike} 
          className={`flex items-center ${liked ? "text-red-500" : "text-gray-400"}`}
        >
          <HeartIcon filled={liked} />
          <span className="ml-2">{likeCount}</span>
        </button>
        <button 
          onClick={handleTeamToggle} 
          className={`flex items-center ${isTeamMember ? "text-green-500" : "text-gray-400"}`}
        >
          <TeamIcon isMember={isTeamMember} />
          <span className="ml-2">{isTeamMember ? "Leave Team" : "Join Team"}</span>
        </button>
      </div>

      {/* Update Post Modal */}
      {isUpdateVisible && (
        <UpdatePost
          postId={postId}
          currentDesc={currentDesc}
          currentImg={currentImg}
          onUpdateSuccess={handleUpdateSuccess}
        />
      )}
    </div>
  );
};

export default Post;
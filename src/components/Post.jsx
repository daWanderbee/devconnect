import React, { useState, useEffect } from "react";
import ThreeDotsMenu from "@/src/components/ThreeDotsMenu";
import UpdatePost from "@/src/components/ui/UpdatePost";
import axios from "axios";
import toast from "react-hot-toast";

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

const ImageModal = ({ isOpen, onClose, imageSrc }) => {
  if (!isOpen) return null;

  // Prevent scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div 
      className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="relative max-w-screen-xl max-h-screen w-full h-full flex items-center justify-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-300 z-50"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <img 
          src={imageSrc} 
          alt="Post content full size" 
          className="max-w-full max-h-full object-contain"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  );
};

const Post = ({
  postId,
  teamId,
  author,
  date,
  desc,
  img,
  likes = [],
  team = false,
  onPostUpdate = () => {return "onPostUpdate not implemented";},
}) => {
  const [likeCount, setLikeCount] = useState(likes.length);
  const [authorName, setAuthorName] = useState("Anonymous");
  const [isTeamMember, setIsTeamMember] = useState(false);
  const [user, setUser] = useState(null);
  const [isUpdateVisible, setIsUpdateVisible] = useState(false);
  const [currentDesc, setCurrentDesc] = useState(desc);
  const [currentImg, setCurrentImg] = useState(img);
  const [authordata, setAuthorData] = useState(null);
  const [liked, setLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imageExists, setImageExists] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  // Check if image exists
  useEffect(() => {
    if (currentImg) {
      const img = new Image();
      img.onload = () => setImageExists(true);
      img.onerror = () => setImageExists(false);
      img.src = currentImg;
    }
  }, [currentImg]);

  //Fetch team
  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await axios.get("/api/getTeam", {
          params: { id: teamId }
        });
        console.log("Team data:", response.data.team);
        const isamember = response.data?.team?.createdBy===user?._id||response.data?.team?.members.includes(user?._id)
        setIsTeamMember(isamember);

      } catch (error) {
        console.error("Error fetching team data:", error);
      }

    };
    fetchTeam();
  }, [teamId,user]);

  // Fetch user session
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("/api/auth/session");
        setUser(response.data?.user || null);
        setLiked(likes.includes(response.data?.user?._id));
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
          const response = await axios.get(`/api/profile`, {
            params: { id: author }
          });
          setAuthorName(response.data?.user?.fullName || "Anonymous");
          setAuthorData(response.data?.user);
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
      const response = await axios.delete("/api/deletePost", { 
        data: { postId } 
      });
      console.log("Post deleted:", response.data);
      toast.success("Post deleted successfully");
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete post");
    }
  }; 

  const handleLikeUnlikePost = async (postId) => {
    try {
      const response = await axios.post("/api/likeUnlike", { postId });
      setLiked(!liked);
      console.log("Post liked/unliked:", response.data);
    } catch (error) {
      console.error("Error liking post:", error);
      toast.error("Failed to like/unlike post");
    }
  };

  const handleTeamToggle = async () => {
    if (!user) {
      toast.error("Please sign in to join/leave teams");
      return;
    }

    setIsLoading(true);
    try {
      if (isTeamMember) {
        // Leave team
        const response = await axios.delete("/api/leaveTeam", {
          data: { teamId }
        });
        
        if (response.data.success) {
          setIsTeamMember(false);
          toast.success("Successfully left the team");
        }
      } else {
        // Join team
        const response = await axios.post("/api/joinTeam", {
          teamId,
          userId: user._id
        });
        
        if (response.data.success) {
          setIsTeamMember(true);
          toast.success("Successfully joined the team");
        }
      }
    } catch (error) {
      console.error("Error toggling team membership:", error);
      toast.error(error.response?.data?.error || "Failed to update team membership");
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowUpdate = () => setIsUpdateVisible(true);
  
  const handleLike = () => {
    if (!user) {
      toast.error("Please sign in to like posts");
      return;
    }
    setLiked(prev => !prev);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
    handleLikeUnlikePost(postId);
  };

  const getRelativeTime = (dateString) => {
    // Parse the date string into a Date object
    const parsedDate = new Date(dateString);
    if (isNaN(parsedDate)) return "Invalid date";
  
    const now = new Date();
    const diff = now - parsedDate;
  
    // Less than a minute
    if (diff < 60 * 1000) return "Just now";
  
    // Less than an hour
    if (diff < 60 * 60 * 1000) return `${Math.floor(diff / (60 * 1000))} minutes ago`;
  
    // Less than a day
    if (diff < 24 * 60 * 60 * 1000) return `${Math.floor(diff / (60 * 60 * 1000))} hours ago`;
  
    // Beyond a day - format date to local time zone
    return parsedDate.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };
  
  
  return (
    <div className="bg-[#0E1422] border border-[#1A1A1A] rounded-lg shadow-lg p-6 max-w-2xl mx-auto my-6">
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
            <h2 className="text-rose-200 font-bold">{authorName.toLowerCase()}</h2>
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
      {currentImg && imageExists && (
        <>
          <img 
            src={currentImg} 
            alt="Post content" 
            className="mt-4 rounded-lg w-full object-cover max-h-96 cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => setIsImageModalOpen(true)}
          />
          
          <ImageModal 
            isOpen={isImageModalOpen}
            onClose={() => setIsImageModalOpen(false)}
            imageSrc={currentImg}
          />
        </>
      )}

      {/* Interaction Buttons */}
      <div className="flex items-center justify-between mt-4">
        <button 
          onClick={handleLike} 
          className={`flex items-center ${liked ? "text-red-500" : "text-gray-400"} ${!user && 'opacity-50'}`}
          disabled={!user || isLoading}
        >
          <HeartIcon filled={liked} />
          <span className="ml-2">{likeCount}</span>
        </button>
        <button 
          onClick={handleTeamToggle} 
          className={`flex items-center ${isTeamMember ? "text-green-500" : "text-gray-400"} ${(!user || isLoading) && 'opacity-50'}`}
          disabled={!user || isLoading}
        >
          <TeamIcon isMember={isTeamMember} />
          <span className="ml-2">
            {isLoading ? "Loading..." : (isTeamMember ? "Leave Team" : "Join Team")}
          </span>
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
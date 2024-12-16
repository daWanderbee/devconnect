"use client";

import React, { useState } from "react";
import CreatePost from "@/src/components/ui/createPost"; 
import Unselected from "@/src/components/Unselected";
import Addpost from "@/src/components/Addpost";

// Ensure the CreatePost component is correctly imported

const Navbar = () => {
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [onhover, setOnhover] = useState(false);

  // Toggle modal visibility
  const handleNewPostClick = () => {
    setIsCreatingPost(!isCreatingPost); // Toggle the CreatePost modal
  };

  // Explicitly close modal
  const handleClosePost = () => {
    setIsCreatingPost(false);
  };

  const handleHover = () => {
    setOnhover(!onhover);
  }



  return (
    <nav className="h-14 w-full top-0 px-4 border-b text-white flex justify-end items-center border-gray-300">
      {/* New Post Button */}
      <button
        onClick={handleNewPostClick}
        onMouseEnter={handleHover}
        onMouseLeave={handleHover}
        className={`text-lg m-0 p-0 font-bold rounded transition duration-300`}
        aria-expanded={isCreatingPost} // Accessibility
        aria-controls="create-post"
      > {isCreatingPost ? 
        <Addpost className="ease-in w-full h-full" />
       : 
          <Unselected className="ease-in w-full h-full" />
      }
      </button>

      {/* CreatePost Modal */}
      {isCreatingPost && (
        <div
          id="create-post"
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          aria-modal="true"
        >
          <div className=" rounded-lg shadow-lg p-6 w-11/12 md:w-3/5 lg:w-2/5">
            {/* Close Button */}
            <button
              onClick={handleClosePost}
              className="absolute top-4 right-4 text-black hover:text-red-600 font-bold text-2xl"
              aria-label="Close Create Post"
            >
              &times;
            </button>

            {/* Render CreatePost Component */}
            <CreatePost handleClosePost={handleClosePost} />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

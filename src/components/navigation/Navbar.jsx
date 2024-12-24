"use client";

import React, { useState } from "react";
import PropTypes from 'prop-types';
import CreatePost from "@/src/components/ui/createPost";
import Unselected from "@/src/components/Unselected";
import Addpost from "@/src/components/Addpost";

// Ensure the CreatePost component is correctly imported

const Navbar = ({ onNotificationButtonClick, onPeopleButtonClick }) => {
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [onhover, setOnhover] = useState(false);
  const [isNotificationVisible, setIsNotificationVisible] = useState(true);

  // Toggle modal visibility
  const handleNewPostClick = () => {
    setIsCreatingPost(!isCreatingPost); // Toggle the CreatePost modal
    // Close the Notifications modal

  };

  // Explicitly close modal
  const handleClosePost = () => {
    setIsCreatingPost(false);
  };

  const handleHover = () => {
    setOnhover(!onhover);
  }

  const onNotificationButtonClickRedDot = () => {
    setIsNotificationVisible(false);
  }


  return (
    <nav className="h-14 w-full top-0 px-4 border-b text-white flex justify-end items-center border-gray-300">

      {/*find people button */}
      <button
        onClick={() => { onPeopleButtonClick(); }}
        className=" md:hidden relative p-2 bg-transparent hover:bg-gray-700 rounded-full transition duration-300"
        aria-label="Notifications"
      >
        {/* Notification Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.5 14.25c2.485 0 4.5-2.015 4.5-4.5s-2.015-4.5-4.5-4.5-4.5 2.015-4.5 4.5 2.015 4.5 4.5 4.5zM7.5 14.25c2.485 0 4.5-2.015 4.5-4.5S9.985 5.25 7.5 5.25 3 7.265 3 9.75s2.015 4.5 4.5 4.5zm9 1.5c-2.9 0-5.4 1.149-7.2 3-.21.225-.3.6-.3.9v1.05h15v-1.05c0-.3-.09-.675-.3-.9-1.8-1.851-4.3-3-7.2-3zM7.5 15.75c-2.9 0-5.4 1.149-7.2 3-.21.225-.3.6-.3.9v1.05h7.5"
          />
        </svg>
      </button>

      {/* Notification Button */}
      <button
        onClick={() => { onNotificationButtonClick(); onNotificationButtonClickRedDot(); }}
        className=" md:hidden relative p-2 bg-transparent hover:bg-gray-700 rounded-full transition duration-300"
        aria-label="Notifications"
      >
        {/* Notification Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 9V5.25a3.75 3.75 0 10-7.5 0V9m12 10.5H3m16.5 0a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25m13.5 0V10.5a6.75 6.75 0 10-13.5 0v9"
          />
        </svg>
        {/* Notification Dot */}
        {isNotificationVisible && <span className="absolute top-1 right-1 bg-red-600 h-3 w-3 rounded-full"></span>}
      </button>
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
Navbar.propTypes = {
  onNotificationButtonClick: PropTypes.func.isRequired,
};

export default Navbar;

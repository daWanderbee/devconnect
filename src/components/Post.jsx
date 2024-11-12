"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

const Post = ({ author, date, desc, img, likes }) => {
  const [fullName, setFullName] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [like, setLike] = useState(likes ? likes.length : 0); // Track loading state

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`/api/profile?id=${author}`);
        console.log('User data:', response.data.user.fullName);  // Debugging the API response

        if (response.data) {
          setFullName(response.data.user.fullName);
          setLike(likes.length)  // Set user data
        } else {
          console.log("No user data found");
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);  // Stop loading once data is fetched
      }
    };

    if (author) {
      fetchUserData();
    }
  }, [author]);  // Runs when `author` prop changes

  return (
    <div className="bg-white p-6 rounded-lg shadow-xl max-w-3xl mx-auto space-y-4">
      <h2 className="text-3xl font-semibold text-gray-800">
        Author: {loading ? (
          <span className="text-gray-500">Loading...</span>  // Show loading message
        ) : (
          <span className="text-green-500">{fullName || author}</span>  // Display fullName if available
        )}
      </h2>
      <p className="text-lg text-gray-500">{date}</p>
      <p className="text-xl text-gray-700">{desc}</p>
      {img && <img src={img} alt="Post" className="w-full h-auto rounded-md shadow-lg" />}
      {like && <p className="text-lg text-gray-500">Likes: {like}</p>}
    </div>
  );
};

Post.propTypes = {
  author: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  desc: PropTypes.string.isRequired,
  img: PropTypes.string,
  likes: PropTypes.array.isRequired,
};

export default Post;

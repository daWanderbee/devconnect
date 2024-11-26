import { getSession } from "next-auth/react";
import axios from "axios";
import React, { useEffect, useState } from 'react';
import Post from "../Post";

const MyPosts = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const session = await getSession();
      if (session) {
        const apiUrl = `/api/posts`;
        try {
          const response = await axios.get(apiUrl);
          if (response.data) {
            // Filter posts to only include those that match the user's ID
            const userPosts = response.data.Posts.filter(post => post.userId === session.user._id);
            setPosts(userPosts);
          }
        } catch (error) {
          console.error("Error fetching posts:", error);
        }
      }
    };

    fetchPosts(); 
  }, []);

  return (
    <div className="overflow-y-scroll w-full mx-auto">
      {posts.map((post) => (
        <Post author={post.userId} date={post.createdAt} desc={post.desc} img={post.img} likes={post.likes} team={post.joinTeam} key={post._id} />
      ))}
    </div>
  );
};

export default MyPosts;

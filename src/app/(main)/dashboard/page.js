"use client";
import React, { useEffect, useState, useMemo } from "react";
import Post from "@/src/components/Post";
import axios from "axios";
import Navbar from "@/src/components/navigation/Navbar";

const Page = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("/api/posts");
        console.log("Posts:", response.data.Posts); // Debugging the API response
        setPosts(response.data.Posts); // Set the posts state
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  // Memoize the transformed posts data
  const processedPosts = useMemo(() => {
    return posts.map((post) => ({
      ...post,
      summary: post.desc ? post.desc.slice(0, 100) : "No description", // Example transformation
    }));
  }, [posts]);

  return (
    <div className="h-screen relative overflow-y-scroll scrollbar-hidden mt-0 pt-0 mx-auto p-4">
      <Navbar />
      <div className="w-full max-w-4xl space-y-6">
        {processedPosts && processedPosts.length > 0 ? (
          processedPosts.map((post) => (
            <Post
              key={post._id}
              id={post._id}
              author={post.userId}
              date={
                post.createdAt
                  ? new Date(post.createdAt).toLocaleDateString()
                  : "No date available"
              } // Format the date properly
              desc={post.summary} // Using the memoized summary
              img={post.img}
              likes={post.likes}
              teams={post.joinTeam}
            />
          ))
        ) : (
          <p>No posts found</p>
        )}
      </div>
    </div>
  );
};

export default Page;

"use client";
import React, { useEffect, useState } from "react";
import Post from "@/src/components/Post";
import CreatePost from "@/src/components/createPost";
import axios from "axios";

const Page = () => {
  const [posts, setPosts] = useState([]); // Initialize as an array

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

  return (
    <div className="h-screen overflow-y-scroll scrollbar-hidden flex mx-auto p-4">
      <div className="w-full max-w-4xl space-y-6">
        {posts && posts.length > 0 ? (
          posts.map((post) => (
            <Post
              key={post._id}
              id={post._id}
              author={post.userId}
              date={
                post.createdAt
                  ? new Date(post.createdAt).toLocaleDateString()
                  : "No date available"
              } // Format the date properly
              desc={post.desc}
              img={post.img}
              likes={post.likes}
              teams={post.joinTeam}
            />
          ))
        ) : (
          <p>No posts found</p>
        )}
      </div>
      <CreatePost />
    </div>
  );
};

export default Page;

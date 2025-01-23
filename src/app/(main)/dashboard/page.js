"use client";
import React, { useEffect, useState, useMemo } from "react";
import Post from "@/src/components/Post";
import axios from "axios";
import Navbar from "@/src/components/navigation/Navbar";
import Notifications from "@/src/components/ui/Notifications";
import Followunfollow from "@/src/components/followunfollow";
import { RefreshCw } from "lucide-react";

const EmptyState = ({ onRefresh, isLoading }) => (
  <div className="flex flex-col items-center justify-center p-8 bg-stone-800 rounded-lg border border-slate-600 text-center">
    <div className="w-16 h-16 mb-4 text-gray-400">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
        />
      </svg>
    </div>
    <h3 className="text-xl font-medium text-gray-200 mb-2">No Posts Found</h3>
    <p className="text-gray-400 mb-4">It seems there are no posts to display at the moment.</p>
    <button
      onClick={onRefresh}
      disabled={isLoading}
      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
    >
      
      <RefreshCw className={` ${isLoading ? 'animate-spin' : ''}`} />
      {isLoading ? 'Refreshing...' : 'Refresh Posts'}
    </button>
  </div>
);


const Page = () => {
  const [posts, setPosts] = useState([]);
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [peopleVisible, setPeopleVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("/api/posts");
      console.log("Posts:", response.data.Posts);
      setPosts(response.data.Posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCloseNotifications = () => {
    setNotificationVisible(false);
  };

  const notificationButtonClick = () => {
    setNotificationVisible(!notificationVisible);
    console.log("Notification button clicked");
  };

  const handleClickPeople = () => {
    setPeopleVisible(!peopleVisible);
    console.log("People button clicked");
  };

  const processedPosts = useMemo(() => {
    return posts.map((post) => ({
      ...post,
      summary: post.desc,
    }));
  }, [posts]);

  return (
    <div className="h-screen w-full relative overflow-y-scroll scrollbar-hidden mt-0 pt-0 mx-auto p-4">
      <Navbar
        onNotificationButtonClick={notificationButtonClick}
        onPeopleButtonClick={handleClickPeople}
      />
      <div className="md:grid md:grid-cols-12">
        <div className="col-span-3 w-1/2"></div>
        <div className="w-full col-span-6 max-w-4xl space-y-6 justify-between">
          {/* Refresh Button */}
          <div className="flex justify-end">
            <button
              onClick={fetchPosts}
              disabled={isLoading}
              className="flex justify-center gap-2 px-3 py-2 text-gray-300 hover:text-white transition-colors disabled:opacity-50"
              title="Refresh posts"
            >
              <div className="relative bottom-1">
              Refresh Posts
              </div>
              <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {peopleVisible && (
            <div className="absolute inset-0 flex transition-all duration-300 items-center justify-center">
              <Followunfollow closeFollowUnfollow={handleClickPeople} />
            </div>
          )}
          {notificationVisible && (
            <div className="absolute inset-0 flex transition-all duration-300 items-center justify-center">
              <Notifications closeNotifications={handleCloseNotifications} />
            </div>
          )}

          {isLoading && !processedPosts.length ? (
            <div className="flex justify-center items-center p-8">
              <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : processedPosts.length > 0 ? (
            processedPosts.map((post) => (
              <Post
                key={post._id}
                postId={post._id}
                author={post.userId}
                date={
                  post.createdAt
                    ? new Date(post.createdAt).toLocaleDateString()
                    : "No date available"
                }
                desc={post.summary}
                img={post.img}
                likes={post.likes}
                teams={post.joinTeam}
                teamId={post.teamId}
              />
            ))
          ) : (
            <EmptyState onRefresh={fetchPosts} isLoading={isLoading} />
          )}
        </div>
        <div className="md:grid md:grid-rows-2 md:h-screen md:col-span-3 w-full">
          <div className="hidden mt-5 md:block w-full row-span-1 justify-items-center">
            <Notifications />
          </div>
          <div className="hidden mt-5 md:block w-full h-full justify-items-center">
            <Followunfollow />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
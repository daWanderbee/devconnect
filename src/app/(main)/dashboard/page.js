"use client";
import React, { useEffect, useState, useMemo } from "react";
import Post from "@/src/components/Post";
import axios from "axios";
import Navbar from "@/src/components/navigation/Navbar";
import Notifications from "@/src/components/ui/Notifications";
import Followunfollow from "@/src/components/followunfollow";

const Page = () => {
  const [posts, setPosts] = useState([]);
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [peopleVisible, setPeopleVisible] = useState(false);

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

  const handleCloseNotifications = () => {
    setNotificationVisible(false);
  }
  const notificationButtonClick = () => {
    setNotificationVisible(!notificationVisible);
    console.log("Notification button clicked");
  }

  const handleClickPeople = () => {
    setPeopleVisible(!peopleVisible);
    console.log("People button clicked");
  }
  // Memoize the transformed posts data
  const processedPosts = useMemo(() => {
    return posts.map((post) => ({
      ...post,
      summary: post.desc,
    }));
  }, [posts]);

  return (
    <div className=" h-screen w-full relative overflow-y-scroll scrollbar-hidden mt-0 pt-0 mx-auto p-4">
      <Navbar onNotificationButtonClick={notificationButtonClick} onPeopleButtonClick={handleClickPeople}/>
      <div className="md:grid md:grid-cols-12">   
      <div className="col-span-3 w-1/2"></div>
      <div className="w-full col-span-6 max-w-4xl space-y-6 justify-between">
      {peopleVisible && (
            <div className="absolute inset-0 flex transition-all duration-300 items-center justify-center">
              <Followunfollow closeFollowUnfollow={handleClickPeople}/>
            </div>
          )}
      {notificationVisible && (
            <div className="absolute inset-0 flex transition-all duration-300 items-center justify-center">
              <Notifications closeNotifications={handleCloseNotifications}/>
            </div>
          )}
        {processedPosts && processedPosts.length > 0 ? (
          processedPosts.map((post) => (
            <Post
              key={post._id}
              postId={post._id}
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
              teamId={post.teamId}
            />
          ))
        ) : (
          <p>No posts found</p>
        )}
      </div>
      <div className="md:grid md:grid-rows-2 md:h-screen md:col-span-3 w-full">
      <div className = "hidden mt-5 md:block w-full row-span-1 justify-items-center "><Notifications /></div>
      <div className = " hidden mt-5 md:block w-full h-full justify-items-center "><Followunfollow/></div>
      </div>
        </div>
    </div>
  );
};

export default Page;

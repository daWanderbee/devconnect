"use client";

import React, { useState, useEffect } from 'react';
import { Heart, UserPlus } from 'lucide-react';
import axios from 'axios';

const NotificationIcon = ({ type }) => {
  if (type === "follow") {
    return <UserPlus className="w-6 h-6 text-emerald-500" />;
  }
  return <Heart className="w-6 h-6 text-rose-500" />;
};

const Notifications = ({ closeNotifications }) => {
  const [notifications, setNotifications] = useState([]);
  const [classForSmallScreen, setClassForSmallScreen] = useState("w-full");

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setClassForSmallScreen("w-full h-full top-10 flex box-border items-center fixed justify-center bg-opacity-60 bg-black");
      } else {
        setClassForSmallScreen("w-full h-screen ml-10");
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get("/api/getNotifications");
        const filteredNotifications = response.data.Notifications.filter(
          (notification) => ["follow", "like"].includes(notification.actionType)
        );
        setNotifications(filteredNotifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
    fetchNotifications();
  }, []);

  return (
    <div className={classForSmallScreen}>
      <div className="w-5/6 bg-stone-900 flex flex-col items-center sm:fixed md:relative p-4 rounded-lg shadow-lg h-1/2 md:h-1/2 relative">
        <h1 className="text-white text-2xl self-start font-bold">Notifications</h1>
        
        <div className="w-full mt-5 mb-5 h-4/6 md:h-5/6 overflow-y-scroll scrollbar-hidden">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div 
                key={notification._id} 
                className="flex items-center w-full bg-stone-900 border-b border-stone-700 p-3 group hover:bg-stone-800 transition-colors"
              >
                <div className="mr-3">
                  <NotificationIcon type={notification.actionType} />
                </div>
                <p className="text-stone-200 text-sm flex-1">{notification.message}</p>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center h-full text-stone-400">
              No notifications
            </div>
          )}
        </div>

        <button
          onClick={closeNotifications}
          className="md:hidden text-white align-middle absolute bottom-2 rounded-md 
                   hover:bg-stone-800 h-8 transition duration-300 bg-stone-950 w-20"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Notifications;
"use client";
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const actionIcons = {
    follow: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 2c2.76 0 5 2.24 5 5s-2.24 5-5 5-5-2.24-5-5 2.24-5 5-5zm0 14c-3.87 0-7 1.63-7 3.5v1h14v-1c0-1.87-3.13-3.5-7-3.5zm0 3c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z" fill="#4CAF50"/></svg>',
    like: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#F44336"/></svg>'
};

const ActionButton = ({ action }) => (
    <span
        className="inline-block mr-2"
        dangerouslySetInnerHTML={{
            __html: actionIcons[action] || '',
        }}
    />
);

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
                            <div key={notification._id} className="flex w-full bg-stone-900 border-b h-14 border-b-cyan-100 p-2 mb-2">
                                <ActionButton action={notification.actionType} />
                                <p className="text-white">{notification.message}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-white">No notifications</p>
                    )}
                </div>
                <button
                    onClick={closeNotifications}
                    className="md:hidden text-white align-middle absolute bottom-2 rounded-md hover:bg-stone-800 h-8 transition duration-300 bg-stone-950 w-20"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

Notifications.propTypes = {
    closeNotifications: PropTypes.func.isRequired,
};

export default Notifications;

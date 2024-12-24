"use client";
import PropTypes from 'prop-types'
import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'

const actionIcons = {
    follow: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M18 11V9a6 6 0 0 0-12 0v2a6 6 0 0 0 12 0zm-2 0V9a4 4 0 0 0-8 0v2a4 4 0 0 0 8 0zm-5 4h2v2h-2zm-4 0h2v2H7zm7 4v-2H9v2h5a2 2 0 0 0 2-2zm-2-6V7a6 6 0 0 1 6 6h-4a2 2 0 0 0-4 0h4z" fill="#4CAF50"/></svg>',
    unfollow: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 12c1.1 0 1.99.9 1.99 2L14 16a2 2 0 0 1-1.99 2H7.99A2 2 0 0 1 6 16v-2a2 2 0 0 1 1.99-2c1.1 0 1.99.9 1.99 2zm4-4V6a6 6 0 0 0-12 0v2a6 6 0 0 0 12 0zm-2 0V6a4 4 0 0 0-8 0v2a4 4 0 0 0 8 0zm-5 4h2v2h-2zm-4 0h2v2H7z" fill="#F44336"/></svg>',
    like: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#F44336"/></svg>',
    unlike: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#4CAF50"/></svg>',
    comment: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M21 12l-3.7-3.7a8.99 8.99 0 0 0-2.39-7.3c-1.72-1.72-3.96-2.59-6.21-2.29-2.26-.3-4.5.57-6.21 2.29-1.73 1.72-2.59 3.96-2.29 6.21-.3 2.26.57 4.5 2.29 6.21 2.22 2.22 5.36 2.83 8.12 1.74L12 21l1.18-5.24 4.83-1.48L21 12zm-2.21 3.3l-3.4 1.06L15 19.34c-.51.51-1.36.51-1.88 0L9 16.34c-.51-.51-.51-1.36 0-1.88l3.7-3.7a8.99 8.99 0 0 0 6.7 3.8z" fill="#FF9800"/></svg>',
};



const ActionButton = ({ action }) => {
    return (
        <span 
            className='inline-block mr-2'
            dangerouslySetInnerHTML={{
                __html: actionIcons[action] || '',
            }}
        />
    );
};

const Notifications = ({ closeNotifications }) => {
    const [notifications, setNotifications] = useState([])
    const [classForSmallScreen, setClassForSmallScreen] = useState("w-full");

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) { // Tailwind's `md` breakpoint
                setClassForSmallScreen("w-full h-full top-10 flex box-border items-center fixed justify-center bg-opacity-60 bg-black");
            } else {
                setClassForSmallScreen("w-full h-screen ml-10 "); // Empty string for medium and larger screens
            }
        };

        // Initial check
        handleResize();

        // Add event listener for window resize
        window.addEventListener('resize', handleResize);

        // Cleanup on component unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await axios.get("/api/getNotifications")
                console.log("Notifications:", response)
                setNotifications(response.data.Notifications)
            } catch (error) {
                console.error("Error fetching notifications:", error)
            }
        }
        fetchNotifications()
    }, [])
    return (
        <div className={classForSmallScreen}>
            <div className="w-5/6 bg-stone-900 flex flex-col items-center sm:fixed md:relative p-4 rounded-lg shadow-lg h-1/2 md:h-1/2">
                <h1 className="text-white text-2xl self-start font-bold">Notifications</h1>

                <div className="w-full mt-5 mb-5 h-4/6 md:h-5/6 overflow-y-scroll scrollbar-hidden">
                    {notifications && notifications.length > 0 ? (
                        notifications.map((notification) => (
                            <div key={notification._id} className="flex w-full bg-stone-900 border-b h-14 border-b-cyan-100 p-2 mb-2 ">
                                <ActionButton action={notification.actionType} />
                                <p className="text-white">{notification.message}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-white">No notifications</p>
                    )}
           
                </div>


                <button onClick={closeNotifications} className=" md:hidden text-white align-middle absolute bottom-2 rounded-md hover:bg-stone-800 h-8 transition duration-300 bg-stone-950 w-20">Close</button>

            </div>
        </div>
    )
}

Notifications.propTypes = {
    closeNotifications: PropTypes.bool.isRequired
}

export default Notifications

"use client"
import React from 'react'
import { useEffect, useState } from "react";
import { getSession } from 'next-auth/react';
import axios from "axios";

const page = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [fullName, setFullName] = useState('');
    const [bio, setBio] = useState('');
    const [followers, setFollowers] = useState();
    const [following, setFollowing] = useState();

    
      useEffect(() => {
        const fetchUserData = async () => {
          const session = await getSession();
          
          if (session && session.user._id) {
            const apiUrl = `/api/profile?id=${session.user._id}`;
      
            try {
              const response = await axios.get(apiUrl);
              
              if (response.data) {
                setFullName(response.data.user.fullName); 
              }
            } catch (error) {
              console.error("Error fetching user data:", error);
            }
          }
        }
      
        fetchUserData();
      }, [])
  return (
    <div >
      {fullName}

    </div>
  )
  
}

export default page;

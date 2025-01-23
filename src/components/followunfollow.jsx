"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ViewProfile from '@/src/components/profile/ViewProfile';
import { UserPlus, UserMinus, User } from 'lucide-react';

const UserCard = ({ user, onFollow, onViewProfile }) => (
  <div className="flex items-center justify-between w-full bg-stone-800 rounded-lg p-4 hover:bg-stone-700 transition-all duration-200 group">
    <button 
      onClick={() => onViewProfile(user)} 
      className="flex items-center space-x-4 flex-1"
    >
      <div className="relative">
        <img
          src={user.profileImg || "https://i.pinimg.com/736x/7d/d7/49/7dd749ba968cd0f2716d988a592f461e.jpg"}
          alt={user.fullName}
          className="w-12 h-12 rounded-full object-cover border-2 border-cyan-400/50 group-hover:border-cyan-400 transition-all duration-200"
        />

      </div>
      
      <div className="flex flex-col items-start">
        <h3 className="text-white font-medium text-sm group-hover:text-cyan-400 transition-colors duration-200">
          {user.fullName}
        </h3>
        <span className="text-stone-400 text-xs">@{user.username}</span>
      </div>
    </button>

    <button
      onClick={() => onFollow(user)}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium 
        transition-all duration-200 
        ${user.following 
          ? 'bg-stone-700 hover:bg-red-500/10 text-red-500 border border-red-500/20' 
          : 'bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400'}
      `}
    >
      {user.following ? (
        <>
          <UserMinus className="w-4 h-4" />
          <span>Unfollow</span>
        </>
      ) : (
        <>
          <UserPlus className="w-4 h-4" />
          <span>Follow</span>
        </>
      )}
    </button>
  </div>
);

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center h-full text-stone-400 py-12">
    <User className="w-12 h-12 mb-3 opacity-50" />
    <p className="text-lg font-medium">No users found</p>
    <p className="text-sm text-stone-500">Check back later for more people to follow</p>
  </div>
);

const Followunfollow = ({ closeFollowUnfollow }) => {
  const [users, setUsers] = useState([]);
  const [classForSmallScreen, setClassForSmallScreen] = useState('w-full');
  const [profile, setProfile] = useState(false);
  const [profileData, setProfileData] = useState({});

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setClassForSmallScreen(
          'w-full h-full top-10 flex box-border items-center fixed justify-center bg-opacity-60 bg-black'
        );
      } else {
        setClassForSmallScreen('w-full h-screen ml-10');
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`/api/fetchUsers`);
        const updatedUsers = response.data.users.map((user) => ({
          ...user,
          following: false,
        }));
        setUsers(updatedUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  const followUnfollow = async (user) => {
    try {
      const updatedUsers = users.map((u) =>
        u._id === user._id ? { ...u, following: !u.following } : u
      );
      setUsers(updatedUsers);
      await axios.post(`/api/followUnfollow`, { userId: user._id });
    } catch (error) {
      console.error('Error following/unfollowing user:', error);
    }
  };

  const viewProfile = async (user) => {
    try {
      const response = await axios.get(`/api/profile?id=${user._id}`);
      setProfileData(response.data.user);
      setProfile(true);
    } catch (error) {
      console.error('Error viewing profile:', error);
    }
  }

  return (
    <div className={classForSmallScreen}>
      <div className="w-5/6 bg-stone-900 mt-5 flex flex-col sm:fixed md:relative p-6 rounded-lg shadow-lg h-1/2 md:h-1/3 relative">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-white text-2xl font-bold flex items-center gap-2">
            <User className="w-6 h-6 text-cyan-400" />
            People to Follow
          </h1>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 space-y-3 scrollbar-thin scrollbar-thumb-stone-700 scrollbar-track-stone-800">
          {users && users.length > 0 ? (
            users.map((user) => (
              <UserCard
                key={user._id}
                user={user}
                onFollow={followUnfollow}
                onViewProfile={viewProfile}
              />
            ))
          ) : (
            <EmptyState />
          )}
        </div>

        <button
          onClick={closeFollowUnfollow}
          className="md:hidden absolute bottom-4 left-1/2 -translate-x-1/2 px-6 py-2 
                   text-white rounded-lg bg-stone-800 hover:bg-stone-700 
                   transition-colors duration-200 shadow-lg"
        >
          Close
        </button>
      </div>

      {profile && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
          <ViewProfile 
            profileData={profileData} 
            closeProfile={() => setProfile(false)} 
          />
        </div>
      )}
    </div>
  );
};

export default Followunfollow;
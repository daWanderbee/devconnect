import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ViewProfile from '@/src/components/profile/ViewProfile';

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
        setClassForSmallScreen('w-full h-screen ml-10 ');
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
      const response = await axios.post(`/api/followUnfollow`, { userId: user._id });

      console.log('Follow/Unfollow response:', response);
    } catch (error) {
      console.error('Error following/unfollowing user:', error);
    }
  };

  const viewProfile = async (user) => {
    try {
      const response = await axios.get(`/api/profile?id=${user._id}`);
      setProfileData(response.data.user);
      console.log('Profile data:', response.data.user);
      setProfile(true);
    } catch (error) {
      console.error('Error viewing profile:', error);
    }
  }
  return (
    <div className={classForSmallScreen}>
      <div className="w-5/6 bg-stone-900 mt-5 flex flex-col items-center sm:fixed md:relative p-4 rounded-lg shadow-lg h-1/2 md:h-1/3 relative">
        <h1 className="text-white text-2xl self-start font-bold">People </h1>
        <div className="w-full mt-5 mb-5 h-5/6 md:h-5/6 overflow-y-scroll scrollbar-hidden bg-stone-900 rounded-lg p-4 shadow-md">
          {users && users.length > 0 ? (
            users.map((user) => (
              <div
                key={user._id}
                className="flex flex-row items-center justify-between w-full bg-stone-800 border-b border-stone-700 rounded-md p-3 mb-3 hover:shadow-lg transition-shadow duration-300"
              >
                {/* User Profile Image */}
                <button onClick={()=>viewProfile(user)} className="flex items-center space-x-3">
                  <img
                    src={user.profileImg || "https://i.pinimg.com/736x/7d/d7/49/7dd749ba968cd0f2716d988a592f461e.jpg"}
                    alt="user"
                    className="w-10 h-10 rounded-full border border-cyan-400 object-cover"
                  />
                  <div>
                    <p className="text-white font-semibold text-sm">{user.fullName}</p>
                    <p className="text-stone-400 text-xs">@{user.username}</p>
                  </div>
                </button>

                {/* Follow/Unfollow Button */}
                <button
                  onClick={() => followUnfollow(user)}
                  className={`px-4 py-1 rounded-md text-sm font-medium transition-colors duration-300 ${user.following
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-cyan-500 hover:bg-cyan-600 text-white'
                    }`}
                >
                  {user.following ? 'Unfollow' : 'Follow'}
                </button>
              </div>
            ))
          ) : (
            <p className="text-center text-stone-400">No users found</p>
          )}
        </div>
        {/* Close Button */}
        <button
          onClick={closeFollowUnfollow}
          className="md:hidden text-white absolute bottom-3 rounded-md hover:bg-stone-800 h-8 transition duration-300 bg-stone-950 w-20 z-50"
        >
          Close
        </button>
      </div>
      {profile &&
        <div className="w-full h-screen bg-black bg-opacity-60 fixed top-0 left-0 flex items-center justify-center">
          <ViewProfile profileData={profileData} closeProfile={() => setProfile(false)} />
        </div>
      }
    </div>

  );
};

export default Followunfollow;

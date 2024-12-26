import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";

const FollowersFollowing = ({
  FollowersorFollowingClicked, // "Followers" or "Following"
  FollowersFollowinglist, // List of user IDs
  closeAll,
  FollowingList,
}) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        // Fetch details of users based on the IDs in FollowersFollowinglist
        const response = await axios.post(`/api/fetchUsersByIds`, {
          userIds: FollowersFollowinglist,
        });
        const updatedUsers = response.data.users.map((user) => ({
          ...user,
          following: FollowersorFollowingClicked === 'Following'?true:FollowingList.includes(user._id), // Initialize with current follow status
        }));
        setUsers(updatedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
      
    };

    fetchUsers();
  }, [FollowersFollowinglist]);

  const followUnfollow = async (user) => {
    try {
      // Optimistic UI update
      const updatedUsers = users.map((u) =>
        u._id === user._id ? { ...u, following: !u.following } : u
      );
      setUsers(updatedUsers);

      // API call to toggle follow/unfollow
      await axios.post(`/api/followUnfollow`, { userId: user._id });
    } catch (error) {
      console.error("Error following/unfollowing user:", error);
    }
  };

  return (
    <div className="w-full h-full top-0 left-0 flex items-center fixed justify-center bg-opacity-60 bg-black">
      <div className="w-5/6 bg-stone-900 mt-5 flex flex-col items-center sm:fixed md:relative p-4 rounded-lg shadow-lg h-1/2 md:h-1/3 relative">
        <h2 className="text-white text-lg font-semibold mb-4">
          {FollowersorFollowingClicked}
        </h2>

        <div className="w-full mt-5 mb-5 h-5/6 overflow-y-scroll scrollbar-hidden bg-stone-900 rounded-lg p-4 shadow-md">
          {loading ? (
            <p className="text-center text-stone-400">Loading...</p>
          ) : users.length > 0 ? (
            users.map((user) => (
              <div
                key={user._id}
                className="flex items-center justify-between w-full bg-stone-800 border-b border-stone-700 rounded-md p-3 mb-3 hover:shadow-lg transition-shadow duration-300"
              >
                {/* User Info */}
                <div className="flex items-center space-x-3">
                  <img
                    src={
                      user.profileImg ||
                      "https://i.pinimg.com/736x/7d/d7/49/7dd749ba968cd0f2716d988a592f461e.jpg"
                    }
                    alt="user"
                    className="w-10 h-10 rounded-full border border-cyan-400 object-cover"
                  />
                  <div>
                    <p className="text-white font-semibold text-sm">{user.fullName}</p>
                    <p className="text-stone-400 text-xs">@{user.username}</p>
                  </div>
                </div>

                {/* Follow/Unfollow Button */}
                <button
                  onClick={() => followUnfollow(user)}
                  className={`px-4 py-1 rounded-md text-sm font-medium transition-colors duration-300 ${user.following
                    ? "bg-red-500 hover:bg-red-600 text-white"
                    : "bg-cyan-500 hover:bg-cyan-600 text-white"
                    }`}
                >
                  {FollowersorFollowingClicked === "Following"
                    ? user.following
                      ? "Unfollow"
                      : "Follow"
                    : user.following
                      ? "Unfollow"
                      : "Follow Back"}


                </button>
              </div>
            ))
          ) : (
            <p className="text-center text-stone-400">No users found</p>
          )}
        </div>

        {/* Close Button */}
        <button
          onClick={closeAll}
          className="text-white absolute bottom-3 rounded-md hover:bg-stone-800 h-8 transition duration-300 bg-stone-950 w-20 z-50"
        >
          Close
        </button>
      </div>
    </div>
  );
};

FollowersFollowing.propTypes = {
  FollowersorFollowingClicked: PropTypes.string.isRequired,
  FollowersFollowinglist: PropTypes.arrayOf(PropTypes.string).isRequired,
  closeAll: PropTypes.func.isRequired,
  FollowingList: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default FollowersFollowing;

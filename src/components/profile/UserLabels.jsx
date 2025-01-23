import axios from "axios";
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

const UserLabels = ({ id }) => {
  const [userLabels, setUserLabels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(id);

  useEffect(() => {
    const fetchUserLabels = async () => {
      try {
        console.log("User id", userId);
        const response = await axios.get(`/api/fetchLabelById?userId=${userId}`);
        setUserLabels(response.data.labels || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user labels:", error);
        setLoading(false);
      }
    };
    fetchUserLabels();
  }, [userId]);

  if (loading) {
    return <div>Loading labels...</div>;
  }

  if (!userLabels.length) {
    return <div>No labels found for this user.</div>;
  }

  return (
    <div className="p-10">
      <h1 className="text-2xl text-yellow-50 font-bold mb-4">Labels</h1>
      <div className="flex flex-wrap gap-2">
        {userLabels.map((label, index) => (
          <div
            key={index}
            className="px-4 py-2 bg-cyan-800 text-white rounded-full shadow-md hover:bg-blue-600 transition"
          >
            {label.name} {/* Render the "name" property of each label */}
          </div>
        ))}
      </div>
    </div>
  );
};

UserLabels.propTypes = {
  id: PropTypes.string.isRequired,
};

export default UserLabels;

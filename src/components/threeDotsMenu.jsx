import React, { useState } from "react";

const ThreeDotsMenu = ({ onShowUpdate, onDelete }) => {
  const [visibility, setVisibility] = useState(false);

  return (
    <div>
      <button
        onClick={() => setVisibility(!visibility)}
        className="p-2 bg-stone-800 rounded-full hover:text-white"
        aria-label="Menu"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="w-6 h-6 text-gray-400"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 5.5h.01M12 12h.01M12 18.5h.01"
          />
        </svg>
      </button>
      {visibility && (
        <div className="absolute right-0 bg-stone-800 text-white rounded-lg shadow-lg mt-2 z-10">
          <button
            onClick={() => {
              setVisibility(false);
              onShowUpdate();
            }}
            className="block w-full px-4 py-2 text-left hover:bg-gray-700"
          >
            Update
          </button>
          <button
            onClick={() => {
              if (confirm("Are you sure you want to delete this post?")) {
                setVisibility(false);
                onDelete();
              }
            }}
            className="block w-full px-4 py-2 text-left hover:bg-gray-700"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default ThreeDotsMenu;
import React, { useState } from "react";

const ThreeDotsMenu = ({ onUpdate, onDelete }) => {
    const [visibility, setVisibility] = useState(false);
  
    return (
      <div className="relative">
        <button onClick={() => setVisibility(!visibility)} className="p-2 rounded-full bg-stone-800 hover:text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="w-6 h-6 text-gray-400"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6h.01M12 12h.01M12 18h.01"
              className="stroke-current"
              strokeWidth="2"
            />
          </svg>
        </button>
        {visibility && (
          <div className="absolute right-0 bg-stone-800 shadow-lg text-white rounded-lg w-32 mt-2">
            <button
              onClick={onUpdate}
              className="block w-full px-4 py-2 text-left hover:bg-gray-700"
            >
              Update
            </button>
            <button
              onClick={onDelete}
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
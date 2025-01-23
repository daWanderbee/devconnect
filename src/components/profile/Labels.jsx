import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Labels = () => {
  const [labels, setLabels] = useState([]);
  const [selectedLabels, setSelectedLabels] = useState([]);
  const [newLabel, setNewLabel] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchLabels = async () => {
      try {
        const response = await axios.get("/api/fetchAllLabels");
        if (response.data.labels) {
          setLabels(response.data.labels);
        }
      } catch (error) {
        console.error("Error fetching labels:", error);
      }
    };
    fetchLabels();
  }, []);

  useEffect(() => {
    const fetchSelectedLabels = async () => {
      try {
        const response = await axios.get("/api/fetchLabel");
        if (response.data.userLabels.labels) {
          setSelectedLabels(response.data.userLabels.labels);
        }
      } catch (error) {
        console.error("Error fetching selected labels:", error);
      }
    };
    fetchSelectedLabels();
  }, []);

  const handleAddLabel = async () => {
    if (!newLabel.trim()) return;
    try {
      const response = await axios.post("/api/addLabel", { names: newLabel });
      if (response.data.message === "Label already exists") {
        setErrorMessage("Label already exists!");
      } else {
        setLabels(prev => [...prev, response.data.newLabel]);
        setSelectedLabels(prev => [...prev, response.data.newLabel]);
        setErrorMessage("");
      }
      setNewLabel("");
    } catch (error) {
      console.error("Error adding label:", error);
    }
  };

  const addToSelectedLabels = async (label) => {
    try {
      const response = await axios.post("/api/userLabel", {
        labels: [label]
      });

      if (response.status === 200) {
        setLabels(prev => prev.filter(item => item._id !== label._id));
        setSelectedLabels(prev => [...prev, label]);
      }
    } catch (error) {
      console.error("Error updating user labels:", error);
    }
  };

  const addToUnselectedLabels = async (label) => {
    try {
      const response = await axios.delete(`/api/removeUserLabel?labelId=${label._id}`);
      
      if (response.status === 200) {
        setSelectedLabels(prev => prev.filter(item => item._id !== label._id));
        setLabels(prev => [...prev, label]);
      }
    } catch (error) {
      console.error("Error removing label:", error);
    }
  };

  const LabelTag = ({ label, onRemove, onClick }) => (
    <button
      onClick={onClick}
      className="group flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-all hover:opacity-90 text-black"
      style={{ backgroundColor: label.color }}
    >
      {label.name}
      {onRemove && (
        <span 
          className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(label);
          }}
        >
          ×
        </span>
      )}
    </button>
  );
  
  return (
    <div className="w-full max-w-2xl mx-auto bg-stone-900 rounded-lg shadow-lg">
      {/* Header */}
      <div className="p-4 border-b border-stone-700">
        <h2 className="text-xl font-semibold text-white">Labels</h2>
      </div>

      <div className="p-4 space-y-4">
        {/* Selected Labels */}
        <div className="bg-stone-800 rounded-lg p-4 min-h-24 max-h-48 overflow-y-auto">
          <h3 className="text-sm font-medium mb-2 text-white">Selected Labels</h3>
          {selectedLabels.length === 0 ? (
            <p className="text-stone-600 text-sm">No labels selected</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {selectedLabels.map(label => (
                <LabelTag
                  key={label._id}
                  label={label}
                  onRemove={addToUnselectedLabels}
                />
              ))}
            </div>
          )}
        </div>

        {/* Add New Label */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Add new label..."
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            className="flex-1 px-3 py-2 bg-stone-800 border border-stone-700 rounded-lg text-black placeholder-stone-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <button
            onClick={handleAddLabel}
            className="px-4 py-2 bg-green-600 text-black rounded-lg hover:bg-green-700 transition-colors flex items-center"
          >
            <span className="mr-1">+</span>
            Add
          </button>
        </div>
        
        {errorMessage && (
          <p className="text-red-600 text-sm">{errorMessage}</p>
        )}

        {/* Available Labels */}
        <div className="bg-stone-800 rounded-lg p-4 min-h-24 max-h-48 overflow-y-auto">
          <h3 className="text-sm font-medium mb-2 text-white">Available Labels</h3>
          {labels.length === 0 ? (
            <p className="text-stone-600 text-sm">No labels available</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {labels.map(label => (
                <LabelTag
                  key={label._id}
                  label={label}
                  onClick={() => addToSelectedLabels(label)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Labels;
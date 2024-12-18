import axios from "axios";
import { useState, useEffect, React } from "react";

const Labels = () => {
  const [labels, setLabels] = useState([]); // List of all labels
  const [selectedLabels, setSelectedLabels] = useState([]); // User's selected labels
  const [newLabel, setNewLabel] = useState(""); // Input field state
  const [errorMessage, setErrorMessage] = useState(""); // Error message for duplicate label
  const [newSelectedLabel, setNewSelectedLabel] = useState([]); // User's selected labels

  // Fetch all labels
  useEffect(() => {
    const fetchLabels = async () => {
      try {
        const response = await axios.get("/api/fetchAllLabels");
        console.log("Main labels:", response.data.labels);
        if (response.data.labels) {
          setLabels(response.data.labels);
        }
      } catch (error) {
        console.error("Error fetching labels:", error);
      }
    };
    fetchLabels();
  }, []);

  // Fetch selected labels
  useEffect(() => {
    const fetchSelectedLabels = async () => {
      try {
        const response = await axios.get("/api/fetchLabel");
        console.log("Selected labels:", response.data.userLabels.labels);
        if (response.data.userLabels.labels) {
          setSelectedLabels(response.data.userLabels.labels);
        }
      } catch (error) {
        console.error("Error fetching selected labels:", error);
      }
    };
    fetchSelectedLabels();
  }, []);

  // Function to handle adding a new label
  const handleAddLabel = async () => {
    if (!newLabel.trim()) return; // Prevent adding empty labels
    try {
      const response = await axios.post("/api/addLabel", { names: newLabel });
      console.log("Response:", response);
      if (response.data.message === "Label already exists") {
        setErrorMessage("Label already exists!");
      } else {
        // Add the new label to the state
        setLabels((prev) => [...prev, response.data.newLabel]);
        setSelectedLabels((prev) => [...prev, response.data.newLabel]);
        

        setErrorMessage(""); // Clear error
      }
      setNewLabel(""); // Reset input field
    } catch (error) {
      console.error("Error adding label:", error);
    }
  };

  const addToSelectedLabels = async (label) => {
    try {
      setNewSelectedLabel(label);
      // Send request to update the user's selected labels in the database
      const response = await axios.post("/api/userLabel", {
        labels : [label]
      });

      if (response.status === 200) {
        // Update the frontend state: remove from labels and add to selectedLabels
        setLabels((prev) => prev.filter((item) => item._id !== label._id));
        setSelectedLabels((prev) => [...prev, label]);
      } else {
        console.error("Error updating user labels:", response.data.message);
      }
    } catch (error) {
      console.error("Error updating user labels:", error);
    }
  };

  const addToUnselectedLabels = async (label) => {
    try {
      // Send API request to remove label by ID
      const response = await axios.delete(`/api/removeUserLabel?labelId=${label._id}`);
      
      if (response.status === 200) {
        // Update frontend state
        setSelectedLabels((prev) => prev.filter((item) => item._id !== label._id));
        setLabels((prev) => [...prev, label]);
      } else {
        console.error("Failed to remove label:", response.data.message);
      }
    } catch (error) {
      console.error("Error removing label:", error);
    }
  };
  
  return (
    <div className="h-1/3 w-1/2 m-10 bg-stone-900 rounded-lg overflow-y-scroll">
      <div className="text-white ml-4 pt-2">Tags</div>

      {/* Selected Labels Section */}
      <div className="bg-stone-700 rounded-lg p-2 h-auto m-4">
        {selectedLabels.length === 0 ? (
          <p className="text-gray-400">No labels found</p>
        ) : (
          <div className="flex p-auto text-sm flex-wrap gap-2">
            {selectedLabels.map((label) => (
              <button
                onClick={() => addToUnselectedLabels(label)}
                key={label._id}
                className="flex items-center px-1 py-1 rounded-lg"
                style={{ backgroundColor: label.color }}
              >
                <span
                  className="m-0 p-0 w-fit center h-4 rounded-full"
                  style={{ backgroundColor: label.color }}
                ></span>
                {label.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Add New Label Input Section */}
      <div className="flex m-4 h-6">
        <input
          type="text"
          placeholder="Add new label..."
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          className="w-full p-2 rounded-l-lg bg-stone-800 text-white"
        />
        <button
          onClick={handleAddLabel}
          className="bg-green-500 px-2 rounded-r-lg text-white"
        >
          Add
        </button>
      </div>
      {errorMessage && <p className="text-red-500 text-lg m-4">{errorMessage}</p>}

      {/* All Labels Section */}
      <div className="bg-stone-700 m-4 rounded-lg">
        {labels.length === 0 ? (
          <p className="text-gray-400 p-2">No labels found</p>
        ) : (
          <div className="flex p-1 text-sm flex-wrap gap-2">
            {labels.map((label) => (
              <button
                onClick={() => addToSelectedLabels(label)}
                key={label._id}
                className="flex items-center px-2 py-1 rounded-lg"
                style={{ backgroundColor: label.color }}
              >
                <span
                  className="m-0 p-0 w-fit center h-4 rounded-full"
                  style={{ backgroundColor: label.color }}
                ></span>
                {label.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Labels;

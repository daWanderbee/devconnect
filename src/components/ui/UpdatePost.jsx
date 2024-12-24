import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

const UpdatePost = ({ postId, currentDesc, currentImg, onUpdateSuccess }) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const [imgFile, setImgFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(currentImg || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Set initial values for the form
  useEffect(() => {
    setValue("desc", currentDesc || "");
  }, [currentDesc, setValue]);

  // Image upload function
  const handleImageUpload = async (file) => {
    if (!file) return "";

    const formData = new FormData();
    formData.append("file", file);

    try {
      console.log("Uploading image...");
      const response = await axios.post("/api/upload-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Image uploaded successfully:", response.data);
      return response.data.url; // Assuming the API returns an object with 'url'
    } catch (err) {
      console.error("Image upload error:", err.message);
      throw new Error("Failed to upload image");
    }
  };

  // Handle file selection and preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImgFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImgFile(null);
    setPreviewImage(null);
  };

  // Handle form submission
  const onSubmit = async (data) => {
    setLoading(true);
    setError(""); // Reset error state

    try {
      // Handle image upload or use current image
      const imageUrl = imgFile ? await handleImageUpload(imgFile) : previewImage;

      console.log("Updating post...");
      const response = await axios.post("/api/updatePosts", {
        postId,
        desc: data.desc,
        img: imageUrl,
      });

      if (response.status !== 200) {
        throw new Error("Failed to update post");
      }

      console.log("Post updated successfully");
      onUpdateSuccess(); // Call the success callback
    } catch (err) {
      console.error("Error in onSubmit:", err.message);
      setError(err.message); // Set error message for display
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="bg-stone-800 border border-slate-600 rounded-lg shadow-lg p-6 max-w-2xl mx-auto my-6">
      <h2 className="text-rose-200 font-bold text-lg mb-4">Update Post</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Description */}
        <div className="mb-4">
          <label className="text-gray-300 block mb-2">Description</label>
          <textarea
            {...register("desc", { required: "Description is required" })}
            className="w-full p-2 bg-gray-700 text-white rounded-lg"
            rows="4"
          />
          {errors.desc && <p className="text-red-500 text-sm">{errors.desc.message}</p>}
        </div>

        {/* File Input or Image Preview */}
        {previewImage ? (
          <div className="relative w-full h-64 shadow-2xl rounded-lg overflow-hidden">
            <img
              src={previewImage}
              alt="Preview"
              className="w-full hover:opacity-60 h-full object-cover"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 text-white p-1 rounded-full hover:bg-red-600"
            >
              ✕
            </button>
          </div>
        ) : (
          <label
            htmlFor="file"
            className="block w-full cursor-pointer py-2 px-4 text-center bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 focus:outline-none"
          >
            Upload Image
            <input
              id="file"
              type="file"
              accept="image/*"
              {...register("file")}
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className={`w-full p-2 rounded-lg ${loading ? "bg-gray-600" : "bg-rose-500 hover:bg-rose-600"} text-white font-bold`}
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Post"}
        </button>
      </form>
    </div>
  );
};

export default UpdatePost;

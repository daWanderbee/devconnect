"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";

const CreatePost = ({ handleClosePost }) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
      setValue("file", file);
    }
  };

  const removeImage = () => {
    setPreviewImage(null);
    setValue("file", null);
  };

  const handleReset = () => {
    reset();
    setPreviewImage(null);
    handleClosePost();
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      let mediaUrl = "";

      if (data.file) {
        const formData = new FormData();
        formData.append("file", data.file);
        
        const uploadResponse = await fetch("/api/upload-image", {
          method: "POST",
          body: formData,
        });

        const uploadResult = await uploadResponse.json();
        
        if (!uploadResponse.ok) {
          throw new Error(uploadResult.message || "File upload failed");
        }
        
        mediaUrl = uploadResult.url;
      }

      const createTeamResponse = await fetch("/api/createTeam", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamName: data.name }),
      });

      const createTeamData = await createTeamResponse.json();

      if (!createTeamResponse.ok) {
        throw new Error(createTeamData.error || "Failed to create team");
      }

      const postData = {
        desc: data.desc,
        img: mediaUrl,
        teamId: createTeamData.team._id,
      };

      const createPostResponse = await fetch("/api/create-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });

      if (!createPostResponse.ok) {
        const createPostData = await createPostResponse.json();
        throw new Error(createPostData.message || "Failed to create post");
      }

      reset();
      setPreviewImage(null);
      handleClosePost();
    } catch (error) {
      console.error("Error:", error);
      alert(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-stone-800 rounded-lg shadow-xl text-white">
      <div className="p-6 border-b border-stone-700">
        <h2 className="text-2xl font-bold">Create New Post</h2>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="p-6">
        <div className="space-y-6">
          {/* Description Input */}
          <div className="space-y-2">
            <textarea
              placeholder="Share your thoughts..."
              {...register("desc", { required: "Description is required" })}
              className="w-full min-h-24 p-3 bg-stone-700 border border-stone-600 rounded-lg 
                         placeholder:text-stone-400 focus:outline-none focus:ring-2 
                         focus:ring-blue-500 resize-none"
              rows="3"
            />
            {errors.desc && (
              <p className="text-red-500 text-sm">{errors.desc.message}</p>
            )}
          </div>

          {/* Team Name Input */}
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Team Name"
              {...register("name", { required: "Team name is required" })}
              className="w-full p-3 bg-stone-700 border border-stone-600 rounded-lg 
                         placeholder:text-stone-400 focus:outline-none focus:ring-2 
                         focus:ring-blue-500"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          {/* Image Upload */}
          {previewImage ? (
            <div className="relative rounded-lg overflow-hidden">
              <img
                src={previewImage}
                alt="Preview"
                className="w-full h-64 object-cover"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 p-2 bg-red-500 rounded-full 
                           hover:bg-red-600 transition-colors"
              >
                <span className="text-white">✕</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 
                               border-2 border-dashed rounded-lg cursor-pointer 
                               border-stone-600 bg-stone-700 hover:bg-stone-600 
                               transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg className="w-8 h-8 mb-2 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                          d="M12 4v16m8-8H4"/>
                  </svg>
                  <p className="text-sm text-stone-400">Click to upload image</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  {...register("file")}
                  onChange={handleFileChange}
                />
              </label>
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex gap-4 mt-6">
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 py-2 px-4 bg-stone-700 text-white rounded-lg
                     hover:bg-stone-600 transition-colors focus:outline-none 
                     focus:ring-2 focus:ring-stone-500"
          >
            Discard
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex-1 py-2 px-4 rounded-lg text-white transition-colors 
                       focus:outline-none focus:ring-2 focus:ring-blue-500
                       ${isSubmitting 
                         ? 'bg-blue-400 cursor-not-allowed' 
                         : 'bg-blue-600 hover:bg-blue-500'}`}
          >
            {isSubmitting ? "Creating Post..." : "Create Post"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
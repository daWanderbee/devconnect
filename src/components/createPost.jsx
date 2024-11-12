"use client"
import { useState } from "react";
import { useForm } from "react-hook-form";
import { getSession } from "next-auth/react";

const CreatePost = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [imgUrl, setImgUrl] = useState("");

  // Upload media file to image-upload API
  const uploadMedia = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const session = await getSession();
    const ids = session.user._id;

    try {
      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      return data.url; // Assuming the API returns the image URL in `data.url`
    } catch (error) {
      console.error("Error uploading media:", error);
      throw error;
    }
  };

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      let mediaUrl = "";

      // Upload file if present
      if (data.file[0]) {
        mediaUrl = await uploadMedia(data.file[0]);
      }

      // Create post with description and media URL
      const response = await fetch("/api/create-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ desc: data.desc, img: mediaUrl }),
      });

      if (response.ok) {
        reset();
        alert("Post created successfully!");
      } else {
        const errorData = await response.json();
        console.error("Error creating post:", errorData.message);
      }
    } catch (error) {
      console.error("Error submitting post:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-4 max-w-lg mx-auto bg-white shadow-md">
      <h2 className="text-lg font-semibold mb-4">Create Post</h2>

      {/* Description Field */}
      <textarea
        placeholder="What's on your mind?"
        {...register("desc", { required: "Description is required" })}
        className="w-full border p-2 mb-4"
      ></textarea>
      {errors.desc && <p className="text-red-500">{errors.desc.message}</p>}
      
      {/* File Input */}
      <input
        type="file"
        accept="image/*, video/*"
        {...register("file")}
        className="mb-4"
      />

      {/* Submit Button */}
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Submit Post
      </button>
    </form>
  );
};

export default CreatePost;

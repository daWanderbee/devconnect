"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";

const CreatePost = ({ handleClosePost }) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
      setValue("file", file); // Manually set the file to the form state
    }
  };

  // Remove selected image
  const removeImage = () => {
    setPreviewImage(null);
    setValue("file", null); // Reset the file value in form state
  };

  const handleReset = () => {
    reset();
    setPreviewImage(null);
    handleClosePost(); // Close modal when "Discard" is clicked
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      let mediaUrl = "";

      if (data.file) {
        const formData = new FormData();
        formData.append("file", data.file);

        const response = await fetch("/api/upload-image", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        if (response.ok) {
          mediaUrl = result.url;
        } else {
          throw new Error(result.message || "File upload failed");
        }
      }

      const postData = {
        desc: data.desc,
        img: mediaUrl,
      };

      const createPostResponse = await fetch("/api/create-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });

      if (createPostResponse.ok) {
        reset();
        setPreviewImage(null);
        alert("Post created successfully!");
        handleClosePost(); // Close modal after successful post creation
      } else {
        const error = await createPostResponse.json();
        alert(error.message || "Failed to create post. Try again.");
      }
    } catch (error) {
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-12 w-full max-w-md shadow-2xl mx-auto bg-stone-800 h-1/2 text-white rounded-lg space-y-6"
    >
      <h2 className="text-2xl font-bold">New Post</h2>

      {/* Description Field */}
      <textarea
        id="desc"
        placeholder="Share your thoughts..."
        {...register("desc", { required: "Description is required" })}
        className="w-full bg-stone-800 rounded-lg border border-stone-700 p-4 text-sm text-gray-300 focus:outline-none focus:border-blue-600 transition-all resize-none"
        rows="3"
      ></textarea>
      {errors.desc && <p className="text-red-500 text-sm mt-2">{errors.desc.message}</p>}

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
          Upload Image<input
            id="file"
            type="file"
            accept="image/*"
            {...register("file")}
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      )}

      {/* Submit and Discard Buttons */}
      <div className="flex justify-between">
        <button
          type="reset"
          onClick={handleReset}
          className="px-6 py-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600"
        >
          Discard
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-6 py-2 rounded-lg ${
            isSubmitting ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-500"
          } text-white`}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </div>
    </form>
  );
};

export default CreatePost;

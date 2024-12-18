"use client";
import { useState } from "react";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast"; // For showing notifications

const ProfileUpdateForm = ({ handleCloseProfile }) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewCoverImage, setPreviewCoverImage] = useState(null);
  const [previewProfileImage, setPreviewProfileImage] = useState(null);

  // Watch field values for validation
  const watchFields = watch(["username", "fullName", "bio", "coverImg", "profileImg"]);

  // Handle file selection
  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (type === "coverImg") {
          setPreviewCoverImage(reader.result);
        } else if (type === "profileImg") {
          setPreviewProfileImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
      setValue(type, file); // Manually set the file to the form state
    }
  };

  // Remove selected image
  const removeImage = (type) => {
    if (type === "coverImg") {
      setPreviewCoverImage(null);
    } else if (type === "profileImg") {
      setPreviewProfileImage(null);
    }
    setValue(type, null); // Reset the file value in form state
  };

  const handleReset = () => {
    reset();
    setPreviewCoverImage(null);
    setPreviewProfileImage(null);
    handleCloseProfile(); // Close modal when "Discard" is clicked
  };

  const onSubmit = async (data) => {
    // Ensure at least one field is provided
    if (
      !data.username &&
      !data.fullName &&
      !data.bio &&
      !data.coverImg &&
      !data.profileImg
    ) {
      toast.error("Please fill in at least one field.");
      return;
    }

    setIsSubmitting(true);

    try {
      let coverImgUrl = "";
      let profileImgUrl = "";

      // Upload cover image if exists
      if (data.coverImg) {
        const coverImgFormData = new FormData();
        coverImgFormData.append("file", data.coverImg);

        const coverImgResponse = await fetch("/api/upload-image", {
          method: "POST",
          body: coverImgFormData,
        });

        const coverImgResult = await coverImgResponse.json();
        if (coverImgResponse.ok) {
          coverImgUrl = coverImgResult.url;
        } else {
          throw new Error(coverImgResult.message || "Cover image upload failed");
        }
      }

      // Upload profile image if exists
      if (data.profileImg) {
        const profileImgFormData = new FormData();
        profileImgFormData.append("file", data.profileImg);

        const profileImgResponse = await fetch("/api/upload-image", {
          method: "POST",
          body: profileImgFormData,
        });

        const profileImgResult = await profileImgResponse.json();
        if (profileImgResponse.ok) {
          profileImgUrl = profileImgResult.url;
        } else {
          throw new Error(profileImgResult.message || "Profile image upload failed");
        }
      }

      const profileData = {
        username: data.username,
        fullName: data.fullName,
        bio: data.bio,
        coverImg: coverImgUrl,
        profileImg: profileImgUrl,
      };

      const updateProfileResponse = await fetch("/api/updateProfile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });

      if (updateProfileResponse.ok) {
        reset();
        setPreviewCoverImage(null);
        setPreviewProfileImage(null);
        toast.success("Profile updated successfully!");
        handleCloseProfile(); // Close modal after successful profile update
      } else {
        const error = await updateProfileResponse.json();
        toast.error(error.message || "Failed to update profile. Try again.");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-14 w-full max-w-md shadow-2xl mx-auto bg-stone-800 h-auto text-white rounded-lg space-y-6"
    >
      <h2 className="text-2xl font-bold">Update Profile</h2>

      {/* Username Field */}
      <input
        id="username"
        type="text"
        placeholder="Username"
        {...register("username")}
        className="w-full bg-stone-800 rounded-lg border border-stone-700 p-4 text-sm text-gray-300 focus:outline-none focus:border-blue-600 transition-all"
      />

      {/* Full Name Field */}
      <input
        id="fullName"
        type="text"
        placeholder="Full Name"
        {...register("fullName")}
        className="w-full bg-stone-800 rounded-lg border border-stone-700 p-4 text-sm text-gray-300 focus:outline-none focus:border-blue-600 transition-all"
      />

      {/* Bio Field */}
      <textarea
        id="bio"
        placeholder="Tell us about yourself..."
        {...register("bio")}
        className="w-full bg-stone-800 rounded-lg border border-stone-700 p-4 text-sm text-gray-300 focus:outline-none focus:border-blue-600 transition-all resize-none"
        rows="3"
      ></textarea>

      {/* Cover Image Input */}
      <div>
        <label className="block text-gray-300 mb-2">Cover Image</label>
        {previewCoverImage ? (
          <div className="relative w-full h-64 shadow-2xl rounded-lg overflow-hidden">
            <img
              src={previewCoverImage}
              alt="Cover Preview"
              className="w-full hover:opacity-60 h-full object-cover"
            />
            <button
              type="button"
              onClick={() => removeImage("coverImg")}
              className="absolute top-2 right-2 text-white p-1 rounded-full hover:bg-red-600"
            >
              ✕
            </button>
          </div>
        ) : (
          <label
            htmlFor="coverImg"
            className="block w-full cursor-pointer py-2 px-4 text-center bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 focus:outline-none"
          >
            Upload Cover Image
            <input
              id="coverImg"
              type="file"
              accept="image/*"
              {...register("coverImg")}
              onChange={(e) => handleFileChange(e, "coverImg")}
              className="hidden"
            />
          </label>
        )}
      </div>

      {/* Profile Image Input */}
      <div>
        <label className="block text-gray-300 mb-2">Profile Image</label>
        {previewProfileImage ? (
          <div className="relative w-full h-64 shadow-2xl rounded-lg overflow-hidden">
            <img
              src={previewProfileImage}
              alt="Profile Preview"
              className="w-full hover:opacity-60 h-full object-cover"
            />
            <button
              type="button"
              onClick={() => removeImage("profileImg")}
              className="absolute top-2 right-2 text-white p-1 rounded-full hover:bg-red-600"
            >
              ✕
            </button>
          </div>
        ) : (
          <label
            htmlFor="profileImg"
            className="block w-full cursor-pointer py-2 px-4 text-center bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 focus:outline-none"
          >
            Upload Profile Image
            <input
              id="profileImg"
              type="file"
              accept="image/*"
              {...register("profileImg")}
              onChange={(e) => handleFileChange(e, "profileImg")}
              className="hidden"
            />
          </label>
        )}
      </div>

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
          {isSubmitting ? "Submitting..." : "Update Profile"}
        </button>
      </div>
    </form>
  );
};

ProfileUpdateForm.propTypes = {
  handleCloseProfile: PropTypes.func.isRequired,
};

export default ProfileUpdateForm;

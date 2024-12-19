"use client";

import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { useDebounce } from "@uidotdev/usehooks"; // Replace with your debounce hook path
import { z } from "zod";

// Validation Schema
const profileUpdateSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters long")
    .max(20, "Username must be at most 20 characters long")
    .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, and underscores are allowed")
    .optional(),
  fullName: z.string().optional(),
  bio: z.string().max(150, "Bio cannot exceed 150 characters").optional(),
  coverImg: z.any().optional(),
  profileImg: z.any().optional(),
});

const ProfileUpdateForm = ({ handleCloseProfile, currentProfile }) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      username: currentProfile?.username || "",
      fullName: currentProfile?.fullName || "",
      bio: currentProfile?.bio || "",
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewCoverImage, setPreviewCoverImage] = useState(currentProfile?.coverImg || null);
  const [previewProfileImage, setPreviewProfileImage] = useState(currentProfile?.profileImg || null);
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);

  const watchFields = watch(["username", "coverImg", "profileImg"]);
  const debouncedUsername = useDebounce(watchFields.username, 200); // Use debounce for better UX

  useEffect(() => {
    let intervalId;
  
    if (debouncedUsername) {
      // Check username availability every 2 seconds
      intervalId = setInterval(async () => {
        if (debouncedUsername && debouncedUsername !== currentProfile?.username) {
          setIsCheckingUsername(true);
          setUsernameMessage("Checking username...");
  
          try {
            const response = await fetch(`/api/check-username-unique?username=${debouncedUsername}`);
            const data = await response.json();
  
            if (data.error) {
              setUsernameMessage(data.error);
            } else {
              setUsernameMessage("Username is available");
            }
          } catch {
            setUsernameMessage("Error checking username");
          } finally {
            setIsCheckingUsername(false);
          }
        }
      }, 2000); // Check every 2 seconds
    }
  
    // Cleanup the interval on component unmount or when debouncedUsername changes
    return () => clearInterval(intervalId);
  
  }, [debouncedUsername, currentProfile?.username]); // Re-run the effect if either of these values change
  

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
      setValue(type, file);
    }
  };

  const removeImage = (type) => {
    if (type === "coverImg") {
      setPreviewCoverImage(currentProfile?.coverImg || null);
    } else if (type === "profileImg") {
      setPreviewProfileImage(currentProfile?.profileImg || null);
    }
    setValue(type, null);
  };

  const handleReset = () => {
    reset();
    setPreviewCoverImage(currentProfile?.coverImg || null);
    setPreviewProfileImage(currentProfile?.profileImg || null);
    handleCloseProfile();
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      let coverImgUrl = previewCoverImage === currentProfile?.coverImg ? currentProfile?.coverImg : "";
      let profileImgUrl = previewProfileImage === currentProfile?.profileImg ? currentProfile?.profileImg : "";

      if (data.coverImg && previewCoverImage !== currentProfile?.coverImg) {
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

      if (data.profileImg && previewProfileImage !== currentProfile?.profileImg) {
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
        username: data.username || currentProfile.username,
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
        toast.success("Profile updated successfully!");
        reset();
        handleCloseProfile();
      } else {
        const error = await updateProfileResponse.json();
        toast.error(error.message || "Failed to update profile.");
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
      className="p-14 w-full max-w-md overflow-y-scroll shadow-2xl mx-auto bg-stone-800 h-80 text-white rounded-lg space-y-6"
    >
      <h2 className="text-2xl font-bold">Update Profile</h2>
      {/* Username Input */}
      <div>
        <input
          id="username"
          type="text"
          placeholder="Username"
          {...register("username")}
          className="w-full bg-stone-800 rounded-lg border border-stone-700 p-4 text-sm text-gray-300 focus:outline-none focus:border-blue-600 transition-all"
        />
        {isCheckingUsername && <p className="text-blue-500">Checking username...</p>}
        <p className={usernameMessage === "Username is available" ? "text-green-500" : "text-red-500"}>
          {usernameMessage}
        </p>
        {errors.username && <span className="text-red-500">{errors.username.message}</span>}
      </div>
      {/* Full Name Input */}
      <input
        id="fullName"
        type="text"
        placeholder="Full Name"
        {...register("fullName")}
        className="w-full bg-stone-800 rounded-lg border border-stone-700 p-4 text-sm text-gray-300 focus:outline-none focus:border-blue-600 transition-all"
      />
      {errors.fullName && <span className="text-red-500">{errors.fullName.message}</span>}

      {/* Bio Textarea */}
      <textarea
        id="bio"
        placeholder="Tell us about yourself..."
        {...register("bio")}
        className="w-full bg-stone-800 rounded-lg border border-stone-700 p-4 text-sm text-gray-300 focus:outline-none focus:border-blue-600 transition-all resize-none"
        rows="3"
      ></textarea>
      {errors.bio && <span className="text-red-500">{errors.bio.message}</span>}

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

      {/* Action Buttons */}
      <div className="flex justify-between">
        <button
          type="reset"
          onClick={handleReset}
          className="px-6 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 focus:outline-none"
        >
          Discard
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 focus:outline-none"
        >
          {isSubmitting ? "Submitting..." : "Update Profile"}
        </button>
      </div>
    </form>
  );
};

ProfileUpdateForm.propTypes = {
  handleCloseProfile: PropTypes.func.isRequired,
  currentProfile: PropTypes.shape({
    username: PropTypes.string,
    fullName: PropTypes.string,
    bio: PropTypes.string,
    coverImg: PropTypes.string,
    profileImg: PropTypes.string,
  }),
};

export default ProfileUpdateForm;

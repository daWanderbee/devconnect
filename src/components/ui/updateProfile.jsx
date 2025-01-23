import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { toast } from "react-hot-toast";

const ProfileUpdateForm = ({ handleCloseProfile, currentProfile }) => {
  const [formData, setFormData] = useState({
    username: currentProfile?.username || "",
    fullName: currentProfile?.fullName || "",
    bio: currentProfile?.bio || "",
    coverImg: null,
    profileImg: null
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewCoverImage, setPreviewCoverImage] = useState(currentProfile?.coverImg || null);
  const [previewProfileImage, setPreviewProfileImage] = useState(currentProfile?.profileImg || null);
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [errors, setErrors] = useState({});

  const validateUsername = (username) => {
    if (!username) return "Username is required";
    if (username.length < 3) return "Username must be at least 3 characters long";
    if (username.length > 20) return "Username must be at most 20 characters long";
    if (!/^[a-zA-Z0-9_]+$/.test(username)) return "Only letters, numbers, and underscores are allowed";
    return null;
  };

  const validateBio = (bio) => {
    if (bio && bio.length > 150) return "Bio cannot exceed 150 characters";
    return null;
  };

  useEffect(() => {
    const checkUsername = async () => {
      const username = formData.username;
      if (!username || username === currentProfile?.username) {
        setUsernameMessage("");
        return;
      }

      const error = validateUsername(username);
      if (error) {
        setUsernameMessage(error);
        return;
      }

      setIsCheckingUsername(true);
      setUsernameMessage("Checking username...");

      try {
        const response = await axios.get(`/api/check-username-unique?username=${username}`);
        setUsernameMessage(response.data.error || "Username is available");
      } catch (error) {
        setUsernameMessage("Error checking username");
      } finally {
        setIsCheckingUsername(false);
      }
    };

    const timeoutId = setTimeout(checkUsername, 500);
    return () => clearTimeout(timeoutId);
  }, [formData.username, currentProfile?.username]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear errors when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setErrors(prev => ({
          ...prev,
          [type]: "File size must be less than 5MB"
        }));
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        if (type === "coverImg") setPreviewCoverImage(reader.result);
        else if (type === "profileImg") setPreviewProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
      setFormData(prev => ({
        ...prev,
        [type]: file
      }));
    }
  };

  const removeImage = (type) => {
    if (type === "coverImg") {
      setPreviewCoverImage(currentProfile?.coverImg || null);
    } else if (type === "profileImg") {
      setPreviewProfileImage(currentProfile?.profileImg || null);
    }
    setFormData(prev => ({
      ...prev,
      [type]: null
    }));
    setErrors(prev => ({
      ...prev,
      [type]: null
    }));
  };

  const handleReset = () => {
    setFormData({
      username: currentProfile?.username || "",
      fullName: currentProfile?.fullName || "",
      bio: currentProfile?.bio || "",
      coverImg: null,
      profileImg: null
    });
    setPreviewCoverImage(currentProfile?.coverImg || null);
    setPreviewProfileImage(currentProfile?.profileImg || null);
    setErrors({});
    handleCloseProfile();
  };

  const validateForm = () => {
    const newErrors = {};

    const usernameError = validateUsername(formData.username);
    if (usernameError) newErrors.username = usernameError;

    const bioError = validateBio(formData.bio);
    if (bioError) newErrors.bio = bioError;

    return newErrors;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate form
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      let coverImgUrl = currentProfile?.coverImg || "";
      let profileImgUrl = currentProfile?.profileImg || "";

      // Handle cover image upload
      if (formData.coverImg && previewCoverImage !== currentProfile?.coverImg) {
        const formDataObj = new FormData();
        formDataObj.append("file", formData.coverImg);
        const response = await axios.post("/api/upload-image", formDataObj, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        coverImgUrl = response.data?.url || "";
      }

      // Handle profile image upload
      if (formData.profileImg && previewProfileImage !== currentProfile?.profileImg) {
        const formDataObj = new FormData();
        formDataObj.append("file", formData.profileImg);
        const response = await axios.post("/api/upload-image", formDataObj, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        profileImgUrl = response.data?.url || "";
      }

      // Prepare profile data
      const profileData = {
        username: formData.username,
        fullName: formData.fullName || undefined,
        bio: formData.bio || undefined,
        coverImg: coverImgUrl || undefined,
        profileImg: profileImgUrl || undefined,
      };

      // Submit profile update
      const response = await axios.post("/api/updateProfile", profileData);

      if (response.status === 200) {
        toast.success("Profile updated successfully!");
        handleCloseProfile();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const InputField = ({ id, name, label, type = "text", placeholder, error, ...props }) => (
    <div className="space-y-2">
      {label && <label htmlFor={id} className="block text-sm font-medium text-gray-300">{label}</label>}
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        className="w-full px-4 py-3 bg-stone-700 border border-stone-600 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        {...props}
      />
      {error && <p className="text-red-400 text-sm">{error}</p>}
    </div>
  );

  const ImageUpload = ({ id, name, label, preview, onRemove, error, ...props }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">{label}</label>
      {preview ? (
        <div className="relative rounded-lg overflow-hidden group">
          <img
            src={preview}
            alt={`${label} Preview`}
            className="w-full h-48 object-cover transition-opacity group-hover:opacity-75"
          />
          <button
            type="button"
            onClick={onRemove}
            className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
          >
            ✕
          </button>
        </div>
      ) : (
        <label
          htmlFor={id}
          className="block w-full cursor-pointer py-3 px-4 text-center bg-stone-700 text-gray-300 rounded-lg hover:bg-stone-600 transition-colors"
        >
          Upload {label}
          <input
            id={id}
            name={name}
            type="file"
            accept="image/*"
            className="hidden"
            {...props}
          />
        </label>
      )}
      {error && <p className="text-red-400 text-sm">{error}</p>}
    </div>
  );

  return (
    <form onSubmit={onSubmit} className="w-full max-w-2xl mx-auto bg-stone-800 rounded-lg shadow-xl overflow-hidden">
      <div className="p-8 space-y-6">
        <h2 className="text-2xl font-bold text-gray-200">Update Profile</h2>

        <div className="space-y-6">
          <InputField
            id="username"
            name="username"
            label="Username"
            placeholder="Enter username"
            value={formData.username}
            onChange={handleInputChange}
            error={errors.username}
          />
          {isCheckingUsername && (
            <p className="text-blue-400 text-sm">Checking username...</p>
          )}
          {usernameMessage && (
            <p className={`text-sm ${
              usernameMessage === "Username is available" ? "text-green-400" : "text-red-400"
            }`}>
              {usernameMessage}
            </p>
          )}

          <InputField
            id="fullName"
            name="fullName"
            label="Full Name"
            placeholder="Enter full name"
            value={formData.fullName}
            onChange={handleInputChange}
            error={errors.fullName}
          />

          <div className="space-y-2">
            <label htmlFor="bio" className="block text-sm font-medium text-gray-300">Bio</label>
            <textarea
              id="bio"
              name="bio"
              placeholder="Tell us about yourself..."
              value={formData.bio}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-stone-700 border border-stone-600 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              rows="4"
            />
            {errors.bio && <p className="text-red-400 text-sm">{errors.bio}</p>}
          </div>

          <ImageUpload
            id="coverImg"
            name="coverImg"
            label="Cover Image"
            preview={previewCoverImage}
            onRemove={() => removeImage("coverImg")}
            onChange={(e) => handleFileChange(e, "coverImg")}
            error={errors.coverImg}
          />

          <ImageUpload
            id="profileImg"
            name="profileImg"
            label="Profile Image"
            preview={previewProfileImage}
            onRemove={() => removeImage("profileImg")}
            onChange={(e) => handleFileChange(e, "profileImg")}
            error={errors.profileImg}
          />

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={handleReset}
              disabled={isSubmitting}
              className="px-6 py-2 bg-stone-700 text-gray-300 rounded-lg hover:bg-stone-600 transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-all disabled:opacity-50"
            >
              {isSubmitting ? "Updating..." : "Save Changes"}
            </button>
          </div>
        </div>
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
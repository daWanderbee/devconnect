import { useState } from "react";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { z } from "zod";
import { Eye, EyeOff } from 'lucide-react';

const passwordUpdateSchema = z.object({
  oldPassword: z.string().min(6, "Old password must be at least 6 characters long"),
  newPassword: z
    .string()
    .min(6, "New password must be at least 6 characters long")
    .max(20, "New password must be at most 20 characters long")
    .regex(/[A-Za-z]/, "Password must contain letters")
    .regex(/[0-9]/, "Password must contain numbers"),
  confirmPassword: z.string().min(6, "Confirm password must be at least 6 characters long"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const UpdatePasswordForm = ({ handleCloseProfile, currentProfile }) => {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(passwordUpdateSchema),
  });

  const handleReset = () => {
    reset();
    handleCloseProfile();
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/updatePassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          oldPassword: data.oldPassword,
          newPassword: data.newPassword,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Password updated successfully!");
        reset();
        handleCloseProfile();
      } else {
        toast.error(result.message || "Failed to update password.");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const PasswordInput = ({ id, placeholder, error, showPassword, togglePassword, ...props }) => (
    <div className="space-y-2">
      <div className="relative">
        <input
          id={id}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          className="w-full px-4 py-3 bg-stone-700 border border-stone-600 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-12"
          {...props}
        />
        <button
          type="button"
          onClick={togglePassword}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
        >
          {showPassword ? (
            <EyeOff size={20} />
          ) : (
            <Eye size={20} />
          )}
        </button>
      </div>
      {error && (
        <p className="text-red-400 text-sm">{error}</p>
      )}
    </div>
  );

  return (
    <div className="w-full max-w-xl mx-auto">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-stone-800 rounded-lg shadow-xl p-8 space-y-6"
      >
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-200">Update Password</h2>
          <p className="text-gray-400 text-sm">
            Please enter your current password and choose a new one.
          </p>
        </div>

        <div className="space-y-6">
          <PasswordInput
            id="oldPassword"
            placeholder="Current Password"
            error={errors.oldPassword?.message}
            showPassword={showOldPassword}
            togglePassword={() => setShowOldPassword(!showOldPassword)}
            {...register("oldPassword")}
          />

          <PasswordInput
            id="newPassword"
            placeholder="New Password"
            error={errors.newPassword?.message}
            showPassword={showNewPassword}
            togglePassword={() => setShowNewPassword(!showNewPassword)}
            {...register("newPassword")}
          />

          <PasswordInput
            id="confirmPassword"
            placeholder="Confirm New Password"
            error={errors.confirmPassword?.message}
            showPassword={showConfirmPassword}
            togglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
            {...register("confirmPassword")}
          />
        </div>

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
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {isSubmitting ? "Updating..." : "Update Password"}
          </button>
        </div>
      </form>

      <div className="mt-4 p-4 bg-stone-700/50 rounded-lg">
        <h3 className="text-sm font-medium text-gray-300 mb-2">Password Requirements:</h3>
        <ul className="text-sm text-gray-400 space-y-1 list-disc pl-4">
          <li>At least 6 characters long</li>
          <li>Maximum 20 characters</li>
          <li>Must contain both letters and numbers</li>
        </ul>
      </div>
    </div>
  );
};

UpdatePasswordForm.propTypes = {
  handleCloseProfile: PropTypes.func.isRequired,
  currentProfile: PropTypes.object.isRequired,
};

export default UpdatePasswordForm;
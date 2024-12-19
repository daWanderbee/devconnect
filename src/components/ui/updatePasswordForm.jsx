"use client";

import { useState } from "react";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { z } from "zod";

// Validation Schema for Password Update
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
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(passwordUpdateSchema),
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset the form and close the profile update modal
  const handleReset = () => {
    reset(); // Reset form values
    handleCloseProfile(); // Close the modal
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
        reset(); // Reset the form after successful submission
        handleCloseProfile(); // Close the modal
      } else {
        toast.error(result.message || "Failed to update password.");
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
      <h2 className="text-2xl font-bold">Update Password</h2>

      {/* Old Password Input */}
      <div>
        <input
          id="oldPassword"
          type="password"
          placeholder="Old Password"
          {...register("oldPassword")}
          className="w-full bg-stone-800 rounded-lg border border-stone-700 p-4 text-sm text-gray-300 focus:outline-none focus:border-blue-600 transition-all"
        />
        {errors.oldPassword && <span className="text-red-500">{errors.oldPassword.message}</span>}
      </div>

      {/* New Password Input */}
      <div>
        <input
          id="newPassword"
          type="password"
          placeholder="New Password"
          {...register("newPassword")}
          className="w-full bg-stone-800 rounded-lg border border-stone-700 p-4 text-sm text-gray-300 focus:outline-none focus:border-blue-600 transition-all"
        />
        {errors.newPassword && <span className="text-red-500">{errors.newPassword.message}</span>}
      </div>

      {/* Confirm New Password Input */}
      <div>
        <input
          id="confirmPassword"
          type="password"
          placeholder="Confirm New Password"
          {...register("confirmPassword")}
          className="w-full bg-stone-800 rounded-lg border border-stone-700 p-4 text-sm text-gray-300 focus:outline-none focus:border-blue-600 transition-all"
        />
        {errors.confirmPassword && <span className="text-red-500">{errors.confirmPassword.message}</span>}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <button
          type="button"
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
          {isSubmitting ? "Submitting..." : "Update Password"}
        </button>
      </div>
    </form>
  );
};

UpdatePasswordForm.propTypes = {
  handleCloseProfile: PropTypes.func.isRequired,
  currentProfile: PropTypes.object.isRequired,
};

export default UpdatePasswordForm;

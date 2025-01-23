"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { signInSchema } from "@/src/schemas/signInSchema";
import React, { useEffect } from "react";
import { signIn } from "next-auth/react";
import { Label } from "@/src/components/ui/label";
import { Input } from "@/src/components/ui/input";
import { cn } from "@/src/app/lib/utils";
import Loader from "@/src/components/loader";
import PropTypes from "prop-types";
import { Code, Lock, UserRound, LogIn } from "lucide-react";
import InteractiveHoverButton from "@/components/ui/interactive-hover-button";

const Page = () => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const { handleSubmit, register, formState: { errors } } = form;

  useEffect(() => {
    if (errors.password?.message) {
      toast.error(errors.password?.message);
    }
  }, [errors.password?.message]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    const result = await signIn("credentials", {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });

    if (result?.error) {
      toast.error("Invalid credentials");
    } else if (result?.url) {
      router.replace("/dashboard");
    }

    setIsSubmitting(false);
  };

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    try {
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch (error) {
      toast.error("Google Sign-In failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGithubSignIn = async () => {
    setIsSubmitting(true);
    try {
      await signIn("github", { callbackUrl: "/dashboard" });
    } catch (error) {
      toast.error("GitHub Sign-In failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="w-[60vw] max-w-md mx-auto rounded-2xl p-6 bg-[#13005A] text-white shadow-2xl border-2 border-[#55D6F5]"
    >
      <div className="flex justify-center mb-6">
        <Code className="w-12 h-12 text-[#03C988]" />
      </div>
      <h2 className="text-3xl font-bold text-center text-[#03C988] mb-4">
        Dev Access Portal
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <LabelInputContainer>
          <Label htmlFor="identifier" className="text-[#55D6F5]">
            <UserRound className="inline-block mr-2 w-5 h-5" />
            Username/Email
          </Label>
          <Input
            id="identifier"
            placeholder="enter your username or email"
            type="text"
            className="bg-[#00337C] border-[#55D6F5] text-white focus:ring-[#03C988]"
            {...register("identifier")}
          />
        </LabelInputContainer>

        <LabelInputContainer>
          <Label htmlFor="password" className="text-[#55D6F5]">
            <Lock className="inline-block mr-2 w-5 h-5" />
            Password
          </Label>
          <Input
            id="password"
            placeholder="secure password"
            type="password"
            className="bg-[#00337C] border-[#55D6F5] text-white focus:ring-[#03C988]"
            {...register("password")}
          />
        </LabelInputContainer>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#55D6F5] text-[#13005A] py-3 rounded-lg hover:bg-[#FFC0CB] transition-colors flex justify-center items-center"
        >
          {isSubmitting ? (
            <Loader />
          ) : (
            <>
              <LogIn className="mr-2" /> Sign In
            </>
          )}
        </button>
      </form>

      <div className="mt-6 space-y-4">
        <div className="flex items-center">
          <hr className="flex-grow border-[#55D6F5]" />
          <span className="mx-4 text-[#03C988]">or continue with</span>
          <hr className="flex-grow border-[#55D6F5]" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <InteractiveHoverButton
            onClick={handleGoogleSignIn}
            disabled={isSubmitting}
            className="bg-[#00337C] text-white py-2 rounded-lg hover:bg-[#55D6F5] flex items-center justify-center"
          >
            <svg
              className="w-5 h-5 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M22.65 12.03c0-.64-.06-1.25-.15-1.84H12v3.48h5.91a5.07 5.07 0 0 1-2.2 3.33v2.77h3.56c2.08-1.92 3.28-4.75 3.28-8.02z" />
              <path d="M12 24c3.24 0 5.97-1.07 7.96-2.9l-3.56-2.77c-1.05.7-2.41 1.12-4.4 1.12-3.38 0-6.25-2.28-7.28-5.36H1.3v3.34A12.01 12.01 0 0 0 12 24z" />
              <path d="M4.72 14.53a7.2 7.2 0 0 1 0-5.06V6.13H1.3a12.03 12.03 0 0 0 0 11.74l3.42-3.34z" />
              <path d="M12 4.8c1.77 0 3.35.61 4.59 1.81l3.43-3.43A11.96 11.96 0 0 0 12 .02C7.4.02 3.37 2.88 1.3 6.13l3.42 3.34c1.03-3.08 3.9-5.36 7.28-5.36z" />
            </svg>
          </InteractiveHoverButton>
          <InteractiveHoverButton
            onClick={handleGithubSignIn}
            disabled={isSubmitting}
            className="bg-[#00337C] text-white py-2 rounded-lg hover:bg-[#1C82AD] flex items-center justify-center"
          >
            <svg
              className="w-5 h-5 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
          </InteractiveHoverButton>
        </div>
      </div>
    </div>
  );
};

const LabelInputContainer = ({ children, className }) => {
  return <div className={cn("flex flex-col space-y-2 w-full", className)}>{children}</div>;
};

LabelInputContainer.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default Page;
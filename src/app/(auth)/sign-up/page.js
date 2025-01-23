"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useDebounce } from "@uidotdev/usehooks";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/src/schemas/signUpSchema";
import React, { useEffect } from "react";
import axios, { AxiosError } from "axios";
import { Code } from "lucide-react";

// form imports
import { Label } from "@/src/components/ui/label";
import { Input } from "@/src/components/ui/input";
import { cn } from "@/src/app/lib/utils";
import Loader from "@/src/components/loader";

const Page = () => {
  const [username, setUsername] = React.useState("");
  const [usernameMessage, setUsernameMessage] = React.useState("");
  const [isCheckingUsername, setIsCheckingUsername] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const debouncedUsername = useDebounce(username, 500);
  const router = useRouter();

  // zod
  const form = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: "",
      username: "",
      email: "",
      password: "",
    },
  });

  // Destructure handleSubmit and register from the form object
  const { handleSubmit, register } = form;

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (debouncedUsername) {
        setIsCheckingUsername(true);
        setUsernameMessage("");
        try {
          const response = await axios.get(
            `/api/check-username-unique?username=${debouncedUsername}`
          );
          setUsernameMessage(response.data.message||response.data.error);
        } catch (error) {
          const AxiosError = error;
          setUsernameMessage(
            AxiosError.response?.data.error || "Error checking username"
          );
        } finally {
          setIsCheckingUsername(false);
          console.log(AxiosError.response?.data.error);
        }
      }
    };
    checkUsernameUnique();
  }, [debouncedUsername]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/sign-up", data);
      toast.success(response.data.message);
      router.replace(`/verify/${username}`);
    } catch (error) {
      console.log("error signing up", error);
      const axiosError = error;
      toast.error(
        axiosError.response?.data.message || "Error signing up"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-[60vw] max-w-md mx-auto rounded-2xl p-6 bg-[#13005A] shadow-2xl border-2 border-[#55D6F5]">
      <div className="flex justify-center mb-6">
        <Code className="w-12 h-12 text-[#03C988]" />
      </div>
      <h2 className="text-3xl font-bold text-center text-[#03C988] mb-4">
        Welcome to DevConnect
      </h2>
      <form className="my-8" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
          <LabelInputContainer>
            <Label htmlFor="fullName" className="text-[#55D6F5]">Full Name</Label>
            <Input
              id="fullName"
              placeholder="John Doe"
              type="text"
              {...register("fullName")}
            />
          </LabelInputContainer>
        </div>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="username" className="text-[#55D6F5]">Username</Label>
          <Input
            id="username"
            placeholder="johndoe"
            type="text"
            {...register("username")}
            onChange={(e) => setUsername(e.target.value)}
          />
        {isCheckingUsername && (<div><Loader/></div>)}
        </LabelInputContainer>
        <p className={`mb-4 text-sm ${usernameMessage === "Username is available"?'text-green-500' : 'text-red-500'}`}> {usernameMessage}</p>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email" className="text-[#55D6F5]">Email Address</Label>
          <Input
            id="email"
            placeholder="projectmayhem@fc.com"
            type="email"
            {...register("email")}
          />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="password" className="text-[#55D6F5]">Password</Label>
          <Input
            id="password"
            placeholder="••••••••"
            type="password"
            {...register("password")}
          />
        </LabelInputContainer>
        <button
          className="w-full bg-[#55D6F5] text-[#13005A] py-3 rounded-lg hover:bg-[#FFC0CB] transition-colors flex justify-center items-center"
          type="submit"
        >
          {isSubmitting ? <div className="flex justify-end align-middle items-center w-1/2 h-full"><Loader /></div> : "Sign up →"}
          <BottomGradient />
        </button>   
      </form>
    </div>
  );
};

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

import PropTypes from 'prop-types';

const LabelInputContainer = ({ children, className }) => {
  return <div className={cn("flex flex-col space-y-2 w-full", className)}>{children}</div>;
};

LabelInputContainer.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default Page;

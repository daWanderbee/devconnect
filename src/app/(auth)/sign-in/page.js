"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { signInSchema } from "@/src/schemas/signInSchema";
import React from "react";
import { signIn } from "next-auth/react";
import { Label } from "@/src/components/ui/label";
import { Input } from "@/src/components/ui/input";
import { cn } from "@/src/app/lib/utils";
import Loader from "@/src/components/loader";
import PropTypes from "prop-types";

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

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    console.log("Form Data: ", data); // for debugging

    const result = await signIn("credentials", {
      redirect: false,
      identifier: data.identifier, // consistent with schema
      password: data.password,
    });

    console.log("SignIn Result: ", result); // for debugging
    if (result?.error) {
      toast.error("Invalid credentials");
    } else if (result?.url) {
      console.log("signed in successfully");
      router.replace("/dashboard");
    }

    setIsSubmitting(false);
  };

  console.log(errors); // Log errors for debugging form validation issues

  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
      <h2 className="text-xl md:text-3xl font-bold dark:text-white text-center">
        Welcome || Welcome back!
      </h2>
      <p className="font-extralight text-center text-base md:text-xl dark:text-neutral-200 py-4">
        Sign in to your account
      </p>
      <form className="my-8" onSubmit={handleSubmit(onSubmit)}>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="identifier">Username/Email</Label>
          <Input
            id="identifier"
            placeholder="username or email"
            type="text"
            {...register("identifier")}
          />
        </LabelInputContainer>
        {errors.identifier && (
  <p className="text-red-500 text-sm">{errors.identifier.message}</p>
)}

        <LabelInputContainer className="mb-4">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            placeholder="••••••••"
            type="password"
            {...register("password")}
          />
        </LabelInputContainer>
        <button
          className="bg-gradient-to-br mt-6 relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          type="submit"
        >
          {isSubmitting ? <div className="flex justify-end align-middle items-center w-1/2 h-full"><Loader/></div> : "Sign in →"}
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

const LabelInputContainer = ({ children, className }) => {
  return <div className={cn("flex flex-col space-y-2 w-full", className)}>{children}</div>;
};

LabelInputContainer.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default Page;

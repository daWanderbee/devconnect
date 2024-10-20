"use client";
import React from 'react';
import { useRouter } from 'next/navigation'; // Use this for Next.js app directory
import { useParams } from 'next/navigation'; // Use this for Next.js app directory
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form'; // Import useForm correctly
import { zodResolver } from '@hookform/resolvers/zod';
import { verifySchema } from '@/src/schemas/verifySchema';
import axios from 'axios'; // Ensure axios is imported
import Loader from '@/src/components/loader';

// Form UI components
import { Label } from '@/src/components/ui/label';
import { Input } from '@/src/components/ui/input';
import { cn } from '@/src/app/lib/utils';

const VerifyAccount = () => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const router = useRouter();
  const params = useParams();

  const form = useForm({
    resolver: zodResolver(verifySchema),
  });

  const { register, handleSubmit } = form;

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post('/api/verify-code', {
        username: params.username, // Using useParams
        verifyCode: data.code, // Ensure correct key here
      });
      toast.success(response.data.message);
      router.replace('/sign-in');
    } catch (error) {
      console.error('Error verifying account:', error);
      toast.error(error.response?.data.message || 'Error verifying account');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
      <p className="font-extralight text-center text-base md:text-xl dark:text-neutral-200 py-4">
        Enter the verification code sent to your email
      </p>
      <form className="my-8" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
          <LabelInputContainer>
            <Label htmlFor="code">Verification Code</Label>
            <Input
              id="code"
              placeholder="code"
              type="text"
              {...register("code")}
            />
          </LabelInputContainer>
        </div>
        <button
          className="bg-gradient-to-br mt-6 relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? <div className="align-center"><Loader /></div> : "Submit"}
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

export default VerifyAccount;

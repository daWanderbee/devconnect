"use client"
import React from "react";
import { BackgroundBeams } from "@/src/components/ui/background-beams";
import { TypewriterEffectSmooth } from "@/src/components/ui/typewriter-effect";
import { useRouter } from "next/navigation"; // Import useRouter


export default function HomePage() {
  const router = useRouter(); // Initialize useRouter

  const words = [
    {
      text: "Build ",
    },
    {
      text: "awesome ",
    },
    {
      text: "community ",
    },
    {
      text: "with ",
    },
    {
      text: "DevConnect.",
      className: "text-blue-500 dark:text-blue-500",
    },
  ];

  return (
    <div className="h-screen w-full rounded-md bg-neutral-950 relative flex flex-col items-center justify-center antialiased">
       
      <div className="flex flex-col items-center justify-center h-[40rem]">
      <h1 className="relative z-10 text-lg md:text-7xl  bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600  text-center font-sans font-bold">
          Hello fellow developers!
        </h1>
        
        <TypewriterEffectSmooth words={words} />
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4">
        <button
  className="w-40 h-10 rounded-xl bg-black border dark:border-white border-transparent text-white text-sm z-10 cursor-pointer"
  onClick={() => { router.push("/sign-up")}} // Navigate to /sign-up
>
  Join now
</button>

<button
  className="w-40 h-10 rounded-xl bg-white text-black border border-black text-sm z-10 cursor-pointer"
  onClick={() => {
    console.log("SignIn button clicked");
    router.push("/sign-in");
  }}
>
            SignIn
          </button>
        </div>
      </div>
      <BackgroundBeams />
    </div>
  );
}

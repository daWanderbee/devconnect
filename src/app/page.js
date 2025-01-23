"use client";
import React from "react";
import { BackgroundBeams } from "@/src/components/ui/background-beams";
import { TypewriterEffectSmooth } from "@/src/components/ui/typewriter-effect";
import { useRouter } from "next/navigation";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { cn } from "@/lib/utils";
import { BentoGrid, BentoGridItem } from "@/src/components/ui/bento-grid";
import {
  IconClipboardCopy,
  IconFileBroken,
  IconSignature,
  IconTableColumn,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { LampContainer } from "@/src/components/ui/lamp";
import { IconCloud } from "@/components/ui/icon-cloud";
import { Vortex } from "@/src/components/ui/vortex";
import { FlickeringGrid } from "@/components/ui/flickering-grid";

const slugs = [
  "typescript",
  "javascript",
  "dart",
  "java",
  "react",
  "flutter",
  "android",
  "html5",
  "css3",
  "nodedotjs",
  "express",
  "nextdotjs",
  "prisma",
  "amazonaws",
  "postgresql",
  "firebase",
  "nginx",
  "vercel",
  "testinglibrary",
  "jest",
  "cypress",
  "docker",
  "git",
  "jira",
  "github",
  "gitlab",
  "visualstudiocode",
  "androidstudio",
  "sonarqube",
  "figma",
];

export default function HomePage() {
  const router = useRouter();

  const words = [
    { text: "Build ", className: "text-[#55D6F5]" }, // Bright blue
    { text: "awesome ", className: "text-[#55D6F5]" }, // Bright blue
    { text: "community ", className: "text-[#55D6F5]" }, // Bright blue
    { text: "with ", className: "text-[#55D6F5]" }, // Bright blue
    {
      text: "DevConnect.",
      className: "text-blue-500", // Soft pink
    },
  ];

  return (
    <>
      <div className="h-[40rem] rounded-md max-w-screen bg-[#0E1422] relative flex flex-col items-center justify-center antialiased"> 
        {/* Deep, velvety blue-black background */}
        <FlickeringGrid
          className="fixed inset-0 -z-10 w-screen h-[100vh] bg-[#55D6F5]" // Bright blue background
          squareSize={6}
          gridGap={6}
          color="#13005A" // Deep blue
          maxOpacity={0.5}
          flickerChance={0.1}
          height={2000}
          width={typeof window !== "undefined" ? window.innerWidth : 2000}
        />
        <div className="flex flex-col items-center justify-center h-[40rem]">
          <h1 className="relative text-4xl md:text-7xl bg-clip-text text-[#55D6F5]  text-center font-sans font-bold"> 
            {/* Gradient from Bright blue to Deep sea green */}
            Hello fellow developers!
          </h1>
          <TypewriterEffectSmooth words={words} />

          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4 mt-6">
            {/* Simple Join Now button */}
            <InteractiveHoverButton
              className="w-40 h-10 hover:items-center text-[#13005A] border bg-[#FFC0CB] text-sm z-10 cursor-pointer justify-center flex items-center" // Soft pink button
              onClick={() => router.push("/sign-up")}
              text="Join Now"
              darkMode={true}
            >
              Join Now
            </InteractiveHoverButton>

            {/* Sign Up button with hover effect */}
            <InteractiveHoverButton
              className="w-40 h-10 hover:items-center text-[#13005A] bg-[#55D6F5] text-sm z-10 cursor-pointer justify-center flex items-center" // Bright blue button
              onClick={() => router.push("/sign-in")}
              darkMode={false}
            >
              Sign In
            </InteractiveHoverButton>
          </div>
        </div>
      </div>
      <div className="m-10 mx-auto mt-8">
        <BentoGrid>
          {items.map((item, index) => (
            <BentoGridItem
              key={index}
              title={item.title}
              description={item.description}
              header={item.header}
              className={item.className}
              icon={item.icon}
            />
          ))}
        </BentoGrid>
      </div>
    </>
  );
}

const Skeleton = () => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl   dark:bg-dot-white/[0.2] bg-dot-black/[0.2] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]  border border-transparent dark:border-white/[0.2] bg-neutral-100 dark:bg-neutral-100"></div>
);

const SkeletonColor = () => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl   dark:bg-dot-white/[0.2] bg-dot-black/[0.2] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]  border border-transparent dark:border-white/[0.2] bg-neutral-100 dark:bg-black">
    <Vortex
      backgroundColor="black"
      rangeY={800}
      particleCount={500}
      baseHue={120}
      className="flex items-center flex-col justify-center px-2 md:px-10  py-4 w-full h-full"
    ></Vortex>
  </div>
);

const images = slugs.map(
  (slug) => `https://cdn.simpleicons.org/<span class="math-inline">\{slug\}/</span>{slug}`,
);

const SkeletonSphere = () => (
  <div className="flex m-auto p-auto w-full h-full min-h-[6rem] rounded-xl   dark:bg-dot-white/[0.2] bg-dot-black/[0.2] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]  border border-transparent dark:border-white/[0.2] bg-neutral-100 dark:bg-black items-center">
    <IconCloud images={images} />
  </div>
);

const SkeletonLamp = () => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl   dark:bg-dot-white/[0.2] bg-dot-black/[0.2] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]  border border-transparent dark:border-white/[0.2] bg-neutral-100 dark:bg-black md:bg-[#FFC0CB]">
    <LampContainer>
      <motion.h1
        initial={{ opacity: 0.5, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="mt-8 bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl"
      >
        Build lamps <br /> the right way
      </motion.h1>
    </LampContainer>
  </div>
);

const SkeletonFour = () => {
  const first = {
    initial: {
      x: 20,
      rotate: -5,
    },
    hover: {
      x: 0,
      rotate: 0,
    },
  };
  const second = {
    initial: {
      x: -20,
      rotate: 5,
    },
    hover: {
      x: 0,
      rotate: 0,
    },
  };
  return (
    <motion.div
      initial="initial"
      animate="animate"
      whileHover="hover"
      className="flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex-row space-x-2"
    >
      <motion.div
        variants={first}
        className="h-full opacity-35 hover:opacity-100 w-1/3 rounded-2xl bg-white p-4 dark:bg-[#FFC0CB] dark:border-white/[0.1] border border-neutral-200 flex flex-col items-center justify-center"
      >
        <Image
          src="https://pbs.twimg.com/profile_images/1417752099488636931/cs2R59eW_400x400.jpg"
          alt="avatar"
          height="100"
          width="100"
          className="rounded-full h-10 w-10"
        />
        <p className="sm:text-sm text-xs text-center font-semibold text-neutral-500 mt-4">
          Just code in Vanilla Javascript
        </p>
        <p className="border border-red-500 bg-red-100 dark:bg-red-900/20 text-red-600 text-xs rounded-full px-2 py-0.5 mt-4">
          Delusional
        </p>
      </motion.div>
      <motion.div className="h-full relative z-20 w-1/3 rounded-2xl bg-white p-4 dark:bg-[#004D40] dark:border-white/[0.1] border border-neutral-200 flex flex-col items-center justify-center opacity-35 hover:opacity-100">
        <Image
          src="https://pbs.twimg.com/profile_images/1417752099488636931/cs2R59eW_400x400.jpg"
          alt="avatar"
          height="100"
          width="100"
          className="rounded-full h-10 w-10"
        />
        <p className="sm:text-sm text-xs text-center font-semibold text-neutral-500 mt-4">
          Tailwind CSS is cool, you know
        </p>
        <p className="border border-green-500 bg-green-100 dark:bg-green-900/20 text-green-600 text-xs rounded-full px-2 py-0.5 mt-4">
          Sensible
        </p>
      </motion.div>
      <motion.div
        variants={second}
        className="h-full w-1/3 rounded-2xl bg-white p-4 dark:bg-[#55D6F5] dark:border-white/[0.1] border border-neutral-200 flex flex-col items-center justify-center opacity-35 hover:opacity-100"
      >
        <Image
          src="https://pbs.twimg.com/profile_images/1417752099488636931/cs2R59eW_400x400.jpg"
          alt="avatar"
          height="100"
          width="100"
          className="rounded-full h-10 w-10"
        />
        <p className="sm:text-sm text-xs text-center font-semibold text-neutral-500 mt-4">
          I love angular, RSC, and Redux.
        </p>
        <p className="border border-orange-500 bg-orange-100 dark:bg-orange-900/20 text-orange-600 text-xs rounded-full px-2 py-0.5 mt-4">
          Helpless
        </p>
      </motion.div>
    </motion.div>
  );
};

const items = [
  {
    title: "The Dawn of Innovation",
    description: "Explore the birth of groundbreaking ideas and teams.",
    header: <SkeletonFour />,
    className: "md:col-span-2",
    icon: <IconClipboardCopy className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "The Digital Revolution",
    description: "Dive into the transformative power of technology.",
    header: <SkeletonLamp />,
    className: "md:col-span-1",
    icon: <IconFileBroken className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "The Art of Design",
    description: "Discover the beauty of thoughtful and functional design.",
    header: <SkeletonSphere />,
    className: "md:col-span-1",
    icon: <IconSignature className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "The Power of Communication",
    description: "Understand the impact of effective communication in our lives.",
    header: <SkeletonColor />,
    className: "md:col-span-2",
    icon: <IconTableColumn className="h-4 w-4 text-neutral-500" />,
  },
];
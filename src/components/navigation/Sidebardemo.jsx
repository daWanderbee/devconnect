"use client";
import React, { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { Sidebar, SidebarBody, SidebarLink } from "@/src/components/ui/sidebar";
import { IconArrowLeft, IconBrandTabler, IconSettings, IconUserBolt } from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/src/app/lib/utils";
import { getSession, signOut } from "next-auth/react";
import axios from "axios";
import UserImg from "@/src/components/assets/svg/user.svg";
import { useRouter } from "next/navigation";
import { StreamChat } from "stream-chat";

export function SidebarDemo({ children }) {
  SidebarDemo.propTypes = {
    children: PropTypes.node,
  };

  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [image, setImage] = useState(UserImg);
  const [client, setClient] = useState(null); // State for storing StreamChat client
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [token, setToken] = useState(null); // Store token
  const [open, setOpen] = useState(false); // Sidebar state
  const [user, setUser] = useState({ _id: null }); // User state

  const onSignout = async () => {
    console.log("User signed out");

    // Disconnect from the chat client if it's available
    if (client) {
      await client.disconnect();
      console.log("StreamChat client disconnected");
    }

    // Sign out from NextAuth
    await signOut({ redirect: false });

    // Redirect to the home page
    router.replace("/");
  };

  // Fetch user data including token
  const fetchUserData = async () => {
    const session = await getSession();
    if (session?.user?._id) {
      const apiUrl = `/api/profile?id=${session.user._id}`;
      try {
        const response = await axios.get(apiUrl);
        if (response.data?.user?.token) {
          setToken(response.data.user.token); // Set the token here
          setFullName(response.data.user.fullName); // Set the full name
          setImage(response.data.user.profileImg || UserImg); // Set the image
          setUser({ _id: response.data.user._id }); // Set the user ID
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
  };

  // Initialize StreamChat client once the token is ready
  useEffect(() => {
    const initClient = async () => {
      await fetchUserData();
      if (token && !client) {  // Check if client is not already initialized
        const chatClient = StreamChat.getInstance("vyaz8uzwffwu"); // Replace with your actual API key
        await chatClient.connectUser(
          { id: user._id, name: fullName },
          token
        );
        setClient(chatClient);
      }
      setLoading(false); // Set loading to false once the token is fetched and client is initialized
    };

    initClient();
  }, [token,user?._id]); // Only run once the token is ready

  // If the token is loading, show a loading indicator
  if (loading) return <div>Loading...</div>;

  const links = [
    { label: "Dashboard", href: "/dashboard", icon: <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" /> },
    { label: "Profile", href: "/profile", icon: <IconUserBolt className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" /> },
    { label: "Teams", href: "/teams", icon: <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" /> },
    { label: "Settings", href: "#", icon: <IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" /> },
    { label: "Logout", href: "#", icon: <IconArrowLeft onClick={onSignout} className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" /> },
  ];

  return (
    <div className={cn("rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 max-w-full mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden", "h-[100vh]")}>
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo fullName={fullName.split(" ")[0]} /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div>
            <SidebarLink link={{ label: fullName, href: "#", icon: <Image src={image} className="h-7 w-7 flex-shrink-0 rounded-full" width={50} height={50} alt="Avatar" /> }} />
          </div>
        </SidebarBody>
      </Sidebar>
      {children}
    </div>
  );
}

export const Logo = ({ fullName }) => {
  return (
    <Link href="/profile" className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20">
      <p></p>
      <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-medium text-black dark:text-white whitespace-pre">
        Welcome! {fullName}
      </motion.span>
    </Link>
  );
};

export const LogoIcon = () => {
  return (
    <Link href="#" className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20">
      <img alt="logo" className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" src="https://res.cloudinary.com/wanderbee/image/upload/v1735315243/logo_h5nzj8.png"/>
    </Link>
  );
};

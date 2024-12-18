"use client";
import React, { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { Sidebar, SidebarBody, SidebarLink } from "@/src/components/ui/sidebar";
import { IconArrowLeft, IconBrandTabler, IconSettings, IconUserBolt } from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/src/app/lib/utils";
import { getSession } from "next-auth/react";
import axios from "axios";
import UserImg from "@/src/components/assets/svg/user.svg";

export function SidebarDemo({ children }) {
  SidebarDemo.propTypes = {
    children: PropTypes.node,
  };

  const [fullName, setFullName] = useState('');
  const [image, setImage] = useState(UserImg);

  const fetchUserName = async () => {
    const session = await getSession();
    console.log("Session:", session);
    if (session?.user?._id) {
      const apiUrl = `/api/profile?id=${session.user._id}`;
      try {
        const response = await axios.get(apiUrl);
        if (response.data) {
          return response.data.user;
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
    return '';
  };

  // Use useMemo to only fetch and set fullName once per session
  const userFullName = useMemo(() => {
    fetchUserName().then(name => setFullName(name.fullName));
  }, []); // Empty dependency array ensures it only runs once.
  const userImage = useMemo(() => {
    fetchUserName().then(img => setImage(img?.profileImg || UserImg));
  }, []); // Empty dependency array ensures it only runs once.

  const links = [
    { label: "Dashboard", href: "/dashboard", icon: <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" /> },
    { label: "Profile", href: "/profile", icon: <IconUserBolt className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" /> },
    { label: "Settings", href: "#", icon: <IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" /> },
    { label: "Logout", href: "#", icon: <IconArrowLeft className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" /> },
  ];
  
  const [open, setOpen] = useState(false);
  
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
    <Link href="#" className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20">
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
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    </Link>
  );
};

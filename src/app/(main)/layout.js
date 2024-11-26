import React from "react";
import { SidebarDemo } from "@/src/components/navigation/Sidebardemo";
import Navbar from "@/src/components/navigation/Navbar";
export const metadata = {
    name: "Dashboard - DevConnect",
    description: "Welcome to DevConnect , a platform for developers to connect. It's a place where you can share your projects, learn from others, and connect with other developers.",
  };
  
export default function DashboardLayout({ children }) {
  return(
     <SidebarDemo>{children}</SidebarDemo>
  )
  }
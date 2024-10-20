
import { motion } from "framer-motion";
import React from "react";
import { AuroraBackground } from "@/src/components/ui/aurora-background";
export const metadata = {
  name: "Login or Signup - DevConnect",
  description: "Login or Signup",
};



export default function AuthLayout({ children }) {
  return (   
    <>
   <AuroraBackground>
    <div className="relative flex flex-col gap-4 items-center justify-center px-4">{children}</div>
    </AuroraBackground>
    </>
  );
}


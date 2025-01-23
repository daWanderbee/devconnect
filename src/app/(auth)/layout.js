
import React from "react";
import { AuroraBackground } from "@/src/components/ui/aurora-background";

export const metadata = {
  name: "Login or Signup - DevConnect",
  description: "Login or Signup",
};

export default function AuthLayout({ children }) {
return( 
    <div className="relative flex flex-col gap-4 items-center justify-center px-4 my-auto h-screen w-screen"
    >
     
      {children}
      <img src="https://res.cloudinary.com/wanderbee/image/upload/v1737656669/1_ssggoh.png" alt="logo" className="absolute top-0 left-0 w-full h-full object-cover -z-10" /></div>
)
}
import "./globals.css";
import AuthProvider from "../context/AuthProvider";
import { Toaster } from "react-hot-toast";
import { icons } from "@tabler/icons-react";


export const metadata = {
  title: "DevConnect",
  description: "A social media platform for developers",
  icons: {
    favicon: "/public/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <AuthProvider>
      <body>
        {children}
        <Toaster position="bottom-right" />
      </body>
      </AuthProvider>
    </html>
  );
}


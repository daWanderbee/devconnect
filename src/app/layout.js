import "./globals.css";
import AuthProvider from "../context/AuthProvider";
import { Toaster } from "react-hot-toast";


export const metadata = {
  title: "DevConnect",
  description: "A social media platform for developers",
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


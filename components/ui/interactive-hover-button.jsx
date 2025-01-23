import React from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export const InteractiveHoverButton = React.forwardRef(
  ({ children, className, darkMode, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "group relative w-auto cursor-pointer overflow-hidden rounded-full border",
          "bg-background p-2 px-6 text-center font-semibold",
          darkMode ? "border-[#55D6F5]" : "border-[#FFC0CB]", // Changed to Jellyfish theme colors
          className
        )}
        {...props}
      >
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "h-2 w-2 rounded-full transition-all duration-300 group-hover:scale-[100.8]",
              darkMode ? "bg-[#55D6F5]" : "bg-[#FFC0CB]" // Changed to Jellyfish theme colors
            )}
          ></div>
          <span
            className={cn(
              "inline-block transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0",
              darkMode ? "group-hover:text-[#55D6F5]" : "group-hover:text-[#FFC0CB]" // Changed to Jellyfish theme colors
            )}
          >
            {children}
          </span>
        </div>
        <div
          className="absolute top-0 z-10 flex h-full w-full translate-x-12 items-center justify-center gap-2 opacity-0 transition-all duration-300 group-hover:translate-x-2 group-hover:opacity-100"
        >
          <span className="text-[#0E1422]"> 
            {/* Swapped colors for dark and light modes */}
            {children}
          </span>
          <ArrowRight
            className="text-[#0E1422]" 
            {/* Swapped colors for dark and light modes */...props}
            size={20}
          />
        </div>
      </button>
    );
  }
);

InteractiveHoverButton.displayName = "InteractiveHoverButton";

export default InteractiveHoverButton;
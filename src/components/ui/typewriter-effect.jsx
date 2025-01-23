"use client";

import { cn } from "@/src/app/lib/utils";
import { motion, stagger, useAnimate, useInView } from "framer-motion";
import { useEffect } from "react";

export const TypewriterEffect = ({
  words,
  className,
  cursorClassName,
  color = "text-black dark:text-white", // Added color prop with default value
}) => {
  // Split text inside of words into array of characters
  const wordsArray = words.map((word) => ({
    ...word,
    text: word.text.split(""),
  }));

  const [scope, animate] = useAnimate();
  const isInView = useInView(scope);

  useEffect(() => {
    if (isInView) {
      animate("span", {
        display: "inline-block",
        opacity: 1,
        width: "fit-content",
      }, {
        duration: 0.3,
        delay: stagger(0.1),
        ease: "easeInOut",
      });
    }
  }, [isInView]);

  const renderWords = () => (
    <motion.div ref={scope} className="inline">
      {wordsArray.map((word, idx) => (
        <div key={`word-${idx}`} className="inline-block mr-2"> {/* Added margin for space */}
          {word.text.map((char, index) => (
            <motion.span
              initial={{}}
              key={`char-${index}`}
              className={cn(`${color} opacity-0 hidden`, word.className)}>
              {char}
            </motion.span>
          ))}
          {/* Optionally, add a non-breaking space */}
          {/* <span className="inline-block">&nbsp;</span> */}
        </div>
      ))}
    </motion.div>
  );

  return (
    <div className={cn(" sm:text-xl md:text-3xl lg:text-5xl font-bold text-center", className)}>
      {renderWords()}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
        className={cn("inline-block rounded-sm w-[4px] h-4 md:h-6 lg:h-10 bg-[#55D6F5]", cursorClassName)} 
        // Changed cursor color to Bright blue
      >
      </motion.span>
    </div>
  );
};

export const TypewriterEffectSmooth = ({
  words,
  className,
  cursorClassName,
  color = "text-black dark:text-white", // Added color prop with default value
}) => {
  // Split text inside of words into array of characters
  const wordsArray = words.map((word) => ({
    ...word,
    text: word.text.split(""),
  }));

  const renderWords = () => (
    <div>
      {wordsArray.map((word, idx) => (
        <div key={`word-${idx}`} className="inline-block mr-2"> {/* Added margin for space */}
          {word.text.map((char, index) => (
            <span
              key={`char-${index}`}
              className={cn(`${color}`, word.className)}
            >
              {char}
            </span>
          ))}
          {/* Optionally, add a non-breaking space */}
          {/* <span className="inline-block">&nbsp;</span> */}
        </div>
      ))}
    </div>
  );

  return (
    <div className={cn("flex space-x-1 my-6", className)}>
      <motion.div
        className="overflow-hidden pb-2 text-[#55D6F5]" // Changed text color to Bright blue
        initial={{ width: "0%" }}
        whileInView={{ width: "fit-content" }}
        transition={{ duration: 2, ease: "linear", delay: 1 }}
      >
        <div className="text-s sm:text-base md:text-2xl lg:text-3xl xl:text-5xl font-bold text-[#55D6F5]" style={{ whiteSpace: "nowrap" }}> 
          {/* Changed text color to Bright blue */}
          {renderWords()} {" "}
        </div>
      </motion.div>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
        className={cn("block rounded-sm w-[4px] h-4 sm:h-6 xl:h-12 bg-[#55D6F5]", cursorClassName)} 
        // Changed cursor color to Bright blue
      >
      </motion.span>
    </div>
  );
};
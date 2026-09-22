import React from "react";

import markLight from "../assets/brand/mark_light.png";
import markDark from "../assets/brand/mark_dark.png";
import wordLight from "../assets/brand/word_light.png";
import wordDark from "../assets/brand/word_dark.png";


export function LogoMark({ className = "h-9" }) {
  return (
    <>
      <img src={markLight} alt="Dokkan" className={`inline-block object-contain dark:hidden ${className}`} />
      <img src={markDark} alt="Dokkan" className={`hidden object-contain dark:inline-block ${className}`} />
    </>
  );
}

/** "DOKKAN" wordmark, cropped from the same supplied artwork. */
export function LogoWordmark({ className = "h-6" }) {
  return (
    <>
      <img src={wordLight} alt="Dokkan" className={`inline-block object-contain dark:hidden ${className}`} />
      <img src={wordDark} alt="Dokkan" className={`hidden object-contain dark:inline-block ${className}`} />
    </>
  );
}


export default function Logo({ markClassName = "h-9", textClassName = "h-6" }) {
  return (
    <div className="flex items-center gap-2">
      <LogoMark className={markClassName} />
      <LogoWordmark className={textClassName} />
    </div>
  );
}

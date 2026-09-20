import React from "react";

import markLight from "../assets/brand/mark_light.png";
import markDark from "../assets/brand/mark_dark.png";
import wordLight from "../assets/brand/word_light.png";
import wordDark from "../assets/brand/word_dark.png";

/**
 * The storefront icon mark from the real Dokkan logo artwork.
 * Two pre-rendered variants are swapped with Tailwind's dark: modifier —
 * the dark-text version for light backgrounds, the gold/tan version for
 * dark backgrounds (footer, dark mode navbar) — so it always reads clearly.
 */
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

/** Full lockup: mark + wordmark side by side. */
export default function Logo({ markClassName = "h-9", textClassName = "h-6" }) {
  return (
    <div className="flex items-center gap-2">
      <LogoMark className={markClassName} />
      <LogoWordmark className={textClassName} />
    </div>
  );
}

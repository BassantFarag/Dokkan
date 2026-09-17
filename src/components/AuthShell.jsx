import React from "react";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import { LogoMark, LogoWordmark } from "./Logo";

/**
 * Shared shell for /login and /register.
 * Matches the Navbar/Footer palette (#f7f2ed light / #120e0c dark, #c2a38e gold)
 * and adds a soft hanging-lamp glow above the brand mark, echoing the
 * storefront flag/awning in the Dokkan logo.
 */
export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#f7f2ed] pt-32 pb-20 dark:bg-[#120e0c] transition-colors">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[420px] w-[620px] -translate-x-1/2 rounded-full bg-[#c2a38e]/25 blur-[120px] dark:bg-[#c2a38e]/15" />
        <div className="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-[#c2a38e]/10 blur-3xl" />
        <div className="absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-[#c2a38e]/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-md flex-col items-center px-6">
        {/* Hanging lamp + brand mark */}
        <div className="relative mb-8 flex flex-col items-center">
          {/* lamp cord */}
          <div className="h-6 w-px bg-[#c2a38e]/50" />

          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            {/* glow cast by the lamp — dimmer in dark mode so it doesn't wash out the icon */}
            <motion.div
              animate={{ opacity: [0.5, 0.9, 0.5], scale: [1, 1.08, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 -z-10 rounded-full bg-[#e8c39e] blur-2xl dark:bg-[#e8c39e]/30"
            />
            <NavLink to="/" className="flex items-center justify-center drop-shadow-[0_0_25px_rgba(194,163,142,0.5)] dark:drop-shadow-[0_0_12px_rgba(194,163,142,0.22)]">
              <LogoMark className="h-28" />
            </NavLink>
          </motion.div>

          <div className="mt-4">
            <LogoWordmark className="h-11" />
          </div>
        </div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full rounded-3xl border border-[#e4dcd5]/70 bg-[#fbf8f5]/90 p-7 shadow-[0_20px_60px_rgba(42,36,33,0.12)] backdrop-blur-xl dark:border-[#38302c] dark:bg-[#1a1513]/90 dark:shadow-[0_20px_60px_rgba(0,0,0,0.5)] sm:p-9"
        >
          <div className="mb-7 text-center">
            <h1 className="text-2xl font-bold text-[#2a2421] dark:text-[#f3ece7]">{title}</h1>
            {subtitle && (
              <p className="mt-2 text-sm text-[#7a6f68] dark:text-[#a0948c]">{subtitle}</p>
            )}
          </div>

          {children}
        </motion.div>

        {footer && <div className="mt-6 text-center text-sm">{footer}</div>}
      </div>
    </div>
  );
}

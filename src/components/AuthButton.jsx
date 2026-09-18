import React from "react";
import { ClipLoader } from "react-spinners";

export default function AuthButton({ children, loading, className = "", ...rest }) {
  return (
    <button
      disabled={loading}
      className={`group flex w-full items-center justify-center gap-2 rounded-full bg-[#2a2421] py-3 text-sm font-semibold text-[#f7f2ed] shadow-md transition-all hover:bg-[#423935] disabled:cursor-not-allowed disabled:opacity-70 dark:bg-[#f3ece7] dark:text-[#1a1513] dark:hover:bg-[#e4dcd5] ${className}`}
      {...rest}
    >
      {loading ? <ClipLoader size={18} color="currentColor" /> : children}
    </button>
  );
}

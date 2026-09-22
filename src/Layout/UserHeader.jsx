import React, { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, Heart, Package, ChevronDown } from "lucide-react";
import Avatar from "../components/Avatar";
import { getDisplayName } from "../utils/user";

const UserHeader = ({ user, onLogout }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const role = (user?.role || user?.type || user?.accountType || "").toString().toLowerCase();
  const isAdmin = role === "admin" || user?.isAdmin === true;
  const roleLabel = isAdmin ? "Admin" : "Customer";

  useEffect(() => {
    const onClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <div className="flex items-center gap-1 rounded-full border border-[#e4dcd5] bg-[#f7f2ed]/70 py-1.5 pl-1.5 pr-2 text-xs font-semibold text-[#2a2421] shadow-sm transition-all hover:bg-[#eae1d9] dark:border-[#38302c] dark:bg-[#1f1a18]/70 dark:text-[#f3ece7] dark:hover:bg-[#2e2623]">
        <NavLink to="/profile" className="flex items-center gap-2 pr-1">
          <Avatar user={user} className="h-7 w-7 text-[11px]" />
          <span className="max-w-[90px] truncate hover:underline">{getDisplayName(user) || roleLabel}</span>
        </NavLink>
        <button onClick={() => setOpen((o) => !o)} className="flex h-6 w-6 items-center justify-center">
          <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-48 overflow-hidden rounded-2xl border border-[#e4dcd5] bg-[#fbf8f5] shadow-xl dark:border-[#38302c] dark:bg-[#1a1513]"
          >
            <NavLink
              to="/Whishlist"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-3 text-xs font-medium text-[#4a423d] hover:bg-[#f0e9e2] dark:text-[#cdc0b8] dark:hover:bg-[#2e2623]"
            >
              <Heart className="h-3.5 w-3.5 text-[#c2a38e]" /> Wishlist
            </NavLink>
            <NavLink
              to="/Myorders"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-3 text-xs font-medium text-[#4a423d] hover:bg-[#f0e9e2] dark:text-[#cdc0b8] dark:hover:bg-[#2e2623]"
            >
              <Package className="h-3.5 w-3.5 text-[#c2a38e]" /> My Orders
            </NavLink>
            <button
              onClick={() => {
                setOpen(false);
                onLogout?.();
              }}
              className="flex w-full items-center gap-2.5 border-t border-[#e4dcd5] px-4 py-3 text-xs font-medium text-red-500 hover:bg-[#f0e9e2] dark:border-[#38302c] dark:hover:bg-[#2e2623]"
            >
              <LogOut className="h-3.5 w-3.5" /> Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserHeader;

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Sun, Moon, Menu, X, ArrowUpRight , User} from "lucide-react";
import { NavLink, useLocation , useNavigate} from "react-router-dom";
import UserHeader from "./UserHeader";


export default function LuxuryHeader() {
  const [isDark, setIsDark] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
  const navigate =useNavigate();
 
  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Shop", path: "/shop" },
    { label: "My Orders", path: "/Myorders" },
    { label: "Carts", path: "/Carts" },
    { label: "Wishlist", path: "/Whishlist" },
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  const checkIsActive = (targetPath) => {
    const currentPath = location.pathname.toLowerCase();
    const target = targetPath.toLowerCase();

    if (target === "/") {
      return currentPath === "/";
    }
    return currentPath === target || currentPath === target.replace(/^\//, "");
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-[#f7f2ed]/60 dark:bg-[#1a1513]/60 backdrop-blur-lg shadow-sm py-2"
          : "bg-transparent py-4"
      }`}
    >
      {/* Container */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
        
        {/* Brand Logo */}
        <NavLink to="/" className="flex items-center gap-2 cursor-pointer">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#c2a38e] text-zinc-950 font-bold shadow-md">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M2 10v4M6 6v12M10 3v18M14 8v8M18 5v14M22 10v4" />
            </svg>
          </div>
          <span className="text-xl font-extrabold tracking-tight text-[#2a2421] dark:text-[#f3ece7] transition-colors">
            Dokkan
          </span>
        </NavLink>

      
        <nav className="hidden md:flex items-center gap-1 rounded-full border border-[#e4dcd5]/60 bg-[#f7f2ed]/80 p-1.5 backdrop-blur-md shadow-sm dark:border-[#38302c] dark:bg-[#1f1a18]/80 transition-colors">
          {navLinks.map((tab) => {
            const isActive = checkIsActive(tab.path);

            return (
              <NavLink
                key={tab.label}
                to={tab.path}
                className="relative px-6 py-2.5 text-xs font-semibold tracking-wide transition-colors duration-300"
              >
                {isActive && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 pointer-events-none"
                    transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
                  >
                    
                    <div className="absolute -top-[1.5px] left-1/2 h-[3.5px] w-6 -translate-x-1/2 rounded-full bg-[#c2a38e] dark:bg-[#e8c39e] shadow-[0_0_10px_#c2a38e] z-20" />

            
                    <div
                      className="absolute top-0 left-1/2 h-full w-full -translate-x-1/2 z-10"
                      style={{
                        clipPath: "polygon(35% 0%, 65% 0%, 95% 100%, 5% 100%)",
                        background:
                          "linear-gradient(to bottom, rgba(194, 163, 142, 0.7) 0%, rgba(194, 163, 142, 0.15) 75%, transparent 100%)",
                      }}
                    />

                  
                    <div className="absolute inset-0 rounded-full bg-[#c2a38e]/15 blur-md z-0" />
                  </motion.div>
                )}

                <span
                  className={`relative z-20 ${
                    isActive
                      ? "text-[#2a2421] dark:text-[#f3ece7] font-bold drop-shadow-[0_0_10px_rgba(194,163,142,0.9)]"
                      : "text-[#7a6f68] hover:text-[#2a2421] dark:text-[#a0948c] dark:hover:text-[#f3ece7]"
                  }`}
                >
                  {tab.label}
                </span>
              </NavLink>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="hidden md:flex items-center gap-3">
          {/* Theme Toggle Button */}
          <button
            onClick={() => {
              setIsDark(!isDark);
              document.documentElement.classList.toggle("dark");
            }}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e4dcd5] bg-[#f7f2ed]/70 dark:bg-[#1f1a18]/70 text-[#2a2421] hover:bg-[#eae1d9] dark:border-[#38302c] dark:text-[#f3ece7] dark:hover:bg-[#2e2623] transition-all shadow-sm backdrop-blur-sm"
          >
            {isDark ? <Sun className="h-4 w-4 text-[#e8c39e]" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* user profile and login */}
          {isLoggedIn ? (
            <UserHeader onLogout={handleLogout} />
          ) : (
            <button
              className="group flex items-center gap-2 rounded-full bg-[#2a2421] px-5 py-2.5 text-xs font-medium text-[#f7f2ed] hover:bg-[#423935] dark:bg-[#f3ece7] dark:text-[#1a1513] dark:hover:bg-[#e4dcd5] transition-all shadow-md"
              onClick={() => navigate("/login")}
            >
              <span>Login</span>
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          )}
        </div>
        
        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => {
              setIsDark(!isDark);
              document.documentElement.classList.toggle("dark");
            }}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e4dcd5] bg-[#f7f2ed] dark:border-[#38302c] dark:bg-[#1f1a18]"
          >
            {isDark ? <Sun className="h-4 w-4 text-[#e8c39e]" /> : <Moon className="h-4 w-4" />}
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2a2421] text-white dark:bg-[#f3ece7] dark:text-[#1a1513]"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-[#e4dcd5] bg-[#f7f2ed]/95 backdrop-blur-xl px-6 py-4 dark:border-[#38302c] dark:bg-[#1f1a18]/95"
          >
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <NavLink
                  key={link.label}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-sm font-semibold text-[#2a2421] dark:text-[#f3ece7] hover:opacity-75 transition-opacity"
                >
                  {link.label}
                </NavLink>
              ))}
              <button className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-[#2a2421] py-3 text-xs font-semibold text-[#f7f2ed] dark:bg-[#f3ece7] dark:text-[#1a1513]">
                <span>Login</span>
                <User className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
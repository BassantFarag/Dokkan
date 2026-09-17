import React from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Mail, Phone, Globe, Share2, MessageCircle, Send, Flashlight, ShoppingBag, Sparkles } from "lucide-react";
import Logo from "../components/Logo";

export default function LuxuryFooter() {
  const footerNavLinks = [
    { label: "Home", path: "/" },
    { label: "Shop", path: "shop" },
    { label: "My Orders", path: "Myorders" },
    { label: "Carts", path: "Carts" },
    { label: "Wishlist", path: "Whishlist" },
  ];

  return (
    <footer className="relative w-full overflow-hidden bg-[#120e0c] text-[#f3ece7] pt-28 pb-10">
      
     
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none -translate-y-[98%] pointer-events-none">
        <svg
          className="relative block w-full h-[80px] md:h-[120px]"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0 C300,90 600,-30 900,60 C1050,105 1150,40 1200,20 L1200,120 L0,120 Z"
            className="fill-[#120e0c]"
          />
        </svg>
      </div>

   
      <div className="mx-auto max-w-7xl px-6 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-[#2b221e]/80 items-center">
          
        
          <div className="space-y-4">
            {/* Footer is always on the dark palette, so the "dark" wrapper
                forces the logo's dark-mode colors regardless of the site's
                current theme toggle. */}
            <NavLink to="/" className="dark flex items-center">
              <Logo markClassName="h-10" textClassName="h-6" />
            </NavLink>
            <p className="text-xs text-[#a0948c] leading-relaxed">
              Warning: Browsing our collection may cause extreme happiness and heavy carts.
            </p>
          </div>

         
          <div className="space-y-4 md:justify-self-center">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#c2a38e]">Quick Links</h4>
            <ul className="space-y-3">
              {footerNavLinks.map((link) => (
                <li key={link.label}>
                  <NavLink
                    to={link.path}
                    className={({ isActive }) =>
                      `relative inline-flex items-center gap-2 text-xs transition-colors duration-300 ${
                        isActive ? "text-[#f3ece7] font-bold pl-1" : "text-[#a0948c] hover:text-[#f3ece7]"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <motion.div
                            layoutId="side-spotlight"
                            className="relative flex items-center pr-1"
                            transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
                          >
                            <Flashlight className="h-4 w-4 text-[#c2a38e] rotate-45 drop-shadow-[0_0_8px_#c2a38e]" />
                            <div
                              className="absolute left-3 w-16 h-6 pointer-events-none opacity-80 z-0"
                              style={{
                                clipPath: "polygon(0% 40%, 100% 0%, 100% 100%, 0% 60%)",
                                background:
                                  "linear-gradient(to right, rgba(194, 163, 142, 0.9) 0%, rgba(194, 163, 142, 0.15) 75%, transparent 100%)",
                              }}
                            />
                          </motion.div>
                        )}
                        <span className="relative z-10">{link.label}</span>
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

        
          <div className="space-y-4 mb-24">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#c2a38e]">Contact Us</h4>
            <div className="space-y-2.5 text-xs text-[#a0948c]">
              <p className="flex items-center gap-2"><Mail className="h-3.5 w-3.5 text-[#c2a38e]" /> Bassanttfarag28@gmail.com</p>
              <p className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-[#c2a38e]" /> +201277237317</p>
            </div>
            <div className="flex items-center gap-3.5 pt-1 text-[#a0948c]">
              <a href="#" className="hover:text-[#c2a38e] transition-colors"><Globe className="h-4 w-4" /></a>
              <a href="#" className="hover:text-[#c2a38e] transition-colors"><Share2 className="h-4 w-4" /></a>
              <a href="#" className="hover:text-[#c2a38e] transition-colors"><MessageCircle className="h-4 w-4" /></a>
              <a href="#" className="hover:text-[#c2a38e] transition-colors"><Send className="h-4 w-4" /></a>
            </div>
          </div>

         {/* 3d shape  */}
          <div className="flex justify-center items-center perspective-1000">
            <motion.div
              animate={{
                y: [0, -8, 0],
                rotateX: [5, -5, 5],
                rotateY: [-10, 10, -10],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative w-48 h-32 rounded-2xl bg-gradient-to-br from-[#2a211c] via-[#1c1613] to-[#0d0a08] p-4 border border-[#c2a38e]/30 shadow-[0_15px_35px_rgba(0,0,0,0.6)] backdrop-blur-md flex flex-col justify-between overflow-hidden group cursor-pointer"
            >
           
              <div className="absolute -right-6 -top-6 w-20 h-20 bg-[#c2a38e]/10 rounded-full blur-xl group-hover:bg-[#c2a38e]/20 transition-all duration-500" />
              
              <div className="flex items-center justify-between relative z-10">
                <span className="text-[10px] uppercase tracking-widest text-[#c2a38e] font-semibold">Special Edition</span>
                <Sparkles className="h-4 w-4 text-[#c2a38e] animate-pulse" />
              </div>

              <div className="relative z-10 my-auto">
                <p className="text-xs font-bold text-[#f3ece7]">Dokkan VIP Club</p>
                <p className="text-[10px] text-[#a0948c]">Unlock exclusive deals</p>
              </div>

              <div className="flex items-center gap-1.5 text-[10px] text-[#c2a38e] font-semibold relative z-10">
                <ShoppingBag className="h-3 w-3" />
                <span>Shop Premium</span>
              </div>
            </motion.div>
          </div>

        </div>

    
        <div className="mt-8 flex flex-col items-center justify-center gap-4">
          <form onSubmit={(e) => e.preventDefault()} className="relative flex w-full max-w-md items-center">
            <input
              type="email"
              placeholder="Enter your email address..."
              className="w-full rounded-full border border-[#2b221e] bg-[#0c0908] py-2.5 pl-5 pr-28 text-xs text-[#f3ece7] placeholder-[#7a6f68] focus:border-[#c2a38e] focus:outline-none transition-colors"
            />
            <button
              type="submit"
              className="absolute right-1 flex items-center gap-1.5 rounded-full bg-[#c2a38e] px-4 py-1.5 text-xs font-semibold text-zinc-950 transition-all hover:bg-[#d4b5a0] shadow-sm"
            >
              <span>Submit</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </form>

          <p className="text-[11px] text-[#7a6f68]">
            © {new Date().getFullYear()} Dokkan. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
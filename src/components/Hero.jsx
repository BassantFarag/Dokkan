import React, { useState, useEffect, useRef } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { ShoppingBag, ArrowRight, Sparkles, Star, ShieldCheck, Tag, CreditCard } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function Hero() {
  const containerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);

 // initial value for mouse 
  const mouseX = useSpring(0, { stiffness: 120, damping: 14 });
  const mouseY = useSpring(0, { stiffness: 120, damping: 14 });

  const rotateY = useTransform(mouseX, [-1, 1], [-18, 18]);
  const rotateX = useTransform(mouseY, [-1, 1], [18, -18]);

  const tagX = useTransform(mouseX, [-1, 1], [25, -25]);
  const tagY = useTransform(mouseY, [-1, 1], [25, -25]);

  const visaX = useTransform(mouseX, [-1, 1], [-25, 25]);
  const visaY = useTransform(mouseY, [-1, 1], [-25, 25]);

  const pupilX = useTransform(mouseX, [-1, 1], [-14, 14]);
  const pupilY = useTransform(mouseY, [-1, 1], [-14, 14]);

  // for auto blink
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 200);
    }, 4500);
    return () => clearInterval(blinkInterval);
  }, []);


  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();

    const x = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const y = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);

    mouseX.set(Math.max(-1, Math.min(1, x)));
    mouseY.set(Math.max(-1, Math.min(1, y)));
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="relative w-full min-h-[calc(100vh-80px)] flex items-center justify-center overflow-hidden text-brand-primary px-6 py-22 md:py-32 
                 bg-[linear-gradient(135deg,#f7efe7_0%,#f0ddd0_45%,#493C31_100%)] dark:bg-[linear-gradient(135deg,#15130f_0%,#1c1815_45%,#0d0b09_100%)]
                 transition-colors duration-500 md:pl-14"
    >
   
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-brand-gold/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-brand-gold/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="mx-auto max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center relative z-10">

       
        <div className="space-y-7 text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-card border border-brand-border text-brand-gold text-xs font-semibold shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>Blink and You'll Order</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.15]"
          >
            Elevate Your Style With{" "}
            <span className="bg-gradient-to-r from-brand-gold via-[#d4b5a0] to-brand-primary bg-clip-text text-transparent">
              Dokkan
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm md:text-base text-brand-secondary max-w-lg leading-relaxed"
          >
          Curated items so good, even your bank account will forgive you. Discover luxury pieces, smooth-as-butter shopping, and delivery so fast it feels like magic.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center gap-4 pt-2"
          >
            <NavLink
              to="/shop"
              className="group relative inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-transparent text-brand-primary  font-bold text-sm   transition-all duration-300"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </NavLink>

            <NavLink
              to="/carts"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-brand-border bg-brand-card/50 text-brand-primary text-sm font-semibold hover:bg-brand-card transition-colors duration-300"
            >
              <ShoppingBag className="w-4 h-4 text-brand-gold" />
              <span>View Cart</span>
            </NavLink>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="pt-6 border-t border-brand-border/60 flex items-center gap-6 text-xs text-brand-secondary"
          >
          
          </motion.div>
        </div>

     
        <div className="relative flex flex-col justify-center items-center perspective-1000 py-10">
          <motion.div
            style={{
              rotateX,
              rotateY,
            }}
            className="relative"
          >
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-36 h-5 bg-black/30 dark:bg-black/50 rounded-full blur-md" />

        
            <motion.div
              style={{ x: tagX, y: tagY }}
              className="absolute -top-8 -left-14 z-20 bg-brand-card border border-brand-gold/30 rounded-2xl p-2.5 shadow-xl flex items-center gap-2"
            >
              <Tag className="w-4 h-4 text-brand-gold" />
              <span className="text-[10px] font-bold text-brand-primary">HOT DEALS 50%</span>
            </motion.div>

            <motion.div
              style={{ x: visaX, y: visaY }}
              className="absolute -bottom-4 -right-14 z-20 bg-gradient-to-r from-brand-gold to-[#897360] text-brand-main rounded-2xl p-2.5 shadow-xl flex items-center gap-2 font-bold"
            >
              <CreditCard className="w-4 h-4" />
              <span className="text-[10px]">VIP MEMBER</span>
            </motion.div>

        
            <motion.div
              animate={{
                y: isHovered ? [0, -8, 0] : [0, -4, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 3,
                ease: "easeInOut",
              }}
              className="relative w-44 h-48 sm:w-52 sm:h-56 rounded-b-3xl rounded-t-xl bg-gradient-to-br from-[#A59487] via-[#a0846c] to-[#2a211c] p-1 shadow-[inset_-10px_-10px_20px_rgba(0,0,0,0.5),inset_10px_10px_20px_rgba(255,255,255,0.3),0_20px_40px_rgba(0,0,0,0.4)] flex flex-col items-center justify-center gap-3"
            >
          
              <div className="absolute -top-10 w-20 h-14 border-4 border-brand-gold rounded-t-full shadow-md" />

          
              <div className="flex gap-6 relative z-10 pt-4">
                <div className="relative w-11 h-13 sm:w-12 sm:h-14 rounded-full bg-white shadow-[inset_0_3px_6px_rgba(0,0,0,0.3)] flex items-center justify-center overflow-hidden">
                  <motion.div
                    animate={{ scaleY: isBlinking ? 1 : 0 }}
                    className="absolute inset-0 bg-[#897360] z-20 origin-top"
                  />
                  <motion.div
                    style={{ x: pupilX, y: pupilY }}
                    className="w-6 h-7 rounded-full bg-[#120e0c] relative flex items-center justify-center"
                  >
                    <span className="absolute top-1 left-1 w-2 h-2 rounded-full bg-white" />
                  </motion.div>
                </div>

                <div className="relative w-11 h-13 sm:w-12 sm:h-14 rounded-full bg-white shadow-[inset_0_3px_6px_rgba(0,0,0,0.3)] flex items-center justify-center overflow-hidden">
                  <motion.div
                    animate={{ scaleY: isBlinking ? 1 : 0 }}
                    className="absolute inset-0 bg-[#897360] z-20 origin-top"
                  />
                  <motion.div
                    style={{ x: pupilX, y: pupilY }}
                    className="w-6 h-7 rounded-full bg-[#120e0c] relative flex items-center justify-center"
                  >
                    <span className="absolute top-1 left-1 w-2 h-2 rounded-full bg-white" />
                  </motion.div>
                </div>
              </div>

              <div className="relative z-10 text-center">
                <span className="text-[11px] font-black tracking-widest text-[#120e0c] uppercase opacity-80">
                  DOKKAN
                </span>
              </div>
            </motion.div>
          </motion.div>

          
        </div>
      </div>
    </section>
  );
}

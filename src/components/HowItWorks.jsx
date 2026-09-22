import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Search, ShoppingCart, Truck, Sparkles } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Browse Products",
    description: "Explore our wide range of premium products.",
  },
  {
    number: "02",
    icon: ShoppingCart,
    title: "Add to Cart",
    description: "Select your favorites and add them to your cart.",
  },
  {
    number: "03",
    icon: Truck,
    title: "Order & Receive",
    description: "Place your order and get it delivered to your doorstep.",
  },
];

export default function HowItWorks() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 70%", "end 50%"],
  });


  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const truckX = useTransform(scrollYProgress, [0, 1], ["16%", "84%"]);

  return (
    <section ref={sectionRef} className="relative overflow-hidden py-28">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#BAAB9A]/25 blur-[140px] dark:bg-[#BAAB9A]/15" />

      <div className="relative mx-auto max-w-7xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#BAAB9A]/40 bg-[#EDD4C1]/50 px-4 py-1.5 text-xs font-semibold text-[#5C422B] shadow-[0_0_15px_rgba(186,171,154,0.3)] backdrop-blur-md dark:border-[#BAAB9A]/30 dark:bg-[#1C1713]/80 dark:text-[#BAAB9A]"
        >
          <Sparkles className="h-3.5 w-3.5 text-[#5C422B] dark:text-[#BAAB9A]" />
          <span>Three Easy Steps</span>
        </motion.div>

    
        <h2 className="text-3xl font-extrabold text-[#1C1713] md:text-5xl dark:text-[#EBE8E5]">
          How It <span className="text-[#5C422B] dark:text-[#BAAB9A]">Works</span>
        </h2>
        <p className="mt-3 text-base text-[#645C4C] dark:text-[#8D837D]">
          Simple steps to get your items quickly and smoothly
        </p>

        <div className="relative mt-24 grid grid-cols-1 gap-y-20 md:grid-cols-3 md:gap-x-8">
          
         
          <div className="pointer-events-none absolute -top-12 left-0 z-20 hidden w-full md:block">
            
           {/* doted  line */}
            <svg
              className="w-full overflow-visible"
              height="8"
              viewBox="0 0 100 1"
              preserveAspectRatio="none"
            >
             
              <line
                x1="16" y1="0.5" x2="84" y2="0.5"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeDasharray="2 2"
                className="text-[#8D837D]/30 dark:text-[#8D837D]/40"
              />
            
              <motion.line
                x1="16" y1="0.5" x2="84" y2="0.5"
                stroke="currentColor"
                strokeWidth="2"
                className="text-[#5C422B] drop-shadow-[0_0_8px_rgba(92,66,43,0.8)] dark:text-[#BAAB9A] dark:drop-shadow-[0_0_10px_rgba(186,171,154,0.9)]"
                style={{ pathLength }}
              />
            </svg>

            <motion.div
              style={{ left: truckX }}
              className="absolute -top-6 -translate-x-1/2"
            >
              <motion.div
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
                className="relative flex items-center justify-center"
              >
                
                <span className="absolute -bottom-2 h-5 w-14 rounded-full bg-[#BAAB9A] blur-md opacity-80 dark:bg-[#BAAB9A] dark:blur-lg" />

                
                <div className="flex items-center gap-1.5 rounded-2xl border border-[#BAAB9A] bg-[#EBE8E5] px-4 py-2 text-[#5C422B] shadow-[0_0_20px_rgba(186,171,154,0.6)] backdrop-blur-xl dark:border-[#BAAB9A] dark:bg-[#1C1713] dark:text-[#BAAB9A] dark:shadow-[0_0_25px_rgba(186,171,154,0.5)]">
                  <Truck className="h-6 w-6 animate-pulse text-[#5C422B] dark:text-[#BAAB9A]" />
                  <span className="text-[11px] font-extrabold tracking-wide uppercase">Delivering...</span>
                </div>
              </motion.div>
            </motion.div>
          </div>

         
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                whileHover={{ y: -8 }}
                className="group mt-4 relative z-10 flex flex-col items-center rounded-3xl border border-[#8D837D]/20 bg-[#EBE8E5]/40 p-8 backdrop-blur-xl shadow-lg transition-all duration-300 hover:border-[#BAAB9A]/60 hover:bg-[#EBE8E5]/70 hover:shadow-[0_0_30px_rgba(186,171,154,0.2)] dark:border-[#8D837D]/20 dark:bg-[#1C1713]/40 dark:hover:border-[#BAAB9A]/60 dark:hover:bg-[#1C1713]/70 dark:hover:shadow-[0_0_30px_rgba(186,171,154,0.15)]"
              >
                <span className="pointer-events-none absolute top-4 right-5 text-4xl font-black text-[#645C4C]/15 transition-colors group-hover:text-[#5C422B]/25 select-none dark:text-[#8D837D]/20 dark:group-hover:text-[#BAAB9A]/30">
                  {step.number}
                </span>

                <motion.div
                  whileHover={{ rotate: [0, -8, 8, 0] }}
                  transition={{ duration: 0.5 }}
                  className="relative -mt-16 mb-4 flex h-20 w-20 items-center justify-center rounded-2xl border border-[#5C422B]/20 bg-[#EDD4C1]/80 text-[#5C422B] shadow-md backdrop-blur-md transition-all group-hover:border-[#BAAB9A] group-hover:shadow-[0_0_20px_rgba(186,171,154,0.5)] dark:border-[#BAAB9A]/30 dark:bg-[#3D342B]/80 dark:text-[#BAAB9A] dark:group-hover:border-[#BAAB9A]"
                >
                  <Icon className="h-8 w-8" />
                  <span className="absolute inset-0 -z-10 rounded-2xl bg-[#BAAB9A]/40 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100" />
                </motion.div>

                <h3 className="mt-2 text-lg font-bold text-[#1C1713] dark:text-[#EBE8E5]">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#645C4C] dark:text-[#8D837D]">
                  {step.description}
                </p>
              </motion.div>
            );
          })}

        </div>
      </div>
    </section>
  );
}
import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Truck, RefreshCw, Headset, ArrowRight, Sparkles } from "lucide-react";

export default function PromoBanner() {
  const features = [
    {
      icon: Truck,
      title: "Fast Delivery",
      desc: "Shipping across all governorates",
    },
    {
      icon: ShieldCheck,
      title: "100% Authentic",
      desc: "Guaranteed quality products",
    },
    {
      icon: RefreshCw,
      title: "Easy Returns",
      desc: "Hassle-free 14-day policy",
    },
    {
      icon: Headset,
      title: "24/7 Support",
      desc: "Dedicated customer service",
    },
  ];

  return (
    <section className="relative w-full py-12 px-6">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* 1. Value Features Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 rounded-[28px] border border-[#8D837D]/20 bg-[#EBE8E5]/40 p-8 backdrop-blur-md dark:border-[#8D837D]/25 dark:bg-[#1C1713]/60">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div key={idx} className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#EDD4C1]/60 text-[#5C422B] dark:bg-[#3D342B] dark:text-[#BAAB9A]">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#1C1713] dark:text-[#EBE8E5]">
                    {feature.title}
                  </h4>
                  <p className="text-xs text-[#8D837D] mt-0.5">
                    {feature.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* 2. Limited Time Offer Callout */}
        <div className="relative overflow-hidden rounded-[32px] border border-[#BAAB9A]/30 bg-gradient-to-r from-[#3D342B] via-[#2A221B] to-[#1C1713] p-8 md:p-12 text-[#EBE8E5] shadow-2xl">
          <div className="absolute -right-10 -top-10 h-60 w-60 rounded-full bg-[#BAAB9A]/10 blur-3xl" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
            <div className="space-y-3 max-w-xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#BAAB9A]/40 bg-[#BAAB9A]/10 px-3 py-1 text-xs font-semibold text-[#BAAB9A]">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Special Promotion</span>
              </div>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-[#EBE8E5]">
                Upgrade Your Lifestyle with Exclusive Collection
              </h3>
              <p className="text-xs sm:text-sm text-[#8D837D] leading-relaxed">
                Discover our handpicked premium items with special prices this week only.
              </p>
            </div>

            <Link
              to="/shop"
              className="inline-flex shrink-0 items-center gap-2.5 rounded-full bg-[#BAAB9A] px-7 py-3.5 text-xs font-bold text-[#1C1713] transition-all hover:bg-[#EDD4C1] hover:scale-105 shadow-lg"
            >
              <span>Explore Shop</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
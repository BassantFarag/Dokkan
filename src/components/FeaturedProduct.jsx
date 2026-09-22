import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { Sparkles, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

import "swiper/css";
import "swiper/css/navigation";

import { getAllProducts } from "../api/productApi";
import HomeProductCard from "./HomeProductCard";

export default function FeaturedProduct() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllProducts()
      .then((res) => {
        const allProducts = res.data.products || [];
       
        const inStockProducts = allProducts.filter((product) => product.stock > 0);
        
        setProducts(inStockProducts);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading products:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="py-16 text-center text-brand-secondary text-sm">
        Loading Featured Items...
      </div>
    );
  }

  return (
    <section className="relative w-full py-16 px-6 text-brand-primary transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 border-b border-brand-border/60 pb-6">
          <div className="space-y-2 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-card border border-brand-border text-brand-gold text-xs font-semibold shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Curated Selection</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Featured{" "}
              <span className="bg-gradient-to-r from-brand-gold via-[#d4b5a0] to-brand-primary bg-clip-text text-transparent">
                Products
              </span>
            </h2>
          </div>

         
          <div className="flex items-center gap-3">
            <Link
              to="/shop"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-gold hover:underline mr-2"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <button className="swiper-prev-btn p-2.5 rounded-full border border-brand-border bg-brand-card/60 text-brand-primary hover:border-brand-gold hover:text-brand-gold transition-colors shadow-sm">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="swiper-next-btn p-2.5 rounded-full border border-brand-border bg-brand-card/60 text-brand-primary hover:border-brand-gold hover:text-brand-gold transition-colors shadow-sm">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Swiper Carousel */}
        <Swiper
          modules={[Navigation, Autoplay]}
          navigation={{
            prevEl: ".swiper-prev-btn",
            nextEl: ".swiper-next-btn",
          }}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          spaceBetween={20}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
          }}
          className="w-full"
        >
          {products.map((product) => (
            <SwiperSlide key={product._id}>
              <HomeProductCard product={product} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
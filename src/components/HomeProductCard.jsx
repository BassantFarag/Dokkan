import React from "react";
import { Heart, Star, ShoppingBag, ImageOff } from "lucide-react";
import { Link } from "react-router-dom";

export default function HomeProductCard({ product }) {
  const discountPercentage = product?.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <div className="group relative w-full flex flex-col justify-between rounded-[28px] border p-3 transition-all duration-300 shadow-md hover:shadow-xl border-[#8D837D]/20 bg-[#EBE8E5]/50 backdrop-blur-md dark:border-[#8D837D]/25 dark:bg-[#1C1713]/70">
      <div>
        {/* Images Container */}
        <div className="relative mb-3 flex h-52 w-full items-center justify-center overflow-hidden rounded-[22px] bg-[#EDD4C1]/40 dark:bg-[#3D342B]/40">
          {product?.images?.[0]?.url ? (
            <img 
              src={product.images[0].url} 
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex flex-col items-center justify-center gap-1.5 text-[#645C4C] dark:text-[#8D837D]">
              <ImageOff className="h-8 w-8 opacity-70" />
              <span className="text-[11px] font-medium tracking-wider uppercase">
                No Image
              </span>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
            <span className="rounded-full bg-[#1C1713]/60 px-2.5 py-1 text-[10px] font-medium text-[#EBE8E5] backdrop-blur-md dark:bg-[#EBE8E5]/20 dark:text-[#EBE8E5]">
              {product?.category}
            </span>
            {discountPercentage > 0 && (
              <span className="rounded-full bg-[#5C422B] px-2 py-0.5 text-[10px] font-bold text-[#EBE8E5] shadow-sm dark:bg-[#BAAB9A] dark:text-[#1C1713]">
                -{discountPercentage}%
              </span>
            )}
          </div>

          {/* Favorite Button */}
          <button className="absolute top-2 right-2 z-10 rounded-full bg-[#1C1713]/40 p-2 text-[#EBE8E5] backdrop-blur-md transition-colors hover:bg-[#5C422B] dark:bg-[#EBE8E5]/20 dark:hover:bg-[#BAAB9A] dark:hover:text-[#1C1713]">
            <Heart className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Product Details */}
        <div className="space-y-1 px-1 text-left">
          <Link to={`/products/${product?._id}`}>
            <h3 className="line-clamp-1 text-base font-semibold text-[#1C1713] transition-colors hover:text-[#5C422B] dark:text-[#EBE8E5] dark:hover:text-[#BAAB9A]">
              {product?.name}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.floor(product?.averageRating || 0)
                      ? "fill-[#5C422B] text-[#5C422B] dark:fill-[#BAAB9A] dark:text-[#BAAB9A]"
                      : "text-[#8D837D]/40"
                  }`}
                />
              ))}
            </div>
            <span className="text-[10px] text-[#645C4C] dark:text-[#8D837D]">
              ({product?.numReviews || 0})
            </span>
          </div>
        </div>
      </div>

      {/* Footer: Price and Cart Button */}
      <div className="mt-3 flex items-center justify-between border-t border-[#8D837D]/20 pt-3 px-1 dark:border-[#8D837D]/20">
        <div className="flex items-baseline gap-1.5">
          <span className="text-base font-bold text-[#5C422B] dark:text-[#BAAB9A]">
            EGP {product?.discountPrice || product?.price}
          </span>
          {product?.discountPrice && (
            <span className="text-[11px] text-[#645C4C] line-through opacity-70 dark:text-[#8D837D]">
              EGP {product?.price}
            </span>
          )}
        </div>

        <button className="rounded-full bg-[#5C422B] p-2.5 text-[#EBE8E5] shadow-md transition-all hover:bg-[#3D342B] hover:shadow-lg dark:bg-[#BAAB9A] dark:text-[#1C1713] dark:hover:bg-[#EDD4C1]">
          <ShoppingBag className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
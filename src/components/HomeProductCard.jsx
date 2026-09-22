import React, { useState, useEffect } from "react";
import { Heart, Star, ShoppingBag, ImageOff } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { AddItemToCard } from "../api/cartsApi";
import { addToWishlist, removeFromWishlist, getMyWishlist } from "../api/wishlistApi";

export default function HomeProductCard({ product }) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loadingCart, setLoadingCart] = useState(false);
  const [loadingWishlist, setLoadingWishlist] = useState(false);

  const discountPercentage = product?.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const productId = product?._id || product?.id;
  const isOutOfStock = product?.stock <= 0;

    useEffect(() => {
    let isMounted = true;
    const checkWishlistStatus = async () => {
      try {
        const response = await getMyWishlist();
        
        const wishlistProducts = 
          response?.wishlist?.products || 
          response?.data?.wishlist?.products || 
          response?.data?.products || 
          response?.products || 
          [];

        if (Array.isArray(wishlistProducts) && isMounted) {
          const exists = wishlistProducts.some((item) => {
            const itemId = item?._id || item?.id || item;
            return String(itemId) === String(productId);
          });
          setIsWishlisted(exists);
        }
      } catch (error) {
      }
    };

    if (productId) {
      checkWishlistStatus();
    }

    return () => {
      isMounted = false;
    };
  }, [productId]);

  const handleWishlistClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (loadingWishlist) return;

    try {
      setLoadingWishlist(true);

      if (isWishlisted) {
        setIsWishlisted(false);
        await removeFromWishlist(productId);
        toast.info("Removed from wishlist");
      } else {
        setIsWishlisted(true);
        await addToWishlist(productId);
        toast.success("Added to wishlist successfully!");
      }
    } catch (error) {
      setIsWishlisted(!isWishlisted);
      toast.error(error.response?.data?.message || "Failed to update wishlist");
    } finally {
      setLoadingWishlist(false);
    }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isOutOfStock) return;

    try {
      setLoadingCart(true);
      await AddItemToCard({ productId: productId, quantity: 1 });
      toast.success("Product added to cart successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add to cart");
    } finally {
      setLoadingCart(false);
    }
  };

  return (
    <div className="group relative w-full flex flex-col justify-between rounded-[28px] border p-3 transition-all duration-300 shadow-md hover:shadow-xl border-[#8D837D]/20 bg-[#EBE8E5]/50 backdrop-blur-md dark:border-[#8D837D]/25 dark:bg-[#1C1713]/70">
      <div>
        {/* Images Container */}
        <div className="relative mb-3 flex h-52 w-full items-center justify-center overflow-hidden rounded-[22px] bg-[#EDD4C1]/40 dark:bg-[#3D342B]/40">
          {product?.images?.[0]?.url || product?.image ? (
            <img
              src={product?.images?.[0]?.url || product?.image}
              alt={product?.name || "Product"}
              className={`h-full w-full object-cover transition-transform duration-500 ${
                isOutOfStock ? "blur-sm grayscale" : "group-hover:scale-105"
              }`}
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

          {/*Wishlist*/}
          <button
            type="button"
            onClick={handleWishlistClick}
            disabled={loadingWishlist}
            className={`absolute top-2 right-2 z-10 rounded-full p-2 backdrop-blur-md transition-colors shadow-sm disabled:opacity-50 ${
              isWishlisted
                ? "bg-[#5C422B] text-[#EBE8E5] dark:bg-[#BAAB9A] dark:text-[#1C1713]"
                : "bg-[#1C1713]/40 text-[#EBE8E5] hover:bg-[#5C422B] dark:bg-[#EBE8E5]/20 dark:hover:bg-[#BAAB9A] dark:hover:text-[#1C1713]"
            }`}
            aria-label="Wishlist"
          >
            <Heart className={`h-3.5 w-3.5 ${isWishlisted ? "fill-current" : ""}`} />
          </button>

          {isOutOfStock && (
            <div className="absolute inset-0 z-[5] flex items-center justify-center bg-black/30">
              <span className="rounded-full bg-red-600/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-1 px-1 text-left">
          <Link to={`/products/${productId}`}>
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

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={loadingCart || isOutOfStock}
          className="rounded-full bg-[#5C422B] p-2.5 text-[#EBE8E5] shadow-md transition-all hover:bg-[#3D342B] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[#BAAB9A] dark:text-[#1C1713] dark:hover:bg-[#EDD4C1]"
          aria-label="Add to cart"
        >
          <ShoppingBag className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
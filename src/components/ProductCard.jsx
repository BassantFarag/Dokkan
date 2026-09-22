import { Heart, ShoppingCart, Star, ImageOff } from "lucide-react";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { AddItemToCard } from "../api/cartsApi";
import { addToWishlist, removeFromWishlist, getMyWishlist } from "../api/wishlistApi";

export const ProductCard = ({ product }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loadingWishlist, setLoadingWishlist] = useState(false);

  const productId = product?._id || product?.id;

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

  const handleAddToCart = async () => {
    try {
      await AddItemToCard({
        productId: productId,
        quantity: 1,
      });

      toast.success("Product added to cart");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to add product to cart",
      );
    }
  };

  const handleToggleWishlist = async () => {
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
        toast.success("Product added to wishlist");
      }
    } catch (error) {
      console.error(error);
      setIsWishlisted(!isWishlisted); 
      toast.error(
        error.response?.data?.message || "Failed to update wishlist",
      );
    } finally {
      setLoadingWishlist(false);
    }
  };

  if (!product) return null;

  const rating = Math.round(product.averageRating || 0);

  return (
    <div className="w-full min-w-0 bg-brand-card border border-brand-border rounded-xl sm:rounded-2xl shadow-sm p-2.5 sm:p-3 md:p-4 flex flex-col gap-2 sm:gap-2.5 relative text-brand-primary overflow-hidden">
      <div className="flex items-center justify-between gap-1.5 w-full min-w-0">
        <span className="px-2 sm:px-2.5 md:px-3 py-0.5 text-[9px] sm:text-[10px] md:text-xs font-medium bg-brand-main text-brand-secondary rounded-full truncate max-w-[50%]">
          {product.category || "Product"}
        </span>

        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          <span className="px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] md:text-xs font-semibold bg-brand-gold/20 text-brand-gold rounded-full whitespace-nowrap">
            {product.price && product.discountPrice
              ? -Math.round(
                  ((product.price - product.discountPrice) / product.price) *
                    100,
                )
              : 0}
            %
          </span>
          <button
            type="button"
            onClick={handleToggleWishlist}
            disabled={loadingWishlist}
            aria-label="Add to wishlist"
            className="p-1 sm:p-1.5 rounded-full bg-brand-main border border-brand-border shadow-sm hover:text-brand-gold transition-colors shrink-0 disabled:opacity-50"
          >
            <Heart
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                isWishlisted
                  ? "fill-brand-gold text-brand-gold"
                  : "text-brand-secondary"
              }`}
            />
          </button>
        </div>
      </div>

      <div className="w-full aspect-square sm:aspect-[4/3] rounded-lg sm:rounded-xl overflow-hidden bg-brand-main flex items-center justify-center">
        {product.images?.[0]?.url ? (
          <img
            src={product.images[0].url}
            alt={product.name || "Product"}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="flex flex-col items-center justify-center gap-1 text-brand-secondary">
            <ImageOff className="w-6 h-6 sm:w-8 sm:h-8 text-brand-secondary/60" />

            <span className="text-[9px] sm:text-[10px] font-medium">
              No Image
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1 min-w-0">
        <h3 className="text-xs sm:text-sm md:text-base font-semibold text-brand-primary pt-1 sm:pt-2 line-clamp-2 min-h-8 sm:min-h-10 leading-5">
          {product.name || "Unnamed Product"}
        </h3>

        <div className="flex items-center gap-1 pt-1 sm:pt-2 min-w-0">
          <div className="flex items-center gap-0.5 shrink-0">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${
                  star <= rating
                    ? "fill-brand-gold text-brand-gold"
                    : "text-brand-border"
                }`}
              />
            ))}
          </div>

          <span className="text-[9px] sm:text-[10px] text-brand-secondary truncate">
            ({product.numReviews || 0})
          </span>
        </div>

        <div className="flex flex-wrap items-baseline gap-1 sm:gap-1.5 md:gap-2 pt-2 sm:pt-4">
          <span className="text-base sm:text-lg md:text-xl font-bold text-brand-gold truncate">
            EGP {(product.discountPrice || product.price)?.toLocaleString()}
          </span>

          {product.discountPrice && (
            <span className="text-[10px] sm:text-xs md:text-sm text-brand-secondary line-through truncate">
              EGP {product.price?.toLocaleString()}
            </span>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={handleAddToCart}
        className="w-full py-2 sm:py-2.5 md:py-3 mt-1 bg-brand-gold hover:bg-brand-gold-hover text-brand-main font-medium rounded-lg sm:rounded-xl flex items-center justify-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs md:text-sm transition-colors shadow-sm"
      >
        <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        <span>Add to Cart</span>
      </button>
    </div>
  );
};

export default ProductCard;
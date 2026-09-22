import { Heart, ShoppingCart, Star, ImageOff, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { AddItemToCard, getMyCart, removeItemFromCart } from "../api/cartsApi";
import { useNavigate } from "react-router-dom";
import { addToWishlist, removeFromWishlist, getMyWishlist } from "../api/wishlistApi";

export const ProductCard = ({ product }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loadingWishlist, setLoadingWishlist] = useState(false);

  const [isInCart, setIsInCart] = useState(false);
  const [loadingCart, setLoadingCart] = useState(false);

  const navigate = useNavigate();
  const productId = product?._id || product?.id;

  useEffect(() => {
    let isMounted = true;

    const fetchUserData = async () => {
      if (!productId) return;

      try {
        const [wishlistRes, cartRes] = await Promise.allSettled([
          getMyWishlist(),
          getMyCart(),
        ]);

        if (wishlistRes.status === "fulfilled" && isMounted) {
          const response = wishlistRes.value;
          const wishlistData =
            response?.data?.wishlist || response?.wishlist || response?.data;
          const products = wishlistData?.products || [];

          const exists = products.some((item) => {
            const itemId = item?._id || item?.id || item;
            return String(itemId) === String(productId);
          });
          setIsWishlisted(exists);
        }

        if (cartRes.status === "fulfilled" && isMounted) {
          const cartData = cartRes.value;
          const data = cartData?.data ?? cartData?.cart ?? cartData;
          const cartItems = data?.items ?? [];

          const existsInCart = cartItems.some((item) => {
            const itemProdId =
              item?.productId ||
              (typeof item?.product === "string"
                ? item?.product
                : item?.product?._id) ||
              item?.product?.id ||
              item?._id ||
              item?.id;
            return String(itemProdId) === String(productId);
          });

          setIsInCart(existsInCart);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();

    return () => {
      isMounted = false;
    };
  }, [productId]);

  const isOutOfStock = product?.stock <= 0;

  const handleCartAction = async (e) => {
    e.stopPropagation();
    if (isOutOfStock || loadingCart) return;

    try {
      setLoadingCart(true);

      if (isInCart) {
        await removeItemFromCart(productId);
        setIsInCart(false);
        toast.info("Removed from cart");
      } else {
        await AddItemToCard({
          productId: productId,
          quantity: 1,
        });
        setIsInCart(true);
        toast.success("Product added to cart successfully!");
      }
    } catch (error) {
      console.error("Cart toggle error:", error);
      if (error.response?.status === 401) {
        toast.error("Please login first");
        navigate("/login");
        return;
      }
      toast.error(error.response?.data?.message || "Failed to update cart");
    } finally {
      setLoadingCart(false);
    }
  };

  const handleToggleWishlist = async (e) => {
    e.stopPropagation();
    if (loadingWishlist) return;

    try {
      setLoadingWishlist(true);
      if (isWishlisted) {
        await removeFromWishlist(productId);
        setIsWishlisted(false);
        toast.info("Removed from wishlist");
      } else {
        await addToWishlist(productId);
        setIsWishlisted(true);
        toast.success("Product added to wishlist");
      }
    } catch (error) {
      console.error("Wishlist toggle error:", error);
      toast.error(error.response?.data?.message || "Failed to update wishlist");
    } finally {
      setLoadingWishlist(false);
    }
  };

  const handleCardClick = () => {
    if (productId) {
      navigate(`/products/${productId}`);
    }
  };

  if (!product) return null;

  const rating = Math.round(product.averageRating || 0);

  return (
    <div
      onClick={handleCardClick}
      className="w-full min-w-0 bg-brand-card border border-brand-border rounded-xl sm:rounded-2xl shadow-sm p-2.5 sm:p-3 md:p-4 flex flex-col gap-2 sm:gap-2.5 relative text-brand-primary overflow-hidden cursor-pointer"
    >
      <div className="flex items-center justify-between gap-1.5 w-full min-w-0">
        <span className="px-2 sm:px-2.5 md:px-3 py-0.5 text-[9px] sm:text-[10px] md:text-xs font-medium bg-brand-main text-brand-secondary rounded-full truncate max-w-[50%]">
          {product.category || "Product"}
        </span>

        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          <span className="px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] md:text-xs font-semibold bg-brand-gold/20 text-brand-gold rounded-full whitespace-nowrap">
            {product.price && product.discountPrice
              ? -Math.round(
                  ((product.price - product.discountPrice) / product.price) *
                    100
                )
              : 0}
            %
          </span>
          <button
            type="button"
            onClick={handleToggleWishlist}
            disabled={loadingWishlist}
            aria-label="Toggle wishlist"
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

      <div className="relative w-full aspect-square sm:aspect-[4/3] rounded-lg sm:rounded-xl overflow-hidden bg-brand-main flex items-center justify-center">
        {product.images?.[0]?.url ? (
          <img
            src={product.images[0].url}
            alt={product.name || "Product"}
            className={`w-full h-full object-cover transition-transform duration-300 ${
              isOutOfStock ? "blur-sm grayscale" : "hover:scale-105"
            }`}
          />
        ) : (
          <div className="flex flex-col items-center justify-center gap-1 text-brand-secondary">
            <ImageOff className="w-6 h-6 sm:w-8 sm:h-8 text-brand-secondary/60" />
            <span className="text-[9px] sm:text-[10px] font-medium">
              No Image
            </span>
          </div>
        )}

        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <span className="px-3 py-1 text-[10px] sm:text-xs font-bold tracking-wide uppercase bg-red-600/90 text-white rounded-full shadow-sm">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1 min-w-0">
        <h3 className="text-xs sm:text-sm md:text-base font-semibold text-brand-primary pt-1 sm:pt-2 line-clamp-2 min-h-8 sm:min-h-10 leading-5">
          {product.name || "Unnamed Product"}
        </h3>

        <div className="flex items-center gap-1 pt-1 sm:pt-2 min-w-0">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${
                star <= rating
                  ? "fill-brand-gold text-brand-gold"
                  : "text-stone-400 fill-stone-200 dark:text-stone-500 dark:fill-stone-800"
              }`}
            />
          ))}

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
        onClick={handleCartAction}
        disabled={isOutOfStock || loadingCart}
        className={`w-full py-2 sm:py-2.5 md:py-3 mt-1 font-medium rounded-lg sm:rounded-xl flex items-center justify-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs md:text-sm transition-colors shadow-sm disabled:opacity-50 cursor-pointer ${
          isOutOfStock
            ? "bg-brand-border text-brand-secondary cursor-not-allowed opacity-60"
            : isInCart
            ? "bg-brand-card border border-brand-border text-brand-primary hover:bg-brand-card-hover"
            : "bg-brand-gold hover:bg-brand-gold-hover text-brand-main"
        }`}
      >
        {loadingCart ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : isOutOfStock ? (
          <span>Out of Stock</span>
        ) : isInCart ? (
          <>
            <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-secondary" />
            <span>Remove from Cart</span>
          </>
        ) : (
          <>
            <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Add to Cart</span>
          </>
        )}
      </button>
    </div>
  );
};

export default ProductCard;
import { Heart, ShoppingCart, Star, ImageOff ,Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { useState , useEffect } from "react";
import { getMyCart, AddItemToCard, removeItemFromCart } from "../api/cartsApi";
import { addToWishlist } from "../api/wishlistApi";

export const ProductCard = ({ product }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
useEffect(() => {
  const checkCart = async () => {
    try {
      const response = await getMyCart();

      const cartItems = response.data?.items || [];

      const exists = cartItems.some(
        (item) => item.productId === product._id || item.product?._id === product._id
      );

      setIsInCart(exists);
    } catch (error) {
      console.error("Failed to check cart:", error);
    }
  };

  if (product?._id) {
    checkCart();
  }
}, [product?._id]);
const handleCart = async () => {
  try {
    if (isInCart) {
      await  removeItemFromCart (product._id);

      setIsInCart(false);
      toast.success("Product removed from cart");
    } else {
      await AddItemToCard({
        productId: product._id,
        quantity: 1,
      });

      setIsInCart(true);
      toast.success("Product added to cart");
    }
  } catch (error) {
    toast.error(
      error.response?.data?.message || "Failed to update cart",
    );
  }
};

  const handleAddToWishlist = async () => {
    try {
      ShoppingCart.style.span.textContent = "removing";
      await addToWishlist(product._id);

      setIsWishlisted(true);

      toast.success("Product added to wishlist");
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message || "Failed to add product to wishlist",
      );
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
            onClick={handleAddToWishlist}
            aria-label="Add to wishlist"
            className="p-1 sm:p-1.5 rounded-full bg-brand-main border border-brand-border shadow-sm hover:text-brand-gold transition-colors shrink-0"
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
  onClick={handleCart}
  className={`w-full py-2 sm:py-2.5 md:py-3 mt-1 font-medium rounded-lg sm:rounded-xl flex items-center justify-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs md:text-sm transition-colors shadow-sm ${
    isInCart
      ? "bg-gray-100 hover:bg-gray-200 text-gray-600"
      : "bg-brand-gold hover:bg-brand-gold-hover text-brand-main"
  }`}
>
  {isInCart ? (
    <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
  ) : (
    <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
  )}

  <span>{isInCart ? "Remove" : "Add to Cart"}</span>
</button>
    </div>
  );
};

export default ProductCard;

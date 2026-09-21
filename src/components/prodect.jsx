
import { Heart, ShoppingCart, Star } from "lucide-react";

const Product = ({ product }) => {
  if (!product) {
    return (
      <div className="w-full min-h-50 flex items-center justify-center text-brand-secondary">
        Loading...
      </div>
    );
  }

  const rating = Math.round(product.averageRating || 0);

  const image =
    product.images?.[0]?.url ||
    product.images?.[0] ||
    "";

  const discountPrice = product.discountPrice;
  const originalPrice = product.price;

  return (
    <div className="w-full min-w-0 bg-brand-card border border-brand-border rounded-xl sm:rounded-2xl shadow-sm p-2.5 sm:p-3 md:p-4 flex flex-col gap-2 sm:gap-2.5 relative text-brand-primary overflow-hidden transition-all duration-300 hover:shadow-md">

      <div className="flex items-center justify-between gap-1.5 sm:gap-2 w-full min-w-0">

        <span className="px-2 sm:px-2.5 md:px-3 py-0.5 text-[9px] sm:text-[10px] md:text-xs font-medium bg-brand-main text-brand-secondary rounded-full truncate max-w-[50%]">
          {product.category || "Product"}
        </span>

        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">

          <span className="px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] md:text-xs font-semibold bg-brand-gold/20 text-brand-gold rounded-full whitespace-nowrap">
            {product.stock ?? 0}
          </span>

          <button
            type="button"
            aria-label="Add to wishlist"
            className="p-1 sm:p-1.5 rounded-full bg-brand-main border border-brand-border shadow-sm text-brand-secondary hover:text-brand-gold transition-colors shrink-0"
          >
            <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

        </div>
      </div>

      <div className="w-full aspect-square rounded-lg sm:rounded-xl overflow-hidden bg-brand-main flex items-center justify-center">
        {image ? (
          <img
            src={image}
            alt={product.name || "Product"}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <span className="text-xs sm:text-sm text-brand-secondary">
            No Image
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1 min-w-0">

        <h3 className="text-xs sm:text-sm md:text-base font-semibold text-brand-primary pt-1 line-clamp-2 min-h-8 sm:min-h-10 leading-5">
          {product.name || "Unnamed Product"}
        </h3>

        <div className="flex items-center gap-1 pt-1 min-w-0">

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

          <span className="text-[9px] sm:text-[10px] md:text-xs text-brand-secondary truncate">
            ({product.numReviews || 0})
          </span>

        </div>

        <div className="flex flex-wrap items-baseline gap-1 sm:gap-1.5 md:gap-2 pt-2 sm:pt-3">

          {discountPrice ? (
            <>
              <span className="text-base sm:text-lg md:text-xl font-bold text-brand-gold truncate">
                {discountPrice}
              </span>

              <span className="text-[10px] sm:text-xs md:text-sm text-brand-secondary line-through truncate">
                {originalPrice}
              </span>
            </>
          ) : (
            <span className="text-base sm:text-lg md:text-xl font-bold text-brand-gold truncate">
              {originalPrice}
            </span>
          )}

        </div>
      </div>

      <button
        type="button"
        className="w-full py-2 sm:py-2.5 md:py-3 mt-1 bg-brand-gold hover:bg-brand-gold-hover text-brand-main font-medium rounded-lg sm:rounded-xl flex items-center justify-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs md:text-sm transition-colors shadow-sm"
      >
        <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        <span>Add to Cart</span>
      </button>

    </div>
  );
};

export default Product;

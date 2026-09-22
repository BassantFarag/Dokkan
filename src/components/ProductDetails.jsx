import { useEffect, useState } from "react";
import { Heart, Trash2, ShoppingCart, Loader2 } from "lucide-react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";

// استيراد Swiper والمكونات التابعة لها مع وحدة التمرير المصغر والتأثير الإبداعي
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Thumbs, FreeMode, EffectCreative } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";
import "swiper/css/free-mode";
import "swiper/css/effect-creative";

import {
  getMyWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../api/wishlistApi";

import { AddItemToCard, getMyCart, removeItemFromCart } from "../api/cartsApi";
import { getAllProducts, getSingleProduct } from "../api/productApi";

import {
  getProductReview,
  addReview,
  deleteReview,
} from "../api/ReviewsApi";

import Loading from "./Loading";

// مكون المنتجات المشابهة (Related Products)
const RelatedProducts = ({ currentProductId, categoryId }) => {
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartItemsIds, setCartItemsIds] = useState(new Set());
  const [cartLoading, setCartLoading] = useState(null);

  useEffect(() => {
    const fetchRelatedAndCart = async () => {
      try {
        setLoading(true);

        let products = [];
        try {
          const productsRes = await getAllProducts();
          const res = productsRes;
          products = res.data?.products || res.products || res.data || [];
        } catch (err) {
          console.error("Error fetching products:", err);
        }

        const filtered = products.filter((item) => {
          const itemId = item._id || item.id;
          return String(itemId) !== String(currentProductId);
        });
        setRelated(filtered.slice(0, 4));

        try {
          const cartRes = await getMyCart();
          const cartData = cartRes;
          const data = cartData?.data ?? {};
          const cartItems = data.items ?? [];

          const ids = new Set(
            cartItems.map((item) => {
              return item?.productId || (typeof item?.product === "string" ? item?.product : item?.product?._id) || item?._id || item?.id;
            }).filter(Boolean)
          );
          setCartItemsIds(ids);
        } catch (err) {
          console.error("Error fetching cart:", err);
        }

      } catch (error) {
        console.error("Error loading related products:", error);
      } finally {
        setLoading(false);
      }
    };

    if (currentProductId) {
      fetchRelatedAndCart();
    }
  }, [currentProductId, categoryId]);

  const handleToggleCart = async (product) => {
    const productId = product?._id || product?.id;
    if (!productId) return;

    const isInCart = cartItemsIds.has(productId);

    try {
      setCartLoading(productId);

      if (isInCart) {
        await removeItemFromCart(productId); 
        setCartItemsIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(productId);
          return newSet;
        });
        toast.info("Removed from cart");
      } else {
        await AddItemToCard({
          productId: productId,
          quantity: 1,
        });
        setCartItemsIds((prev) => new Set(prev).add(productId));
        toast.success("Product added to cart successfully!");
      }
    } catch (error) {
      console.error("Cart toggle error:", error);
      toast.error(error.response?.data?.message || "Failed to update cart");
    } finally {
      setCartLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Loading />
      </div>
    );
  }

  if (related.length === 0) return null;

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-semibold text-brand-primary mb-6">
        Related Products
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {related.map((item) => {
          let imageUrl = "";
          if (Array.isArray(item?.images) && item.images.length > 0) {
            const firstImg = item.images[0];
            imageUrl = typeof firstImg === "string" ? firstImg : firstImg?.url || "";
          } else if (typeof item?.images === "string") {
            imageUrl = item.images;
          } else {
            imageUrl = item?.image?.url || item?.image || "";
          }

          const itemId = item._id || item.id;
          const price = item.discountPrice || item.price;
          const isInCart = cartItemsIds.has(itemId);

          return (
            <div
              key={itemId}
              className="group relative flex flex-col justify-between rounded-2xl border border-brand-border bg-brand-card p-4 transition-all duration-300 hover:shadow-lg"
            >
              <div>
                <Link to={`/products/${itemId}`}>
                  <div className="relative mb-4 flex h-48 w-full items-center justify-center overflow-hidden rounded-xl bg-brand-card-hover">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={item.name || "Product"}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <span className="text-brand-secondary text-sm p-4 text-center">
                        {item.name || "Product"}
                      </span>
                    )}
                  </div>
                </Link>

                <Link to={`/products/${itemId}`}>
                  <h3 className="font-semibold text-brand-primary truncate hover:text-brand-gold transition">
                    {item.name}
                  </h3>
                </Link>

                <p className="text-brand-gold font-bold mt-2">
                  EGP {price}
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleToggleCart(item)}
                  disabled={cartLoading === itemId}
                  className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50 ${
                    isInCart
                      ? "bg-red-600/10 text-red-600 border border-red-600/30 hover:bg-red-600/20"
                      : "bg-brand-primary text-brand-main hover:bg-brand-gold-hover"
                  }`}
                >
                  {cartLoading === itemId ? (
                    <span>Adding...</span>
                  ) : (
                    <ShoppingCart size={14} />
                  )}
                  <span>{isInCart ? "Remove" : "Add to Cart"}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ProductDetails = () => {
  const navigate = useNavigate();
  const params = useParams();

  const id = params.id || params.productId;

  const [activeTab, setActiveTab] = useState("description");
  const [product, setProduct] = useState(null);

  const [pageLoading, setPageLoading] = useState(true);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);

  const [isFavorite, setIsFavorite] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);

  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  const [reviewComment, setReviewComment] = useState("");
  const [reviewRating, setReviewRating] = useState(0);

  const fetchReviews = async () => {
    if (!id) return;
    try {
      const response = await getProductReview(id);
      const reviewsData = response.data?.reviews || response.reviews || [];
      setReviews(reviewsData);
    } catch (error) {
      console.error("Reviews error:", error);
    }
  };

  useEffect(() => {
    const fetchPageData = async () => {
      if (!id) {
        setPageLoading(false);
        return;
      }

      try {
        setPageLoading(true);

        try {
          const productResponse = await getSingleProduct(id);
          const productData =
            productResponse.data?.product ||
            productResponse.product ||
            productResponse.data;
          setProduct(productData);
        } catch (err) {
          console.error("Failed to load product:", err);
        }

        try {
          const wishlistResponse = await getMyWishlist();
          const wishlistProducts =
            wishlistResponse.data?.wishlist?.products ||
            wishlistResponse.wishlist?.products ||
            wishlistResponse.data?.products ||
            wishlistResponse.products ||
            [];

          const productIsFavorite = wishlistProducts.some((item) => {
            const itemId = item?._id || item?.id || item;
            return String(itemId) === String(id);
          });
          setIsFavorite(productIsFavorite);
        } catch (err) {
          console.error("Failed to load wishlist:", err);
        }

        try {
          const reviewResponse = await getProductReview(id);
          const reviewsData =
            reviewResponse.data?.reviews ||
            reviewResponse.reviews ||
            [];
          setReviews(reviewsData);
        } catch (err) {
          console.error("Failed to load reviews:", err);
        }

      } catch (error) {
        console.error("Error loading product page:", error);
        toast.error("Failed to load product.");
      } finally {
        setPageLoading(false);
      }
    };

    fetchPageData();
  }, [id]);

  const handleWishlist = async () => {
    if (!product?._id || wishlistLoading) return;

    try {
      setWishlistLoading(true);

      if (isFavorite) {
        await removeFromWishlist(product._id);
        setIsFavorite(false);
        toast.success("Removed from wishlist 🤍");
      } else {
        await addToWishlist(product._id);
        setIsFavorite(true);
        toast.success("Added to wishlist ❤️");
      }
    } catch (error) {
      console.error("Wishlist error:", error);
      toast.error(
        error.response?.data?.message || "Something went wrong."
      );
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product?._id || cartLoading) return;

    try {
      setCartLoading(true);

      await AddItemToCard({
        productId: product._id,
        quantity: quantity,
      });

      toast.success("Product added to cart 🛒");
    } catch (error) {
      console.error("Add to cart error:", error);
      toast.error(
        error.response?.data?.message || "Failed to add product to cart."
      );
    } finally {
      setCartLoading(false);
    }
  };

  const increaseQuantity = () => {
    const stock = product?.stock || 100;
    if (quantity < stock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleSubmitReview = async () => {
    if (reviewRating === 0) {
      toast.warning("Please select a rating first.");
      return;
    }

    if (!reviewComment.trim()) {
      toast.warning("Please write your review.");
      return;
    }

    try {
      setReviewLoading(true);

      await addReview(id, {
        rating: reviewRating,
        comment: reviewComment,
      });

      toast.success("Review added successfully.");
      setReviewComment("");
      setReviewRating(0);
      await fetchReviews();
    } catch (error) {
      console.error("Add review error:", error);
      toast.error(
        error.response?.data?.message || "Failed to add review."
      );
    } finally {
      setReviewLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (deleteLoading) return;

    try {
      setDeleteLoading(reviewId);
      await deleteReview(id, reviewId);
      toast.success("Review deleted successfully.");
      await fetchReviews();
    } catch (error) {
      console.error("Delete review error:", error);
      toast.error(
        error.response?.data?.message || "Failed to delete review."
      );
    } finally {
      setDeleteLoading(null);
    }
  };

  let productImages = [];
  if (Array.isArray(product?.images)) {
    productImages = product.images.map((img) => 
      typeof img === "string" ? img : img?.url || ""
    ).filter(Boolean);
  } else if (typeof product?.images === "string") {
    productImages = [product.images];
  } else if (product?.image) {
    const singleImg = typeof product.image === "string" ? product.image : product.image?.url || "";
    if (singleImg) productImages = [singleImg];
  }

  // شاشة الـ Loading بدون إخفاء الهيدر
  if (pageLoading) {
    return (
      <div className="bg-brand-main min-h-screen text-brand-primary pt-28 pb-20 md:pt-32">
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loading />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-brand-main min-h-screen text-brand-primary pt-28 pb-20 md:pt-32">
      {/* تخصيص لون أسهم وسويبر السلايدر لتكون باللون البني */}
      <style>{`
        .custom-fan-slider .swiper-button-next,
        .custom-fan-slider .swiper-button-prev {
          color: #8B5A2B !important;
          background-color: rgba(255, 255, 255, 0.9);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
          transition: all 0.3s ease;
        }
        .custom-fan-slider .swiper-button-next:hover,
        .custom-fan-slider .swiper-button-prev:hover {
          background-color: #8B5A2B !important;
          color: #ffffff !important;
        }
        .custom-fan-slider .swiper-button-next::after,
        .custom-fan-slider .swiper-button-prev::after {
          font-size: 16px;
          font-weight: bold;
        }
        .custom-fan-slider .swiper-pagination-bullet-active {
          background: #8B5A2B !important;
        }
      `}</style>

      {!product ? (
        <section className="pt-24 min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-brand-primary">
              Product not found
            </h2>
            <button
              type="button"
              onClick={() => navigate("/shop")}
              className="mt-5 px-6 py-3 rounded-xl bg-brand-primary text-brand-main cursor-pointer"
            >
              Back to Shop
            </button>
          </div>
        </section>
      ) : (
        <section className="px-6">
          <div className="max-w-6xl mx-auto">
            {/* Product Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
              
              {/* Fan / Creative Stacked Cards Template */}
              <div className="flex flex-col gap-6 bg-brand-card p-6 rounded-3xl border border-brand-border shadow-sm">
                {productImages.length > 0 ? (
                  <div className="relative w-full">
                    <Swiper
                      modules={[Navigation, Pagination, EffectCreative]}
                      grabCursor={true}
                      effect={'creative'}
                      creativeEffect={{
                        prev: {
                          shadow: true,
                          translate: ['-20%', 0, -150],
                          rotate: [0, 0, -18],
                        },
                        next: {
                          shadow: true,
                          translate: ['100%', 0, 0],
                          rotate: [0, 0, 18],
                        },
                      }}
                      navigation={true}
                      pagination={{ clickable: true }}
                      className="custom-fan-slider w-full h-[400px] sm:h-[450px] rounded-2xl overflow-hidden bg-brand-card-hover pb-8"
                    >
                      {productImages.map((imgUrl, index) => (
                        <SwiperSlide key={index} className="flex items-center justify-center p-2">
                          <img
                            src={imgUrl}
                            alt={`${product.name || "Product"} ${index + 1}`}
                            className="w-full h-full object-cover rounded-2xl shadow-lg transition-transform duration-500 hover:scale-102"
                          />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-[400px] text-brand-secondary font-medium">
                    {product?.name || "No image available"}
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="flex flex-col gap-6">
                <h1 className="text-3xl font-semibold text-brand-primary">
                  {product.name}
                </h1>

                {/* Brand + Category */}
                <div className="flex items-center gap-3 text-sm">
                  {product.brand && (
                    <>
                      <span className="text-brand-gold font-medium">
                        {product.brand}
                      </span>
                      <span className="text-brand-secondary">•</span>
                    </>
                  )}
                  <span className="text-brand-secondary">
                    {product.category?.name || product.category || "Product"}
                  </span>
                </div>

                {/* Rating + Wishlist */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <span
                        key={index}
                        className={`text-xl ${
                          index <
                          Math.round(
                            product.ratingsAverage ||
                              product.rating ||
                              product.averageRating ||
                              0
                          )
                            ? "text-yellow-500"
                            : "text-gray-400"
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={handleWishlist}
                    disabled={wishlistLoading}
                    className="cursor-pointer transition-transform duration-300 hover:scale-110 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {wishlistLoading ? (
                      <Loader2 size={24} className="animate-spin text-[#8B5A2B]" />
                    ) : (
                      <Heart
                        size={25}
                        className={
                          isFavorite 
                            ? "text-[#8B5A2B] dark:text-[#F5DEB3]" 
                            : "text-brand-secondary"
                        }
                        fill={isFavorite ? "currentColor" : "none"}
                      />
                    )}
                  </button>
                </div>

                {/* Price */}
                <p className="text-2xl font-semibold text-brand-gold">
                  EGP {product.discountPrice || product.price}
                </p>

                {/* Quantity */}
                <div className="flex items-center gap-4">
                  <span className="text-brand-secondary">Quantity</span>
                  <div className="flex items-center border border-brand-border rounded-xl overflow-hidden bg-brand-card">
                    <button
                      type="button"
                      onClick={decreaseQuantity}
                      disabled={quantity === 1 || cartLoading}
                      className="px-4 py-2 text-xl text-brand-primary hover:bg-brand-border/50 transition disabled:opacity-40 cursor-pointer"
                    >
                      -
                    </button>
                    <span className="px-5 py-2 text-brand-primary">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={increaseQuantity}
                      disabled={cartLoading}
                      className="px-4 py-2 text-xl text-brand-primary hover:bg-brand-border/50 transition disabled:opacity-40 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Cart Button */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={cartLoading}
                  className="w-full md:w-fit px-8 py-3 rounded-xl bg-brand-primary text-brand-main font-medium hover:bg-brand-gold-hover transition-all duration-300 hover:scale-105 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                >
                  {cartLoading ? (
                    <span>Adding...</span>
                  ) : (
                    <>
                      <ShoppingCart size={20} />
                      Add to Cart
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Description + Reviews Tabs */}
            <div className="mt-16">
              <div className="flex items-center gap-8 border-b border-brand-border">
                <button
                  type="button"
                  onClick={() => setActiveTab("description")}
                  className={`pb-4 text-lg font-semibold transition cursor-pointer ${
                    activeTab === "description"
                      ? "text-brand-primary border-b-2 border-brand-gold"
                      : "text-brand-secondary hover:text-brand-primary"
                  }`}
                >
                  Description
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("reviews")}
                  className={`pb-4 text-lg font-semibold transition cursor-pointer ${
                    activeTab === "reviews"
                      ? "text-brand-primary border-b-2 border-brand-gold"
                      : "text-brand-secondary hover:text-brand-primary"
                  }`}
                >
                  Reviews ({reviews.length})
                </button>
              </div>

              {/* Description Content */}
              {activeTab === "description" && (
                <div className="py-8">
                  <h2 className="text-xl font-semibold text-brand-primary mb-4">
                    Product Description
                  </h2>
                  <p className="text-brand-secondary leading-7 max-w-4xl">
                    {product.description || "No description available for this product."}
                  </p>
                </div>
              )}

              {/* Reviews Content */}
              {activeTab === "reviews" && (
                <div className="py-8">
                  <h2 className="text-xl font-semibold text-brand-primary mb-6">
                    Customer Reviews
                  </h2>

                  <div className="space-y-4">
                    {reviews.length === 0 ? (
                      <p className="text-brand-secondary">No reviews yet.</p>
                    ) : (
                      reviews.map((review) => (
                        <div
                          key={review._id}
                          className="bg-brand-card rounded-xl p-4 max-w-4xl border border-brand-border"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <span className="font-semibold text-brand-primary">
                                {review.username || review.user?.name || "User"}
                              </span>
                              <span className="text-sm text-brand-secondary">
                                {review.createdAt
                                  ? new Date(review.createdAt).toLocaleDateString()
                                  : ""}
                              </span>
                              <div className="flex gap-1">
                                {Array.from({ length: 5 }).map((_, index) => (
                                  <span
                                    key={index}
                                    className={
                                      index < review.rating
                                        ? "text-yellow-500"
                                        : "text-gray-400"
                                    }
                                  >
                                    ★
                                  </span>
                                ))}
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleDeleteReview(review._id)}
                              disabled={deleteLoading === review._id}
                              className="text-red-500 hover:text-red-600 transition cursor-pointer disabled:opacity-50"
                            >
                              {deleteLoading === review._id ? (
                                <Loading size="sm" />
                              ) : (
                                <Trash2 size={16} />
                              )}
                            </button>
                          </div>
                          <p className="text-brand-secondary">{review.comment}</p>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add Review Form */}
                  <div className="mt-8 max-w-4xl">
                    <h3 className="text-lg font-semibold text-brand-primary mb-4">
                      Add Your Review
                    </h3>

                    <div className="flex gap-2 mb-5">
                      {Array.from({ length: 5 }).map((_, index) => {
                        const starNumber = index + 1;
                        return (
                          <button
                            key={starNumber}
                            type="button"
                            onClick={() => setReviewRating(starNumber)}
                            className={`text-4xl transition-transform duration-200 hover:scale-110 cursor-pointer ${
                              starNumber <= reviewRating
                                ? "text-yellow-500"
                                : "text-gray-400"
                            }`}
                          >
                            ★
                          </button>
                        );
                      })}
                    </div>

                    <textarea
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Write your review..."
                      className="w-full min-h-32 rounded-xl border border-brand-border bg-brand-card p-4 text-brand-primary outline-none focus:border-brand-gold"
                    />

                    <button
                      type="button"
                      onClick={handleSubmitReview}
                      disabled={reviewLoading}
                      className="mt-4 px-6 py-3 rounded-xl bg-brand-primary text-brand-main hover:bg-brand-gold-hover transition-all duration-300 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {reviewLoading ? (
                        <>
                          <Loading size="sm" />
                          Adding...
                        </>
                      ) : (
                        "Submit Review"
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Related Products Section */}
            <RelatedProducts 
              currentProductId={product._id} 
              categoryId={product.category?._id || product.category} 
            />
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetails;
import { useEffect, useState } from "react";
import { Heart, Trash2, ShoppingCart, Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import {
  getMyWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../api/wishlistApi";

import { AddItemToCard } from "../api/cartsApi";
import { getSingleProduct } from "../api/productApi";

import {
  getProductReview,
  addReview,
  deleteReview,
} from "../api/ReviewsApi";

const WishlistReview = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [activeTab, setActiveTab] = useState("description");

  // Product
  const [product, setProduct] = useState(null);

  // Loading
  const [pageLoading, setPageLoading] = useState(true);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);

  // Wishlist
  const [isFavorite, setIsFavorite] = useState(false);

  // Quantity
  const [quantity, setQuantity] = useState(1);

  // Reviews
  const [reviews, setReviews] = useState([]);

  // Review
  const [reviewComment, setReviewComment] = useState("");
  const [reviewRating, setReviewRating] = useState(0);

  // -----------------------------------------
  // Get Reviews
  // -----------------------------------------

  const fetchReviews = async () => {
    try {
      const response = await getProductReview(id);

      const reviewsData =
        response.data?.reviews || [];

      setReviews(reviewsData);
    } catch (error) {
      console.error("Reviews error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load reviews."
      );
    }
  };

  // -----------------------------------------
  // Get Product + Wishlist + Reviews
  // -----------------------------------------

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        setPageLoading(true);

        const [
          productResponse,
          wishlistResponse,
          reviewResponse,
        ] = await Promise.all([
          getSingleProduct(id),
          getMyWishlist(),
          getProductReview(id),
        ]);

        const productData =
          productResponse.data?.product ||
          productResponse.data;

        setProduct(productData);

        const wishlistProducts =
          wishlistResponse.data?.wishlist?.products || [];

        const productIsFavorite =
          wishlistProducts.some(
            (item) =>
              String(item?._id || item) ===
              String(id)
          );

        setIsFavorite(productIsFavorite);

        const reviewsData =
          reviewResponse.data?.reviews || [];

        setReviews(reviewsData);
      } catch (error) {
        console.error(
          "Error loading product page:",
          error
        );

        toast.error(
          error.response?.data?.message ||
            "Failed to load product."
        );
      } finally {
        setPageLoading(false);
      }
    };

    if (id) {
      fetchPageData();
    }
  }, [id]);

  // -----------------------------------------
  // Wishlist
  // -----------------------------------------

  const handleWishlist = async () => {
    if (!product?._id || wishlistLoading) return;

    try {
      setWishlistLoading(true);

      if (isFavorite) {
        await removeFromWishlist(product._id);

        setIsFavorite(false);

        toast.success(
          "Removed from wishlist ❤️"
        );
      } else {
        await addToWishlist(product._id);

        setIsFavorite(true);

        toast.success(
          "Added to wishlist ❤️"
        );
      }
    } catch (error) {
      console.error(
        "Wishlist error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Something went wrong."
      );
    } finally {
      setWishlistLoading(false);
    }
  };

  // -----------------------------------------
  // Add To Cart
  // -----------------------------------------

  const handleAddToCart = async () => {
    if (!product?._id || cartLoading) return;

    try {
      setCartLoading(true);

      await AddItemToCard({
        productId: product._id,
        quantity: quantity,
      });

      toast.success(
        "Product added to cart 🛒"
      );
    } catch (error) {
      console.error(
        "Add to cart error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to add product to cart."
      );
    } finally {
      setCartLoading(false);
    }
  };

  // -----------------------------------------
  // Quantity
  // -----------------------------------------

  const increaseQuantity = () => {
    const stock = product?.stock || 0;

    if (quantity < stock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  // -----------------------------------------
  // Add Review
  // -----------------------------------------

  const handleSubmitReview = async () => {
    if (reviewRating === 0) {
      toast.warning(
        "Please select a rating first."
      );
      return;
    }

    if (!reviewComment.trim()) {
      toast.warning(
        "Please write your review."
      );
      return;
    }

    try {
      setReviewLoading(true);

      await addReview(id, {
        rating: reviewRating,
        comment: reviewComment,
      });

      toast.success(
        "Review added successfully."
      );

      setReviewComment("");
      setReviewRating(0);

      await fetchReviews();
    } catch (error) {
      console.error(
        "Add review error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to add review."
      );
    } finally {
      setReviewLoading(false);
    }
  };

  // -----------------------------------------
  // Delete Review
  // -----------------------------------------

  const handleDeleteReview = async (
    reviewId
  ) => {
    if (deleteLoading) return;

    try {
      setDeleteLoading(reviewId);

      await deleteReview(
        id,
        reviewId
      );

      toast.success(
        "Review deleted successfully."
      );

      await fetchReviews();
    } catch (error) {
      console.error(
        "Delete review error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to delete review."
      );
    } finally {
      setDeleteLoading(null);
    }
  };

  // -----------------------------------------
  // Product Image
  // -----------------------------------------

  const productImage =
    product?.images?.[0] ||
    product?.image ||
    product?.thumbnail ||
    "";

  return (
    <>
      {pageLoading ? (
        <section className="pt-24 min-h-screen flex items-center justify-center">
          <Loader2
            size={42}
            className="animate-spin text-brand-gold"
          />
        </section>
      ) : !product ? (
        <section className="pt-24 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-brand-primary">
              Product not found
            </h2>

            <button
              type="button"
              onClick={() =>
                navigate("/shop")
              }
              className="mt-5 px-6 py-3 rounded-xl bg-brand-primary text-brand-main"
            >
              Back to Shop
            </button>
          </div>
        </section>
      ) : (
        <section className="pt-24 min-h-screen px-6 py-10">
          <div className="max-w-6xl mx-auto">

            {/* Product */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

              {/* Image */}
              <div className="bg-brand-card rounded-2xl p-8 flex items-center justify-center min-h-[450px]">
                {productImage ? (
                  <img
                    src={productImage}
                    alt={product.name}
                    className="w-full max-w-md h-[400px] object-contain"
                  />
                ) : (
                  <div className="text-brand-secondary">
                    No image available
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

                      <span className="text-brand-secondary">
                        •
                      </span>
                    </>
                  )}

                  <span className="text-brand-secondary">
                    {product.category?.name ||
                      product.category ||
                      "Product"}
                  </span>
                </div>

                {/* Rating + Wishlist */}
                <div className="flex items-center gap-4">

                  <div className="flex items-center gap-1">
                    {Array.from({
                      length: 5,
                    }).map((_, index) => (
                      <span
                        key={index}
                        className={`text-xl ${
                          index <
                          Math.round(
                            product.ratingsAverage ||
                              product.rating ||
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
                    disabled={
                      wishlistLoading
                    }
                    className="cursor-pointer transition-transform duration-300 hover:scale-110 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {wishlistLoading ? (
                      <Loader2
                        size={25}
                        className="animate-spin text-red-500"
                      />
                    ) : (
                      <Heart
                        size={25}
                        className={
                          isFavorite
                            ? "text-red-500"
                            : "text-brand-secondary"
                        }
                        fill={
                          isFavorite
                            ? "currentColor"
                            : "none"
                        }
                      />
                    )}
                  </button>

                </div>

                {/* Price */}
                <p className="text-2xl font-semibold text-brand-gold">
                  {product.price} EGP
                </p>

                {/* Quantity */}
                <div className="flex items-center gap-4">

                  <span className="text-brand-secondary">
                    Quantity
                  </span>

                  <div className="flex items-center border border-brand-border rounded-xl overflow-hidden">

                    <button
                      type="button"
                      onClick={
                        decreaseQuantity
                      }
                      disabled={
                        quantity === 1 ||
                        cartLoading
                      }
                      className="px-4 py-2 text-xl text-brand-primary hover:bg-brand-card transition disabled:opacity-40"
                    >
                      -
                    </button>

                    <span className="px-5 py-2 text-brand-primary">
                      {quantity}
                    </span>

                    <button
                      type="button"
                      onClick={
                        increaseQuantity
                      }
                      disabled={
                        quantity >=
                          (product.stock ||
                            0) ||
                        cartLoading
                      }
                      className="px-4 py-2 text-xl text-brand-primary hover:bg-brand-card transition disabled:opacity-40"
                    >
                      +
                    </button>

                  </div>

                </div>

                {/* Cart */}
                <button
                  type="button"
                  onClick={
                    handleAddToCart
                  }
                  disabled={
                    cartLoading ||
                    product.stock === 0
                  }
                  className="w-full md:w-fit px-8 py-3 rounded-xl bg-brand-primary text-brand-main font-medium hover:bg-brand-gold-hover transition-all duration-300 hover:scale-105 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                >
                  {cartLoading ? (
                    <>
                      <Loader2
                        size={20}
                        className="animate-spin"
                      />
                      Adding...
                    </>
                  ) : (
                    <>
                      <ShoppingCart
                        size={20}
                      />
                      Add to Cart
                    </>
                  )}
                </button>

              </div>
            </div>

            {/* Description + Reviews */}
            <div className="mt-16">

              {/* Tabs */}
              <div className="flex items-center gap-8 border-b border-brand-border">

                <button
                  type="button"
                  onClick={() =>
                    setActiveTab(
                      "description"
                    )
                  }
                  className={`pb-4 text-lg font-semibold transition ${
                    activeTab ===
                    "description"
                      ? "text-brand-primary border-b-2 border-brand-gold"
                      : "text-brand-secondary hover:text-brand-primary"
                  }`}
                >
                  Description
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setActiveTab("reviews")
                  }
                  className={`pb-4 text-lg font-semibold transition ${
                    activeTab === "reviews"
                      ? "text-brand-primary border-b-2 border-brand-gold"
                      : "text-brand-secondary hover:text-brand-primary"
                  }`}
                >
                  Reviews ({reviews.length})
                </button>

              </div>

              {/* Description */}
              {activeTab ===
                "description" && (
                <div className="py-8">

                  <h2 className="text-xl font-semibold text-brand-primary mb-4">
                    Product Description
                  </h2>

                  <p className="text-brand-secondary leading-7 max-w-4xl">
                    {product.description ||
                      "No description available for this product."}
                  </p>

                </div>
              )}

              {/* Reviews */}
              {activeTab === "reviews" && (
                <div className="py-8">

                  <h2 className="text-xl font-semibold text-brand-primary mb-6">
                    Customer Reviews
                  </h2>

                  {/* Reviews List */}
                  <div className="space-y-4">

                    {reviews.length ===
                    0 ? (
                      <p className="text-brand-secondary">
                        No reviews yet.
                      </p>
                    ) : (
                      reviews.map(
                        (review) => (
                          <div
                            key={
                              review._id
                            }
                            className="bg-brand-card rounded-xl p-4 max-w-4xl"
                          >

                            <div className="flex items-center gap-3 mb-2">

                              <span className="font-semibold text-brand-primary">
                                {
                                  review.username
                                }
                              </span>

                              <span className="text-sm text-brand-secondary">
                                {new Date(
                                  review.createdAt
                                ).toLocaleDateString()}
                              </span>

                              <div className="flex gap-1">

                                {Array.from({
                                  length: 5,
                                }).map(
                                  (
                                    _,
                                    index
                                  ) => (
                                    <span
                                      key={
                                        index
                                      }
                                      className={
                                        index <
                                        review.rating
                                          ? "text-yellow-500"
                                          : "text-gray-400"
                                      }
                                    >
                                      ★
                                    </span>
                                  )
                                )}

                              </div>

                              <button
                                type="button"
                                onClick={() =>
                                  handleDeleteReview(
                                    review._id
                                  )
                                }
                                disabled={
                                  deleteLoading ===
                                  review._id
                                }
                                className="text-red-500 hover:text-red-600 transition"
                              >
                                {deleteLoading ===
                                review._id ? (
                                  <Loader2
                                    size={
                                      16
                                    }
                                    className="animate-spin"
                                  />
                                ) : (
                                  <Trash2
                                    size={
                                      16
                                    }
                                  />
                                )}
                              </button>

                            </div>

                            <p className="text-brand-secondary">
                              {review.comment}
                            </p>

                          </div>
                        )
                      )
                    )}

                  </div>

                  {/* Add Review */}
                  <div className="mt-8 max-w-4xl">

                    <h3 className="text-lg font-semibold text-brand-primary mb-4">
                      Add Your Review
                    </h3>

                    {/* Rating */}
                    <div className="flex gap-2 mb-5">

                      {Array.from({
                        length: 5,
                      }).map(
                        (_, index) => {
                          const starNumber =
                            index + 1;

                          return (
                            <button
                              key={
                                starNumber
                              }
                              type="button"
                              onClick={() =>
                                setReviewRating(
                                  starNumber
                                )
                              }
                              className={`text-4xl transition-transform duration-200 hover:scale-110 ${
                                starNumber <=
                                reviewRating
                                  ? "text-yellow-500"
                                  : "text-gray-400"
                              }`}
                            >
                              ★
                            </button>
                          );
                        }
                      )}

                    </div>

                    {/* Comment */}
                    <textarea
                      value={
                        reviewComment
                      }
                      onChange={(e) =>
                        setReviewComment(
                          e.target.value
                        )
                      }
                      placeholder="Write your review..."
                      className="w-full min-h-32 rounded-xl border border-brand-border bg-transparent p-4 text-brand-primary outline-none focus:border-brand-gold"
                    />

                    {/* Submit */}
                    <button
                      type="button"
                      onClick={
                        handleSubmitReview
                      }
                      disabled={
                        reviewLoading
                      }
                      className="mt-4 px-6 py-3 rounded-xl bg-brand-primary text-brand-main hover:bg-brand-gold-hover transition-all duration-300 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {reviewLoading ? (
                        <>
                          <Loader2
                            size={18}
                            className="animate-spin"
                          />
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
          </div>
        </section>
      )}
    </>
  );
};

export default WishlistReview;
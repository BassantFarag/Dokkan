import React, { useEffect, useState } from "react";
import { Heart, Trash2, ShoppingCart, CircleSlash2, ImageOff, ArrowLeft, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  clearWishlists,
  getMyWishlist,
  removeFromWishlist,
} from "../api/wishlistApi";
import { AddItemToCard, getMyCart, removeItemFromCart } from "../api/cartsApi";
import { toast } from "react-toastify";
import Loading from "../components/Loading"; 

const Whishlist = () => {
  const [favourit, setFavourit] = useState([]);
  const [cartItemsIds, setCartItemsIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [clearLoading, setClearLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [cartLoading, setCartLoading] = useState(null);

  const navigate = useNavigate();

  const handleBrowse = () => {
    navigate("/shop");
  };

  useEffect(() => {
    const fetchWishlistAndCart = async () => {
      try {
        const [wishlistRes, cartRes] = await Promise.allSettled([
          getMyWishlist(),
          getMyCart(),
        ]);

        if (wishlistRes.status === "fulfilled") {
          const response = wishlistRes.value;
          const wishlistData = response?.data?.wishlist || response?.wishlist || response?.data;
          const products = wishlistData?.products || [];

          const uniqueProducts = Array.from(
            new Map(
              products.map((item) => {
                const itemId = item?._id || item?.id || item;
                return [itemId, typeof item === "object" ? item : { _id: item }];
              })
            ).values()
          );
          setFavourit(uniqueProducts);
        }

        if (cartRes.status === "fulfilled") {
          const cartData = cartRes.value;
          const data = cartData?.data ?? {};
          const cartItems = data.items ?? [];

          const ids = new Set(
            cartItems.map((item) => {
              return item?.productId || (typeof item?.product === "string" ? item?.product : item?.product?._id) || item?._id || item?.id;
            }).filter(Boolean)
          );
          
          setCartItemsIds(ids);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        if (error.response?.status === 401) {
          toast.error("Please login first to view your wishlist");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchWishlistAndCart();
  }, [navigate]);

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
      if (error.response?.status === 401) {
        toast.error("Please login first");
        navigate("/login");
        return;
      }
      toast.error(error.response?.data?.message || "Failed to update cart");
    } finally {
      setCartLoading(null);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!productId) {
      toast.error("Invalid product ID");
      return;
    }

    const previousWishlist = [...favourit];

    setFavourit((prev) =>
      prev.filter((product) => {
        const currentId = String(product?._id || product?.id || product);
        return currentId !== String(productId);
      })
    );

    try {
      setDeleteLoading(productId);
      await removeFromWishlist(productId);
      toast.info("Removed from wishlist");
    } catch (error) {
      console.error(error);
      setFavourit(previousWishlist);

      if (error.response?.status === 401) {
        toast.error("Please login first");
        navigate("/login");
        return;
      }
      toast.error(error.response?.data?.message || "Failed to remove item");
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleDeleteAllProducts = async () => {
    const confirm = window.confirm(
      "Are you sure you want to remove all items from your wishlist?"
    );
    if (!confirm) return;

    try {
      setClearLoading(true);
      await clearWishlists();
      setFavourit([]);
      toast.info("Wishlist cleared successfully");
    } catch (error) {
      console.error(error);
      if (error.response?.status === 401) {
        toast.error("Please login first");
        navigate("/login");
        return;
      }
      toast.error("Failed to clear wishlist");
    } finally {
      setClearLoading(false);
    }
  };

  const format = (n) => `EGP ${Math.round(n || 0).toLocaleString()}`;


  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-brand-main pt-28 pb-20 md:pt-32">
      <div className="mx-auto max-w-7xl px-6">
        {favourit.length === 0 ? (
          <div className="mt-16 flex flex-col items-center justify-center gap-4 rounded-2xl border border-brand-border bg-brand-card py-20 text-center">
            <div className="rounded-full p-4 bg-brand-card-hover text-brand-gold">
              <Heart className="h-10 w-10 fill-brand-gold animate-pulse" />
            </div>
            <div>
              <p className="text-lg font-bold text-brand-primary">Your wishlist is empty</p>
              <p className="mt-1 text-sm text-brand-secondary">
                Save items you love to your wishlist. They'll be waiting for you here when you're ready.
              </p>
            </div>
            <button
              onClick={handleBrowse}
              className="mt-2 rounded-full bg-brand-gold px-6 py-2.5 text-xs font-semibold text-zinc-950 transition-colors hover:bg-brand-gold-hover cursor-pointer"
            >
              Explore Products
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-brand-border pb-4">
              <h1 className="text-3xl font-extrabold text-brand-primary">
                My Wishlist <span className="text-sm font-normal text-brand-secondary">({favourit.length} items)</span>
              </h1>
              <button
                onClick={handleDeleteAllProducts}
                disabled={clearLoading}
                className="flex items-center gap-2 rounded-xl border border-red-600/30 bg-red-600/10 px-4 py-2 text-xs font-semibold text-red-600 transition-colors hover:bg-red-600/20 disabled:opacity-50 dark:border-red-400/30 dark:bg-red-400/10 dark:text-red-400 cursor-pointer"
              >
                {clearLoading ? (
                  <>
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
                    <span>Clearing...</span>
                  </>
                ) : (
                  <>
                    <CircleSlash2 size={16} />
                    <span>Clear Wishlist</span>
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {favourit.map((product) => {
                const prodId = product?._id || product?.id;
                const imageUrl = product?.images?.[0]?.url || product?.image;
                const discountPrice = product?.discountPrice || product?.price;
                const hasDiscount = product?.discountPrice && product?.discountPrice < product?.price;
                const isInCart = cartItemsIds.has(prodId);

                return (
                  <div
                    key={prodId}
                    className="group relative flex flex-col justify-between rounded-2xl border border-brand-border bg-brand-card p-4 transition-all duration-300 hover:shadow-lg"
                  >
                    <div>
                      <div className="relative mb-4 flex h-48 w-full items-center justify-center overflow-hidden rounded-xl bg-brand-card-hover">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={product?.name || "Product"}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center gap-1 text-brand-secondary">
                            <ImageOff className="h-8 w-8 opacity-70" />
                            <span className="text-[10px] uppercase font-medium">No Image</span>
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={() => handleDeleteProduct(prodId)}
                          disabled={deleteLoading === prodId}
                          className="absolute top-2 right-2 rounded-full bg-brand-card/80 p-2 text-brand-secondary backdrop-blur-md transition-colors hover:text-red-600 dark:hover:text-red-400 shadow-sm disabled:opacity-50 cursor-pointer"
                          aria-label="Remove item"
                        >
                          {deleteLoading === prodId ? (
                            <span className="block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </div>

                      <div className="space-y-1">
                        <h3 className="line-clamp-1 text-sm font-bold text-brand-primary sm:text-base">
                          {product?.name || "Product Name"}
                        </h3>

                        <div className="flex items-baseline gap-2">
                          <span className="text-sm font-semibold text-brand-gold sm:text-base">
                            {format(discountPrice)}
                          </span>
                          {hasDiscount && (
                            <span className="text-xs text-brand-secondary line-through">
                              {format(product?.price)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-brand-border">
                      <button
                        type="button"
                        onClick={() => handleToggleCart(product)}
                        disabled={cartLoading === prodId}
                        className={`w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition-colors disabled:opacity-50 cursor-pointer ${
                          isInCart
                            ? "bg-zinc-800 text-brand-gold hover:bg-zinc-700 border border-brand-gold/30"
                            : "bg-brand-gold text-zinc-950 hover:bg-brand-gold-hover"
                        }`}
                      >
                        {cartLoading === prodId ? (
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        ) : isInCart ? (
                          <>
                            <Check className="h-4 w-4 text-brand-gold" />
                            <span>Remove from Cart</span>
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="h-4 w-4" />
                            <span>Add to Cart</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-4">
              <button
                type="button"
                onClick={() => navigate("/shop")}
                className="flex items-center gap-1.5 text-sm font-semibold text-brand-gold hover:text-brand-gold-hover cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" /> Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Whishlist;

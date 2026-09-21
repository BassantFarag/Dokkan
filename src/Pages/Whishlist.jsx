
import React, { useEffect, useState } from "react";
import { Heart, Trash2 } from "lucide-react";
import { NavLink } from "react-router-dom";
import {
  getMyWishlist,
  removeFromWishlist,
} from "../api/wishlistApi";
import { toast } from "react-toastify";

const Whishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWishlist = async () => {
      try {
        const response = await getMyWishlist();

        console.log("Wishlist response:", response.data);

        const products =
          response?.data?.wishlist?.products || [];

        setWishlist(products);
      } catch (error) {
        console.error("Wishlist error:", error);

        toast.error(
          error.response?.data?.message ||
            "Failed to load wishlist"
        );
      } finally {
        setLoading(false);
      }
    };

    loadWishlist();
  }, []);

  const handleRemove = async (productId) => {
    try {
      await removeFromWishlist(productId);

      setWishlist((prev) =>
        prev.filter((product) => product._id !== productId)
      );

      toast.success("Product removed from wishlist");
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to remove product"
      );
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        Loading wishlist...
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col items-center px-6 pb-24 pt-32 text-center">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#eae1d9] text-[#c2a38e]">
          <Heart className="h-7 w-7" />
        </div>

        <h1 className="mb-2 text-xl font-bold">
          Your wishlist is empty
        </h1>

        <p className="mb-6 text-sm text-gray-500">
          Tap the heart icon on any product to add it here.
        </p>

        <NavLink
          to="/shop"
          className="rounded-full bg-[#2a2421] px-6 py-2.5 text-xs font-semibold text-white"
        >
          Browse Shop
        </NavLink>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-28">
      <h1 className="mb-2 text-2xl font-bold">
        My Wishlist
      </h1>

      <p className="mb-8 text-sm text-gray-500">
        {wishlist.length} product
        {wishlist.length !== 1 ? "s" : ""}
      </p>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {wishlist.map((product) => (
          <div
            key={product._id}
            className="overflow-hidden rounded-2xl border bg-white shadow-sm"
          >
            <div className="aspect-square overflow-hidden bg-gray-100">
              {product.images?.[0]?.url ? (
                <img
                  src={product.images[0].url}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  No Image
                </div>
              )}
            </div>

            <div className="p-4">
              <h2 className="font-semibold">
                {product.name}
              </h2>

              <p className="mt-2 font-bold">
                EGP{" "}
                {(
                  product.discountPrice ||
                  product.price
                )?.toLocaleString()}
              </p>

              <button
                type="button"
                onClick={() =>
                  handleRemove(product._id)
                }
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border py-2 text-sm hover:text-red-500"
              >
                <Trash2 className="h-4 w-4" />
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Whishlist;

import React, { useEffect, useState } from "react";
import { Heart, Trash, ShoppingCart, CircleSlash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  clearWishlists,
  getMyWishlist,
  removeFromWishlist
} from "../api/wishlistApi";
import { AddItemToCard } from "../api/cartsApi";
import { toast } from "react-toastify";

const Whishlist = () => {
  // functions

  // \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

  // Store products in the wishlist state
  const [favourit, setFavourit] = useState([]);

  // page loading
  const [loading, setLoading] = useState(true);

  // clear all item loading
  const [clearLoading, setClearLoading] = useState(false);

  // claer an item loading
  const [deleteLoading, setDeleteLoading] = useState(null);

  // add to cart loading
  const [cartLoading, setCartLoading] = useState(null);

  // handling go shopping link
  const navigate = useNavigate();
  function handleBrowse() {
    navigate("/shop");
  }

  // handling get items from API
  useEffect(() => {
    const fetchWishlistData = async () => {
      try {
        const response = await getMyWishlist();
        setFavourit(response.data.wishlist.products);
      } catch (error) {
        console.log(error)
      }
      finally{
      setLoading(false)
      }
    };
        fetchWishlistData();

  }, []);


  // handling addcartproduct
  const handleAddToCart = async (product) => {
    try {
      setCartLoading(product._id);
      await AddItemToCard({
        productId: product._id,
        quantity: 1,
      });
      toast("Added to cart", {
        icon: <ShoppingCart size={17} className="text-brand-gold" />,
        style: {
          background: "hsl(20 8% 15%)",
          color: "hsl(33 28% 85%)",
          border: "1px solid hsl(25 10% 20%)",
          borderRadius: "12px",
          fontSize: "13px",
          padding: "8px 14px",
          width: "auto",
          minWidth: "180px",
          minHeight: "50px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
        },
      });
    } catch (error) {
      console.error(error);
    } finally {
      setCartLoading(null);
    }
  };

  // handling delete a product from wishlist from {id}
  const handleDeleteProduct = async (id) => {
    try {
      setDeleteLoading(id);
      await removeFromWishlist(id);
      setFavourit((prev) => prev.filter((product) => product._id !== id));
    } catch (error) {
      console.log(error);
    } finally {
      setDeleteLoading(null);
    }
  };

  // handling delete all products from wishlist
  const handleDeleteAllProducts = async () => {
    const confirm = window.confirm(
      "Are you sure you want to remove all items from your wishlist?",
    );
    if (!confirm) return;
    try {
      setClearLoading(true);
      await clearWishlists();

      setFavourit([]);
    } catch (error) {
      console.error(error);
    } finally {
      setClearLoading(false);
    }
  };

  // \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

  return (
    <section className="pt-24 mb-10">
      {/* loading page */}
      {loading ? (
        <>
          <div className="flex min-h-96 flex-col items-center justify-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-border border-t-brand-gold"></div>

            <p className="text-sm text-brand-secondary animate-pulse">
              Loading ...
            </p>
          </div>
        </>
      ) : favourit.length === 0 ? (
        
          // page without wishlist products
        <div className="flex flex-col items-center justify-center space-y-6 h-[450px] sm:h-[500px] md:h-[450px]">
          {/* Heart */}
          <div className="rounded-full p-4 bg-brand-card text-brand-gold hover:scale-105 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
            <Heart className="size-10 fill-red-500 text-red-500" />
          </div>

          {/* texts */}
          <div className="flex flex-col items-center space-y-4 w-sm sm:w-md md:w-lg">
            <h2 className="text-2xl text-brand-primary">
              Your wishlist is empty
            </h2>
            <p className="text-brand-secondary text-sm text-center">
              Save items you love to your wishlist. They'll be waiting for you
              here.
            </p>
          </div>
          {/* button to go shopping */}
          <button
            className="bg-brand-primary text-brand-main px-6 py-3 rounded-2xl cursor-pointer hover:bg-brand-gold-hover hover:-translate-y-1 transition-all duration-300 hover:scale-105 hover:shadow-xl"
            onClick={handleBrowse}
          >
            Explore Products
          </button>
        </div>

      ) : (
        // page with wishlist products
        <>
          {/* button for delete all items from wishlist */}
          <div className="flex justify-center mb-10">
            <button
              onClick={handleDeleteAllProducts}
              className=" group flex items-center gap-2.5 px-5 py-2.5 rounded-xl border border-red-500/20 bg-red-500/5 text-red-500 shadow-sm  transition-all duration-300 hover:bg-red-500/10 hover:border-red-500/40 hover:shadow-md  cursor-pointer "
            >
              {/* claer loading */}
              {clearLoading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
                  <span className="text-sm font-medium">
                    Clearing wishlist...
                  </span>
                </>
              ) : (
                <>
                  {/* cicle slash icone handle */}
                  <CircleSlash2
                    size={18}
                    strokeWidth={2}
                    className="transition-transform duration-300 group-hover:rotate-90"
                  />

                  <span className="text-sm font-medium">Clear Wishlist</span>
                </>
              )}
            </button>
          </div>

          {/* Cart */}
          <div className="grid  grid-cols-4 gap-10 px-40 sm:grid-cols-1 sm:px-6 md:grid-cols-2 md:px-10 lg:grid-cols-3 lg:px-16 xl:grid-cols-4 xl:px-40">
            {favourit.map((product) => (
              // Image Cart
              <div
                key={product._id}
                className="bg-brand-card shadow-xl rounded-2xl min-w-0 w-full"
              >
                <div className="w-full items-start justify-center overflow-hidden rounded-t-2xl">
                  <img
                    src={product.images[0].url}
                    alt={product.name}
                    className="w-full h-full object-contain object-top transition-transform duration-300 hover:scale-110 cursor-pointer"
                  />
                </div>

                {/* details of cart */}
                <div className="p-6 items-center space-y-3 min-w-0 xs:p-3 sm:p-4 md:p-5 lg:p-6">
                  {/* name of product */}
                  <p className="text-xl text-brand-primary break-words xs:text-sm sm:text-base md:text-lg lg:text-lg">
                    {product.name}
                  </p>

                  <div className="flex space-x-6 flex-wrap gap-2 xs:space-x-1 sm:space-x-2 md:space-x-4 lg:space-x-6">
                    {/* discount of product */}
                    <p className=" text-brand-primary text-sm sm:text-base md:text-lg lg:text-base">
                      {product.discountPrice.toLocaleString()} EGP
                    </p>
                    {/* price of product */}
                    <del className="text-brand-secondary text-sm sm:text-xs md:text-sm lg:text-base">
                      {product.price.toLocaleString()} EGP
                    </del>
                  </div>

                  <div className="flex justify-between items-center gap-2 min-w-0">
                    {/* add this itme to cart by id  */}
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="px-18 py-3 items-center justify-center flex gap-4 cursor-pointer bg-brand-primary text-brand-main rounded-2xl min-w-0 flex-1 px-2 gap-1 xs:px-2 xs:gap-1 sm:px-3 sm:gap-2 md:px-4 md:gap-3 lg:px-5 lg:gap-3 xl:px-6 xl:gap-4 text-xs sm:text-sm md:text-sm lg:text-base hover:bg-brand-gold-hover duration-300 ease-in hover:scale-105 transition-transform "
                    >
                      {/* cart loading */}
                      {cartLoading === product._id ? (
                        <>
                          <span className="h-5 w-5 items-center animate-spin rounded-full border-2 border-brand-main border-t-transparent" />
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="shrink-0 size-4 sm:size-4 md:size-5 lg:size-5" />

                          <span className="truncate">Add to cart</span>
                        </>
                      )}
                    </button>
                    {/* delete an item from wishlist by id */}
                    <button
                      type="button"
                      className=" p-2 rounded-lg cursor-pointer shrink-0 text-brand-gold transition-colors duration-150 hover:text-red-500"
                      onClick={() => handleDeleteProduct(product._id)}
                    >
                      {/* delete loading */}
                      {deleteLoading === product._id ? (
                        <>
                          <span className="block h-5 w-5 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
                        </>
                      ) : (
                        <Trash className="size-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default Whishlist;








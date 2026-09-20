import React from "react";
import { Heart } from "lucide-react";
import { NavLink } from "react-router-dom";

const Whishlist = () => {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center px-6 pb-24 pt-32 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#eae1d9] text-[#c2a38e] dark:bg-[#2e2623]">
        <Heart className="h-7 w-7" />
      </div>
      <h1 className="mb-2 text-xl font-bold text-[#2a2421] dark:text-[#f3ece7]">Your wishlist is empty</h1>
      <p className="mb-6 text-sm text-[#7a6f68] dark:text-[#a0948c]">
        Tap the heart icon on any product to add it here.
      </p>
      <NavLink
        to="/shop"
        className="rounded-full bg-[#2a2421] px-6 py-2.5 text-xs font-semibold text-[#f7f2ed] hover:bg-[#423935] dark:bg-[#f3ece7] dark:text-[#1a1513] dark:hover:bg-[#e4dcd5]"
      >
        Browse Shop
      </NavLink>
    </div>
  );
};

export default Whishlist;
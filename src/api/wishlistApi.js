import api from "./axios";

// Add product to wishlist
export const addToWishlist = (id) =>
  api.post(`/wishlists/add/${id}`);

// Remove product from wishlist
export const removeFromWishlist = (productId) => {
  return api.delete(`/wishlists/remove/${productId}`);
};
// Get my wishlist
export const getMyWishlist = () =>
  api.get("/wishlists/my");

// Clear wishlist
export const clearWishlists = () =>
  api.delete("/wishlists/clear");
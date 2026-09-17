import api from './axios';

//Add product to wishlist
export const addToWishlist =(id,payload)=>api.post(`/wishlist/add/${id}`,payload);

//Remove product from wishlist
export const removeFromWishlist =(productId)=>api.delete(`/wishlist/remove/${productId}`);

//get my wishlist 
export const getMyWishlist =()=>api.get('/wishlists/my');

//clear wishlist 
export const clearWishlists =()=>api.delete('/wishlists/clear');

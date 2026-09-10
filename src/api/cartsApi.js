import api from './axios';

// Get my carts
export const getMyCart =()=>api.get('/carts');

//add item to carts
export const AddItemToCard=(payload)=>api.post('/carts/items',payload);

//update item quantity
export const updateItemQuantity =(payload)=>api.patch('/carts/items',payload);

//remove item from cart
export const removeItemFromCart=(productId)=>api.delete(`/carts/items/${productId}`);

//Apply coupon 
export const applyCoupon=(payload)=>api.post('/carts/coupon',payload);

//remove coupon
export const removeCoupon=()=>api.delete('/carts/coupon');

//clear cart 
export const clearCart =()=>api.delete('/carts/clear')
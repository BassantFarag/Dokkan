import api from './axios';

//place order 
export const placeOrder=(payload)=>api.post('/orders',payload);

//get my order
export const myOrder=()=>api.get('orders/my');

//get single order
export const getOrderById=(id)=>api.get(`/orders/my/${id}`);

//cancel order
export const cancelOrder=(id)=>api.get(`/orders/my/${id}`);



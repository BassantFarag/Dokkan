import api from './axios';

// Get product review 
export const getProductReview =(id)=>api.get(`/products/${id}/reviews`);

//Add review
export const addReview =(id ,payload)=>api.post(`/products/${id}/reviews` , payload);

//Delete review 
export const deleteReview = (id , reviewId)=>api.delete(`/products/${id}/reviews/${reviewId}`)
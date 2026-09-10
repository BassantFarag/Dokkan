import api from './axios';

// Get all product 
export const getAllProducts=()=>api.get('/products');

//Search product
export const searchProduct =()=>api.get('/products/search');

//Get single product
export const getSingleProduct =(id)=>api.get(`/products/${id}`);
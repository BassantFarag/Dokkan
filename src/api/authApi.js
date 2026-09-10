import api from  './axios';

//Send registration OTP
export const sendRegisterOTP = (payload)=>api.post('/auth/register/send-otp' ,payload);

//Verify registration OTP
export const verifyRegisterOTP = (payload)=>api.post('/auth/register/verify-otp' ,payload);

//login 
export const login =(payload)=>api.post('/auth/login',payload);

//logout
export const logout=()=>api.post('/auth/logout');

//forgot password send otp 
export const forgotPasswordSendOTP =(payload)=>api.post('/auth/forgot-password/send-otp',payload);

//forgot password Verify otp 
export const forgotPasswordVerifyOTP =(payload)=>api.post('/auth/forgot-password/verify-otp',payload);

//auth me 
export const authMe =()=>api.get('/auth/me')



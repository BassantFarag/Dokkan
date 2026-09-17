import api from './axios';

// Send registration OTP
// payload: { username, email, phone, password, rePassword }
export const sendRegisterOTP = (payload) =>
  api.post('/auth/register/send-otp', payload);

// Verify registration OTP
// payload: { email, otp }
export const verifyRegisterOTP = (payload) =>
  api.post('/auth/register/verify-otp', payload);

// Login
// payload: { email, password }
export const login = (payload) =>
  api.post('/auth/login', payload);

// Logout
export const logout = () =>
  api.post('/auth/logout');

// Forgot password - send OTP
// payload: { email }
export const forgotPasswordSendOTP = (payload) =>
  api.post('/auth/forgot-password/send-otp', payload);

// Forgot password - verify OTP + reset password
// payload: { email, otp, newPassword }
export const forgotPasswordVerifyOTP = (payload) =>
  api.post('/auth/forgot-password/verify-otp', payload);

// Get current user
export const authMe = () =>
  api.get('/auth/me');
#  Dokkan  — E-Commerce Web Application

**Dokkan** is a modern, responsive customer-facing E-Commerce web application built with **React.js 18**, **Tailwind CSS**, and integrated with a **RESTful API**. This project offers a seamless online shopping experience including user authentication, product filtering, shopping cart management, wishlist functionality, user profiles, and order checkout flow.

---

##Features

* **Authentication & Security:** User registration with OTP verification, login, password recovery, and JWT token management.
* **Product Browsing & Search:** Interactive product catalog with category/brand filters, price range sliders, search bar, and sorting.
* **Detailed Product Views:** Complete product view with photo galleries, stock statuses, discount tags, and user reviews.
* **Shopping Cart System:** Full global cart management (Add, remove, quantity adjustment, clear cart, and discount coupon applying).
* **Wishlist:** Save favorite products for quick access later.
* **Order Checkout & Payment:** Multi-step checkout process supporting Cash on Delivery and Stripe card payments.
* **User Profile & History:** View profile details, update user info, view past orders, and track/cancel order status.
* **Fully Responsive:** Optimized layout for mobile, tablet, and desktop viewports.

---

## Tech Stack & Libraries

* **Framework & Tooling:** React.js 18, Vite
* **Styling:** Tailwind CSS
* **Routing:** React Router v6
* **HTTP & API Integration:** Axios with custom request/response interceptors
* **State Management:** React Context API (Auth & Cart Contexts)
* **Form Management:** React Hook Form, Zod
* **UI Feedback & UX:** React Toastify, SweetAlert2, React Spinners, Lucide Icons, Canvas Confetti
* **Media & Payments:** Swiper.js, Stripe.js Integration

---

##Project Structure

```text
src/
├── api/          # Axios instance and API service calls
├── assets/       # Static media files (images, icons)
├── components/   # Reusable UI components (Navbar, Footer, Cards, Loaders)
├── Context/      # Global Context State (AuthContext, CartContext)
├── Layout/       # Main App Layouts
├── Pages/        # App View Screens (Home, Products, Cart, Auth, Profile)
└── Router/       # React Router setup & Protected Routes logic

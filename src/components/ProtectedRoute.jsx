import React, { useEffect, useRef } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

/**
 * Wrap any page that requires login (Cart, Wishlist...).
 * If the user isn't logged in, show a toast and redirect straight to /login,
 * remembering where they came from so we can send them back after login.
 */
export default function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAuth();
  const location = useLocation();
  const hasWarned = useRef(false);

  useEffect(() => {
    if (!isLoggedIn && !hasWarned.current) {
      toast.error("Please log in first to access this page");
      hasWarned.current = true;
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
}

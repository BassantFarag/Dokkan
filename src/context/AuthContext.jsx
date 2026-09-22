// import React, { createContext, useContext, useState, useCallback } from "react";
// import { toast } from "react-toastify";
// import { useNavigate, useLocation } from "react-router-dom";

// const AuthContext = createContext(null);

// export function AuthProvider({ children }) {
//   const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem("token"));
//   const [user, setUser] = useState(() => {
//     try {
//       const raw = localStorage.getItem("user");
//       return raw ? JSON.parse(raw) : null;
//     } catch {
//       return null;
//     }
//   });

//   const loginSuccess = useCallback((token, userData) => {
//     localStorage.setItem("token", token);
//     if (userData) localStorage.setItem("user", JSON.stringify(userData));
//     setUser(userData || null);
//     setIsLoggedIn(true);
//   }, []);

//   // Merge a partial update (e.g. a newly saved address) into the current
//   // user object, both in state and localStorage, without a full re-login.
//   const updateUser = useCallback((partial) => {
//     setUser((prev) => {
//       const next = { ...(prev || {}), ...partial };
//       localStorage.setItem("user", JSON.stringify(next));
//       return next;
//     });
//   }, []);

//   const logoutUser = useCallback(() => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     setUser(null);
//     setIsLoggedIn(false);
//   }, []);

//   return (
//     <AuthContext.Provider value={{ isLoggedIn, user, loginSuccess, logoutUser, updateUser }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
//   return ctx;
// }


// export function useRequireAuth() {
//   const { isLoggedIn } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();

//   return useCallback(
//     (action, message = "Please log in first to continue") => {
//       if (isLoggedIn) {
//         action?.();
//         return true;
//       }
//       toast.error(message);
//       navigate("/login", { state: { from: location.pathname } });
//       return false;
//     },
//     [isLoggedIn, navigate, location]
//   );
// }

import { Outlet, ScrollRestoration } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./Navbar";
import Footer from './Footer';

export default function RootLayout() {
  return (

    <div className="flex min-h-screen flex-col bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white transition-colors">
      <ScrollRestoration />
      <Navbar />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />

      <ToastContainer
        position="top-center"
        rtl
        autoClose={3500}
        theme="colored"
        toastStyle={{ fontFamily: "inherit" }}
      />
    </div>
  );
}
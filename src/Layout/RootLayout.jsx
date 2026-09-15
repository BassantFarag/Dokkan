import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from './Footer';

export default function RootLayout() {
  return (
    
    <div className="flex min-h-screen flex-col bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white transition-colors">
      <Navbar />

     
      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
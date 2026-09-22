import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FileQuestion, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-brand-main px-6 pt-28 pb-20 md:pt-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md text-center"
      >
     
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl border border-brand-border bg-brand-card shadow-sm">
          <FileQuestion className="h-12 w-12 text-brand-gold" />
        </div>

        <h1 className="text-6xl font-extrabold tracking-tight text-brand-primary">404</h1>
        <h2 className="mt-2 text-xl font-bold text-brand-primary">Page Not Found</h2>
        
        <p className="mt-3 text-sm text-brand-secondary"> </p>

        
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-brand-gold px-6 py-3 text-sm font-bold text-zinc-950 transition-colors hover:bg-brand-gold-hover cursor-pointer"
          >
            <Home className="h-4 w-4" />
           
          </button>

          <button
            onClick={() => navigate(-1)}
            className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-brand-border bg-brand-card px-6 py-3 text-sm font-semibold text-brand-primary transition-colors hover:bg-brand-card-hover cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
         
          </button>
        </div>
      </motion.div>
    </div>
  );
}
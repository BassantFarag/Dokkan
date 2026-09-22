import React, { useState } from 'react';
import { motion } from "framer-motion";
import {
  ChevronRight,
  Calendar,
  Package,
  Truck,
  CheckCircle2,
  XCircle,
  ShoppingBag,
  Clock,
} from "lucide-react";

export default function OrderCard({ order, onClick }) {
  const [isHovered, setIsHovered] = useState(false);

  const getStatusMeta = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return {
          label: "Confirmed",
          icon: <CheckCircle2 className="h-3.5 w-3.5" />,
          classes:
            "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
        };
      case "shipped":
        return {
          label: "Shipped & Live",
          icon: <Truck className="h-3.5 w-3.5 animate-pulse" />,
          classes:
            "bg-brand-gold/15 text-brand-gold border-brand-gold/30 shadow-[0_0_12px_rgba(212,181,160,0.2)]",
        };
      case "cancelled":
        return {
          label: "Cancelled",
          icon: <XCircle className="h-3.5 w-3.5" />,
          classes: "bg-rose-500/10 text-rose-500 border-rose-500/20",
        };
      default:
        return {
          label: status || "Pending",
          icon: <Clock className="h-3.5 w-3.5" />,
          classes:
            "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
        };
    }
  };

  const statusMeta = getStatusMeta(order?.status);

  // Format Date
  const formatDate = (dateString) => {
    if (!dateString) return "Recent Order";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };


  const itemsCount = Array.isArray(order?.items)
    ? order.items.reduce((acc, item) => acc + (Number(item.quantity) || 1), 0)
    : 0;

  return (
    <motion.div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="group relative w-full cursor-pointer overflow-hidden rounded-2xl border border-brand-border/80 bg-brand-card/90 p-4 backdrop-blur-md transition-all duration-300 hover:border-brand-gold/60 hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_10px_30px_rgba(0,0,0,0.3)] sm:p-5 lg:p-6"
    >
  
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-brand-gold/0 via-brand-gold/10 to-brand-gold/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
     
        <div className="min-w-0 flex-1 space-y-2.5 sm:space-y-3">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          
            <div className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-brand-border/50 bg-brand-main/60 px-2.5 py-1 text-xs font-black tracking-wider text-brand-primary">
              <ShoppingBag className="h-3.5 w-3.5 text-brand-gold" />
              <span>
                #{String(order?._id || order?.id || "0000")
                  .substring(0, 8)
                  .toUpperCase()}
              </span>
            </div>

            <span
              className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider sm:px-3 sm:text-[11px] ${statusMeta.classes}`}
            >
              {statusMeta.icon}
              {statusMeta.label}
            </span>
          </div>

          {/* Details */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs font-medium text-brand-secondary sm:gap-x-4">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 shrink-0 text-brand-gold/80" />
              <span>{formatDate(order?.createdAt)}</span>
            </div>

            <span className="hidden text-brand-border sm:inline">•</span>

            <div className="flex items-center gap-1.5">
              <Package className="h-3.5 w-3.5 shrink-0 text-brand-gold/80" />
              <span className="text-brand-primary/90">
                {itemsCount} {itemsCount === 1 ? "item" : "items"} purchased
              </span>
            </div>
          </div>
        </div>

        <div className="flex w-full items-center justify-between gap-4 border-t border-brand-border/50 pt-3 sm:w-auto sm:shrink-0 sm:justify-end sm:gap-5 sm:border-t-0 sm:pt-0">
          <div className="flex flex-col gap-0.5 sm:items-end">
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-secondary sm:hidden">
              Total Amount
            </span>
            <span className="whitespace-nowrap text-lg font-black tracking-tight text-brand-gold transition-colors group-hover:text-brand-gold-hover sm:text-xl">
              EGP {Number(order?.totalPrice || 0).toLocaleString("en-US")}
            </span>
          </div>

          <motion.div
            animate={{ x: isHovered ? 3 : 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-brand-border bg-brand-main/80 text-brand-secondary shadow-inner transition-colors group-hover:border-brand-gold/50 group-hover:bg-brand-gold group-hover:text-brand-main sm:h-10 sm:w-10"
          >
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
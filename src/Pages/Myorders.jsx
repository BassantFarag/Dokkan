import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { myOrder } from "../api/ordersApi"; 
import OrderCard from '../components/OrderCard'
import { toast } from 'react-toastify';
import {
  ShoppingBag,
  PackageCheck,
  XCircle,
  Clock,
  Sparkles,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(false);
      const response = await myOrder();

      const ordersData = response?.data?.orders ||response?.data?.data ||[];
      setOrders(ordersData);
    } catch (err) {
      setError(true);
      toast.error("Failed to load your orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const activeCount = orders.filter((o) =>
    ["confirmed", "shipped", "pending"].includes(o.status?.toLowerCase())
  ).length;
  const completedCount = orders.filter(
    (o) => o.status?.toLowerCase() === "delivered"
  ).length;
  const cancelledCount = orders.filter(
    (o) => o.status?.toLowerCase() === "cancelled"
  ).length;

  return (
    /* pt-24 / md:pt-28 = مسافة الـ Navbar عشان المحتوى ميلزقش فيه */
    <div className="flex min-h-screen justify-center bg-brand-main px-4 pb-10 pt-24 font-sans text-brand-primary sm:px-6 sm:pb-12 md:px-10 md:pt-28">
      <div className="w-full max-w-5xl space-y-6 sm:space-y-8">
        
        {/* Header Section */}
        <div className="relative overflow-hidden rounded-3xl border border-brand-border/60 bg-gradient-to-r from-brand-card/90 via-brand-card/50 to-brand-card/90 p-5 backdrop-blur-xl shadow-2xl sm:p-8">
          <div className="relative z-10 flex flex-col justify-between gap-5 md:flex-row md:items-center md:gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-gold/30 bg-brand-gold/10 px-3 py-1 text-xs font-bold text-brand-gold">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Order Tracking Dashboard</span>
              </div>
              <h1 className="text-3xl font-black tracking-tight text-brand-primary sm:text-4xl">
                My Orders
              </h1>
            </div>

            {/* Stats Summary */}
            <div className="grid w-full grid-cols-3 gap-2 border-t border-brand-border/40 pt-4 sm:gap-3 md:w-auto md:gap-4 md:border-l md:border-t-0 md:pl-6 md:pt-0">
              <div className="flex min-w-0 flex-col items-start rounded-xl border border-brand-border/40 bg-brand-main/50 p-2 sm:p-2.5 md:min-w-24">
                <span className="flex flex-col items-start gap-1 text-[9px] font-bold uppercase tracking-normal text-brand-secondary sm:flex-row sm:items-center sm:text-[10px] sm:tracking-wider">
                  <Clock className="h-3 w-3 text-brand-gold" /> Active
                </span>
                <span className="mt-1 text-lg font-black text-brand-primary sm:text-xl">{activeCount}</span>
              </div>
              <div className="flex min-w-0 flex-col items-start rounded-xl border border-brand-border/40 bg-brand-main/50 p-2 sm:p-2.5 md:min-w-24">
                <span className="flex flex-col items-start gap-1 text-[9px] font-bold uppercase tracking-normal text-brand-secondary sm:flex-row sm:items-center sm:text-[10px] sm:tracking-wider">
                  <PackageCheck className="h-3 w-3 text-emerald-500" /> Done
                </span>
                <span className="mt-1 text-lg font-black text-emerald-500 sm:text-xl">{completedCount}</span>
              </div>
              <div className="flex min-w-0 flex-col items-start rounded-xl border border-brand-border/40 bg-brand-main/50 p-2 sm:p-2.5 md:min-w-24">
                <span className="flex flex-col items-start gap-1 text-[9px] font-bold uppercase tracking-normal text-brand-secondary sm:flex-row sm:items-center sm:text-[10px] sm:tracking-wider">
                  <XCircle className="h-3 w-3 text-rose-500" /> Cancelled
                </span>
                <span className="mt-1 text-lg font-black text-rose-500 sm:text-xl">{cancelledCount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Content Handling */}
        {loading ? (
          /* Loading State */
          <div className="space-y-3 sm:space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-36 w-full animate-pulse rounded-2xl border border-brand-border/40 bg-brand-card/40 sm:h-28" />
            ))}
          </div>
        ) : error ? (
        
          <div className="rounded-3xl border border-rose-500/20 bg-rose-500/5 px-4 py-12 text-center sm:py-16">
            <AlertCircle className="mx-auto mb-3 text-rose-500" size={40} />
            <h3 className="text-lg font-bold text-brand-primary">Failed to load orders</h3>
            <p className="mb-6 mt-1 text-xs text-brand-secondary">Something went wrong while communicating with the server.</p>
            <button
              onClick={fetchOrders}
              className="inline-flex items-center gap-2 rounded-xl bg-brand-gold px-5 py-2.5 text-xs font-bold text-brand-main transition-opacity hover:opacity-90"
            >
              <RefreshCw size={14} /> Try Again
            </button>
          </div>
        ) : orders.length > 0 ? (
          /* Orders List */
          <div className="space-y-3 sm:space-y-4">
            {orders.map((order) => (
              <OrderCard
                key={order._id || order.id}
                order={order}
                onClick={() => navigate(`/orders/${order._id || order.id}`)}
              />
            ))}
          </div>
        ) : (
          /* No Data*/
          <div className="rounded-3xl border border-dashed border-brand-border/60 bg-brand-card/20 px-4 py-12 text-center backdrop-blur-sm sm:py-20">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-brand-gold/20 bg-brand-gold/10 text-brand-gold">
              <ShoppingBag size={32} />
            </div>
            <h3 className="text-lg font-bold text-brand-primary">No orders placed yet</h3>
            <p className="mx-auto mb-6 mt-1 max-w-sm text-xs text-brand-secondary sm:text-sm">
              Looks like you haven't made any purchases yet.
            </p>
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center gap-2 rounded-xl bg-brand-gold px-6 py-3 text-xs font-bold text-brand-main shadow-lg shadow-brand-gold/20 transition-transform hover:scale-105 active:scale-95"
            >
              Start Shopping
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
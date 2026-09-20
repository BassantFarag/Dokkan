import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { myOrder } from "../api/ordersApi"; 
import OrderCard from "../components/OrderCard";
import {toast }from "react-toastify";
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
    <div className="min-h-screen bg-brand-main p-4 sm:p-6 md:p-10 font-sans flex justify-center text-brand-primary">
      <div className="w-full max-w-5xl space-y-8">
        
        {/* Header Section */}
        <div className="relative overflow-hidden rounded-3xl border border-brand-border/60 bg-gradient-to-r from-brand-card/90 via-brand-card/50 to-brand-card/90 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-gold/30 bg-brand-gold/10 px-3 py-1 text-xs font-bold text-brand-gold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Order Tracking Dashboard</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-brand-primary tracking-tight">
                My Orders
              </h1>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 border-t md:border-t-0 md:border-l border-brand-border/40 pt-4 md:pt-0 md:pl-6">
              <div className="flex flex-col items-start p-2.5 rounded-xl bg-brand-main/50 border border-brand-border/40">
                <span className="text-[10px] uppercase tracking-wider text-brand-secondary font-bold flex items-center gap-1">
                  <Clock className="w-3 h-3 text-brand-gold" /> Active
                </span>
                <span className="text-xl font-black text-brand-primary mt-1">{activeCount}</span>
              </div>
              <div className="flex flex-col items-start p-2.5 rounded-xl bg-brand-main/50 border border-brand-border/40">
                <span className="text-[10px] uppercase tracking-wider text-brand-secondary font-bold flex items-center gap-1">
                  <PackageCheck className="w-3 h-3 text-emerald-500" /> Done
                </span>
                <span className="text-xl font-black text-emerald-500 mt-1">{completedCount}</span>
              </div>
              <div className="flex flex-col items-start p-2.5 rounded-xl bg-brand-main/50 border border-brand-border/40">
                <span className="text-[10px] uppercase tracking-wider text-brand-secondary font-bold flex items-center gap-1">
                  <XCircle className="w-3 h-3 text-rose-500" /> Cancelled
                </span>
                <span className="text-xl font-black text-rose-500 mt-1">{cancelledCount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Content Handling */}
        {loading ? (
          /* Loading State */
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-28 w-full animate-pulse rounded-2xl border border-brand-border/40 bg-brand-card/40" />
            ))}
          </div>
        ) : error ? (
        
          <div className="text-center py-16 px-4 border border-rose-500/20 rounded-3xl bg-rose-500/5">
            <AlertCircle className="mx-auto text-rose-500 mb-3" size={40} />
            <h3 className="text-lg font-bold text-brand-primary">Failed to load orders</h3>
            <p className="text-xs text-brand-secondary mt-1 mb-6">Something went wrong while communicating with the server.</p>
            <button
              onClick={fetchOrders}
              className="inline-flex items-center gap-2 rounded-xl bg-brand-gold px-5 py-2.5 text-xs font-bold text-brand-main hover:opacity-90 transition-opacity"
            >
              <RefreshCw size={14} /> Try Again
            </button>
          </div>
        ) : orders.length > 0 ? (
          /* Orders List */
          <div className="space-y-4">
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
          <div className="text-center py-20 px-4 border border-dashed border-brand-border/60 rounded-3xl bg-brand-card/20 backdrop-blur-sm">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-gold/10 text-brand-gold mb-4 border border-brand-gold/20">
              <ShoppingBag size={32} />
            </div>
            <h3 className="text-lg font-bold text-brand-primary">No orders placed yet</h3>
            <p className="text-xs sm:text-sm text-brand-secondary max-w-sm mx-auto mt-1 mb-6">
              Looks like you haven't made any purchases yet.
            </p>
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center gap-2 rounded-xl bg-brand-gold px-6 py-3 text-xs font-bold text-brand-main transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-brand-gold/20"
            >
              Start Shopping
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

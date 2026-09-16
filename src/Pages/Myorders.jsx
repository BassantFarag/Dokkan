import React, { useState, useEffect } from 'react';
import axios from 'axios';
import OrderCard from '../components/OrderCard';
import { ShoppingBag, CheckCircle, XCircle } from 'lucide-react';

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLiveOrders = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/orders/my-orders');
        const ordersData = response?.data?.orders || response?.data?.data || response?.data;
        
        if (Array.isArray(ordersData)) {
          setOrders(ordersData);
          setLoading(false);
          return;
        }
      } catch (error) {
        console.error("Failed to fetch live orders:", error);
      }

      const mockOrders = [
        { _id: "EE3F936C", createdAt: "2026-09-14T12:00:00.000Z", items: [{}, {}], totalPrice: 1250.00, currency: "EGP", status: "Confirmed" },
        { _id: "BFAC99DD", createdAt: "2026-09-14T13:00:00.000Z", items: Array(3).fill({}), totalPrice: 653.06, currency: "EGP", status: "Cancelled" },
        { _id: "882981B7", createdAt: "2026-09-14T14:00:00.000Z", items: [{}], totalPrice: 208.46, currency: "EGP", status: "Confirmed" },
        { _id: "0F3FBC72", createdAt: "2026-09-13T10:00:00.000Z", items: [{}], totalPrice: 159600, currency: "EGP", status: "Shipped" }
      ];
      setOrders(mockOrders);
      setLoading(false);
    };

    fetchLiveOrders();
  }, []);

  const totalCount = orders.length;
  const confirmedCount = orders.filter(o => o.status?.toLowerCase() === 'confirmed' || o.status?.toLowerCase() === 'shipped').length;
  const cancelledCount = orders.filter(o => o.status?.toLowerCase() === 'cancelled').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-main text-brand-primary flex items-center justify-center font-sans">
        <div className="animate-spin rounded-full h-9 w-9 border-b-2 border-brand-gold"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-main p-4 md:p-10 font-sans flex justify-center transition-colors duration-300" dir="ltr">
      <div className="w-full max-w-4xl space-y-8">
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#B29573]/20 pb-5">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-brand-primary tracking-tight">
              My Orders
            </h1>
           
          </div>
          <span className="self-start md:self-center bg-brand-gold/10 text-brand-gold border border-[#B29573]/30 px-3 py-1 text-xs font-bold rounded-full">
            {totalCount} Orders Total
          </span>
        </div>

        <div className="space-y-4">
          {orders.length > 0 ? (
            orders.map((order) => (
              <OrderCard key={order._id || order.id} order={order} />
            ))
          ) : (
            <div className="text-center text-brand-secondary py-16 border border-dashed border-[#B29573]/40 rounded-2xl bg-brand-card/20">
              <ShoppingBag className="mx-auto text-brand-border mb-3" size={40} />
              <p className="font-semibold text-sm">No orders recorded in your history yet.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

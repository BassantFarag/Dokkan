import React from 'react';
import { ChevronRight, Calendar, Package, Check, X, Truck } from 'lucide-react';

export default function OrderCard({ order }) {
  
  const getStatusMeta = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return {
          label: 'Confirmed',
          icon: <Check size={12} />,
          classes: 'bg-blue-500/10 text-blue-500 dark:bg-blue-500/20 dark:text-blue-400 border border-blue-500/20'
        };
      case 'cancelled':
        return {
          label: 'Cancelled',
          icon: <X size={12} />,
          classes: 'bg-red-500/10 text-red-500 dark:bg-red-500/20 dark:text-red-400 border border-red-500/20'
        };
      case 'shipped':
        return {
          label: 'Shipped & Live',
          icon: <Truck size={12} className="animate-pulse" />,
          classes: 'bg-cyan-500/10 text-cyan-500 dark:bg-cyan-500/20 dark:text-cyan-400 border border-cyan-500/20'
        };
      default:
        return {
          label: status || 'Pending',
          icon: <Package size={12} />,
          classes: 'bg-brand-card-hover/40 text-brand-secondary border border-[#B29573]/30'
        };
    }
  };

  const statusMeta = getStatusMeta(order?.status);

  const formatDate = (dateString) => {
    if (!dateString) return 'Recent Order';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const itemsCount = Array.isArray(order?.items) ? order.items.length : (order?.itemsCount || 1);

  return (
    <div className="w-full bg-brand-card hover:bg-brand-card-hover border border-[#B29573]/50 rounded-2xl p-5 md:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition-all duration-300 shadow-sm hover:shadow-md group cursor-pointer">
      
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="text-brand-primary font-bold text-base uppercase tracking-tight">
            #{String(order?._id || order?.id || '0000').substring(0, 8)}
          </span>
          <span className={`flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-bold rounded-md uppercase tracking-wider ${statusMeta.classes}`}>
            {statusMeta.icon}
            {statusMeta.label}
          </span>
        </div>
        
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-brand-secondary">
          <div className="flex items-center gap-1">
            <Calendar size={13} className="opacity-70" />
            <span>{formatDate(order?.createdAt || order?.date)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Package size={13} className="opacity-70" />
            <span className="font-semibold text-brand-primary/80">{itemsCount} item(s) purchased</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-[#B29573]/20">
        <div className="flex flex-col sm:items-end">
          <span className="text-xs text-brand-secondary font-medium block sm:hidden">Total Price</span>
          <span className="text-brand-gold group-hover:text-brand-gold-hover font-black text-lg md:text-xl tracking-wide transition-colors duration-200">
            {order?.currency || 'EGP'} {Number(order?.totalPrice || order?.price || 0).toLocaleString('en-US')}
          </span>
        </div>
        <div className="p-1.5 rounded-full bg-brand-main group-hover:bg-brand-gold/10 border border-[#B29573]/40 group-hover:border-[#B29573] transition-all duration-200">
          <ChevronRight 
            size={16} 
            className="text-brand-secondary group-hover:text-brand-gold transition-colors transform group-hover:translate-x-0.5 duration-200" 
          />
        </div>
      </div>

    </div>
  );
}

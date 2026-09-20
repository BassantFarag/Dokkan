import React from 'react';
import { ChevronRight, Calendar, Package, Check, Truck ,CheckCircle2, XCircle ,ShoppingBag , Clock} from 'lucide-react';

export default function OrderCard({ order , onClick}) {
  const [isHovered, setIsHovered] = useState(false);
  
  const getStatusMeta = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return {
          label: 'Confirmed',
         icon: <CheckCircle2 className="w-3.5 h-3.5" />,
          classes:
            "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
        };
      case 'cancelled':
        return {
          label: 'Cancelled',
          icon: <CheckCircle2 className="w-3.5 h-3.5" />,
          classes:
            "bg-emerald-500/15 text-emerald-500 border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.15)]",
        };
      case 'shipped':
        return {
          label: 'Shipped & Live',
          icon: <Truck className="w-3.5 h-3.5 animate-pulse" />,
         classes:
            "bg-brand-gold/15 text-brand-gold border-brand-gold/30 shadow-[0_0_12px_rgba(212,181,160,0.2)]",
        };
        case "cancelled":
        return {
          label: "Cancelled",
          icon: <XCircle className="w-3.5 h-3.5" />,
          classes:
            "bg-rose-500/10 text-rose-500 border-rose-500/20",
        };
      default:
        return {
          label: status || 'Pending',
          icon: <Clock className="w-3.5 h-3.5" />,
          classes:
            "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
        };
    }
  };

  const statusMeta = getStatusMeta(order?.status);

  //Format Date
  const formatDate = (dateString) => {
    if (!dateString) return 'Recent Order';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const itemsCount = Array.isArray(order?.items)
    ? order.items.reduce((acc, item) => acc + (item.quantity || 1), 0)
    : 1;

  return (
    <motion.div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="group relative w-full cursor-pointer rounded-2xl border border-brand-border/80 bg-brand-card/90 p-5 sm:p-6 backdrop-blur-md transition-all duration-300 hover:border-brand-gold/60 hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_10px_30px_rgba(0,0,0,0.3)]"
    >
      {/* Background Subtle Gold Glow on Hover */}
      <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-brand-gold/0 via-brand-gold/10 to-brand-gold/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" />

      <div className="relative z-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        {/* Left Side: Order Info */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            {/* Order ID Tag */}
            <div className="inline-flex items-center gap-1.5 rounded-lg bg-brand-main/60 px-2.5 py-1 text-xs font-black tracking-wider text-brand-primary border border-brand-border/50">
              <ShoppingBag className="w-3.5 h-3.5 text-brand-gold" />
              <span>
                #{String(order?._id || order?.id || "0000")
                  .substring(0, 8)
                  .toUpperCase()}
              </span>
            </div>

            {/* Status Badge */}
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider ${statusMeta.classes}`}
            >
              {statusMeta.icon}
              {statusMeta.label}
            </span>
          </div>

          {/* Details Meta */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-brand-secondary font-medium">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-brand-gold/80" />
              <span>{formatDate(order?.createdAt)}</span>
            </div>

            <span className="hidden text-brand-border sm:inline">•</span>

            <div className="flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5 text-brand-gold/80" />
              <span className="text-brand-primary/90">
                {itemsCount} {itemsCount === 1 ? "item" : "items"} purchased
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Total Price & Interactive Action */}
        <div className="flex items-center justify-between border-t border-brand-border/50 pt-3 sm:justify-end sm:gap-6 sm:border-t-0 sm:pt-0">
          <div className="flex flex-col sm:items-end">
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-secondary sm:hidden">
              Total Amount
            </span>
            <span className="text-lg sm:text-xl font-black text-brand-gold tracking-tight group-hover:text-brand-gold-hover transition-colors">
              EGP {Number(order?.totalPrice || 0).toLocaleString("en-US")}
            </span>
          </div>

          {/* Arrow Button with Subtle Motion */}
          <motion.div
            animate={{ x: isHovered ? 3 : 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-brand-border bg-brand-main/80 text-brand-secondary shadow-inner transition-colors group-hover:border-brand-gold/50 group-hover:bg-brand-gold group-hover:text-brand-main"
          >
            <ChevronRight className="w-5 h-5" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

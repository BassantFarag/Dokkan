import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AnimatePresence, motion } from "framer-motion";
import {
  Trash2,
  Minus,
  Plus,
  Tag,
  ArrowLeft,
  ShoppingBag,
  Loader2,
  X,
} from "lucide-react";
import {
  getMyCart,
  updateItemQuantity,
  removeItemFromCart,
  applyCoupon,
  removeCoupon,
} from "../api/cartsApi";

const TAX_RATE = 0.14;
const FREE_SHIPPING_THRESHOLD = 1000;
const SHIPPING_FEE = 50;


const getId = (item) =>
  item.productId ||
  (typeof item.product === "string" ? item.product : item.product?._id) ||
  item._id ||
  item.id;
const getQty = (item) => item.quantity ?? item.qty ?? 1;
const getPrice = (item) => item.price ?? item.product?.price ?? 0;
const getName = (item) => item.title ?? item.name ?? item.product?.title ?? item.product?.name ?? "Product";
const getImage = (item) =>
  item.image ||
  item.product?.image ||
  (Array.isArray(item.product?.images) ? item.product.images[0] : null);

export default function Cart() {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const [coupon, setCoupon] = useState("");
  const [couponInfo, setCouponInfo] = useState(null); 
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState("");

  const fetchCart = async () => {
    try {
      setError("");
      const res = await getMyCart();
      const data = res.data ?? {};
      const cartItems = data.items ?? [];
      setItems(Array.isArray(cartItems) ? cartItems : []);
      if (data.coupon) setCouponInfo(data.coupon);
    } catch (err) {
      setError(
        err?.response?.data?.message || "Couldn't load your cart. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + getPrice(item) * getQty(item), 0),
    [items]
  );

  const discount = couponInfo?.discount ?? 0;
  const shipping = subtotal === 0 ? 0 : subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const tax = Math.max(subtotal - discount, 0) * TAX_RATE;
  const total = Math.max(subtotal - discount, 0) + shipping + tax;

  const handleQtyChange = async (item, nextQty) => {
    const id = getId(item);
    if (nextQty < 1 || updatingId) return;
    setUpdatingId(id);
    
    setItems((prev) =>
      prev.map((it) => (getId(it) === id ? { ...it, quantity: nextQty } : it))
    );

    try {
      await updateItemQuantity({ productId: id, quantity: nextQty });
    } catch (err) {
      const msg = err?.response?.data?.message || "Couldn't update quantity.";
      setError(msg);
      toast.error(msg);
      fetchCart(); 
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRemove = async (item) => {
    const id = getId(item);
    setUpdatingId(id);
    try {
      await removeItemFromCart(id);
      setItems((prev) => prev.filter((it) => getId(it) !== id));
      toast.info("Item removed from cart");
    } catch (err) {
      const msg = err?.response?.data?.message || "Couldn't remove this item.";
      setError(msg);
      toast.error(msg);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!coupon.trim()) return;
    
    setCouponLoading(true);
    setCouponError("");
    
    try {
      const res = await applyCoupon({ code: coupon.trim() });
      const data = res.data ?? {};
      
      setCouponInfo({
        code: data.coupon || coupon.trim(),
        discount: data.discountAmount ?? 0,
      });
      toast.success(data.message || "Coupon applied successfully!");
      setCoupon("");
    } catch (err) {
      const msg = err?.response?.data?.message || "That code didn't work.";
      setCouponError(msg);
      toast.error(msg);
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = async () => {
    try {
      const res = await removeCoupon();
      const data = res.data ?? {};

      setCouponInfo(null);
      setCoupon("");

      toast.success(data.message || "Coupon removed successfully!");
      fetchCart();
    } catch (err) {
      const msg = err?.response?.data?.message || "Couldn't remove coupon.";
      toast.error(msg);
    } 
  };

  const format = (n) => `EGP ${Math.round(n).toLocaleString()}`;

  return (
    <div className="min-h-screen bg-brand-main pt-28 pb-20 md:pt-32">
      <div className="mx-auto max-w-7xl px-6">
        <h1 className="text-3xl font-extrabold text-brand-primary">Shopping Cart</h1>

        {error && (
          <div className="mt-4 rounded-xl border border-red-600/30 bg-red-600/10 px-4 py-3 text-sm text-red-600 dark:border-red-400/30 dark:bg-red-400/10 dark:text-red-400">
            {error}
          </div>
        )}

        {loading ? (
          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="h-28 animate-pulse rounded-2xl border border-brand-border bg-brand-card"
                />
              ))}
            </div>
            <div className="h-72 animate-pulse rounded-2xl border border-brand-border bg-brand-card" />
          </div>
        ) : items.length === 0 ? (
          <div className="mt-16 flex flex-col items-center justify-center gap-4 rounded-2xl border border-brand-border bg-brand-card py-20 text-center">
            <ShoppingBag className="h-10 w-10 text-brand-secondary" />
            <div>
              <p className="text-lg font-bold text-brand-primary">Your cart is empty</p>
              <p className="mt-1 text-sm text-brand-secondary">
                Looks like you haven't added anything yet.
              </p>
            </div>
            <button
              onClick={() => navigate("/shop")}
              className="mt-2 rounded-full bg-brand-gold px-6 py-2.5 text-xs font-semibold text-zinc-950 transition-colors hover:bg-brand-gold-hover"
            >
              Browse the shop
            </button>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <div className="rounded-2xl border border-brand-border bg-brand-card p-4 sm:p-6">
                <AnimatePresence initial={false}>
                  {items.map((item, idx) => {
                    const id = getId(item);
                    const qty = getQty(item);
                    const image = getImage(item);
                    const isUpdating = updatingId === id;
                    return (
                      <motion.div
                        key={id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0, marginBottom: 0 }}
                        transition={{ duration: 0.2 }}
                        className={`flex items-center gap-4 py-4 ${
                          idx !== 0 ? "border-t border-brand-border" : ""
                        }`}
                      >
                        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-brand-card-hover sm:h-20 sm:w-20">
                          {image ? (
                            <img
                              src={image}
                              alt={getName(item)}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <ShoppingBag className="h-6 w-6 text-brand-secondary" />
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-bold text-brand-primary sm:text-base">
                            {getName(item)}
                          </p>
                          <p className="mt-1 text-sm font-semibold text-brand-gold">
                            {format(getPrice(item))}
                          </p>

                          <div className="mt-2 flex items-center gap-2">
                            <button
                              disabled={isUpdating || qty <= 1}
                              onClick={() => handleQtyChange(item, qty - 1)}
                              className="flex h-7 w-7 items-center justify-center rounded-lg border border-brand-border text-brand-primary transition-colors hover:bg-brand-card-hover disabled:opacity-40"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="w-6 text-center text-sm font-semibold text-brand-primary">
                              {isUpdating ? (
                                <Loader2 className="mx-auto h-3.5 w-3.5 animate-spin" />
                              ) : (
                                qty
                              )}
                            </span>
                            <button
                              disabled={isUpdating}
                              onClick={() => handleQtyChange(item, qty + 1)}
                              className="flex h-7 w-7 items-center justify-center rounded-lg border border-brand-border text-brand-primary transition-colors hover:bg-brand-card-hover disabled:opacity-40"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="flex flex-col items-end justify-between self-stretch">
                          <button
                            onClick={() => handleRemove(item)}
                            disabled={isUpdating}
                            className="text-brand-secondary transition-colors hover:text-red-600 dark:hover:text-red-400 disabled:opacity-40"
                            aria-label="Remove item"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                          <p className="text-sm font-bold text-brand-primary">
                            {format(getPrice(item) * qty)}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

              <div className="rounded-2xl border border-brand-border bg-brand-card p-4 sm:p-6">
                <h4 className="flex items-center gap-2 text-sm font-bold text-brand-primary">
                  <Tag className="h-4 w-4 text-brand-gold" /> Coupon Code
                </h4>

                {couponInfo ? (
                  <div className="mt-3 flex items-center justify-between rounded-xl border border-brand-gold bg-brand-card-hover px-4 py-2.5">
                    <span className="text-sm font-semibold text-brand-primary">
                      {couponInfo.code} applied
                    </span>
                    <button
                      onClick={handleRemoveCoupon}
                      className="flex items-center gap-1 text-xs font-medium text-brand-secondary hover:text-red-600 dark:hover:text-red-400"
                    >
                      <X className="h-3.5 w-3.5" /> Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="mt-3 flex gap-2">
                    <input
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                      placeholder="Enter coupon code"
                      className="flex-1 rounded-xl border border-brand-border bg-brand-main px-4 py-2.5 text-sm text-brand-primary placeholder-brand-secondary focus:border-brand-gold focus:outline-none"
                    />
                    <button
                      type="submit"
                      disabled={couponLoading}
                      className="rounded-xl border border-brand-gold px-4 py-2.5 text-sm font-semibold text-brand-gold transition-colors hover:bg-brand-gold hover:text-zinc-950 disabled:opacity-50"
                    >
                      {couponLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply"}
                    </button>
                  </form>
                )}
                {couponError && <p className="mt-2 text-xs text-red-600 dark:text-red-400">{couponError}</p>}
              </div>

              <button
                onClick={() => navigate("/shop")}
                className="flex items-center gap-1.5 text-sm font-semibold text-brand-gold hover:text-brand-gold-hover"
              >
                <ArrowLeft className="h-4 w-4" /> Continue Shopping
              </button>
            </div>

            <div className="lg:sticky lg:top-28 lg:self-start">
              <div className="rounded-2xl border border-brand-border bg-brand-card p-6">
                <h3 className="text-lg font-bold text-brand-primary">Order Summary</h3>

                <div className="mt-5 space-y-3 text-sm">
                  <div className="flex justify-between text-brand-secondary">
                    <span>Subtotal</span>
                    <span className="text-brand-primary">{format(subtotal)}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-brand-secondary">
                      <span>Discount</span>
                      <span className="text-brand-gold">-{format(discount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-brand-secondary">
                    <span>Shipping</span>
                    <span className="text-brand-primary">
                      {shipping === 0 ? "Free" : format(shipping)}
                    </span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-xs text-brand-secondary">
                      Free shipping on orders over {format(FREE_SHIPPING_THRESHOLD)}
                    </p>
                  )}

                  <div className="flex justify-between text-brand-secondary">
                    <span>Tax ({Math.round(TAX_RATE * 100)}%)</span>
                    <span className="text-brand-primary">{format(tax)}</span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-brand-border pt-4">
                  <span className="text-base font-bold text-brand-primary">Total</span>
                  <span className="text-lg font-extrabold text-brand-gold">{format(total)}</span>
                </div>

                <button
                  onClick={() => navigate("/checkout")}
                  className="mt-6 w-full rounded-full bg-brand-gold py-3 text-sm font-bold text-zinc-950 transition-colors hover:bg-brand-gold-hover"
                >
                  Proceed to Checkout
                </button>
                <button
                  onClick={() => navigate("/shop")}
                  className="mt-3 w-full text-center text-xs font-semibold text-brand-gold hover:text-brand-gold-hover"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
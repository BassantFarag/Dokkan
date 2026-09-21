import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import {
  MapPin,
  CreditCard,
  FileText,
  ShoppingBag,
  CheckCircle2,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { getMyCart } from "../api/cartsApi";
import { placeOrder } from "../api/ordersApi";

const FREE_SHIPPING_THRESHOLD = 500;
const SHIPPING_FEE = 50;
const TAX_RATE = 0.14;

const initialForm = {
  fullName: "",
  phone: "",
  country: "Egypt",
  city: "",
  address: "",
  postalCode: "",
  customerNote: "",
};

const getId = (item) => item._id || item.id || item.product?._id;
const getName = (item) => item.title || item.name || item.product?.title || "Product";
const getPrice = (item) => item.price || item.product?.price || 0;
const getQty = (item) => item.quantity || item.qty || 1;
const getImage = (item) => item.image || item.product?.image || item.product?.images?.[0] || null;

export default function Checkout() {
  const navigate = useNavigate();

 const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [placed, setPlaced] = useState(false);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await getMyCart();
        setCart(res.data);
      } catch {
        toast.error("Couldn't load your cart.");
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);
  const items = cart?.items || [];
 
  const calculatedSubtotal = useMemo(
    () => items.reduce((sum, item) => sum + getPrice(item) * getQty(item), 0),
    [items]
  );
  
 const subtotal = cart?.subtotal ?? calculatedSubtotal;
  const shipping = subtotal === 0 ? 0 : subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const tax = subtotal * TAX_RATE;
  const total = cart?.total ?? (subtotal + shipping + tax);
  const format = (n) => `EGP ${Math.round(n).toLocaleString()}`;
  
  useEffect(() => {
    if (!loading && items.length === 0 && !placed) {
      navigate("/carts", { replace: true });
    }
  }, [loading, items, placed, navigate]);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const next = {};
    if (!form.fullName.trim()) next.fullName = "Full name is required";
    if (!form.phone.trim()) next.phone = "Phone number is required";
    if (!form.country.trim()) next.country = "Country is required";
    if (!form.city.trim()) next.city = "City is required";
    if (!form.address.trim()) next.address = "Address is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate() || submitting) return;

    setSubmitting(true);
    setSubmitError("");
    try {
      await placeOrder({
        shippingAddress: {
          fullName: form.fullName,
          phone: form.phone,
          country: form.country,
          city: form.city,
          address: form.address,
          postalCode: form.postalCode,
        },
        paymentMethod: "cash",
        customerNote: form.customerNote,
      });
      toast.success("Order placed successfully!");
      setPlaced(true);
      setTimeout(() => navigate("/myorders"), 1800);
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message || "Couldn't place your order. Please try again.";
        toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = (field) =>
    `w-full rounded-xl border bg-brand-main px-4 py-2.5 text-sm text-brand-primary placeholder-brand-secondary focus:outline-none transition-colors ${
      errors[field]
        ? "border-red-600 focus:border-red-600 dark:border-red-400 dark:focus:border-red-400"
        : "border-brand-border focus:border-brand-gold"
    }`;

  return (
    <div className="relative min-h-screen bg-brand-main pt-28 pb-20 md:pt-32">
      <div className="mx-auto max-w-7xl px-6">
        <h1 className="text-3xl font-extrabold text-brand-primary">Checkout</h1>

        {loading ? (
          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="h-96 animate-pulse rounded-2xl border border-brand-border bg-brand-card lg:col-span-2" />
            <div className="h-72 animate-pulse rounded-2xl border border-brand-border bg-brand-card" />
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3"
          >
            {/* Left: shipping & payment &notes */}
            <div className="space-y-6 lg:col-span-2">
              <section className="rounded-2xl border border-brand-border bg-brand-card p-6">
                <h3 className="flex items-center gap-2 text-sm font-bold text-brand-primary">
                  <MapPin className="h-4 w-4 text-brand-gold" /> Shipping Address
                </h3>

                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-brand-secondary">
                      Full Name *
                    </label>
                    <input
                      value={form.fullName}
                      onChange={handleChange("fullName")}
                      className={inputClass("fullName")}
                    />
                    {errors.fullName && (
                      <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.fullName}</p>
                    )}
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-brand-secondary">
                      Phone *
                    </label>
                    <input
                      value={form.phone}
                      onChange={handleChange("phone")}
                      className={inputClass("phone")}
                    />
                    {errors.phone && (
                      <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.phone}</p>
                    )}
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-brand-secondary">
                      Country *
                    </label>
                    <input
                      value={form.country}
                      onChange={handleChange("country")}
                      className={inputClass("country")}
                    />
                    {errors.country && (
                      <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.country}</p>
                    )}
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-brand-secondary">
                      City *
                    </label>
                    <input
                      value={form.city}
                      onChange={handleChange("city")}
                      className={inputClass("city")}
                    />
                    {errors.city && (
                      <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.city}</p>
                    )}
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-xs font-medium text-brand-secondary">
                      Address *
                    </label>
                    <input
                      value={form.address}
                      onChange={handleChange("address")}
                      className={inputClass("address")}
                    />
                    {errors.address && (
                      <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.address}</p>
                    )}
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-brand-secondary">
                      Postal Code
                    </label>
                    <input
                      value={form.postalCode}
                      onChange={handleChange("postalCode")}
                      className={inputClass("postalCode")}
                    />
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-brand-border bg-brand-card p-6">
                <h3 className="flex items-center gap-2 text-sm font-bold text-brand-primary">
                  <CreditCard className="h-4 w-4 text-brand-gold" /> Payment Method
                </h3>
                <div className="mt-4 flex items-center gap-3 rounded-xl border border-brand-gold bg-brand-card-hover px-4 py-3.5">
                  <CreditCard className="h-4 w-4 text-brand-gold" />
                  <div>
                    <p className="text-sm font-semibold text-brand-primary">Cash on Delivery</p>
                    <p className="text-xs text-brand-secondary">Pay when you receive your order</p>
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-brand-border bg-brand-card p-6">
                <h3 className="flex items-center gap-2 text-sm font-bold text-brand-primary">
                  <FileText className="h-4 w-4 text-brand-gold" /> Order Notes (Optional)
                </h3>
                <textarea
                  value={form.customerNote}
                  onChange={handleChange("customerNote")}
                  rows={3}
                  placeholder="Any special instructions for your order..."
                  className="mt-4 w-full resize-none rounded-xl border border-brand-border bg-brand-main px-4 py-2.5 text-sm text-brand-primary placeholder-brand-secondary focus:border-brand-gold focus:outline-none"
                />
              </section>
            </div>

            {/* Right: order summary */}
            <div className="lg:sticky lg:top-28 lg:self-start">
              <div className="rounded-2xl border border-brand-border bg-brand-card p-6">
                <h3 className="text-lg font-bold text-brand-primary">Order Summary</h3>

                <div className="mt-4 max-h-56 space-y-3 overflow-y-auto pr-1">
                  {items.map((item) => {
                    const image = getImage(item);
                    return (
                      <div key={getId(item)} className="flex items-center gap-3">
                        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-brand-card-hover">
                          {image ? (
                            <img src={image} alt={getName(item)} className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <ShoppingBag className="h-4 w-4 text-brand-secondary" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-brand-primary">
                            {getName(item)}
                          </p>
                          <p className="text-xs text-brand-secondary">x{getQty(item)}</p>
                        </div>
                        <p className="shrink-0 text-sm font-semibold text-brand-primary">
                          {format(getPrice(item) * getQty(item))}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 space-y-2 border-t border-brand-border pt-4 text-sm">
                  <div className="flex justify-between text-brand-secondary">
                    <span>Subtotal</span>
                    <span className="text-brand-primary">{format(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-brand-secondary">
                    <span>Shipping</span>
                    <span className="text-brand-primary">
                      {shipping === 0 ? "Free" : format(shipping)}
                    </span>
                  </div>
                  <div className="flex justify-between text-brand-secondary">
                    <span>Tax ({Math.round(TAX_RATE * 100)}%)</span>
                    <span className="text-brand-primary">{format(tax)}</span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-brand-border pt-4">
                  <span className="text-base font-bold text-brand-primary">Total</span>
                  <span className="text-lg font-extrabold text-brand-gold">{format(total)}</span>
                </div>

                {submitError && (
                  <p className="mt-3 text-xs text-red-600 dark:text-red-400">{submitError}</p>
                )}

                <button
                  type="submit"
                  disabled={submitting || items.length === 0}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-brand-gold py-3 text-sm font-bold text-zinc-950 transition-colors hover:bg-brand-gold-hover disabled:opacity-60"
                >
                  {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  Place Order
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/carts")}
                  className="mt-3 flex w-full items-center justify-center gap-1.5 text-xs font-semibold text-brand-gold hover:text-brand-gold-hover"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Back to Cart
                </button>
              </div>
            </div>
          </form>
        )}
      </div>

      {/* Success overlay */}
      <AnimatePresence>
        {placed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center gap-3 rounded-2xl bg-brand-card px-10 py-8 text-center"
            >
              <CheckCircle2 className="h-10 w-10 text-brand-gold" />
              <p className="text-base font-bold text-brand-primary">Order placed successfully</p>
              <p className="text-sm text-brand-secondary">Taking you to your orders…</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
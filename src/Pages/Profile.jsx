import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Mail,
  Phone,
  ShieldCheck,
  LogOut,
  MapPin,
  Loader2,
  Camera,
  Pencil,
  Check,
  X,
  Trash2,
  Package,
  Heart,
  ChevronRight,
  CalendarDays,
  PackageCheck,
  Wallet,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { logout as logoutApi } from "../api/authApi";
import { updateUserProfile } from "../api/userApi";
import { myOrder } from "../api/ordersApi";
import Avatar from "../components/Avatar";
import { getAvatarUrl, getDisplayName, getUserId } from "../utils/user";
import { resizeImageToDataUrl } from "../utils/imageResize";

const MAX_FILE_MB = 8;
const NAME_MIN = 2;
const NAME_MAX = 30;
const cardClass =
  "rounded-3xl border border-[#e4dcd5] bg-[#fbf8f5] p-6 shadow-sm dark:border-[#38302c] dark:bg-[#1a1513] sm:p-7";
const iconBubble =
  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#eae1d9] text-[#c2a38e] dark:bg-[#2e2623]";
export default function Profile() {
  const { user, logoutUser, updateUser } = useAuth();
  const navigate = useNavigate();
  const role = (user?.role || user?.type || user?.accountType || "").toString().toLowerCase();
  const isAdmin = role === "admin" || user?.isAdmin === true;
  const roleLabel = isAdmin ? "Admin" : "Customer";
  const displayName = getDisplayName(user);
  const photoUrl = getAvatarUrl(user);
  const userId = getUserId(user);
  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : null;
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState("");
  const [savingName, setSavingName] = useState(false);
  const fileRef = useRef(null);
  const [avatarBusy, setAvatarBusy] = useState(false);
  const [address, setAddress] = useState(user?.address || "");
  const [savingAddress, setSavingAddress] = useState(false);
  const [orders, setOrders] = useState(null); // null = loading

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await myOrder();
        const list = res?.data?.orders || res?.data?.data || [];
        if (!cancelled) setOrders(Array.isArray(list) ? list : []);
      } catch {
        if (!cancelled) setOrders([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const stats = useMemo(() => {
    const list = orders || [];
    const delivered = list.filter((o) => o.status?.toLowerCase() === "delivered").length;
    const spent = list
      .filter((o) => o.status?.toLowerCase() !== "cancelled")
      .reduce((sum, o) => sum + (Number(o.totalPrice) || 0), 0);
    return { total: list.length, delivered, spent };
  }, [orders]);

  const requireUserId = () => {
    if (!userId) {
      toast.error("Couldn't find your account, please log in again");
      return false;
    }
    return true;
  };

  const startEditName = () => {
    setNameDraft(displayName);
    setEditingName(true);
  };

  const cancelEditName = () => {
    setEditingName(false);
    setNameDraft("");
  };

  const handleSaveName = async () => {
    const next = nameDraft.trim();
    if (next.length < NAME_MIN) {
      toast.error(`Name must be at least ${NAME_MIN} characters`);
      return;
    }
    if (next.length > NAME_MAX) {
      toast.error(`Name can't be longer than ${NAME_MAX} characters`);
      return;
    }
    if (next === displayName) {
      cancelEditName();
      return;
    }
    if (!requireUserId()) return;

    setSavingName(true);
    try {
      await updateUserProfile({ username: next }, userId);
      updateUser({ username: next });
      toast.success("Name updated");
      cancelEditName();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Couldn't update your name, please try again");
    } finally {
      setSavingName(false);
    }
  };

  const handlePickFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow picking the same file again later
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }
    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      toast.error(`Image is too large (max ${MAX_FILE_MB}MB)`);
      return;
    }
    if (!requireUserId()) return;

    setAvatarBusy(true);
    try {
      const avatar = await resizeImageToDataUrl(file);
      await updateUserProfile({ avatar }, userId);
      updateUser({ avatar });
      toast.success(photoUrl ? "Photo updated" : "Photo added");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Couldn't upload your photo, please try again");
    } finally {
      setAvatarBusy(false);
    }
  };

  const handleRemovePhoto = async () => {
    if (!requireUserId()) return;
    setAvatarBusy(true);
    try {
      await updateUserProfile({ avatar: "" }, userId);
      updateUser({ avatar: "", image: "", photo: "", picture: "", profileImage: "", avatarUrl: "" });
      toast.success("Photo removed");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Couldn't remove your photo, please try again");
    } finally {
      setAvatarBusy(false);
    }
  };

  const handleSaveAddress = async () => {
    if (!requireUserId()) return;
    setSavingAddress(true);
    try {
      await updateUserProfile({ address }, userId);
      updateUser({ address });
      toast.success("Address saved");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Couldn't save your address, please try again");
    } finally {
      setSavingAddress(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch {
    }
    logoutUser();
    navigate("/login");
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-24 pt-28 sm:px-6">
      {/* ================= Header card ================= */}
      <div className="overflow-hidden rounded-3xl border border-[#e4dcd5] bg-[#fbf8f5] shadow-sm dark:border-[#38302c] dark:bg-[#1a1513]">
        {/* cover */}
        <div className="h-28 bg-gradient-to-r from-[#c2a38e]/50 via-[#eae1d9] to-[#c2a38e]/30 dark:from-[#c2a38e]/20 dark:via-[#2e2623] dark:to-[#c2a38e]/10 sm:h-36" />

        <div className="px-6 pb-6 sm:px-8 sm:pb-8">
          <div className="-mt-12 flex flex-col items-center gap-4 sm:-mt-14 sm:flex-row sm:items-end">
            {/* avatar + camera button */}
            <div className="relative shrink-0">
              <div className="rounded-full border-4 border-[#fbf8f5] dark:border-[#1a1513]">
                <Avatar user={user} className="h-24 w-24 text-3xl sm:h-28 sm:w-28 sm:text-4xl" />
              </div>

              {avatarBusy && (
                <div className="absolute inset-1 flex items-center justify-center rounded-full bg-black/45">
                  <Loader2 className="h-6 w-6 animate-spin text-white" />
                </div>
              )}

              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={avatarBusy}
                aria-label={photoUrl ? "Change photo" : "Add photo"}
                title={photoUrl ? "Change photo" : "Add photo"}
                className="absolute bottom-1 right-1 flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#fbf8f5] bg-[#2a2421] text-[#f7f2ed] shadow-md transition-colors hover:bg-[#423935] disabled:cursor-not-allowed disabled:opacity-60 dark:border-[#1a1513] dark:bg-[#f3ece7] dark:text-[#1a1513] dark:hover:bg-[#e4dcd5]"
              >
                <Camera className="h-4 w-4" />
              </button>

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handlePickFile}
                className="hidden"
              />
            </div>

            {/* name + meta */}
            <div className="min-w-0 flex-1 text-center sm:pb-1 sm:text-left">
              {editingName ? (
                <div className="flex items-center justify-center gap-2 sm:justify-start">
                  <input
                    autoFocus
                    value={nameDraft}
                    onChange={(e) => setNameDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSaveName();
                      if (e.key === "Escape") cancelEditName();
                    }}
                    maxLength={NAME_MAX}
                    placeholder="Your name"
                    className="w-full max-w-[220px] rounded-xl border border-[#c2a38e] bg-[#f7f2ed] px-3 py-1.5 text-lg font-bold text-[#2a2421] outline-none dark:bg-[#1f1a18] dark:text-[#f3ece7]"
                  />
                  <button
                    type="button"
                    onClick={handleSaveName}
                    disabled={savingName}
                    aria-label="Save name"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2a2421] text-[#f7f2ed] hover:bg-[#423935] disabled:opacity-60 dark:bg-[#f3ece7] dark:text-[#1a1513]"
                  >
                    {savingName ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Check className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={cancelEditName}
                    disabled={savingName}
                    aria-label="Cancel"
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-[#e4dcd5] text-[#7a6f68] hover:bg-[#eae1d9] dark:border-[#38302c] dark:text-[#a0948c] dark:hover:bg-[#2e2623]"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 sm:justify-start">
                  <h1 className="truncate text-2xl font-bold text-[#2a2421] dark:text-[#f3ece7]">
                    {displayName || roleLabel}
                  </h1>
                  <button
                    type="button"
                    onClick={startEditName}
                    aria-label="Edit name"
                    title="Edit name"
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[#a0948c] transition-colors hover:bg-[#eae1d9] hover:text-[#c2a38e] dark:hover:bg-[#2e2623]"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}

              <p className="mt-0.5 truncate text-sm text-[#7a6f68] dark:text-[#a0948c]">
                {user?.email}
              </p>

              <div className="mt-3 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#eae1d9] px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#7a6f68] dark:bg-[#2e2623] dark:text-[#a0948c]">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#c2a38e]" />
                  {roleLabel}
                </span>
                {memberSince && (
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#a0948c]">
                    <CalendarDays className="h-3.5 w-3.5" />
                    Member since {memberSince}
                  </span>
                )}
              </div>
            </div>

            {photoUrl && (
              <button
                type="button"
                onClick={handleRemovePhoto}
                disabled={avatarBusy}
                className="flex items-center gap-1.5 rounded-full border border-[#e4dcd5] px-3.5 py-2 text-[11px] font-semibold text-[#7a6f68] transition-colors hover:border-red-300 hover:text-red-500 disabled:opacity-60 dark:border-[#38302c] dark:text-[#a0948c] dark:hover:border-red-500/30 sm:mb-1"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Remove photo
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ================= Stats ================= */}
      <div className="mt-5 grid grid-cols-3 gap-3 sm:gap-4">
        <StatCard
          icon={<Package className="h-4 w-4" />}
          label="Orders"
          value={orders === null ? "—" : stats.total}
        />
        <StatCard
          icon={<PackageCheck className="h-4 w-4" />}
          label="Delivered"
          value={orders === null ? "—" : stats.delivered}
        />
        <StatCard
          icon={<Wallet className="h-4 w-4" />}
          label="Total spent"
          value={orders === null ? "—" : `EGP ${stats.spent.toLocaleString("en-US")}`}
        />
      </div>

      {/* ================= Contact ================= */}
      <div className={`${cardClass} mt-5`}>
        <h2 className="mb-5 text-sm font-bold uppercase tracking-wide text-[#c2a38e]">Contact</h2>
        <div className="space-y-4">
          <InfoRow icon={<Mail className="h-4 w-4" />} label="Email" value={user?.email} />
          <InfoRow icon={<Phone className="h-4 w-4" />} label="Phone" value={user?.phone} />
        </div>
      </div>

      {/* ================= Address ================= */}
      <div className={`${cardClass} mt-5`}>
        <h2 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-[#c2a38e]">
          <MapPin className="h-4 w-4" />
          Delivery address
        </h2>
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          rows={3}
          placeholder="Add your delivery address (street, city, area, notes...)"
          className="w-full resize-none rounded-2xl border border-[#e4dcd5] bg-[#f7f2ed] p-3 text-sm text-[#2a2421] outline-none transition-colors placeholder:text-[#a0948c] focus:border-[#c2a38e] dark:border-[#38302c] dark:bg-[#1f1a18] dark:text-[#f3ece7]"
        />
        <button
          onClick={handleSaveAddress}
          disabled={savingAddress}
          className="mt-3 flex items-center gap-2 rounded-full bg-[#2a2421] px-5 py-2.5 text-xs font-semibold text-[#f7f2ed] transition-all hover:bg-[#423935] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#f3ece7] dark:text-[#1a1513] dark:hover:bg-[#e4dcd5]"
        >
          {savingAddress && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          <span>{savingAddress ? "Saving..." : "Save address"}</span>
        </button>
      </div>

      {/* ================= Quick links ================= */}
      <div className={`${cardClass} mt-5 !p-2 sm:!p-2`}>
        <QuickLink to="/Myorders" icon={<Package className="h-4 w-4" />} label="My orders" />
        <QuickLink to="/Whishlist" icon={<Heart className="h-4 w-4" />} label="Wishlist" />
      </div>

      {/* ================= Logout ================= */}
      <button
        onClick={handleLogout}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-full border border-red-300 py-3 text-xs font-semibold text-red-500 transition-colors hover:bg-red-50 dark:border-red-500/30 dark:hover:bg-red-500/10"
      >
        <LogOut className="h-3.5 w-3.5" />
        Logout
      </button>
    </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-[#e4dcd5] bg-[#fbf8f5] px-2 py-4 text-center shadow-sm dark:border-[#38302c] dark:bg-[#1a1513]">
      <span className="mb-2 text-[#c2a38e]">{icon}</span>
      <p className="max-w-full truncate text-base font-bold text-[#2a2421] dark:text-[#f3ece7] sm:text-lg">
        {value}
      </p>
      <p className="mt-0.5 text-[11px] text-[#a0948c]">{label}</p>
    </div>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3 text-sm text-[#2a2421] dark:text-[#f3ece7]">
      <span className={iconBubble}>{icon}</span>
      <div className="min-w-0">
        <p className="text-[11px] text-[#a0948c]">{label}</p>
        <p className="truncate font-medium">{value || "—"}</p>
      </div>
    </div>
  );
}

function QuickLink({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      className="flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-medium text-[#2a2421] transition-colors hover:bg-[#f0e9e2] dark:text-[#f3ece7] dark:hover:bg-[#2e2623]"
    >
      <span className={iconBubble}>{icon}</span>
      <span className="flex-1">{label}</span>
      <ChevronRight className="h-4 w-4 text-[#a0948c]" />
    </NavLink>
  );
}

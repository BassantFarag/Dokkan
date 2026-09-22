import React, { useState } from "react";
import { Mail, Phone, ShieldCheck, User as UserIcon, LogOut, MapPin, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/AuthProvider";
import { updateUserProfile } from "../api/userApi";
import Avatar from "../components/Avatar";

export default function Profile() {
  const { user, logoutContext, updateUser } = useAuth();
  const navigate = useNavigate();

  const role = (user?.role || user?.type || user?.accountType || "").toString().toLowerCase();
  const isAdmin = role === "admin" || user?.isAdmin === true;
  const roleLabel = isAdmin ? "Admin" : "Customer";

  const [address, setAddress] = useState(user?.address || "");
  const [savingAddress, setSavingAddress] = useState(false);

  const handleLogout = async () => {
    await logoutContext();
    navigate("/login");
  };

  const handleSaveAddress = async () => {
    const userId = user?._id || user?.id;
    if (!userId) {
      toast.error("Couldn't find your account, please log in again");
      return;
    }
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

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col items-center px-6 pb-24 pt-32">
      {/* Avatar + name */}
      <div className="mb-6 flex flex-col items-center">
        <div className="mb-4">
          <Avatar user={user} className="h-20 w-20 text-2xl" />
        </div>
        <h1 className="text-xl font-bold text-[#2a2421] dark:text-[#f3ece7]">
          {user?.name || roleLabel}
        </h1>
        <span className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-[#eae1d9] px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#7a6f68] dark:bg-[#2e2623] dark:text-[#a0948c]">
          <ShieldCheck className="h-3.5 w-3.5 text-[#c2a38e]" />
          {roleLabel}
        </span>
      </div>

      {/* Info card */}
      <div className="w-full rounded-3xl border border-[#e4dcd5] bg-[#fbf8f5] p-6 shadow-sm dark:border-[#38302c] dark:bg-[#1a1513] sm:p-8">
        <h2 className="mb-5 text-sm font-bold uppercase tracking-wide text-[#c2a38e]">
          Account Details
        </h2>

        <div className="space-y-4">
          <div className="flex items-center gap-3 text-sm text-[#2a2421] dark:text-[#f3ece7]">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#eae1d9] text-[#c2a38e] dark:bg-[#2e2623]">
              <UserIcon className="h-4 w-4" />
            </span>
            <div>
              <p className="text-[11px] text-[#a0948c]">Full name</p>
              <p className="font-medium">{user?.name || "—"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm text-[#2a2421] dark:text-[#f3ece7]">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#eae1d9] text-[#c2a38e] dark:bg-[#2e2623]">
              <Mail className="h-4 w-4" />
            </span>
            <div>
              <p className="text-[11px] text-[#a0948c]">Email</p>
              <p className="font-medium">{user?.email || "—"}</p>
            </div>
          </div>

          {user?.phone && (
            <div className="flex items-center gap-3 text-sm text-[#2a2421] dark:text-[#f3ece7]">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#eae1d9] text-[#c2a38e] dark:bg-[#2e2623]">
                <Phone className="h-4 w-4" />
              </span>
              <div>
                <p className="text-[11px] text-[#a0948c]">Phone</p>
                <p className="font-medium">{user.phone}</p>
              </div>
            </div>
          )}
        </div>

        {/* Address */}
        <div className="mt-6 border-t border-[#e4dcd5] pt-6 dark:border-[#38302c]">
          <label className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-[#a0948c]">
            <MapPin className="h-3.5 w-3.5 text-[#c2a38e]" />
            Address
          </label>
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
            <span>{savingAddress ? "Saving..." : "Save Address"}</span>
          </button>
        </div>

        <button
          onClick={handleLogout}
          className="mt-8 flex w-full items-center justify-center gap-2 rounded-full border border-red-300 py-2.5 text-xs font-semibold text-red-500 transition-colors hover:bg-red-50 dark:border-red-500/30 dark:hover:bg-red-500/10"
        >
          <LogOut className="h-3.5 w-3.5" />
          Logout
        </button>
      </div>
    </div>
  );
}
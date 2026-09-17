import React, { useState } from "react";

/**
 * Shows the user's profile photo when the backend provides one, falling
 * back to a colored circle with their initial otherwise (or if the image
 * fails to load). Checks the common field names APIs use for a photo URL.
 */
export default function Avatar({ user, className = "h-7 w-7 text-[11px]" }) {
  const [imgFailed, setImgFailed] = useState(false);
  const photoUrl =
    user?.avatar || user?.image || user?.photo || user?.picture || user?.profileImage || user?.avatarUrl;
  const initial = (user?.name || user?.email || "U").trim().charAt(0).toUpperCase();

  if (photoUrl && !imgFailed) {
    return (
      <img
        src={photoUrl}
        alt={user?.name || "Profile"}
        onError={() => setImgFailed(true)}
        className={`rounded-full object-cover ${className}`}
      />
    );
  }

  return (
    <span
      className={`flex items-center justify-center rounded-full bg-[#c2a38e] font-bold text-zinc-950 ${className}`}
    >
      {initial}
    </span>
  );
}

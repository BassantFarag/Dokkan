import React, { useState, useEffect } from "react";
import { getAvatarUrl, getDisplayName } from "../utils/user";

export default function Avatar({ user, className = "h-7 w-7 text-[11px]" }) {
  const [imgFailed, setImgFailed] = useState(false);
  const photoUrl = getAvatarUrl(user);
  const initial = (getDisplayName(user) || user?.email || "U").trim().charAt(0).toUpperCase();

  useEffect(() => {
    setImgFailed(false);
  }, [photoUrl]);

  if (photoUrl && !imgFailed) {
    return (
      <img
        src={photoUrl}
        alt={getDisplayName(user) || "Profile"}
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

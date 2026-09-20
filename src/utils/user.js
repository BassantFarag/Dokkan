export const getDisplayName = (user) =>
  user?.username ||
  user?.name ||
  user?.fullName ||
  (user?.email ? user.email.split("@")[0] : "");

export const getUserId = (user) => user?._id || user?.id;

export const getAvatarUrl = (user) =>
  user?.avatar ||
  user?.image ||
  user?.photo ||
  user?.picture ||
  user?.profileImage ||
  user?.avatarUrl ||
  "";

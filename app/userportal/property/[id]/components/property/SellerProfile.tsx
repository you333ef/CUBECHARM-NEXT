"use client";
import { memo } from "react";
import { useRouter } from "next/navigation";
import { FiMoreVertical } from "react-icons/fi";

// seller profile section
const SellerProfile = memo(({ owner, ownerId, onOpenMenu }: any) => {
  const router = useRouter();

  // navigate to seller profile
  const goToOwnerProfile = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/userportal/profilee/${ownerId}`);
  };

  // open options menu
  const handleClick = () => {
    onOpenMenu?.();
  };

  return (
    <div
      className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200 relative cursor-pointer"
      onClick={goToOwnerProfile}
      style={{ position: "relative" }}
    >
      {/* menu button */}
      <div
        className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-200 transition z-50"
        style={{ pointerEvents: "auto", cursor: "pointer" }}
      >
        <FiMoreVertical
          size={18}
          className="text-gray-600"
          onClick={(e) => {
            e.stopPropagation();
            handleClick();
          }}
        />
      </div>

      {/* profile image */}
      <img
        src={
          owner?.profileImage
            ? `http://localhost:5000/${owner.profileImage}`
            : "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200"
        }
        alt="Seller"
        className="h-16 w-16 rounded-xl object-cover border-2 border-blue-600 shadow-md"
        loading="lazy"
      />

      {/* seller info */}
      <div className="flex-1">
        <p className="text-lg font-semibold text-blue-600">{owner?.name}</p>
        <p className="text-xs text-gray-500 mt-1">
          Member since{" "}
          {owner?.memberSince ? new Date(owner.memberSince).toLocaleDateString() : ""}
        </p>
      </div>
    </div>
  );
});
SellerProfile.displayName = "SellerProfile";

export default SellerProfile;

"use client";

import React, { useContext, useState } from "react";
import { IoMdHeartEmpty, IoMdHeart, IoMdStar } from "react-icons/io";
import { GrLocation } from "react-icons/gr";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { IoEyeOutline } from "react-icons/io5";

import { useRouter } from "next/navigation";
import AuthContext from "@/app/providers/AuthContext";
import axios from "axios";
import { toast } from "sonner";
import ReportModal from "../../componants/shared/ReportModal";
import ConfirmDeleteModal from '../../../adminPortl/sharedAdmin/DELETE_CONFIRM';
import { usePropertyCardActions } from "../hooks/usePropertyCardActions";

interface PropertyCardProps {
  id: number;
  images: string[];
  title: string;
  description?: string;
  isFavorite?: boolean;
  price: string;
  location: string;
  currency: string;
  categoryName: string;
  categorySlug: string;
  totalArea: string | number;
  viewsCount: string | number;
  publishedAt: string;
   imageUrl1?: string;
  ownerName: string;
  ownerProfileImage: string;
  ownerRating: number;
  ownerUserId: string;
  onRemoveFavorite?: () => void;
  fetchProperties?:any
}
interface ActionItem {
  label: string;
  onClick: (id: number) => void;
  danger?: boolean;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  id,
  images,
  title,
  fetchProperties,
  description,
  isFavorite: propIsFavorite,
  price,
  location,
  currency,
  categoryName,
  categorySlug,
  totalArea,
  viewsCount,
  publishedAt,
  ownerName,
  ownerProfileImage,
  ownerRating,
  ownerUserId,
  onRemoveFavorite,
}) => {
  const [internalFavorite, setInternalFavorite] = useState(false);
  const isFavorite = propIsFavorite !== undefined ? propIsFavorite : internalFavorite;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const router = useRouter();
  const auth = useContext(AuthContext)!;
  const { baseUrl } = auth;
  const BASE_URL = "http://localhost:5000";
  const accessToken =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  const currentUserId = auth.user?.sub;
  const isOwner = currentUserId == ownerUserId;

  // Get action logic from hook
  const {
    showModal,
    setShowModal,
    showReportModal,
    setShowReportModal,
    toggleModal,
    isDeleteModalOpen,
    itemToDelete,
    confirmDelete,
    cancelDelete,
    isBlockModalOpen,
    userToBlock,
    confirmBlock,
    cancelBlock,
    handleSubmitReport,
    actionsToShow,
  } = usePropertyCardActions({
    propertyId: id,
    ownerUserId,
    isOwner,
    ownerName,
    fetchProperties,
    baseUrl,
    accessToken: accessToken,
    router,
  });

  const formattedImages = (images ?? [])
  .filter(Boolean)
  .map(img =>
    img.startsWith("http") ? img : `${BASE_URL}/${img}`
  );
  const hasSlider = formattedImages.length > 1;

  const handleCardClick = () => {
    router.push(`/userportal/property/${id}`);
  }
  const handleFavoriteClick = async (e: React.MouseEvent, propertyId: number) => {
    e.stopPropagation();
    if (!accessToken) return;

    try {
      if (propIsFavorite && onRemoveFavorite) {
        onRemoveFavorite();
        return;
      }

      if (!isFavorite) {
        const res = await axios.post(
          `${baseUrl}/favourite/property/${propertyId}`,
          {},
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        if (res.data?.success && propIsFavorite === undefined) {
          setInternalFavorite(true);
        }
      } else {
        const res = await axios.delete(
          `${baseUrl}/favourite/property/${propertyId}`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        if (res.data?.success && propIsFavorite === undefined) {
          setInternalFavorite(false);
        }
      }
    } catch {}
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? formattedImages.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === formattedImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden max-w-md border border-gray-100 cursor-pointer group"
      >
        <div className="p-3 pb-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg overflow-hidden">
              {ownerProfileImage ? (
                <img
                  src={`${BASE_URL}/${ownerProfileImage}`}
                  alt={ownerName}
                  width={40}
                  height={40}
                  className="object-cover"
                  
                />
              ) : (
                ownerName?.charAt(0).toUpperCase() || "U"
              )}
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-800">{ownerName}</p>
           
              <p className="text-xs text-gray-500">
                Published: {new Date(publishedAt).toLocaleDateString("en-US")}
              </p>
            </div>
          </div>
          <button
            onClick={toggleModal}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <BsThreeDotsVertical className="text-gray-600" size={20} />
          </button>
        </div>

        <div className="relative">
          <img
            src={formattedImages[currentImageIndex] || "/placeholder.jpg"}
            alt={title}
            width={600}
            height={400}
            className="w-full h-64 object-cover"
            // priority={currentImageIndex === 0}
            // unoptimized
          />

          {hasSlider && (
            <>
              <button
                onClick={handlePrevImage}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all shadow-lg"
              >
                <MdChevronLeft size={28} className="text-gray-800" />
              </button>

              <button
                onClick={handleNextImage}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all shadow-lg"
              >
                <MdChevronRight size={28} className="text-gray-800" />
              </button>

              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {formattedImages.map((_, index) => (
                  <div
                    key={index}
                    className={`transition-all duration-300 rounded-full ${
                      index === currentImageIndex
                        ? "bg-white w-5 h-1.5"
                        : "bg-white/60 w-1.5 h-1.5"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <div className="p-3 space-y-3">
          <div>
            <p className="text-sm text-gray-700 line-clamp-2 leading-relaxed">
              {description || "Brand New Fully Furnished 1BR ..."}
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/HomeList/property/${id}`);
              }}
              className="text-xs text-blue-600 font-medium hover:underline mt-1"
            >
              Read more
            </button>
          </div>

          <div className="flex justify-between items-start">
            <h3 className="text-lg font-bold text-blue-600 hover:text-blue-700 transition-colors">
              {title}
            </h3>
            <button
              onClick={(e) => handleFavoriteClick(e, id)}
              className="p-1 hover:scale-110 transition-transform"
            >
              {isFavorite ? (
                <IoMdHeart size={26} className="text-red-500 cursor-pointer" />
              ) : (
                <IoMdHeartEmpty size={26} className="text-red-500 cursor-pointer" />
              )}
            </button>
          </div>

          <p className="text-xl font-bold text-gray-900">
            {price} {currency}
          </p>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1.5 text-gray-600">
              <GrLocation size={16} />
              <span>{location}</span>
            </div>
            <div className="flex items-center gap-1">
              <IoMdStar className="text-yellow-400" size={18} />
              <span className="font-semibold">4.8</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex gap-4">
              <span>
                {categoryName} {categorySlug}
              </span>
              <span>{totalArea} m²</span>
            </div>
            <div className="flex items-center gap-1">
              <IoEyeOutline size={15} />
              <span>{viewsCount}</span>
            </div>
          </div>

          <p className="text-xs text-gray-400">3 September 16:22</p>
        </div>
      </div>

      {showModal && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-3xl w-full max-w-sm p-4"
            onClick={(e) => e.stopPropagation()}
          >
            {actionsToShow.map((action) => (
              <button
                key={action.label}
               onClick={() => action.onClick(id)}
                className={`w-full py-3 rounded-xl ${
                  action.danger ? "text-red-600" : "text-gray-800"
                }`}
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        onSubmit={handleSubmitReport}
        reportId={id}
      />
   {isDeleteModalOpen && itemToDelete !== null && (
  <ConfirmDeleteModal
    actionType="delete"
    name="Appartment"
    DeleteTrue={() => confirmDelete(itemToDelete)}
    onCancel={cancelDelete}
  />
)}

{isBlockModalOpen && userToBlock && (
  <ConfirmDeleteModal
    actionType="block"
    name={ownerName}
    DeleteTrue={() => confirmBlock(userToBlock)}
    onCancel={cancelBlock}
  />
)}
    </>
  );
};

export default PropertyCard;

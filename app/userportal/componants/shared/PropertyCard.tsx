"use client";

import React, { useState } from "react";
import { IoMdHeartEmpty, IoMdHeart, IoMdStar } from "react-icons/io";
import { GrLocation } from "react-icons/gr";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { IoEyeOutline } from "react-icons/io5";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface PropertyCardProps {
  id: number;
  image: string;
  title: string;
  description?: string;
  isFavorite?: boolean;
  price: string;
  location: string;
  size: string | number;
   onRemoveFavorite?: () => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  id,
  image,
  title,
  description,
  price,
  location,
  size,
    onRemoveFavorite,
}) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const router = useRouter();

  const images = [image, image];

  const handleCardClick = () => {
    router.push(`/userportal/property/${id}`);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const toggleModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowModal(!showModal);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleCopyLink = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/HomeList/property/${id}`;
    try {
      await navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
    setShowModal(false);
  };

  const modalActions = [
    { label: "Report", onClick: () => { console.log("Report"); setShowModal(false); } },
    { label: "Unfollow", onClick: () => { console.log("Unfollow"); setShowModal(false); } },
    { label: "Block User", onClick: () => { console.log("Block"); setShowModal(false); }, danger: true },
    { label: "Copy Link", onClick: handleCopyLink },
    { label: "Share", onClick: () => { console.log("Share"); setShowModal(false); } },
    { label: "About This User", onClick: () => { console.log("About user"); setShowModal(false); } },
  ];

  return (
    <>
      <div
        onClick={handleCardClick}
        className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden max-w-md border border-gray-100 cursor-pointer group"
      >
        {/* Header: User Info + Menu */}
        <div className="p-3 pb-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
              Y
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">Yousef Khaled</p>
              <p className="text-xs text-gray-500">Front End Developer</p>
            </div>
          </div>
          <button
            onClick={toggleModal}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <BsThreeDotsVertical className="text-gray-600" size={20} />
          </button>
        </div>

        {/* Image Slider */}
        <div className="relative">
          <Image
            src={images[currentImageIndex]}
            alt={title}
            width={600}
            height={400}
            className="w-full h-64 object-cover"
            priority={currentImageIndex === 0}
          />

          {/* Navigation Arrows */}
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

          {/* Dots Indicator */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, index) => (
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
        </div>

        {/* Content */}
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
              onClick={handleFavoriteClick}
              className="p-1 hover:scale-110 transition-transform"
            >
              {isFavorite ? (
                <IoMdHeart className="text-red-500" size={26} />
              ) : (
                <IoMdHeartEmpty className="text-red-500" size={26} />
              )}
            </button>
          </div>

          <p className="text-xl font-bold text-gray-900">{price}</p>

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
              <span>Apartment</span>
              <span>{size} m²</span>
            </div>
            <div className="flex items-center gap-1">
              <IoEyeOutline size={15} />
              <span>4.2K</span>
            </div>
          </div>

          <p className="text-xs text-gray-400">3 September 16:22</p>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-3xl w-full max-w-sm shadow-2xl animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 pb-2 space-y-2">
              {modalActions.map((action) => (
                <button
                  key={action.label}
                  onClick={action.onClick}
                  className={`w-full text-center py-3.5 rounded-xl font-medium transition-all ${
                    action.danger
                      ? "text-red-600 hover:bg-red-50 border border-red-200"
                      : "text-gray-800 hover:bg-gray-50 border border-gray-200"
                  }`}
                >
                  {action.label}
                </button>
              ))}
            </div>
            <div className="px-6 pb-6">
              <button
                onClick={() => setShowModal(false)}
                className="w-full py-3.5 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold text-gray-800 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PropertyCard;
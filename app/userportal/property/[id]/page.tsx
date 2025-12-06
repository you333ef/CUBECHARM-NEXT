'use client';
import { FiPhone } from "react-icons/fi";
import { GrLocation } from "react-icons/gr";
import { IoShareSocialOutline } from "react-icons/io5";
import { FaRegHeart, FaHeart } from "react-icons/fa6";
import { AiOutlineMessage, AiOutlineInfoCircle } from "react-icons/ai";
import { FaFontAwesomeFlag } from "react-icons/fa";
import { IoMdStar, IoMdHeartEmpty, IoMdHeart } from "react-icons/io";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { IoEyeOutline } from "react-icons/io5";
import React, { useState, useEffect, useCallback, memo } from "react";

import { toast } from "sonner";
import MediaGallery from "../Componants/MediaGalleryServer";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

// 1- Mock properties data
const properties = [
  { id: 1, image: "https://cdn.dubaiimmobilier.fr/wp-content/uploads/2024/06/Sky-High-Luxury.webp", title: "Modern Apartment", location: "Cairo", price: "45,000 EGP" },
  { id: 2, image: "https://cdn.dubaiimmobilier.fr/wp-content/uploads/2024/06/Sky-High-Luxury.webp", title: "Cozy Studio", location: "Giza", price: "35,000 EGP" },
  { id: 3, image: "https://cdn.dubaiimmobilier.fr/wp-content/uploads/2024/06/Sky-High-Luxury.webp", title: "Luxury Villa", location: "Alexandria", price: "120,000 EGP" },
];

// 2- PropertyCard component with memoization for performance
const PropertyCard = memo(({ id, image, title, location, price, size = "150", description = "Brand New Fully Furnished 1BR ...", isFavorite, onClick }: any) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate =useRouter()
  const images = [image, image];

  const handlePrevImage = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const handleNextImage = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  return (
    <div
      onClick={() => navigate.push(`/property/${id}`)}
      className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden max-w-md border border-gray-100 cursor-pointer"
    >
      {/* 3- Card header with user info */}
      <div className="p-3 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold">Y</div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-800">Yousef Khaled</span>
            <span className="text-xs text-gray-500">Front End Developer</span>
          </div>
        </div>
        <button onClick={(e) => e.stopPropagation()} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <BsThreeDotsVertical className="text-gray-600" size={18} />
        </button>
      </div>

      {/* 4- Image carousel */}
      <div className="relative group">
        <img src={images[currentImageIndex]} alt={title} className="w-full h-64 object-cover" loading="lazy" />
        <button onClick={handlePrevImage} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
          <MdChevronLeft size={24} className="text-gray-800" />
        </button>
        <button onClick={handleNextImage} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
          <MdChevronRight size={24} className="text-gray-800" />
        </button>
      </div>

      {/* 5- Card details */}
      <div className="p-3">
        <p className="text-sm text-gray-700 line-clamp-2 leading-relaxed mb-2">{description}</p>
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-blue-600 font-bold text-lg hover:text-blue-700 transition-colors">{title}</h3>
          <button onClick={(e) => { e.stopPropagation(); onClick(); }} className="p-1 hover:scale-110 transition-transform">
            {isFavorite ? <IoMdHeart className="text-red-500" size={24} /> : <IoMdHeartEmpty className="text-gray-400" size={24} />}
          </button>
        </div>
        <p className="text-gray-900 text-lg font-semibold mb-2">{price}</p>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1">
            <GrLocation className="text-gray-600" size={14} />
            <span className="text-gray-600 text-sm">{location}</span>
          </div>
          <div className="flex items-center gap-1">
            <IoMdStar className="text-yellow-400" size={18} />
            <span className="text-sm font-semibold">4.8</span>
          </div>
        </div>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-3">
            <span>Apartment</span>
            <span>{size} m²</span>
          </div>
          <div className="flex items-center gap-1">
            <IoEyeOutline size={14} />
            <span>4.2K</span>
          </div>
        </div>
      </div>
    </div>
  );
});

PropertyCard.displayName = "PropertyCard";

// 6- Action icons component
const ActionIcons = memo(({ isFavorite, onToggleFavorite, onChat, onDetails }: { isFavorite: boolean; onToggleFavorite: () => void; onChat: () => void; onDetails: () => void }) => (
  <div className="grid grid-cols-6 gap-2 py-4 px-2 bg-gray-50 rounded-2xl border border-gray-200">
    <button className="group flex flex-col items-center gap-2 p-3 hover:bg-white rounded-xl transition-all duration-200 hover:shadow-md">
      <GrLocation className="w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform" />
      
    </button>
    <button className="group flex flex-col items-center gap-2 p-3 hover:bg-white rounded-xl transition-all duration-200 hover:shadow-md">
      <IoShareSocialOutline className="w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform" />
      
    </button>
    <button onClick={onToggleFavorite} className="group flex flex-col items-center gap-2 p-3 hover:bg-white rounded-xl transition-all duration-200 hover:shadow-md">
      {isFavorite ? <FaHeart className="w-6 h-6 text-red-600 group-hover:scale-110 transition-transform" /> : <FaRegHeart className="w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform" />}
    
    </button>
    <button onClick={onChat} className="group flex flex-col items-center gap-2 p-3 hover:bg-white rounded-xl transition-all duration-200 hover:shadow-md">
      <AiOutlineMessage className="w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform" />
    
    </button>
    <button className="group flex flex-col items-center gap-2 p-3 hover:bg-white rounded-xl transition-all duration-200 hover:shadow-md">
      <FiPhone className="w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform" />
     
    </button>
    <button onClick={onDetails} className="group flex flex-col items-center gap-2 p-3 hover:bg-white rounded-xl transition-all duration-200 hover:shadow-md">
      <AiOutlineInfoCircle className="w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform" />
     
    </button>
  </div>
));

ActionIcons.displayName = "ActionIcons";

// 7- Seller profile component
const SellerProfile = memo(() => (
  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
    <img
      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200"
      alt="Seller"
      className="h-16 w-16 rounded-xl object-cover border-2 border-blue-600 shadow-md"
      loading="lazy"
    />
    <div className="flex-1">
      <Link href="/user-profile" className="text-lg font-semibold text-blue-600 hover:underline">Yassine</Link>
      <div className="flex items-center gap-1 mt-1">
        <IoMdStar className="text-yellow-400" size={16} />
        <span className="text-sm font-semibold">4.8</span>
        <span className="text-xs text-gray-500">(120 Reviews)</span>
      </div>
      <p className="text-xs text-gray-500 mt-1">Member since Oct 5, 2024</p>
    </div>
  </div>
));

SellerProfile.displayName = "SellerProfile";

// 8- Loading skeleton component
const LoadingSkeleton = () => (
  <div className="space-y-5 animate-pulse">
    <div className="h-10 bg-gray-200 rounded w-3/4"></div>
    <div className="h-72 bg-gray-200 rounded-lg"></div>
    <div className="space-y-3">
      <div className="h-6 bg-gray-200 rounded"></div>
      <div className="h-6 bg-gray-200 rounded w-5/6"></div>
    </div>
    <div className="h-32 bg-gray-200 rounded"></div>
  </div>
);

// 9- Main Property component
const Property = () => {
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const { id } = useParams<{ id: string }>();
  const navigate = useRouter();

  // 10- Toggle favorite handler with toast
  const toggleFavorite = useCallback(() => {
    setIsFavorite((prev) => {
      toast.success(!prev ? "Added to Favourites" : "Removed from Favourites", {
        position: "bottom-center",
        duration: 2000,
      });
      return !prev;
    });
  }, []);

  // 11- Navigation handlers
  const toChat = useCallback(() => navigate.push("/messages"), [navigate]);
  const toDetails = useCallback(() => navigate.push(`/pro-mode/${id}`), [navigate, id]);

  // 12- Simulate initial data load
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full bg-gray-50"  style={{ maxWidth: "1100px" }}>
      {/* 13- Main full-width content container */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 md:py-8 pt-16 md:pt-20">
        <div className="bg-white rounded-xl p-4 sm:p-6">
          {loading ? (
            <LoadingSkeleton />
          ) : (
            <div>
           

              {/* 15- Media gallery */}
              <div className="mb-4">
                <MediaGallery />
              </div>

              {/* 16- Action icons */}
              <ActionIcons isFavorite={isFavorite} onToggleFavorite={toggleFavorite} onChat={toChat} onDetails={toDetails} />

              {/* 17- Seller profile */}
              <div className="mt-4">
                <SellerProfile />
              </div>

              {/* 18- CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mt-4">
                <Link href={`/pro-mode/${id}`} className="flex-1 text-center py-3 px-6 bg-white text-blue-600 font-bold rounded-lg text-base border-2 border-blue-600 hover:bg-blue-50 transition-colors">
                  PRO MODE
                </Link>
                <Link href="/payment" className="flex-1 text-center py-3 px-6 bg-green-500 text-white font-bold rounded-lg text-base hover:bg-green-600 transition-colors">
                  Pay Now
                </Link>
              </div>

              {/* 19- Property characteristics */}
              <div className="mt-6 text-center sm:text-left">
                <h2 className="text-xl font-semibold mb-3 text-gray-800">Characteristics</h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-700">
                  <li className="flex items-center justify-center sm:justify-start"><span className="font-semibold w-24">Size:</span><span>150m²</span></li>
                  <li className="flex items-center justify-center sm:justify-start"><span className="font-semibold w-24">Bathrooms:</span><span>2</span></li>
                  <li className="flex items-center justify-center sm:justify-start"><span className="font-semibold w-24">Rooms:</span><span>5</span></li>
                  <li className="flex items-center justify-center sm:justify-start"><span className="font-semibold w-24">Location:</span><span>Cairo</span></li>
                </ul>
              </div>

              {/* 20- Property description */}
              <div className="mt-6 text-center sm:text-left">
                <h2 className="text-xl font-semibold mb-3 text-gray-800">Description</h2>
                <p className="text-gray-700 leading-relaxed">
                  Brand New Fully Furnished 1BR apartment with modern amenities and stunning city views. Perfect for professionals seeking comfort and convenience...
                  <Link href={`/readmore/${id}`} className="text-blue-600 font-semibold hover:underline ml-1">Read More</Link>
                </p>
              </div>

              {/* 21- Report button */}
              <button className="flex items-center justify-center gap-2 w-full py-3 mt-6 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors">
                <FaFontAwesomeFlag className="text-red-600" size={18} />
                <span className="text-red-600 font-semibold">Report this Ad</span>
              </button>

              {/* 22- Related ads section */}
              <h2 className="mt-8 text-xl font-semibold mb-4 text-gray-800">Related Ads</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {properties.map((property) => (
                  <PropertyCard key={property.id} {...property} isFavorite={false} onClick={() => console.log("Favorite:", property.id)} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Property;

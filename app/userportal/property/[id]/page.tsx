"use client"
import { FiPhone } from "react-icons/fi";
import { GrLocation } from "react-icons/gr";
import { IoShareSocialOutline } from "react-icons/io5";
import { FaRegHeart, FaHeart } from "react-icons/fa6";
import { AiOutlineMessage } from "react-icons/ai";
import { FaFontAwesomeFlag } from "react-icons/fa";
import { properties } from "../../../utils/properties";
import { IoMdStar } from "react-icons/io";
import React, { useState, useEffect, lazy, Suspense } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { mediaItems } from "../../../utils/mediaItems";
import "@photo-sphere-viewer/core/index.css";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { IoMdHeartEmpty, IoMdHeart } from "react-icons/io";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { IoEyeOutline } from "react-icons/io5";
import Image from "../../../userportal/componants/shared/Image";

import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

const ReactPhotoSphereViewer = lazy(() =>
  import("react-photo-sphere-viewer").then((m) => ({ default: m.ReactPhotoSphereViewer }))
);

const MediaGallery = () => {
  const [viewerHeight, setViewerHeight] = useState("35vh");
  const [selectedMedia, setSelectedMedia] = useState(mediaItems[0]);

  const handleThumbnailClick = (media: any) => {
    setSelectedMedia(media);
  };

  const handleResize = () => {
    if (window.innerWidth < 640) {
      setViewerHeight("50vh");
    } else if (window.innerWidth >= 640 && window.innerWidth < 768) {
      setViewerHeight("60vh");
    } else if (window.innerWidth >= 768 && window.innerWidth < 1024) {
      setViewerHeight("70vh");
    } else {
      setViewerHeight("80vh");
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="w-full">
      {selectedMedia.is360 && !selectedMedia.isVideo ? (
        <Suspense fallback={<div className="w-full h-96 bg-gray-200 animate-pulse rounded-lg"></div>}>
          <div style={{ width: "100%", height: viewerHeight }} className="rounded-lg overflow-hidden">
            <ReactPhotoSphereViewer src={selectedMedia.src} width="100%" height="100%" />
          </div>
        </Suspense>
      ) : (
        !selectedMedia.isVideo && (
          <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
           <Image
  src={selectedMedia.src}
  alt="Property"
  width={1920}
  height={1080}
  className="object-cover rounded-lg w-full h-full"
  loading="lazy"
/>

          </div>
        )
      )}

      {selectedMedia.isVideo && (
        <div className="w-full aspect-video">
          <iframe
            width="100%"
            height="100%"
            src={selectedMedia.src}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Property Video"
            loading="lazy"
            className="rounded-lg"
          />
        </div>
      )}

      <div className="flex overflow-x-auto gap-3 mt-4 pb-2">
        {mediaItems.map((item: any, index: number) => (
          <div key={index} className="flex-shrink-0">
            {item.isVideo ? (
              <video
                src={item.thumbnail}
                onClick={() => handleThumbnailClick(item)}
                className={`h-20 w-28 sm:h-24 sm:w-32 object-cover rounded-lg cursor-pointer border-2 transition-all duration-200 hover:scale-105 hover:shadow-lg ${
                  selectedMedia.src === item.src ? "border-blue-500" : "border-transparent hover:border-blue-300"
                }`}
              />
            ) : (
              <img
                src={item.thumbnail}
                alt={`Thumbnail ${index + 1}`}
                onClick={() => handleThumbnailClick(item)}
                className={`h-20 w-28 sm:h-24 sm:w-32 object-cover rounded-lg cursor-pointer border-2 transition-all duration-200 hover:scale-105 hover:shadow-lg ${
                  selectedMedia.src === item.src ? "border-blue-500" : "border-transparent hover:border-blue-300"
                }`}
                loading="lazy"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Define media gallery

const PropertyCard = (props:any) => {
  const {
    id,
    image,
    title,
    location,
    price,
    size = '150',
    description = "Brand New Fully Furnished 1BR ...",
    isFavorite,
    onClick,
  } = props;
  // Destructure props

  const [showModal, setShowModal] = React.useState(false);
  // Manage modal state
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  // Manage image index
  const images = [image, image];
  // Set image array
  const navigate = useRouter()
  // Get navigate function

  const handlePrevImage = (e:any) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };
  // Handle previous image

  const handleNextImage = (e:any) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };
  // Handle next image

  return (
    <div
      onClick={() => navigate.push(`/userportal/property/${id}`)}
      className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden max-w-md border border-gray-100 cursor-pointer"
    >
      {/* HEADER */}
      <div className="p-3 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold">
            Y
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-800">Yousef Khaled</span>
            <span className="text-xs text-gray-500">Front End Developer</span>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowModal(true);
          }}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <BsThreeDotsVertical className="text-gray-600" size={18} />
        </button>
      </div>

      {/* IMAGE */}
      <div className="relative group">
        <Image
          src={images[currentImageIndex]}
          alt={title}
          className="w-full h-64 object-cover"
          loading="lazy"
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            handlePrevImage(e);
          }}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
        >
          <MdChevronLeft size={24} className="text-gray-800" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleNextImage(e);
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
        >
          <MdChevronRight size={24} className="text-gray-800" />
        </button>
      </div>

      {/* DETAILS */}
      <div className="px-3 pt-2">
        <p className="text-sm text-gray-700 line-clamp-2 leading-relaxed">
          {description || "Brand New Fully Furnished 1BR ..."}
        </p>
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate.push(`/userportal/property/${id}`);
          }}
          className="text-xs text-blue-600 font-medium mt-1 hover:underline transition-all"
        >
          Read more
        </button>
      </div>

      {/* TITLE + HEART */}
      <div className="p-3">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-blue-600 font-bold text-lg hover:text-blue-700 transition-colors">
            {title}
          </h3>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClick(); 
            }}
            className="p-1 hover:scale-110 transition-transform"
          >
            {isFavorite ? (
              <IoMdHeart className="text-red-500" size={24} />
            ) : (
              <IoMdHeartEmpty className="text-gray-400" size={24} />
            )}
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
        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
          <div className="flex items-center gap-3">
            <span>Apartment</span>
            <span>{size} m²</span>
          </div>
          <div className="flex items-center gap-1">
            <IoEyeOutline size={14} />
            <span>4.2K</span>
          </div>
        </div>
        <p className="text-gray-400 text-xs">3 September 16:22</p>
      </div>
    </div>
  );
};
// Define property card

const Property = () => {
  const [loading, setLoading] = useState(true);
  // Set loading state
  const [isFavorite, setIsFavorite] = useState(false);
  // Set favorite state
  const { id } = useParams<{ id: string }>();
  // Get property id

  const toggleFavorite = () => {
    setIsFavorite((prev) => !prev);
    toast.success(isFavorite ? " Remove in Favourte  " : "Added To Favourite ", {
      position: "bottom-center",
      duration: 2000,
      style: { background: "#10b981", color: "#fff", fontWeight: "bold" },
    });
  };
  // Toggle favorite status

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);
  // Simulate data load
  const Navigate=useRouter()
 // Get navigate function
 const TO_CHAT=()=>{
  Navigate.push('/userportal/messaes')
  }
  // Navigate to chat
  const TO_DETAILS=()=>{
  Navigate.push(`/pro-mode/${id}`)
  }
  // Navigate to details

  return (
    <div className="min-h-screen bg-gray-50">
      // Main container div
      
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 md:py-8 mt-16 md:mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-4 sm:p-6">
            {loading ? (
              <div className="space-y-5">
                <Skeleton height={40} width="70%" />
                <Skeleton height={300} className="rounded-lg" />
                <Skeleton count={4} height={25} />
                <Skeleton height={120} />
                <Skeleton height={40} width="60%" />
              </div>
            ) : (
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">Luxury Apartment</h1>
                <div className="flex justify-between items-center mb-4 lg:hidden">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">60,000 EGP</h2>
                </div>
                <MediaGallery />
                     <div className="flex justify-around items-center mb-4">
                      <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <GrLocation className="w-6 h-6 text-blue-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <IoShareSocialOutline className="w-6 h-6 text-blue-600" />
                      </button>
                      <button
                        onClick={toggleFavorite}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        {isFavorite ? (
                          <FaHeart className="w-6 h-6 text-red-600" />
                        ) : (
                          <FaRegHeart className="w-6 h-6 text-blue-600" />
                        )}
                      </button>
                      <button onClick={TO_CHAT} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <AiOutlineMessage className="w-6 h-6 text-blue-600" />
                      </button>
                      <button  className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <FiPhone className="w-6 h-6 text-blue-600" />
                      </button>
                      <button onClick={TO_DETAILS} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <AiOutlineInfoCircle className="w-6 h-6 text-blue-600" />
                      </button>
                    </div>
            
                <div className="bg-white p-4 rounded-lg shadow-md my-4 lg:hidden">
{/*  */}
<div className="flex flex-col lg:space-y-3 space-y-0 gap-3 lg:block">
  <div className="flex flex-row lg:flex-col items-center justify-center gap-3 w-full">
  <Link
    href={`/PRO_MODE/${id}`}
    className="w-1/2 lg:w-full text-center py-3 px-6 bg-white text-blue-600 font-bold rounded-lg text-lg border-2 border-blue-600 hover:bg-blue-50 transition-colors"
  >
    PRO MODE
  </Link>

  <Link
    href="/userportal/payment"
    className="w-1/2 lg:w-full text-center py-3 px-6 bg-green-500 text-white font-bold rounded-lg text-lg hover:bg-green-600 transition-colors"
  >
    Pay Now
  </Link>
</div>


  <div className="flex lg:hidden items-center gap-4 mt-6 p-4 bg-gray-50 rounded-lg">
    <img
      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200"
      alt="Profile"
      className="h-20 w-20 rounded-full object-cover border-4 border-blue-600 shadow-lg"
    />
    <div>
      <Link
        className="text-lg font-semibold text-blue-600 hover:underline"
        href="/HomeList/account/user-profile"
      >
        Yassine
      </Link>
      <div className="flex items-center gap-1 mt-1">
        <span className="text-sm font-semibold">4.8</span>
        <IoMdStar className="text-yellow-400" size={18} />
        <span className="text-xs font-semibold text-gray-600">(120 Reviews)</span>
      </div>
      <p className="text-xs text-gray-500 mt-1">Member since Oct 5, 2024</p>
    </div>
  </div>
</div>

     
                </div>
                <div className="mt-6">
                  <h2 className="text-xl sm:text-2xl font-semibold mb-3 text-gray-800">Characteristics</h2>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center">
                      <span className="font-semibold w-32">Size:</span>
                      <span>150m²</span>
                    </li>
                    <li className="flex items-center">
                      <span className="font-semibold w-32">Bathrooms:</span>
                      <span>2</span>
                    </li>
                    <li className="flex items-center">
                      <span className="font-semibold w-32">Rooms:</span>
                      <span>5</span>
                    </li>
                    <li className="flex items-center">
                      <span className="font-semibold w-32">Location:</span>
                      <span>Cairo</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-6">
                  <h2 className="text-xl sm:text-2xl font-semibold mb-3 text-gray-800">Description</h2>
                 <p className="text-gray-700 leading-relaxed">
  Brand New Fully Furnished 1BR Brand New Fully Furnished 1BR Brand New Fully Furnished 1BR
  Brand New Fully Furnished 1BR Brand New Fully Furnished 1BR Brand New Fully Furnished 1BR
  Brand New Fully Furnished 1BR Brand New Fully Furnished 1BR Brand New Fully Furnished 1BR
  Brand New Fully Furnished 1BR Brand New Fully Furnished 1BR...
  <Link 
    href={`/userportal/readmore/${id}`}
    className="text-blue-600 font-semibold hover:underline ml-1"
  >
    Read More
  </Link>
</p>

                </div>
                <button className="flex items-center justify-center gap-2 w-full py-3 mt-6 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors">
                  <FaFontAwesomeFlag className="text-red-600" size={18} />
                  <span className="text-red-600 font-semibold">Report this Ad</span>
                </button>
                <h2 className="mt-8 text-xl sm:text-2xl font-semibold mb-4 text-gray-800">Related Ads</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6">
                  {properties.slice(0, 3).map((property) => (
                 <PropertyCard
  key={property.id}
  {...property}
  isFavorite={false}
  onClick={() => console.log("Favorite clicked:", property.id)}
/>

                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="hidden lg:block bg-white rounded-2xl shadow-xl p-6 h-fit sticky top-24">
            {loading ? (
              <div className="space-y-4">
                <Skeleton height={40} width="60%" />
                <Skeleton height={50} width="100%" />
                <Skeleton height={50} width="100%" />
                <Skeleton circle height={60} width={60} />
                <Skeleton height={20} width="70%" />
              </div>
            ) : (
              <div className="flex flex-col gap-8">
                <div className="text-center">
                  <h2 className="text-4xl font-bold text-gray-900">60,000 EGP</h2>
                  <p className="text-sm text-gray-500 mt-1">Negotiable</p>
                </div>
             
                <div className="flex flex-col gap-3 mt-4">
                 
                  <Link
                    href={`/userportal/proModewep/${id}`}
                    className="block w-full text-center py-3 px-6 bg-white text-blue-600 font-bold rounded-lg text-lg border-2 border-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    PRO - MODE
                  </Link>
                 
                  <Link
                    href="/userportal/payment"
                    className="block w-full text-center py-3 px-6 bg-green-500 text-white font-bold rounded-lg text-lg hover:bg-green-600 transition-colors"
                  >
                    Pay Now
                  </Link>
                     <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
                  <img
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200"
                    alt="Profile"
                    className="h-16 w-16 rounded-2xl object-cover border-2 border-blue-600"
                  />
                  <div>
                    <Link className="text-lg font-semibold text-blue-600 hover:underline" href="/HomeList/account/user-profile">
                      Yassine
                    </Link>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-sm font-semibold">4.8</span>
                      <IoMdStar className="text-yellow-400" size={18} />
                      <span className="text-xs font-semibold text-gray-600">(120 Reviews)</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Member since Oct 5, 2024</p>
                  </div>
                </div>
                {/*  Large Size  */}
                  <div className="grid grid-cols-3 gap-4 py-4 px-2 bg-gray-50 rounded-2xl border border-gray-200">
                    
                    <button className="group flex flex-col items-center gap-2 p-3 hover:bg-white rounded-xl transition-all duration-200 hover:shadow-md">
                      <GrLocation className="w-7 h-7 text-blue-600 group-hover:scale-110 transition-transform" />
                      <span className="text-xs text-gray-600 font-medium">Location</span>
                    </button>
                    <button className="group flex flex-col items-center gap-2 p-3 hover:bg-white rounded-xl transition-all duration-200 hover:shadow-md">
                      <IoShareSocialOutline className="w-7 h-7 text-blue-600 group-hover:scale-110 transition-transform" />
                      <span className="text-xs text-gray-600 font-medium">Share</span>
                    </button>
                    
                    <button
                      onClick={toggleFavorite}
                      className="group flex flex-col items-center gap-2 p-3 hover:bg-white rounded-xl transition-all duration-200 hover:shadow-md"
                    >
                      {isFavorite ? (
                        <FaHeart className="w-7 h-7 text-red-600 group-hover:scale-110 transition-transform" />
                      ) : (
                        <FaRegHeart className="w-7 h-7 text-blue-600 group-hover:scale-110 transition-transform" />
                      )}
                      <span className="text-xs text-gray-600 font-medium">Favorite</span>
                    </button>
                    <button onClick={TO_CHAT} className="group flex flex-col items-center gap-2 p-3 hover:bg-white rounded-xl transition-all duration-200 hover:shadow-md">
                      <AiOutlineMessage className="w-7 h-7 text-blue-600 group-hover:scale-110 transition-transform" />
                      <span className="text-xs text-gray-600 font-medium" >Message</span>
                    </button>
                    <button className="group flex flex-col items-center gap-2 p-3 hover:bg-white rounded-xl transition-all duration-200 hover:shadow-md">
                      <FiPhone className="w-7 h-7 text-blue-600 group-hover:scale-110 transition-transform" />
                      <span className="text-xs text-gray-600 font-medium">Call</span>
                    </button>
                      <button onClick={TO_DETAILS} className="group flex flex-col items-center gap-2 p-3 hover:bg-white rounded-xl transition-all duration-200 hover:shadow-md">
                      < AiOutlineInfoCircle className="w-7 h-7 text-blue-600 group-hover:scale-110 transition-transform" />
                      <span className="text-xs text-gray-600 font-medium">Details</span>
                    </button>
                  </div>

                 
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
// Define property component

export default Property;
// Export default property
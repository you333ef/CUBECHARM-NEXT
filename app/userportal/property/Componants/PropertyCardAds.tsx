import React, { memo, useMemo, useState, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Heart,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  MapPin,
  Star,
  Eye,
} from "lucide-react";

type PropertyCardProps = {
  id: number | string;
  image: string;
  title: string;
  location: string;
  price: string;
  size?: string;
  description?: string;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
};

const PropertyCard = memo(
  ({
    id,
    image,
    title,
    location,
    price,
    size = "150",
    description = "Brand New Fully Furnished 1BR ...",
    isFavorite = false,
    onToggleFavorite,
  }: PropertyCardProps) => {
    const router = useRouter();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const images = useMemo(() => [image, image], [image]);

    const handlePrev = useCallback((e: React.MouseEvent) => {
      e.stopPropagation();
      setCurrentImageIndex((prev) => (prev === 0 ? 1 : 0));
    }, []);

    const handleNext = useCallback((e: React.MouseEvent) => {
      e.stopPropagation();
      setCurrentImageIndex((prev) => (prev === 1 ? 0 : 1));
    }, []);

    const handleCardClick = () => router.push(`/property/${id}`);

    const handleFavoriteClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      onToggleFavorite?.();
    };

    return (
      <div
        onClick={handleCardClick}
        className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden max-w-md border border-gray-100 cursor-pointer"
      >
        {/* Header */}
        <div className="p-3 pb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold">
              Y
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-800">
                Yousef Khaled
              </span>
              <span className="text-xs text-gray-500">Front End Developer</span>
            </div>
          </div>
          <button
            onClick={(e) => e.stopPropagation()}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <MoreVertical className="text-gray-600" size={18} />
          </button>
        </div>

        {/* Image Carousel */}
        <div className="relative group">
          <Image
            src={images[currentImageIndex]}
            alt={title}
            width={400}
            height={256}
            className="w-full h-64 object-cover"
            loading="lazy"
          />
          <button
            onClick={handlePrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
          >
            <ChevronLeft size={24} className="text-gray-800" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
          >
            <ChevronRight size={24} className="text-gray-800" />
          </button>
        </div>

        {/* Content */}
        <div className="p-3">
          <p className="text-sm text-gray-700 line-clamp-2 leading-relaxed mb-2">
            {description}
          </p>
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-blue-600 font-bold text-lg hover:text-blue-700 transition-colors">
              {title}
            </h3>
            <button
              onClick={handleFavoriteClick}
              className="p-1 hover:scale-110 transition-transform"
            >
              <Heart
                size={24}
                className={isFavorite ? "text-red-500 fill-red-500" : "text-gray-400"}
              />
            </button>
          </div>
          <p className="text-gray-900 text-lg font-semibold mb-2">{price}</p>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1">
              <MapPin className="text-gray-600" size={14} />
              <span className="text-gray-600 text-sm">{location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="text-yellow-400" size={18} />
              <span className="text-sm font-semibold">4.8</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-3">
              <span>Apartment</span>
              <span>{size} m²</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye size={14} />
              <span>4.2K</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

PropertyCard.displayName = "PropertyCard";

export default PropertyCard;
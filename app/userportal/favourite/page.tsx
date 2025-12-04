"use client";

import { useState, useEffect } from "react";
import PropertyCard from "../componants/shared/PropertyCard";
import Image from "next/image";
import { toast } from "sonner";
import { properties } from "../../utils/properties";

export default function MyFavorites() {
  const [favorites, setFavorites] = useState(() => properties.slice(0, 20));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const preload = async () => {
      const promises = favorites.map((p) => {
        return new Promise((resolve) => {
          const img = new window.Image();
          img.src = p.image;
          img.onload = resolve;
          img.onerror = resolve;
        });
      });
      await Promise.all(promises);
      setLoading(false);
    };
    preload();
  }, [favorites]);

  const handleRemoveFavorite = (id: number) => {
    setFavorites((prev) => prev.filter((item) => item.id !== id));
    toast.error("Removed from favorites");
  };

  if (favorites.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="text-center">
          <Image
            src="/images/noResultFavories.jpg"
            alt="No favorites yet"
            width={320}
            height={320}
            className="mx-auto"
            priority
          />
          <p className="mt-8 text-xl text-gray-700">
            You don&apos;t have any favorites yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-10">
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-md border border-gray-100 p-4 animate-pulse"
            >
              <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
              <div className="h-5 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="flex justify-between">
                <div className="h-5 bg-gray-200 rounded w-20"></div>
                <div className="h-5 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favorites.map((property) => (
            <PropertyCard
              key={property.id}
              {...property}
              isFavorite={true}
              onRemoveFavorite={() => handleRemoveFavorite(property.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

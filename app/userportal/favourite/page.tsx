"use client";

import { useContext, useEffect, useState } from "react";
import PropertyCard from "../../../app/userportal/componants/shared/PropertyCard";
import Image from "next/image";
import axios from "axios";
import { toast } from "sonner";
import AuthContext from "@/app/providers/AuthContext";
import api from "@/app/AuthLayout/refresh";

interface FavouriteProperty {
  propertyId: number;
  userId: number;
  title: string;
  price: number;
  currency: string;
  listingType: string;
  totalArea: number;
  areaUnit: string;
  categoryName: string;
  categorySlug: string;
  city: string;
  country: string;
  ownerUserId: number;
  ownerName: string;
  ownerProfileImage: string | null;
  ownerBio: string | null;
  ownerRating: number;
  isFavourite: boolean;
  isFollowingOwner: boolean;
  imageUrl1: string | null;
  imageUrl2: string | null;
  viewsCount: number;
  publishedAt: string;
  isFeatured: boolean;
  featuredUntil: string | null;
  updatedAt: string;
}


export default function MyFavorites() {
  const [favorites, setFavorites] = useState<FavouriteProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const {  syncFavoriteIds } = useContext(AuthContext)!;


  useEffect(() => {
    const fetchFavorites = async () => {
      try {

        const res = await api.get(
          `/favourite/property`,
         
        );

        const items = res.data?.data?.items || [];
        setFavorites(items);
        //  all fetched favorite ID 
        const ids = items.map((item: FavouriteProperty) => item.propertyId);
        syncFavoriteIds(ids);
      } catch (error) {
        toast.error("Failed to load favorites");
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

const handleRemoveFavorite = (propertyId: number) => {
  setFavorites((prev) => prev.filter((item) => item.propertyId !== propertyId));
};



  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading favorites...
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="text-center">
        
          <p className="mt-8 text-xl text-gray-700">
            You dont have any favorites yet 
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen px-4 py-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
   {favorites.map((property) => (
  <PropertyCard
    key={property.propertyId}
    id={property.propertyId}
    images={
      property.imageUrl1
        ? [property.imageUrl1]
        : []
    }
    title={property.title}
    description={undefined}
    price={property.price.toString()}
    currency={property.currency}
    location={`${property.city}, ${property.country}`}
    categoryName={property.categoryName}
    categorySlug={property.categorySlug}
    totalArea={property.totalArea}
    viewsCount={property.viewsCount}
    publishedAt={property.publishedAt}
    ownerName={property.ownerName}
    ownerProfileImage={property.ownerProfileImage ?? ""}
    ownerRating={property.ownerRating}
    ownerUserId={String(property.ownerUserId)}
    isFavorite={true}
    onRemoveFavorite={() =>
      handleRemoveFavorite(property.propertyId)
    }
  />
))}

      </div>
    </div>
  );
}

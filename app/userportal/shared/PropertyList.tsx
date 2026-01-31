"use client";

import React, { useContext, useEffect, useState } from "react";
import PropertyCard from "../componants/shared/PropertyCard";
import CategoryBar from "../CategoryBar";
import StoriesProfilee from "../profilee/componants/StoriesProfilee";
import LayoutWrapper from "../componants/LayoutWrapper";
import StoryViewer from "../profilee/componants/StoryViewer";
import AuthContext from "@/app/providers/AuthContext";
import axios from "axios";

const PropertyList = () => {
  const { baseUrl } = useContext(AuthContext)!;
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProperties = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/Property/feed?page=1&pageSize=24&sort=recent`
      );

      if (response.status === 200) {
        const items = response.data.data.items.map((item: any) => {
          const formatUrl = (url: string | null) => {
            if (!url) return null;
            if (url.startsWith("http")) return url;
            return `${baseUrl}/${url}`;
          };

          return {
            ...item,
            mainImage: formatUrl(item.imageUrl1),
          };
        });

        setProperties(items);
      }
    } catch (error) {
      console.error("Error fetching property feed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  return (
    <LayoutWrapper>
      <div className="w-full py-5 px-3 md:px-6">
        <CategoryBar />
        <div className="mb-6">
          {/* <StoriesProfilee /> */}
          <StoryViewer />
        </div>
        <h2 className="text-2xl ml-3 font-semibold mb-6 text-gray-700">
          Recommendations for you
        </h2>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array(8)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl shadow-md border border-gray-100 animate-pulse overflow-hidden"
                  style={{ aspectRatio: "3/4" }}
                >
                  <div className="h-64 bg-gray-200" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-4/5" />
                    <div className="h-6 bg-gray-200 rounded w-3/5" />
                    <div className="h-7 bg-gray-200 rounded w-2/5" />
                    <div className="flex justify-between">
                      <div className="h-4 bg-gray-200 rounded w-24" />
                      <div className="h-4 bg-gray-200 rounded w-16" />
                    </div>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {properties
              .filter(property => property.mainImage)
              .map(property => (
                <PropertyCard
                  key={property.propertyId}
                  id={property.propertyId}
                  title={property.title}
            images={property.imageUrl1 ? [property.imageUrl1] : []}
                  location={property.city}
                  price={property.price}
                 
                  description={property.description}
                  currency={property.currency}
                  categoryName={property.categoryName}
                  categorySlug={property.categorySlug}
                  totalArea={property.totalArea}
                  viewsCount={property.viewsCount}
                  //publishedAt ,ownerName,ownerProfileImage,ownerRating,ownerUserId
                  publishedAt={property.publishedAt}
                  ownerName={property.ownerName}
                  ownerProfileImage={property.ownerProfileImage}
                  ownerRating={property.ownerRating}
                  ownerUserId={property.ownerUserId}
                  fetchProperties={fetchProperties}
                  
                />
              ))}
          </div>
        )}
      </div>
    </LayoutWrapper>
  );
};

export default PropertyList;

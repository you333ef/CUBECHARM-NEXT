"use client";

import React, { useState } from "react";
import PropertyCard from "../componants/shared/PropertyCard";
import CategoryBar from "../CategoryBar";
import StoriesProfilee from "../profilee/componants/StoriesProfilee";
import LayoutWrapper from "../componants/LayoutWrapper";
import { properties } from "../../utils/properties";
import StoryViewer from "../profilee/componants/StoryViewer";

const PropertyList = () => {
  
  const [loading] = useState(false); 
  // 1- 

  return (
    <LayoutWrapper>
      <div className="w-full py-5 px-3 md:px-6">

        <CategoryBar />
        {/* 2-*/}

        <div className="mb-6">
          {/* 3-*/}
          <StoriesProfilee /> 
          <StoryViewer />
        </div>

        <h2 className="text-2xl ml-3 font-semibold mb-6 text-gray-700">
          Recommendations for you
        </h2>

        {/* 4- */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

            {Array(8)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  // 5- 
                  className="bg-white rounded-xl shadow-md border border-gray-100 animate-pulse overflow-hidden"
                  style={{ aspectRatio: "3/4" }} 
                  // 6-
                >
                  <div className="h-64 bg-gray-200" />
                  {/* 7- */}

                  <div className="p-4 space-y-3">
                    {/* 8-  */}
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

            {/* 9*/}
            {properties.map((property, index) => (
              <PropertyCard
                key={property.id}
               
                id={property.id}
                title={property.title}
                image={property.image}
                location={property.location}
                price={property.price}
                size={property.size}
                description={property.description}

                
             
              />
            ))}
          </div>
        )}
      </div>
    </LayoutWrapper>
  );
};

export default PropertyList;

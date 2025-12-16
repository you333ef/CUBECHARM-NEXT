"use client";

import { MapPin, Square, Bed } from "lucide-react";
import { Suspense } from "react";
import InteractiveWrapper from "../LeftInteractiveSection";

const bedroomImg = "/images/BEDROOM1.jpg";
const livingImg = "/images/Living.jpg";
const kitchenImg = "/images/Kitchen.jpg";
const bathroomImg = "/images/bathroom.jpg";

const rooms = [
  {
    id: 1,
    name: "Bed  room",
    nameEn: "Bedroom",
    image: bedroomImg,
    description: "Spacious master bedroom with modern design and natural lighting",
    features: ["King-size bed", "Large wardrobe", "Private balcony"]
  },
  {
    id: 2,
    name: "Living Room",
    nameEn: "Living Room",
    image: livingImg,
    description: "Luxury living room with a wide and comfortable space",
    features: ["Modern sofa", "65-inch TV", "LED lighting"]
  },
  {
    id: 3,
    name: "Kitchen", 
    nameEn: "Kitchen",
    image: kitchenImg,
    description: "Fully modern kitchen with high-quality appliances",
    features: ["Natural marble", "Modern electric appliances", "Kitchen island"]
  },
  {
    id: 4,
    name: "Bathroom",
    nameEn: "Bathroom",
    image: bathroomImg,
    description: "Luxury bathroom with relaxing spa design",
    features: ["Elegant bathtub", "Glass shower", "Hidden lighting"]
  }
];

const initialRoom = rooms[0];

function InteractiveSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-pulse">
      <div className="order-1 lg:order-2">
        <div className="bg-[#ffffff] rounded-2xl shadow-lg overflow-hidden sticky top-6">
          <div className="relative bg-[#f8f9fa] flex items-center justify-center min-h-[350px] md:min-h-[450px] lg:min-h-[550px]">
            <div className="bg-gray-200 w-full h-full"></div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#000000dd] via-[#00000066] to-transparent p-4 md:p-6">
              <div className="h-8 bg-gray-300 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2 mt-2"></div>
            </div>
          </div>
          <div className="p-3 md:p-4 bg-[#f8f9fa] border-t border-[#e0e0e0]">
            <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {rooms.map((room) => (
                <div key={room.id} className="flex-shrink-0 w-20 h-16 md:w-24 md:h-20 bg-gray-200 rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="order-2 lg:order-1">
        <div className="bg-[#ffffff] rounded-2xl shadow-lg p-6 md:p-8">
          <div className="mb-6 pb-6 border-b border-[#e0e0e0]">
            <div className="h-10 bg-gray-200 rounded w-3/4 mb-3"></div>
            <div className="flex items-baseline gap-2">
              <div className="h-10 bg-gray-200 rounded w-1/3"></div>
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
          <div className="mb-6 pb-6 border-b border-[#e0e0e0]">
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
          <div className="mb-6">
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
          <div className="mb-6 pb-6 border-b border-[#e0e0e0]">
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-3"></div>
            <div className="h-4 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <ul className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <li key={i} className="h-4 bg-gray-200 rounded"></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mb-6">
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-3"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
          <div className="flex flex-col gap-3">
            <div className="h-12 bg-gray-200 rounded-xl"></div>
            <div className="h-12 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProMode() {
  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <header className="bg-[#ffffff] shadow-sm py-4 px-6 border-b border-[#e0e0e0]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold text-[#3b82f6]">PRO MODE</h1>
          <div className="flex items-center gap-2 text-[#7f8c8d]">
            <MapPin className="text-xl" />
            <span className="hidden md:inline">Egypt, Cairo</span>
          </div>
        </div>
      </header>
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <Suspense fallback={<InteractiveSkeleton />}>
          <InteractiveWrapper rooms={rooms} initialRoom={initialRoom} />
        </Suspense>
      </div>
    </div>
  );
}
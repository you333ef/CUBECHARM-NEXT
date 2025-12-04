"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  HiOutlineHome,
  HiOutlineOfficeBuilding,
} from "react-icons/hi";
import {
  FaHospital,
  FaIndustry,
  FaShoppingBag,
  FaUtensils,
  FaCar,
  FaTshirt,
  FaTree,
  FaHotel,
  FaUniversity,
  FaShieldAlt,
  FaMapMarkedAlt,
  FaStore,
  FaRunning,
  FaLandmark,
  FaCity,
  FaLaptopCode,
  FaMosque,
  FaConciergeBell,
  FaAmbulance,
  FaSolarPanel,
  FaGlobe,
  FaTheaterMasks,
} from "react-icons/fa";

// Category data
const categories = [
  { name: "Agriculture", path: "/userportal/categoryBar/agriculture", icon: <FaTree size={22}/> },
  { name: "Arts & Entertainment", path: "/userportal/categoryBar/artsentertainment", icon: <FaTheaterMasks size={22}/> },
  { name: "Automotive & Transportation", path: "/userportal/categoryBar/automotivetransportation", icon: <FaCar size={22}/> },
  { name: "Construction & Architecture", path: "/userportal/categoryBar/constructionarchitecture", icon: <FaLandmark size={22}/> },
  { name: "Culture & Arts", path: "/userportal/categoryBar/culturearts", icon: <FaTheaterMasks size={22}/> },
  { name: "Daily Services", path: "/userportal/categoryBar/dailyservices", icon: <FaShieldAlt size={22}/> },
  { name: "Educational Institutions", path: "/userportal/categoryBar/educationalinstitutions", icon: <FaUniversity size={22}/> },
  { name: "Education & Training", path: "/userportal/categoryBar/educationtraining", icon: <FaUniversity size={22}/> },
  { name: "Emergency & Relief", path: "/userportal/categoryBar/emergencyrelief", icon: <FaAmbulance size={22}/> },
  { name: "Energy & Environment", path: "/userportal/categoryBar/energyenvironment", icon: <FaSolarPanel size={22}/> },
  { name: "Entertainment & Events", path: "/userportal/categoryBar/entertainmentevents", icon: <FaTheaterMasks size={22}/> },
  { name: "Fashion & Apparel", path: "/userportal/categoryBar/fashionappare", icon: <FaTshirt size={22}/> },
  { name: "Food & Beverage", path: "/userportal/categoryBar/foodbeverage", icon: <FaUtensils size={22}/> },
  { name: "Government & Public Sector", path: "/userportal/categoryBar/governmentpublicsector", icon: <HiOutlineOfficeBuilding size={22}/> },
  { name: "Healthcare Facilities", path: "/userportal/categoryBar/healthcarefacilities", icon: <FaHospital size={22}/> },
  { name: "Healthcare & Medical", path: "/userportal/categoryBar/healthcaremedical", icon: <FaHospital size={22}/> },
  { name: "Industry-Agnostic", path: "/userportal/categoryBar/industryagnostic", icon: <FaGlobe size={22}/> },
  { name: "Manufacturing & Industrial", path: "/userportal/categoryBar/manufacturingindustrial", icon: <FaIndustry size={22}/> },
  { name: "Nature & Outdoors", path: "/userportal/categoryBar/natureoutdoors", icon: <FaTree size={22}/> },
  { name: "Real Estate", path: "/userportal/categoryBar/realestate", icon: <HiOutlineHome size={22}/> },
  { name: "Religious Sites", path: "/userportal/categoryBar/religioussites", icon: <FaMosque size={22}/> },
  { name: "Residential Accommodations", path: "/userportal/categoryBar/residentialaccommodations", icon: <FaStore size={22}/> },
  { name: "Restaurants & Cafes", path: "/userportal/categoryBar/restaurantscafes", icon: <FaUtensils size={22}/> },
  { name: "Retail & E-commerce", path: "/userportal/categoryBar/retailecommerce", icon: <FaShoppingBag size={22}/> },
  { name: "Shopping Venues", path: "/userportal/categoryBar/shoppingvenues", icon: <FaShoppingBag size={22}/> },
  { name: "Sports & Fitness", path: "/userportal/categoryBar/sportsfitness", icon: <FaRunning size={22}/> },
  { name: "Technology & Computing", path: "/userportal/categoryBar/technologycomputing", icon: <FaLaptopCode size={22}/> },
  { name: "Tourism & Heritage", path: "/userportal/categoryBar/tourismheritage", icon: <FaCity size={22}/> },
  { name: "Transportation Hubs", path: "/userportal/categoryBar/transportationhubs", icon: <FaMapMarkedAlt size={22}/> },
  { name: "Travel & Hospitality", path: "/userportal/categoryBar/travelhospitality", icon: <FaHotel size={22}/> }
];
const CategoryBar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleClick = (path: string) => {
    router.push(path);
  };

  return (
    <div
      className="
        w-full 
        mt-3 py-4 
        overflow-x-auto
        whitespace-nowrap
        scrollbar-hide
        max-w-full
      "
      style={{ cursor: "grab" }}
    >
      {/* Scroll container */}
      <div className="flex gap-5 px-4 w-max">
        {categories.map((cat) => {
          const isActive = pathname === cat.path;

          return (
            <button
              key={cat.name}
              onClick={() => handleClick(cat.path)}
              className="
                flex flex-col items-center gap-2 
                min-w-[80px] 
                transition-all duration-200 
                hover:scale-105
                cursor-pointer
              "
            >
              {/* Icon circle */}
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${
                  isActive
                    ? "bg-sky-100 border-2 border-sky-500 shadow-md"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                <span className={isActive ? "text-sky-600" : "text-gray-700"}>
                  {cat.icon}
                </span>
              </div>

              {/* Label */}
              <p
                className={`text-xs font-medium whitespace-nowrap ${
                  isActive ? "text-sky-600" : "text-gray-700"
                }`}
              >
                {cat.name}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryBar;

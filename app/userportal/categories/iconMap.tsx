import React from "react";
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
  FaAmbulance,
  FaSolarPanel,
  FaGlobe,
  FaTheaterMasks,
} from "react-icons/fa";

const ICON_SIZE = 22;


export const getCategoryIcon = (name: string): React.ReactNode => {
  const lower = name.toLowerCase();

  if (lower.includes("arts") && lower.includes("entertainment"))
    return <FaTheaterMasks size={ICON_SIZE} />;
  if (lower.includes("automotive") || (lower.includes("transportation") && lower.includes("hub")))
    return <FaCar size={ICON_SIZE} />;
  if (lower.includes("construction") || lower.includes("architecture"))
    return <FaLandmark size={ICON_SIZE} />;
  if (lower.includes("educational institution"))
    return <FaUniversity size={ICON_SIZE} />;
  if (lower.includes("healthcare") && lower.includes("facilit"))
    return <FaHospital size={ICON_SIZE} />;
  if (lower.includes("industry") && lower.includes("agnostic"))
    return <FaGlobe size={ICON_SIZE} />;
  if (lower.includes("real estate"))
    return <HiOutlineHome size={ICON_SIZE} />;
  if (lower.includes("daily service"))
    return <FaShieldAlt size={ICON_SIZE} />;
  if (lower.includes("public sector") || lower.includes("government"))
    return <HiOutlineOfficeBuilding size={ICON_SIZE} />;

  if (lower.includes("agriculture")) return <FaTree size={ICON_SIZE} />;
  if (lower.includes("culture")) return <FaTheaterMasks size={ICON_SIZE} />;
  if (lower.includes("education") || lower.includes("training"))
    return <FaUniversity size={ICON_SIZE} />;
  if (lower.includes("emergency") || lower.includes("relief"))
    return <FaAmbulance size={ICON_SIZE} />;
  if (lower.includes("energy") || lower.includes("environment"))
    return <FaSolarPanel size={ICON_SIZE} />;
  if (lower.includes("entertainment") || lower.includes("event"))
    return <FaTheaterMasks size={ICON_SIZE} />;
  if (lower.includes("fashion") || lower.includes("apparel"))
    return <FaTshirt size={ICON_SIZE} />;
  if (lower.includes("food") || lower.includes("beverage"))
    return <FaUtensils size={ICON_SIZE} />;
  if (lower.includes("healthcare") || lower.includes("medical"))
    return <FaHospital size={ICON_SIZE} />;
  if (lower.includes("manufacturing") || lower.includes("industrial"))
    return <FaIndustry size={ICON_SIZE} />;
  if (lower.includes("nature") || lower.includes("outdoor"))
    return <FaTree size={ICON_SIZE} />;
  if (lower.includes("religious")) return <FaMosque size={ICON_SIZE} />;
  if (lower.includes("residential") || lower.includes("accommodation"))
    return <FaStore size={ICON_SIZE} />;
  if (lower.includes("restaurant") || lower.includes("cafe"))
    return <FaUtensils size={ICON_SIZE} />;
  if (lower.includes("retail") || lower.includes("commerce"))
    return <FaShoppingBag size={ICON_SIZE} />;
  if (lower.includes("shopping")) return <FaShoppingBag size={ICON_SIZE} />;
  if (lower.includes("sport") || lower.includes("fitness"))
    return <FaRunning size={ICON_SIZE} />;
  if (lower.includes("technology") || lower.includes("computing"))
    return <FaLaptopCode size={ICON_SIZE} />;
  if (lower.includes("tourism") || lower.includes("heritage"))
    return <FaCity size={ICON_SIZE} />;
  if (lower.includes("transportation"))
    return <FaMapMarkedAlt size={ICON_SIZE} />;
  if (lower.includes("travel") || lower.includes("hospitality"))
    return <FaHotel size={ICON_SIZE} />;

  // Default fallback
  return <FaGlobe size={ICON_SIZE} />;
};

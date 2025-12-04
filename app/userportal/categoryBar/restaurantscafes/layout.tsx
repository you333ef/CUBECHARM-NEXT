"use client";

import { useRouter, usePathname } from "next/navigation";

export default function Layout({ children }:any) {
  const router = useRouter();
  const pathname = usePathname();
  const BASE_PATH = "/userportal/categoryBar";


   const categories = [
    { name: "Fine Dining", path: `${BASE_PATH}/FineDining` },
    { name: "Local Cuisine", path: `${BASE_PATH}/LocalCuisine` },
    { name: "Fast Food", path: `${BASE_PATH}/FastFood` },
    { name: "Arabic Coffeehouse", path: `${BASE_PATH}/ArabicCoffeehouse` },
    { name: "Modern Café", path: `${BASE_PATH}/ModernCafe` },
    { name: "Asian Cuisine", path: `${BASE_PATH}/AsianCuisine` },
    { name: "Indian Restaurant", path: `${BASE_PATH}/restaurantscafes` },
    { name: "Organic Food", path: `${BASE_PATH}/OrganicFood` },
    { name: "Vegan Restaurant", path: `${BASE_PATH}/VeganRestaurant` },
    { name: "Seafood Restaurant", path: `${BASE_PATH}/SeafoodRestaurant` },
    { name: "BBQ Grill", path: `${BASE_PATH}/BBQGrill` },
    { name: "Dessert Café", path: `${BASE_PATH}/DessertCafe` },
    { name: "Museum Café", path: `${BASE_PATH}/MuseumCafe` },
    { name: "Rooftop Restaurant", path: `${BASE_PATH}/RooftopRestaurant` },
    { name: "Hotel Restaurant", path: `${BASE_PATH}/HotelRestaurant` },
    { name: "Food Truck", path: `${BASE_PATH}/FoodTruck` },
    { name: "Ice Cream", path: `${BASE_PATH}/IceCream` },
    { name: "Cat Café", path: `${BASE_PATH}/CatCafe` },
    { name: "Reading Café", path: `${BASE_PATH}/ReadingCafe` },
    { name: "Nightclub Bar", path: `${BASE_PATH}/NightclubBar` },
    { name: "Standard Cinema", path: `${BASE_PATH}/StandardCinema` },
    { name: "IMAX Cinema", path: `${BASE_PATH}/IMAXCinema` },
    { name: "Comedy Theater", path: `${BASE_PATH}/ComedyTheater` },
    { name: "Improv Club", path: `${BASE_PATH}/ImprovClub` },
    { name: "Water Park", path: `${BASE_PATH}/WaterPark` },
    { name: "Indoor Amusement", path: `${BASE_PATH}/IndoorAmusement` },
    { name: "Carnival", path: `${BASE_PATH}/Carnival` },
    { name: "Concert Hall", path: `${BASE_PATH}/ConcertHall` },
    { name: "Dance Festival", path: `${BASE_PATH}/DanceFestival` },
    { name: "Traditional Circus", path: `${BASE_PATH}/TraditionalCircus` },
    { name: "Street Plaza", path: `${BASE_PATH}/StreetPlaza` },
    { name: "Gaming Expo", path: `${BASE_PATH}/GamingExpo` },
    { name: "Escape Room", path: `${BASE_PATH}/EscapeRoom` },
    { name: "Casino", path: `${BASE_PATH}/Casino` },
    { name: "Bowling Alley", path: `${BASE_PATH}/BowlingAlley` },
    { name: "E-Sports Lounge", path: `${BASE_PATH}/ESportsLounge` },
    { name: "Playground Complex", path: `${BASE_PATH}/PlaygroundComplex` },
    { name: "Illusion Museum", path: `${BASE_PATH}/IllusionMuseum` },
    { name: "Heritage Nights", path: `${BASE_PATH}/HeritageNights` },
    { name: "Family Edutainment", path: `${BASE_PATH}/FamilyEdutainment` },
  ];


  const isActive = (path:any) => pathname === path;

  return (
    <div className="w-full">
      {/* Categories Bar */}
      <div className="w-full mt-10 py-4">
        <div className="flex flex-row gap-3 overflow-x-auto scrollbar-hide px-4 pb-2">
          {categories.map((cat, index) => (
            <button
              key={cat.name}
              onClick={() => router.push(cat.path)}
              style={{ animationDelay: `${index * 50}ms` }}
              className={`
                group
                flex items-center justify-center
                px-5 py-2.5
                rounded-full
                cursor-pointer
                transition-all duration-300 ease-out
                text-sm font-medium
                whitespace-nowrap
                animate-fade-in
                outline-none
                focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
                ${
                  isActive(cat.path)
                    ? "bg-[#D0E7FF] text-[#0B63C5]"
                    : "bg-[#F2F2F2] text-[#555] hover:bg-[#E5E5E5] hover:text-[#222]"
                }
              `}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Outlet → children */}
      <div className="px-4 mt-4">
        {children}
      </div>
    </div>
  );
}

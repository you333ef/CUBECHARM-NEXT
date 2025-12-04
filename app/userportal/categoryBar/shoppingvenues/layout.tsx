"use client";

import { useRouter, usePathname } from "next/navigation";

export default function Layout({ children }:any) {
  const router = useRouter();
  const pathname = usePathname();
  const BASE_PATH = "/userportal/categoryBar";


   const categories = [
    { name: "Traditional Market", path: `${BASE_PATH}/TraditionalMarket` },
    { name: "Night Market", path: `${BASE_PATH}/NightMarket` },
    { name: "Grocery Store", path: `${BASE_PATH}/GroceryStore` },
    { name: "Supermarket Chain", path: `${BASE_PATH}/SupermarketChain` },
    { name: "Shopping Mall", path: `${BASE_PATH}/ShoppingMall` },
    { name: "Electronics Store", path: `${BASE_PATH}/shoppingvenues` },
    { name: "Home Appliances", path: `${BASE_PATH}/HomeAppliances` },
    { name: "Men Boutique", path: `${BASE_PATH}/MenBoutique` },
    { name: "Women Fashion", path: `${BASE_PATH}/WomenFashion` },
    { name: "Children Store", path: `${BASE_PATH}/ChildrenStore` },
    { name: "Accessories Shop", path: `${BASE_PATH}/AccessoriesShop` },
    { name: "Perfume Boutique", path: `${BASE_PATH}/PerfumeBoutique` },
    { name: "Cosmetics Store", path: `${BASE_PATH}/CosmeticsStore` },
    { name: "Sports Shop", path: `${BASE_PATH}/SportsShop` },
    { name: "Stationery Store", path: `${BASE_PATH}/StationeryStore` },
    { name: "Gift Shop", path: `${BASE_PATH}/GiftShop` },
    { name: "Carpet Store", path: `${BASE_PATH}/CarpetStore` },
    { name: "Office Supplies", path: `${BASE_PATH}/OfficeSupplies` },
    { name: "Building Materials", path: `${BASE_PATH}/BuildingMaterials` },
    { name: "Auto Parts", path: `${BASE_PATH}/AutoParts` },
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

"use client";

import { useRouter, usePathname } from "next/navigation";

export default function Layout({ children }:any) {
  const router = useRouter();
  const pathname = usePathname();
  const BASE_PATH = "/userportal/categoryBar";


    const categories = [
    { name: "Bank Branch", path: `${BASE_PATH}/BankBranch` },
    { name: "Islamic Finance", path: `${BASE_PATH}/IslamicFinance` },
    { name: "Currency Exchange", path: `${BASE_PATH}/CurrencyExchange` },
    { name: "Laundry Service", path: `${BASE_PATH}/LaundryService` },
    { name: "Car Wash", path: `${BASE_PATH}/CarWash` },
    { name: "Men Barbershop", path: `${BASE_PATH}/MenBarbershop` },
    { name: "Women Salon", path: `${BASE_PATH}/WomenSalon` },
    { name: "Shoe Repair", path: `${BASE_PATH}/ShoeRepair` },
    { name: "Electronics Repair", path: `${BASE_PATH}/ElectronicsRepair` },
    { name: "Hardware Store", path: `${BASE_PATH}/dailyservices` },
    { name: "Post Office", path: `${BASE_PATH}/PostOffice` },
    { name: "Internet Café", path: `${BASE_PATH}/InternetCafe` },
    { name: "Mobile Store", path: `${BASE_PATH}/MobileStore` },
    { name: "Furniture Showroom", path: `${BASE_PATH}/FurnitureShowroom` },
    { name: "Gift Wrapping", path: `${BASE_PATH}/GiftWrapping` },
    { name: "Office Supplies", path: `${BASE_PATH}/OfficeSupplies` },
    { name: "Watch Repair", path: `${BASE_PATH}/WatchRepair` },
    { name: "Florist Shop", path: `${BASE_PATH}/FloristShop` },
    { name: "Book Kiosk", path: `${BASE_PATH}/BookKiosk` },
    { name: "Carpet Cleaning", path: `${BASE_PATH}/CarpetCleaning` },
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

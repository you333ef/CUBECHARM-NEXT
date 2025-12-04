"use client";

import { useRouter, usePathname } from "next/navigation";

export default function Layout({ children }:any) {
  const router = useRouter();
  const pathname = usePathname();
  const BASE_PATH = "/userportal/categoryBar";


    const categories = [
    { name: "Customer Experience", path: "/HomeList/Retailecommerce/Customer-Experience"},
    { name: "Digital Payments", path: "/HomeList/Retailecommerce/Digital-Payments" },
    { name: "E-commerce Platforms", path: "/HomeList/Retailecommerce/Ecommerce-Platforms" },
    { name: "Fashion Technology", path: "/userportal/categoryBar/entertainmentevents"},
    { name: "Inventory Management", path: "/HomeList/Retailecommerce/Inventory-Management" },
    { name: "Logistics and Shipping", path: "/HomeList/Retailecommerce/entertainmentevents" },
    { name: "Omnichannel Retailing", path: "/HomeList/Retailecommerce/Omnichannel-Retailing"},
    { name: "Retail Marketing", path: "/HomeList/Retailecommerce/Retail-Marketing"},
    { name: "Store Design", path: "/HomeList/Retailecommerce/Store-Design"},
    { name: "Supply Chain Management", path: "/HomeList/Retailecommerce/Supply-Chain-Management" },
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

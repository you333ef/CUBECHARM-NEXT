"use client";

import { useRouter, usePathname } from "next/navigation";

export default function Layout({ children }:any) {
  const router = useRouter();
  const pathname = usePathname();

  const categories = [
    { name: "AI & ML", path: "/userportal/categoryBar/agriculture/" },
    { name: "Blockchain", path: "/userportal/categoryBar/agriculture/" },
    { name: "Cloud Computing", path: "/userportal/categoryBar/agriculture" },
    { name: "Cybersecurity", path: "/userportal/categoryBar/agriculture/" },
    { name: "Data Analytics", path: "/userportal/categoryBar/agriculture/" },
    { name: "Digital Transformation", path: "/userportal/categoryBar/agriculture/" },
    { name: "E-commerce", path: "/userportal/categoryBar/agriculture/" },
    { name: "Entrepreneurship", path: "/userportal/categoryBar/agriculture/" },
    { name: "Environmental Sustainability", path: "/userportal/categoryBar/agriculture." },
    { name: "Global Market Trends", path: "/userportal/categoryBar/agriculture/" },
    { name: "Innovation", path: "/userportal/categoryBar/agriculture/" },
    { name: "Internet of Things (IoT)", path: "/userportal/categoryBar/agriculture/" },
    { name: "Networking", path: "/userportal/categoryBar/agriculture/" },
    { name: "Robotics", path: "/userportal/categoryBar/agriculture/" },
    { name: "Supply Chain Optimization", path: "/userportal/categoryBar/agriculture/" },
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

"use client";

import React, { useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import AuthContext from "@/app/providers/AuthContext";
import { Category } from "./types";
import { fetchCategories } from "./services";
import { getCategoryIcon } from "./iconMap";

const CategoryBar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { baseUrl } = useContext(AuthContext)!;
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cached = localStorage.getItem("categories");
    if (cached) {
      setCategories(JSON.parse(cached));
      setLoading(false);
      return;
    }

    const loadCategories = async () => {
      try {
        const res = await fetchCategories();        
        if (res.success) {
          setCategories(res.data);
          localStorage.setItem("categories", JSON.stringify(res.data));
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, [baseUrl]);

  const handleClick = (categoryId: number) => {
    router.push(`/userportal/categories/${categoryId}`);
  };

  if (loading) {
    return (
      <div className="w-full mt-3 py-4 overflow-x-auto whitespace-nowrap scrollbar-hide max-w-full">
        <div className="flex gap-5 px-4 w-max">
          {Array(10).fill(0).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2 min-w-[80px]">
              <div className="w-16 h-16 rounded-2xl bg-gray-200 animate-pulse" />
              <div className="h-3 w-14 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mt-3 py-4 overflow-x-auto whitespace-nowrap scrollbar-hide max-w-full" style={{ cursor: "grab" }}>
      <div className="flex gap-5 px-4 w-max">
        {categories.map((cat) => {
          const isActive = pathname.startsWith(`/userportal/categories/${cat.id}`);

          return (
            <button
              key={cat.id}
              onClick={() => handleClick(cat.id)}
              className="flex flex-col items-center gap-2 min-w-[80px] transition-all duration-200 hover:scale-105 cursor-pointer"
            >
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${
                isActive ? "bg-sky-100 border-2 border-sky-500 shadow-md" : "bg-gray-100 hover:bg-gray-200"
              }`}>
                <span className={isActive ? "text-sky-600" : "text-gray-700"}>
                  {getCategoryIcon(cat.name)}
                </span>
              </div>
              <p className={`text-xs font-medium whitespace-nowrap ${isActive ? "text-sky-600" : "text-gray-700"}`}>
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

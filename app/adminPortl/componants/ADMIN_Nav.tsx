"use client";

import { useState, useEffect, useRef } from "react";
import { FaEnvelope, FaBell, FaChevronDown } from "react-icons/fa";
import { FiMenu } from "react-icons/fi";

import Notifications from "../../userportal/componants/shared/Notifications";
import Image from "next/image";

// 1
interface AdminNavProps {
  toggleSidebar: () => void;
}

const ADMIN_Nav = ({ toggleSidebar }: AdminNavProps) => {
  //2
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  // 3
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 4
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    //
    <div className="min-h-[60px] bg-white border-b border-gray-200 shadow-sm">
      <nav className="w-full flex items-center justify-between px-4 md:px-6 py-2">
        
        {/* ==================== 6 ==================== */}
        <div className="flex items-center gap-3 md:gap-4">
          {/* 7*/}
          <button
            className="cursor-pointer md:hidden"
            onClick={toggleSidebar}
          >
            <FiMenu size={24} />
          </button>

          {/* 8 */}
          <span className="text-sm md:text-base font-medium text-skyline-blue">
            CUBECHARM
          </span>
        </div>

        {/* ==================== 9 ==================== */}
        <div className="flex items-center gap-3 md:gap-6">
          
          {/* 10 */}
          <div className="relative">
            <FaEnvelope className="w-5 h-5" />
            <span className="absolute -top-1.5 -right-2 bg-[#ff3b30] text-white text-[10px] px-1.5 rounded-full font-semibold">
              10
            </span>
          </div>

          {/* 11 */}
          <div className="relative">
            <Notifications />
          </div>

          {/* ==================== 12==================== */}
          <div className="relative inline-block text-left" ref={dropdownRef}>
            {/* 13 */}
            <div
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 cursor-pointer px-2 py-1 hover:bg-gray-100 rounded-md"
            >
              <Image
                src="/images/a9054bca-63af-4ee6-a443-e15e322569c3.png"
                alt="User Avatar"
                width={40}
                height={40}
                className="rounded-full object-cover"
              />
              <span className="hidden sm:block text-sm font-medium">Admin</span>
              <FaChevronDown size={12} />
            </div>

            {/*14 */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-44 rounded-md shadow-lg bg-white border border-gray-200 z-50">
                <ul className="py-1 text-sm text-gray-700">
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Profile</li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Settings</li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Logout</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default ADMIN_Nav;
'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IoHomeOutline,
  IoHome,
  IoChatbubbleEllipsesOutline,
  IoChatbubbleEllipses,
  IoCloudUploadOutline,
  IoPersonOutline,
  IoPerson,
  IoNewspaperOutline,
  IoNewspaper,
} from "react-icons/io5";

import { useState } from "react";

const BottomNavbar = () => {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 shadow-2xl z-50">
      <div className="container mx-auto px-2">
        <div className="flex items-center justify-around py-2">
          <Link
            href="/"
            className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all ${
              isActive("/")
                ? "text-blue-600"
                : "text-gray-600 hover:text-blue-500 hover:bg-blue-50"
            }`}
          >
            {isActive("/") ? <IoHome size={24} /> : <IoHomeOutline size={24} />}
            <span className="text-xs mt-1 font-medium">Home</span>
          </Link>
          <Link
            href="/userportal/activity"
            className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all ${
              isActive("/userportal/activity")
                ? "text-blue-600"
                : "text-gray-600 hover:text-blue-500 hover:bg-blue-50"
            }`}
          >
            {isActive("/userportal/activity") ? (
              <IoNewspaper size={24} />
            ) : (
              <IoNewspaperOutline size={24} />
            )}
            <span className="text-xs mt-1 font-medium">Activity</span>
          </Link>

          <Link
            href="/userportal/upload_options"
            className="flex flex-col items-center justify-center -mt-6"
          >
            <div
              className={`p-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all ${
                isActive("/userportal/upload_options")
                  ? "bg-gradient-to-r from-blue-500 to-blue-600"
                  : "bg-white border border-gray-300"
              }`}
            >
              <IoCloudUploadOutline
                size={22}
                className={`stroke-[2.5] ${
                  isActive("/userportal/upload_options") ? "text-white" : "text-gray-500"
                }`}
              />
            </div>
            <span
              className={`text-xs mt-2 font-medium ${
                isActive("/userportal/upload_options") ? "text-blue-600" : "text-gray-600"
              }`}
            >
              Upload
            </span>
          </Link>

          <Link
            href="/userportal/messaes"
            className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all relative ${
              isActive("/userportal/messaes")
                ? "text-blue-600"
                : "text-gray-600 hover:text-blue-500 hover:bg-blue-50"
            }`}
          >
            {isActive("/userportal/messaes") ? (
              <IoChatbubbleEllipses size={24} />
            ) : (
              <IoChatbubbleEllipsesOutline size={24} />
            )}
            <span className="text-xs mt-1 font-medium">Messages</span>
            <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
              3
            </span>
          </Link>

          <Link
            href="/userportal/profilee"
            className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all ${
              isActive("/userportal/profilee")
                ? "text-blue-600"
                : "text-gray-600 hover:text-blue-500 hover:bg-blue-50"
            }`}
          >
            {isActive("/userportal/profilee") ? (
              <IoPerson size={24} />
            ) : (
              <IoPersonOutline size={24} />
            )}
            <span className="text-xs mt-1 font-medium">Profile</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default BottomNavbar;
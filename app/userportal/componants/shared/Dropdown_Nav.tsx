'use client';

import { useState, useRef, useEffect, useContext } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';

import {
  IoPersonOutline,
  IoLockClosedOutline,
  IoCreateOutline,
  IoLogOutOutline,
  IoSettingsOutline,
  IoChevronDownOutline,
  IoCubeOutline,
  IoInformationCircleOutline,
  IoShieldCheckmarkOutline,
  IoMailOutline,
  IoHelpCircleOutline,
  IoLocationOutline,
  IoChatboxOutline,
} from 'react-icons/io5';
import axios from 'axios';
import AuthContext from '@/app/providers/AuthContext';

interface MenuItem {
  label: string;
  href?: string;
  icon:ReactNode;
  onClick?: () => void;
}

const Dropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCubeCharmOpen, setIsCubeCharmOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setIsSettingsOpen(false);
        setIsCubeCharmOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const { baseUrl } = useContext(AuthContext)!;

  const closeDropdown = () => setIsOpen(false);
const handleAuthAction = async (router: any) => {
  try {
    //revoke refresh token 
    await axios.post(
      `${baseUrl}/api/Auth/revoke-token`,
      {},
      { withCredentials: true }
    );
  } catch (error) {
    console.warn("Revoke token failed", error);
  } finally {
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
    }

    router.push("/AuthLayout/Login");
  }
};

const hasToken =
  typeof window !== "undefined" &&
  !!localStorage.getItem("accessToken");

  // Profile Settings links
  const profileSettings: MenuItem[] = [
    { label: 'Profile Info', href: '/userportal/Settings/profilesettings/profile_info', icon: <IoPersonOutline size={16} /> },
    { label: 'Change Password', href: '/AuthLayout/changePass', icon: <IoLockClosedOutline size={16} /> },
    { label: 'Update Profile', href: '/userportal/Settings/profilesettings/update', icon: <IoCreateOutline size={16} /> },
  {
    label: hasToken ? 'Log Out' : 'Login',
    icon: <IoLogOutOutline size={16} />,
    onClick: () => handleAuthAction(router),
  },
  ];

  // CubeCharm Info links
  const cubeCharmLinks: MenuItem[] = [
    { label: 'About', href: '/userportal/Settings/cube_info/about', icon: <IoInformationCircleOutline size={16} /> },
    { label: 'Privacy Policy', href: '/userportal/Settings/cube_info/Privacy', icon: <IoShieldCheckmarkOutline size={16} /> },
    { label: 'Contact', href: '/userportal/Settings/cube_info/contact', icon: <IoMailOutline size={16} /> },
    { label: 'Help', href: '/userportal/Settings/cube_info/help', icon: <IoHelpCircleOutline size={16} /> },
    { label: 'Locations', href: '/userportal/Settings/cube_info/locations', icon: <IoLocationOutline size={16} /> },
    { label: 'FAQ', href: '/userportal/Settings/cube_info/faq', icon: <IoChatboxOutline size={16} /> },
    { label: 'Premiam Plane', href: '/userportal/Settings/cube_info/PremiamPlane', icon: <IoLocationOutline size={16} /> },

  ];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Dropdown Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
        aria-label="Open user menu"
      >
        <IoSettingsOutline size={20} className="text-gray-700" />
        <IoChevronDownOutline
          size={16}
          className={`text-gray-700 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-2xl border border-gray-200 py-2 max-h-[80vh] overflow-y-auto">
          
          {/* Profile Settings Section */}
          <div className="border-t border-gray-200 first:border-none mt-2 first:mt-0 pt-2 first:pt-0">
            <button
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className="w-full flex items-center justify-between px-4 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              <div className="flex items-center gap-3">
                <IoSettingsOutline size={18} />
                <span className="text-sm font-medium">Profile Settings</span>
              </div>
              <IoChevronDownOutline
                size={16}
                className={`transition-transform ${isSettingsOpen ? 'rotate-180' : ''}`}
              />
            </button>
            {isSettingsOpen && (
              <div className="bg-gray-50 py-1">
                {profileSettings.map((item, idx) =>
                  item.href ? (
                    <Link
                      key={idx}
                      href={item.href}
                      className="flex items-center gap-3 px-8 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors text-sm"
                      onClick={closeDropdown}
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  ) : (
                    <button
                      key={idx}
                      onClick={() => { item.onClick?.(); closeDropdown(); }}
                      className="w-full flex items-center gap-3 px-8 py-2 text-red-500 hover:bg-red-50 transition-colors text-sm text-left"
                    >
                      {item.icon}
                      {item.label}
                    </button>
                  )
                )}
              </div>
            )}
          </div>

          {/* CubeCharm Info Section */}
          <div className="border-t border-gray-200 mt-2 pt-2">
            <button
              onClick={() => setIsCubeCharmOpen(!isCubeCharmOpen)}
              className="w-full flex items-center justify-between px-4 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              <div className="flex items-center gap-3">
                <IoCubeOutline size={18} />
                <span className="text-sm font-medium">CubeCharm Info</span>
              </div>
              <IoChevronDownOutline
                size={16}
                className={`transition-transform ${isCubeCharmOpen ? 'rotate-180' : ''}`}
              />
            </button>
            {isCubeCharmOpen && (
              <div className="bg-gray-50 py-1">
                {cubeCharmLinks.map((item, idx) => (
                  <Link
                    key={idx}
                    href={item.href!}
                    className="flex items-center gap-3 px-8 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors text-sm"
                    onClick={closeDropdown}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;

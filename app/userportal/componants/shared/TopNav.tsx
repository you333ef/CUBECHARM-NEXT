'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { IoSearch, IoHeartOutline, IoSettingsOutline } from 'react-icons/io5';
import { FaHeart } from 'react-icons/fa';
import ProfileDropdown from './Dropdown_Nav';
import Notifications from './Notifications';

/*
  Top navigation bar used across the entire app.
 */
const TopNavbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAuth] = useState(true); 

  const router = useRouter();
  const pathname = usePathname();

  // Helper to check current route
  const isActive = (path: string) => pathname === path;
  const inSearchPage = pathname?.includes('/userportal/search');
  const inPremiumPage = pathname?.includes('/Premieum_Plane');
  const inUpdatesPage = pathname?.includes('/LAST_Updates_Container');

  // Redirect to search page when input is focused (desktop behavior)
  const goToSearch = () => {
    router.push('/userportal/search');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="px-4 py-2">
              <span className="font-bold text-3xl text-blue-500 tracking-wide">
                
              </span>
            </div>
          </Link>
          {/* Desktop Search Bar - Hidden on pages where it would be redundant */}
          {!inSearchPage && !inPremiumPage && !inUpdatesPage && (
            <div className="hidden md:flex flex-1 max-w-xl mx-4">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Where you going?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={goToSearch}
                  className="w-full py-2.5 pl-4 pr-12 rounded-full border-2 border-gray-300 focus:border-blue-500 focus:outline-none transition-colors"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-colors">
                  <IoSearch size={18} />
                </button>
              </div>
            </div>
          )}
          {/* Right-side icons */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Mobile Search Icon */}
            <Link
              href="/userportal/favourite"
              className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Search"
            >
              <IoSearch size={24} className="text-gray-700 hover:text-blue-500 transition-colors" />
            </Link>
            {/* Favorites */}
            <Link
              href="/userportal/favourite"
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Favorites"
            >
              {isActive('/userportal/favourite') ? (
                <FaHeart size={24} className="text-red-500" />
              ) : (
                <IoHeartOutline size={24} className="text-gray-700 hover:text-red-500 transition-colors" />
              )}
            </Link>
            {/* Notifications */}
            <Notifications />
            {/* Profile Dropdown - Only show when authenticated */}
            {isAuth && <ProfileDropdown />}
            {/* Settings Icon (optional - uncomment if needed) */}
            {/* <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <IoSettingsOutline size={24} className="text-gray-700 hover:text-gray-900" />
            </button> */}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopNavbar;
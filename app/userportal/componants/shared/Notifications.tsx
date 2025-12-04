'use client';

import { useState, useRef, useEffect } from 'react';
import { FaBell, FaTimes, FaHeart, FaUserPlus, FaComment } from 'react-icons/fa';

// Dummy data – replace with real API later
const dummyNotifications = [
  { id: 1, type: 'like', user: 'sarah_jones', message: 'liked your post', time: '2m ago', avatar: 'https://i.pravatar.cc/150?img=1' },
  { id: 2, type: 'follow', user: 'mike_wilson', message: 'started following you', time: '5m ago', avatar: 'https://i.pravatar.cc/150?img=2' },
  { id: 3, type: 'comment', user: 'emma_davis', message: 'commented: Nice shot!', time: '10m ago', avatar: 'https://i.pravatar.cc/150?img=3' },
  { id: 4, type: 'like', user: 'alex_brown', message: 'liked your post', time: '15m ago', avatar: 'https://i.pravatar.cc/150?img=4' },
  { id: 5, type: 'follow', user: 'lisa_anderson', message: 'started following you', time: '1h ago', avatar: 'https://i.pravatar.cc/150?img=6' },
  { id: 6, type: 'comment', user: 'david_lee', message: 'commented: Amazing!', time: '2h ago', avatar: 'https://i.pravatar.cc/150?img=7' },
];

/**
 * Notifications dropdown shown in the top navbar
 * Includes badge counter and closes when clicking outside
 */
const Notifications = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications] = useState(dummyNotifications);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Icon based on notification type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <FaHeart className="text-[#ff3b30]" size={20} />;
      case 'follow':
        return <FaUserPlus className="text-[#0095f6]" size={20} />;
      case 'comment':
        return <FaComment className="text-[#34c759]" size={20} />;
      default:
        return <FaBell size={20} className="text-gray-600" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon with Badge */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
        aria-label="Notifications"
      >
        <FaBell size={24} className="text-gray-800" />

        {/* Unread count badge */}
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center translate-x-1 -translate-y-1">
            {notifications.length > 9 ? '9+' : notifications.length}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Notifications List */}
          <div
            className="
              absolute top-12 right-0 md:right-0 
              w-[90vw] md:w-96 
              bg-white rounded-2xl shadow-2xl 
              border border-gray-200 
              overflow-hidden z-50
            "
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <FaTimes size={20} className="text-gray-600" />
              </button>
            </div>

            {/* Scrollable List */}
            <div className="max-h-96 overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0 cursor-pointer"
                  >
                    <img
                      src={notif.avatar}
                      alt={notif.user}
                      className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 truncate">
                        <span className="font-semibold">{notif.user}</span>{' '}
                        {notif.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                    </div>
                    <div className="flex-shrink-0">{getNotificationIcon(notif.type)}</div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center text-gray-500">
                  <FaBell size={40} className="mx-auto mb-3 text-gray-300" />
                  <p>No notifications yet</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Notifications;
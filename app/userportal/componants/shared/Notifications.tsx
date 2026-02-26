'use client';
import AuthContext from '@/app/providers/AuthContext';
import { useState, useRef, useEffect, useContext, useCallback } from 'react';
import { FaBell, FaTimes, FaHeart, FaUserPlus, FaCheckCircle, FaBookOpen } from 'react-icons/fa';
import { toast } from 'sonner';
import api from '@/app/AuthLayout/refresh';
interface Notification {
  id: number;
  userId: string;
  notificationType: number;
  notificationTypeName: string;
  title: string;
  content: string;
  referenceType: number;
  referenceTypeName: string;
  referenceId: number | null;
  isRead: boolean;
  createdAt: string;
}
const timeAgo = (dateStr: string): string => {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
};
const Notifications = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const lastNotifIdRef = useRef<number>(0);

  // fetch unread count from API
  const fetchUnreadCount = useCallback(async () => {
  
    try {
      const res = await api.get(`/Notifications/unread-count`, {
    
      });
      if (res.data?.success) setUnreadCount(res.data.data);
    } catch (err) {
   
    }
  }, []);
// 
const { isAuthLoading, token } = useContext(AuthContext)!;
  useEffect(() => {
     if (isAuthLoading || !token) return;
  fetchUnreadCount();
}, [isAuthLoading, token, fetchUnreadCount]);
  
  useEffect(() => {
    if (!isOpen ) return;
    const controller = new AbortController();

    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/Notifications/me`, {
       
          signal: controller.signal,
        });
        if (res.data?.success) {
          const data: Notification[] = res.data.data;
          setNotifications(data);
          if (data.length > 0) lastNotifIdRef.current = data[0].id;
        }
      } catch (err) {
       if ((err as any)?.name !== "AbortError") console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
    return () => controller.abort();
  }, [isOpen]);

  //   new notifications every 10 using since
  const fetchSince = useCallback(async () => {
    if (  lastNotifIdRef.current === 0) return;
    try {
      const res = await api.get(`/Notifications/since`, {
        params: { since: lastNotifIdRef.current, limit: 20 },
      });
      if (res.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
        const newNotifs: Notification[] = res.data.data;
        lastNotifIdRef.current = newNotifs[0].id;
        setNotifications((prev) => {
          const existingIds = new Set(prev.map((n) => n.id));
          const unique = newNotifs.filter((n) => !existingIds.has(n.id));
          return [...unique, ...prev];
        });
        const newUnread = newNotifs.filter((n) => !n.isRead).length;
        if (newUnread > 0) await fetchUnreadCount();
      }
    } catch (err) {
    if ((err as any)?.name !== "AbortError") console.error(err);
        ;
    }
  }, [ ]);

  useEffect(() => {
 
    const interval = setInterval(fetchSince, 10000);
    return () => clearInterval(interval);
  }, [fetchSince]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Mark single notification as read
  const markAsRead = async (notifId: number) => {
    try {
      const res = await api.put(
        `/Notifications/${notifId}/read`,
        {}
      );
      if (res.data?.success) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === notifId ? { ...n, isRead: true } : n))
        );
        await fetchUnreadCount();
        toast.success('Notification marked as read');
      }
    } catch {
      toast.error('Failed to mark notification as read');
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      const res = await api.put(`/Notifications/read-all`, {});
      if (res.data?.success) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        await fetchUnreadCount();
        toast.success('All notifications marked as read');
      }
    } catch {
      toast.error('Failed to mark all as read');
    }
  };
  // Icon based on notification type name from API
  const getNotificationIcon = (typeName: string) => {
    if (typeName === 'PostLike') return <FaHeart className="text-[#ff3b30]" size={20} />;
    else if (typeName === 'NewFollower') return <FaUserPlus className="text-[#0095f6]" size={20} />;
    else if (typeName === 'PostPublishedSuccess') return <FaCheckCircle className="text-[#34c759]" size={20} />;
    else if (typeName === 'StoryPublishedSuccess') return <FaBookOpen className="text-[#ff9500]" size={20} />;
    else return <FaBell size={20} className="text-gray-600" />;
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

        {/* Unread count badge from API */}
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center translate-x-1 -translate-y-1">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/30 md:bg-transparent" onClick={() => setIsOpen(false)} aria-hidden="true" />
          <div className="fixed inset-x-0 bottom-0 top-16 z-50 bg-white rounded-t-2xl shadow-2xl border border-gray-200 overflow-hidden md:fixed-auto md:absolute md:inset-auto md:top-12 md:right-0 md:w-96 md:rounded-2xl md:bottom-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
                  >
                    Mark all as read
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <FaTimes size={20} className="text-gray-600" />
                </button>
              </div>
            </div>

            <div className="max-h-[calc(100vh-10rem)] md:max-h-96 overflow-y-auto">
              {loading ? (
                <div className="p-12 text-center text-gray-500">
                  <div className="animate-spin w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full mx-auto mb-3" />
                  <p>Loading...</p>
                </div>
              ) : notifications.length > 0 ? (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => !notif.isRead && markAsRead(notif.id)}
                    className={`flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0 cursor-pointer ${!notif.isRead ? 'bg-blue-50/50' : ''}`}
                  >
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                      {getNotificationIcon(notif.notificationTypeName)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">
                        <span className="font-semibold">{notif.title}</span>
                      </p>
                      <p className="text-sm text-gray-600 truncate">{notif.content}</p>
                      <p className="text-xs text-gray-500 mt-1">{timeAgo(notif.createdAt)}</p>
                    </div>
                    {!notif.isRead && (
                      <div className="w-2.5 h-2.5 bg-blue-500 rounded-full flex-shrink-0" />
                    )}
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
'use client'
import React, { useContext, useEffect, useState } from "react";
import { FiSearch, FiMoreVertical, FiClock } from "react-icons/fi";
import { BsCheck, BsCheckAll } from "react-icons/bs";
import axios from "axios";
import AuthContext from "@/app/providers/AuthContext";
import { toast } from 'sonner';
import { useMessagingContext } from "../MessagingContext";
import { Chat } from "../page";
import api from "@/app/AuthLayout/refresh";
type MessageStatus = "sent" | "delivered" | "read" | "pending";
type FilterType = "all" | "unread" | "archived";
interface ChatSidebarProps {
  selectedChat: Chat | null;
  onSelectChat: (chat: Chat) => void;
  chats: Chat[];
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>;
  activeFilter: FilterType;
  setActiveFilter: (filter: FilterType) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}
const ChatSidebar = ({ selectedChat, onSelectChat, chats, setChats, activeFilter, setActiveFilter, searchQuery, setSearchQuery }: ChatSidebarProps) => {
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const { baseUrl } = useContext(AuthContext)!;
 
  const { unreadCount, refreshUnreadCount } = useMessagingContext();
  const fetchUnreadCount = async () => {
    await refreshUnreadCount();
  };

  useEffect(() => {
    fetchUnreadCount();
  }, []);
  const filteredChats = chats.filter((chat) => {
    const matchesSearch = chat.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter =
      activeFilter === "all"
        ? !chat.archived
        : activeFilter === "unread"
        ? chat.unread && !chat.archived
        : chat.archived;
    return matchesSearch && matchesFilter;
  });
  const renderStatus = (status: MessageStatus) => {
    if (status === "pending") return <FiClock size={18} className="text-gray-500" />;
    if (status === "sent") return <BsCheck size={18} />;
    if (status === "delivered") return <BsCheckAll size={18} />;
    return <BsCheckAll className="text-blue-500" size={18} />;
  };
  const getAvatarSrc = (avatar?: string | null) => {
    if (!avatar) return "/block-Photi.jpg";
    const trimmed = avatar.trim();
    if (!trimmed) return "/block-Photi.jpg";
    const looksLikeHttp = /^https?:\/\//i.test(trimmed);
    const looksLikeAbsolutePath = trimmed.startsWith("/");
    return looksLikeHttp || looksLikeAbsolutePath ? trimmed : "/block-Photi.jpg";
  };
  const markAsUnread = (chatId: number) => {
    setChats(prev =>
      prev.map(chat =>
        chat.id === chatId ? { ...chat, unread: true } : chat
      )
    );
    setOpenMenuId(null);
    fetchUnreadCount();
  };
  const archiveChat = async (chatId: number) => {
    setChats(prev =>
      prev.map(chat =>
        chat.id === chatId ? { ...chat, archived: true } : chat
      )
    );
    setOpenMenuId(null);
    try {
      await api.patch(
        `/messaging/conversations/${chatId}/archive`,
        {},
        { withCredentials: true }
      );
      toast.success("Conversation archived");
      fetchUnreadCount();
    } catch (error) {
      console.error("Archive failed", error);
      setChats(prev =>
        prev.map(chat =>
          chat.id === chatId ? { ...chat, archived: false } : chat
        )
      );
      toast.error("Failed to archive");
    }
  };
  const unarchiveChat = async (chatId: number) => {
    setChats(prev =>
      prev.map(chat =>
        chat.id === chatId ? { ...chat, archived: false } : chat
      )
    );
    setOpenMenuId(null);
    try {
      await api.patch(
        `/messaging/conversations/${chatId}/unarchive`,
        {},
      
      );
      toast.success("Conversation unarchived");
      fetchUnreadCount();
    } catch (error) {
      console.error("Unarchive failed", error);
      setChats(prev =>
        prev.map(chat =>
          chat.id === chatId ? { ...chat, archived: true } : chat
        )
      );
      toast.error("Failed to unarchive");
    }
  };
  const deleteChat = async (chatId: number) => {
    setOpenMenuId(null);
    try {
      await api.delete(`/messaging/conversations/${chatId}`);
      setChats(prev => prev.filter(chat => chat.id !== chatId));
      toast.error("Conversation deleted successfully");
      fetchUnreadCount();
    } catch (error) {
     
      toast.error("Failed to delete conversation");
    }
  };
  
  return (
    <div className="w-full md:w-[380px] bg-white border-r flex flex-col h-screen">
      <div className="px-3 py-2">
        <div className="flex items-center bg-[#f0f2f5] rounded-lg px-4 py-2">
          <FiSearch className="mr-3" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search"
            className="bg-transparent outline-none w-full"
          />
        </div>
      </div>
      <div className="flex gap-2 px-3 py-2 justify-center">
        {(["all", "unread", "archived"] as FilterType[]).map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-1.5 rounded-full ${
              activeFilter === filter
                ? "bg-blue-600 text-white"
                : "bg-[#f0f2f5]"
            }`}
          >
            {filter === "unread" ? `Unread (${unreadCount})` : filter}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto">
        {filteredChats.length === 0 ? (
          <div className="text-center py-4">
            {searchQuery
              ? "No results found"
              : activeFilter === "unread"
              ? "No unread messages"
              : activeFilter === "archived"
              ? "No archived conversations"
              : "No conversations"}
          </div>
        ) : (
          filteredChats.map((chat,index) => (
            <div
              key={chat.id ??  index}
              onClick={() => {
                setOpenMenuId(null);
                // Mark as read locally when selecting conversation
                if (chat.unread) {
                  setChats(prev =>
                    prev.map(c =>
                      c.id === chat.id ? { ...c, unread: false } : c
                    )
                  );
                  refreshUnreadCount();
                }
                onSelectChat(chat);
              }}
              className={`relative flex items-center py-3 px-4 cursor-pointer hover:bg-[#f0f2f5] transition-colors ${
                selectedChat?.id === chat.id ? "bg-[#f0f2f5]" : chat.unread ? "bg-blue-50/50" : ""
              }`}
            >
              <div className="relative">
                <img
                  src={getAvatarSrc(chat.avatar)}
                  className="w-[50px] h-[50px] rounded-lg object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/block-Photi.jpg";
                  }}
                />
                
                {chat.isOnline && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                )}
              </div>
              <div className="flex-1 ml-4">
                <div className="flex justify-between">
                  <p className="font-medium">{chat.name}</p>
                  <span className={`text-xs ${chat.unread ? "text-blue-600 font-semibold" : ""}`}>{chat.timestamp}</span>
                </div>
                <div className="flex items-center gap-1">
                  {chat.lastMessageSentByMe && renderStatus(chat.lastMessageStatus || "sent")}
                  <p className={`truncate max-w-[180px] ${chat.unread ? "font-semibold text-[#111b21]" : "text-gray-500"}`}>
                    {chat.lastMessage && chat.lastMessage.split(/\s+/).length > 3
                      ? chat.lastMessage.split(/\s+/).slice(0, 3).join(" ") + "....."
                      : chat.lastMessage}
                  </p>
                  {chat.unread && (
                    <span className="ml-auto w-3 h-3 bg-blue-500 rounded-full flex-shrink-0"></span>
                  )}
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenMenuId(openMenuId === chat.id ? null : chat.id);
                }}
              >
                <FiMoreVertical />
              </button>
              {openMenuId === chat.id && (
                <div className="absolute right-4 top-14 w-44 bg-white rounded-lg shadow-lg z-50">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      markAsUnread(chat.id);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Mark as unread
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (chat.archived) {
                        unarchiveChat(chat.id);
                      } else {
                        archiveChat(chat.id);
                      }
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    {chat.archived ? "Unarchive" : "Archive"}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteChat(chat.id);
                    }}
                    className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
export default ChatSidebar;

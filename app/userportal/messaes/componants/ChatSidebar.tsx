'use client'
import { useContext, useEffect, useState } from "react";
import { FiSearch, FiMoreVertical } from "react-icons/fi";
import { BsCheck, BsCheckAll } from "react-icons/bs";
import axios from "axios";
import AuthContext from "@/app/providers/AuthContext";
import { toast } from 'sonner';

type MessageStatus = "sent" | "delivered" | "read";
type FilterType = "all" | "unread" | "archived";
export interface Chat {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
  status: MessageStatus;
  archived: boolean;
}
interface ChatSidebarProps {
  selectedChat: Chat | null;
  onSelectChat: (chat: Chat) => void;
}
const ChatSidebar = ({ selectedChat, onSelectChat }: ChatSidebarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { baseUrl } = useContext(AuthContext)!;
  const accessToken =
    typeof window !== "undefined"
      ? localStorage.getItem("accessToken")
      : null;
  const fetchUnreadCount = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/messaging/conversations/unread-count`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setUnreadCount(response.data?.data?.totalUnread || 0);
    } catch {
      setUnreadCount(0);
    }
  };
 const fetchConversations = async () => {
  try {
    let response;

    if (searchQuery?.trim().length >= 2) {
      response = await axios.get(
        `${baseUrl}/messaging/users/search?q=${encodeURIComponent(searchQuery)}&page=1&pageSize=20`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
    } else {
      response = await axios.get(
        `${baseUrl}/messaging/conversations?filter=${activeFilter}&page=1&pageSize=20`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
    }

    const data = response.data?.data || [];

    const mappedChats: Chat[] = data.map((item: any) => ({
      id: item.conversationId ?? item.id,
      name: item.otherUserName ?? item.fullName ?? `${item.otherUser?.firstName ?? ""} ${item.otherUser?.lastName ?? ""}`.trim() ?? "Unknown",
      avatar: item.otherUser?.avatarUrl
        ? `${baseUrl.replace('/api', '')}/${item.otherUser.avatarUrl}`
        : item.avatarUrl
        ? `${baseUrl.replace('/api', '')}/${item.avatarUrl}`
        : "https://i.pravatar.cc/150",
      lastMessage: item.lastMessage?.text ?? "No messages yet",
      timestamp: new Date(item.updatedAt ?? Date.now()).toLocaleDateString(),
      status: "delivered",
      unread: item.unreadCount > 0,

      archived: item.isArchived ?? false,
    }));

    console.log("Mapped chats:", mappedChats);
    setChats(mappedChats);

  } catch (error) {
    console.error("Error fetching conversations:", error);
    setChats([]);
  }
};

  useEffect(() => {
    fetchUnreadCount();
    fetchConversations();
  }, [activeFilter, searchQuery]);
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
    if (status === "sent") return <BsCheck size={18} />;
    if (status === "delivered") return <BsCheckAll size={18} />;
    return <BsCheckAll className="text-blue-500" size={18} />;
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
      await axios.patch(
        `${baseUrl}/messaging/conversations/${chatId}/archive`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      toast.success("Conversation archived");
      fetchConversations();
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
      await axios.patch(
        `${baseUrl}/messaging/conversations/${chatId}/unarchive`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      toast.success("Conversation unarchived");
      fetchConversations();
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
  const deleteChat = (chatId: number) => {
    setChats(prev => prev.filter(chat => chat.id !== chatId));
    setOpenMenuId(null);
    fetchUnreadCount();
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
                onSelectChat(chat);
              }}
              className={`relative flex items-center py-3 px-4 cursor-pointer ${
                selectedChat?.id === chat.id ? "bg-[#f0f2f5]" : ""
              }`}
            >
              <img
                src={chat.avatar}
                className="w-[50px] h-[50px] rounded-lg object-cover"
              />
              <div className="flex-1 ml-4">
                <div className="flex justify-between">
                  <p className="font-medium">{chat.name}</p>
                  <span className="text-xs">{chat.timestamp}</span>
                </div>
                <div className="flex items-center gap-1">
                  {renderStatus(chat.status)}
                  <p className={chat.unread ? "font-medium" : ""}>
                    {chat.lastMessage}
                  </p>
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
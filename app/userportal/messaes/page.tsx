"use client";

import { useEffect, useState, useContext } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import ChatSidebar from "./componants/ChatSidebar";
import SelectChatArea from "./componants/SelectChatArea";
import AuthContext from "@/app/providers/AuthContext";
import { Toaster } from "sonner";
import { useMessagingContext } from "./MessagingContext";
import api from "@/app/AuthLayout/refresh";

export interface Chat {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
  status: "sent" | "delivered" | "read" | "pending";
  archived: boolean;
  isUser?: boolean; 
  otherUserId?: string;
  isOnline?: boolean;
  lastMessageStatus?: "sent" | "delivered" | "read" | "pending";
  lastMessageSentByMe?: boolean;
}
const Page = () => {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeFilter, setActiveFilter] = useState<"all" | "unread" | "archived">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const searchParams = useSearchParams();
  const conversationId = searchParams.get("conversationId");
  const { baseUrl } = useContext(AuthContext)!;
  const { lastIncomingMessage, refreshUnreadCount } = useMessagingContext();
  // const accessToken =
  //   typeof window !== "undefined"
  //     ? localStorage.getItem("accessToken")
  //     : null;
  const fetchConversations = async (filter: string = "all", query: string = "") => {
    try {
      let url = `/messaging/conversations?filter=${filter}&page=1&pageSize=50`;
      if (query.trim().length >= 2) {
        url += `&q=${encodeURIComponent(query)}`;
      }
      const response = await api.get(url);
      const data = response.data?.data || [];
      const mappedChats: Chat[] = data.map((item: any) => ({
        id: item.conversationId ?? item.id,
        name: item.otherUserName ?? item.fullName ?? `${item.otherUser?.firstName ?? ""} ${item.otherUser?.lastName ?? ""}`.trim() ?? "Unknown",
        avatar: item.otherUser?.avatarUrl
          ? `${baseUrl.replace('/api', '')}/${item.otherUser.avatarUrl}`
          : item.avatarUrl
          ? `${baseUrl.replace('/api', '')}/${item.avatarUrl}`
          : "",
        lastMessage: item.lastMessage?.content ?? item.lastMessage?.text ?? "No messages yet",
        timestamp: new Date(item.updatedAt ?? Date.now()).toLocaleDateString(),
        status: "delivered",
        unread: item.unreadCount > 0,
        archived: item.isArchived ?? false,
        isUser: !item.conversationId,
        otherUserId: item.otherUser?.id ?? item.id,
        isOnline: item.otherUser?.isOnline ?? false,
        lastMessageStatus: item.lastMessage?.statusForMe ?? item.lastMessage?.status ?? "sent",
      }));
      setChats(mappedChats);
      return mappedChats;
    } catch (error) {
      console.error("Error fetching conversations:", error);
      setChats([]);
      return [];
    }
  };

  const handleOnlineStatusUpdate = (conversationId: number, isOnline: boolean) => {
    setChats(prev =>
      prev.map(chat =>
        chat.id === conversationId
          ? { ...chat, isOnline }
          : chat
      )
    );
  };

  const handleMessageActivity = (conversationId: number, lastMessageText: string, status: string, sentByMe: boolean) => {
    setChats(prev =>
      prev.map(chat =>
        chat.id === conversationId
          ? {
              ...chat,
              lastMessage: lastMessageText,
              timestamp: new Date().toLocaleDateString(),
              lastMessageStatus: status as any,
              lastMessageSentByMe: sentByMe,
            }
          : chat
      )
    );
  };

  useEffect(() => {
    fetchConversations(activeFilter, searchQuery);
  }, [activeFilter, searchQuery]);

  //  incoming messages from global SSE
  useEffect(() => {
    if (!lastIncomingMessage) return
    const msgConvId = lastIncomingMessage.conversationId;
    setChats(prev => {
      const exists = prev.some(chat => chat.id === msgConvId);
      if (exists) {
        return prev.map(chat =>
          chat.id === msgConvId
            ? {
                ...chat,
                lastMessage: lastIncomingMessage.content,
                timestamp: new Date().toLocaleDateString(),
                unread: selectedChat?.id !== msgConvId ? true : chat.unread,
                lastMessageSentByMe: false,
                lastMessageStatus: "delivered" as const,
              }
            : chat
        );
      }
      fetchConversations(activeFilter, searchQuery);
      return prev;
    });
  }, [lastIncomingMessage]);

  useEffect(() => {
    if (conversationId) {
      loadSelectedConversation();
    }
  }, [conversationId]);

  const loadSelectedConversation = async () => {
    try {
      const response = await api.get(`/messaging/conversations?filter=all&page=1&pageSize=50`, {
       
      });
      const data = response.data?.data || [];
      const conversation = data.find(
        (c: any) => c.conversationId === Number(conversationId)
      );
      if (!conversation) return;
      setSelectedChat({
        id: conversation.conversationId,
        name:
          conversation.otherUserName ||
          `${conversation.otherUser?.firstName ?? ""} ${conversation.otherUser?.lastName ?? ""}`.trim(),
        avatar: conversation.otherUser?.avatarUrl
          ? `${baseUrl.replace("/api", "")}/${conversation.otherUser.avatarUrl}`
          : "",
        lastMessage: conversation.lastMessage?.text || "",
        timestamp: conversation.lastActivityAt,
        unread: conversation.unreadCount > 0,
        status: "delivered",
        archived: conversation.isArchived,
        otherUserId: conversation.otherUser?.id,
      });
    } catch (error) {
      console.error("Error loading selected conversation:", error);
    }
  }
  const handleSelectChat = async (chat: Chat) => {
    if (chat.isUser) {
      try {
        const response = await api.get(
          `/messaging/conversations/start/${chat.id}`,
         
        );
        if (response.data?.success) {
          const conversation = response.data.data;
          setSelectedChat({
            id: conversation.conversationId,
            name: conversation.otherUserName || `${conversation.otherUser?.firstName ?? ""} ${conversation.otherUser?.lastName ?? ""}`.trim(),
            avatar: conversation.otherUser?.avatarUrl ? `${baseUrl.replace("/api", "")}/${conversation.otherUser.avatarUrl}` : "",
            lastMessage: conversation.lastMessage?.text || "",
            timestamp: conversation.lastActivityAt,
            unread: conversation.unreadCount > 0,
            status: "delivered",
            archived: conversation.isArchived,
            otherUserId: conversation.otherUser?.id,
          });
        } else {
          console.error("Failed to start conversation");
        }
      } catch (error) {
        console.error("Error starting conversation:", error);
      }
    } else {
      setSelectedChat(chat);
    }
  };
  const handleBack = () => {
    setSelectedChat(null);
  };
  return (
    <div className="flex h-screen bg-[#f0f2f5]">
      <div className={`${selectedChat ? "hidden md:flex" : "flex"} w-full md:w-auto`}>
        <ChatSidebar
          selectedChat={selectedChat}
          onSelectChat={handleSelectChat}
          chats={chats}
          setChats={setChats}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </div>
      <div className={`${selectedChat ? "flex" : "hidden md:flex"} flex-1`}>
        <SelectChatArea
          selectedChat={selectedChat}
          onBack={handleBack}
          onClose={handleBack}
          onMessageActivity={handleMessageActivity}
          onOnlineStatusUpdate={handleOnlineStatusUpdate}
        />
      </div>
      <Toaster />
    </div>
  );
};

export default Page;

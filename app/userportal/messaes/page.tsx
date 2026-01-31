"use client";

import { useEffect, useState, useContext } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import ChatSidebar from "./componants/ChatSidebar";
import SelectChatArea from "./componants/SelectChatArea";
import AuthContext from "@/app/providers/AuthContext";

export interface Chat {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
  status: "sent" | "delivered" | "read";
  archived: boolean;
}

const Page = () => {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const searchParams = useSearchParams();
  const conversationId = searchParams.get("conversationId");

  const { baseUrl } = useContext(AuthContext)!;
  const accessToken =
    typeof window !== "undefined"
      ? localStorage.getItem("accessToken")
      : null;

  const fetchConversations = async () => {
    const response = await axios.get(
      `${baseUrl}/messaging/conversations?filter=all&page=1&pageSize=50`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data?.data || [];
  };

  useEffect(() => {
    if (!conversationId) return;

    const loadSelectedConversation = async () => {
      const conversations = await fetchConversations();

      const conversation = conversations.find(
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
      });
    };

    loadSelectedConversation();
  }, [conversationId]);

  const handleBack = () => {
    setSelectedChat(null);
  };

  return (
    <div className="flex h-screen bg-[#f0f2f5]">
      <div className={`${selectedChat ? "hidden md:flex" : "flex"} w-full md:w-auto`}>
        <ChatSidebar
          selectedChat={selectedChat}
          onSelectChat={setSelectedChat}
        />
      </div>

      <div className={`${selectedChat ? "flex" : "hidden md:flex"} flex-1`}>
        <SelectChatArea
          selectedChat={selectedChat}
          onBack={handleBack}
        />
      </div>
    </div>
  );
};

export default Page;

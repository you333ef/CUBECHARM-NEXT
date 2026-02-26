'use client';
import {
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  KeyboardEvent,
  ChangeEvent,
} from "react";
import { BsChatDots, BsArrowLeft } from "react-icons/bs";
import { IoSend } from "react-icons/io5";
import { MdAttachFile, MdMoreVert } from "react-icons/md";
import { BiCheck, BiCheckDouble } from "react-icons/bi";
import AuthContext from "@/app/providers/AuthContext";
import axios from "axios";
import { useMessaging } from "../useMessaging";
import { useMessagingContext } from "../MessagingContext";
import { toast } from "sonner";
import { Chat } from "../page";
import api from "@/app/AuthLayout/refresh";
interface Message {
  id: string;
  text: string;
  sender: string;
  time: string;
  seen: boolean;
}
interface SelectChatAreaProps {
  selectedChat: Chat | null;
  onBack?: () => void;
  onClose?: () => void;
  onMessageActivity?: (
    conversationId: number,
    lastMessageText: string,
    status: string,
    sentByMe: boolean
  ) => void;
  onOnlineStatusUpdate?: (conversationId: number, isOnline: boolean) => void;
}
const SelectChatArea = ({
  selectedChat,
  onBack,
  onClose,
  onMessageActivity,
  onOnlineStatusUpdate,
}: SelectChatAreaProps) => {
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [menuOpen, setMenuOpen] = useState<{ [key: string]: boolean }>({});
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const { baseUrl, user } = useContext(AuthContext)!;
 

  const currentUserId = user?.sub;

  // Callback for ALL incoming messages 
  const handleAnyMessage = useCallback((message: any) => {
    if (message.senderId !== currentUserId) {
      onMessageActivity?.(
        message.conversationId,
        message.content,
        "delivered",
        false
      );
    }
  }, [currentUserId, onMessageActivity]);

  const {
    messages: realtimeMessages,
    sendMessage: sendRealtimeMessage,
    isConnected,
    checkOnlineStatus,
    markConversationAsRead,
    isServiceReady,
  } = useMessaging(selectedChat?.id, handleAnyMessage);
  const { refreshUnreadCount } = useMessagingContext();

  const getAvatarSrc = (avatar?: string | null) => {
    if (!avatar) return "/block-Photi.jpg";
    const trimmed = avatar.trim();
    if (!trimmed) return "/block-Photi.jpg";
    const looksLikeHttp = /^https?:\/\//i.test(trimmed);
    const looksLikeAbsolutePath = trimmed.startsWith("/");
    return looksLikeHttp || looksLikeAbsolutePath ? trimmed : "/block-Photi.jpg";
  };

  const autoResizeInput = (el: HTMLTextAreaElement | null) => {
    if (!el) return;
    el.style.height = "auto";
    const maxHeight = 120;
    const newHeight = Math.min(el.scrollHeight, maxHeight);
    el.style.height = `${newHeight}px`;
  };

  const loadConversationMessages = async (
    conversationId: number,
    take: number = 30
  ) => {
    try {
      const response = await api.get(
        `/messaging/conversations/${conversationId}/messages`,
        {
          params: { take },
        }
      );

      if (!response.data?.success) {
        throw new Error(response.data?.message || "Failed to load messages");
      }

      return response.data.data;
    } catch (error) {
      console.error("Error loading messages:", error);
      return {
        messages: [],
        hasMore: false,
      };
    }
  };

  const fetchOnlineStatus = async () => {
    if (!selectedChat?.otherUserId || !isServiceReady) return;
    try {
      const status = await checkOnlineStatus(selectedChat.otherUserId);
      setIsOnline(status.isOnline);
      onOnlineStatusUpdate?.(selectedChat.id, status.isOnline);
    } catch (error) {
      setIsOnline(false);
      onOnlineStatusUpdate?.(selectedChat.id, false);
    }
  };

  const loadMessages = async () => {
    if (!selectedChat) return;
    setLoading(true);
    const data = await loadConversationMessages(selectedChat.id);

    const mappedMessages: Message[] = data.messages.map((msg: any) => ({
      id: String(msg.messageId ?? msg.id),
      text: msg.content,
      sender: msg.senderId === currentUserId ? "me" : "other",
      time: new Date(msg.sentAt ?? msg.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      seen: msg.statusForMe === "Read" || msg.isRead === true,
    }));

    setMessages(mappedMessages);
    setLoading(false);
  };

  useEffect(() => {
    if (!selectedChat) return;
    loadMessages();
    refreshUnreadCount();

    if (isServiceReady) {
      fetchOnlineStatus();
      markConversationAsRead(selectedChat.id).then(() => {
        refreshUnreadCount();
      });
    }
  }, [selectedChat, isServiceReady]);

  useEffect(() => {
    if (!selectedChat || !isServiceReady) return;

    const statusInterval = setInterval(fetchOnlineStatus, 30000);
    return () => clearInterval(statusInterval);
  }, [selectedChat, isServiceReady]);

  useEffect(() => {
    if (!realtimeMessages.length) return;

    setMessages((prev) => {
      const existingIds = new Set(prev.map((m) => String(m.id)));

      const newOnes: Message[] = realtimeMessages
        .filter((m) => !existingIds.has(String(m.messageId)))
        .map((m) => ({
          id: String(m.messageId),
          text: m.content,
          sender: m.senderId === currentUserId ? "me" : "other",
          time: new Date(m.sentAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          seen: m.isRead,
        }));

      if (!newOnes.length) return prev;
      return [...prev, ...newOnes];
    });
  }, [realtimeMessages, currentUserId]);

  useEffect(() => {
    if (!selectedChat || !realtimeMessages.length) return;
    const last = realtimeMessages[realtimeMessages.length - 1];
    if (last && last.senderId !== currentUserId) {
      markConversationAsRead(selectedChat.id).then(() => {
        refreshUnreadCount();
        setMessages(prev => prev.map(m => ({ ...m, seen: true })));
      });
    }
  }, [realtimeMessages]);

  useEffect(() => {
    autoResizeInput(inputRef.current);
  }, []);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!selectedChat || !trimmed) return;

    if (!isServiceReady) {
      toast.error("Chat is still connecting, please wait a moment...");
      return;
    }

    try {
      const sent = await sendRealtimeMessage({
        recipientId: selectedChat.otherUserId!,
        conversationId: selectedChat.id,
        messageType: "Text",
        content: trimmed,
      });

      setMessages((prev) => {
        const existingIds = new Set(prev.map((m) => String(m.id)));
        const newId = String(sent.messageId);

        if (existingIds.has(newId)) {
          return prev;
        }

        return [
          ...prev,
          {
            id: newId,
            text: sent.content,
            sender: "me",
            time: new Date(sent.sentAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            seen: sent.isRead,
          },
        ];
      });

      setMessageInput("");
      if (inputRef.current) {
        inputRef.current.style.height = "auto";
      }

      refreshUnreadCount();
      onMessageActivity?.(selectedChat.id, trimmed, "sent", true);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const deleteMessage = async (messageId: string) => {
    try {
      await api.delete(`/messaging/messages/${messageId}`)
   
   

      setMessages((prev) =>
        prev.filter((msg) => String(msg.id) !== String(messageId))
      );
    } catch (error) {
      console.error("Error deleting message:", error);
      toast.error("Failed to delete message");
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessageInput(e.target.value);
    autoResizeInput(e.target);
  };

  const handleInputKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(messageInput);
    }
  };

  if (!selectedChat) {
    return (
      <div className="flex flex-1 h-full flex-col items-center justify-center bg-[#f0f2f5] border-l border-[#e9edef]  md:flex">
        <BsChatDots className="text-[#8696a0] mb-4" size={120} />
        <h2 className="text-[32px] font-light text-[#41525d] mb-2">
          CUBECHARM-like Chat
        </h2>
        <p className="text-[14px] text-[#667781] text-center max-w-[440px] px-4">
          Select a conversation from the sidebar to start messaging
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-[#efeae2] relative h-full">
      {/* Header */}
      <div className="bg-[#f0f2f5] border-b border-[#e9edef] px-4 py-3 flex items-center gap-3">
        <button
          onClick={onBack}
          className="md:hidden p-2 hover:bg-[#e9edef] rounded-full transition-colors"
        >
          <BsArrowLeft className="text-[#54656f]" size={20} />
        </button>

        <img
          src={getAvatarSrc(selectedChat.avatar)}
          alt={selectedChat.name}
          className="w-[50px] h-[50px] rounded-lg object-cover"
          onError={(e) => {
            e.currentTarget.src = "/block-Photi.jpg";
          }}
        />

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-[16px] font-medium text-[#111b21]">
              {selectedChat.name}
            </h3>
            {isOnline && <div className="w-2 h-2 bg-green-500 rounded-full" />}
          </div>
          <p className="text-[13px] text-[#667781]">
            {isOnline ? "Online" : selectedChat.timestamp}
          </p>
        </div>

        <button
          onClick={onClose}
          className="hidden md:flex p-2 hover:bg-[#e9edef] rounded-full transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#54656f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 min-h-0 overflow-y-auto px-2 sm:px-3 md:px-4 py-4 pb-2 md:pb-2 space-y-2">
        {loading ? (
          <div className="text-center py-4">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="text-center py-4">No messages yet</div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex w-full ${
                msg.sender === "me" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`relative inline-flex rounded-lg px-3 py-2 gap-2
                  max-w-[90%] sm:max-w-[85%] md:max-w-[65%]
                  ${
                    msg.sender === "me"
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                      : "bg-[#fff] text-[#111b21]"
                  }`}
              >
                <p className="text-[14px] whitespace-pre-wrap break-words leading-relaxed">
                  {msg.text}
                </p>

                {msg.sender === "me" && (
                  <button
                    onClick={() =>
                      setMenuOpen((prev) => ({
                        ...prev,
                        [msg.id]: !prev[msg.id],
                      }))
                    }
                    className="text-white/70 hover:text-white flex-shrink-0 self-start"
                  >
                    <MdMoreVert size={16} />
                  </button>
                )}

                {menuOpen[msg.id] && msg.sender === "me" && (
                  <div className="absolute -top-2 left-0 -translate-y-full bg-white border rounded shadow-lg z-20 min-w-[140px]">
                    <div className="absolute top-full left-6 -mt-px h-0 w-0 border-x-8 border-x-transparent border-t-8 border-t-white" />
                    {confirmDeleteId === msg.id ? (
                      <button
                        onClick={() => {
                          deleteMessage(msg.id.toString());
                          setConfirmDeleteId(null);
                          setMenuOpen((prev) => ({
                            ...prev,
                            [msg.id]: false,
                          }));
                        }}
                        className="block px-4 py-2 text-red-600 hover:bg-gray-100 w-full text-left text-sm"
                      >
                        Confirm delete
                      </button>
                    ) : (
                      <button
                        onClick={() => setConfirmDeleteId(msg.id)}
                        className="block px-4 py-2 text-red-600 hover:bg-gray-100 w-full text-left text-sm"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                )}

                <div className="flex items-center gap-1 mt-1 self-end">
                  <span
                    className={`text-[11px] ${
                      msg.sender === "me"
                        ? "text-white/80"
                        : "text-[#667781]"
                    }`}
                  >
                    {msg.time}
                  </span>

                  {msg.sender === "me" &&
                    (msg.seen ? (
                      <BiCheckDouble className="text-blue-200" size={16} />
                    ) : (
                      <BiCheck className="text-white/70" size={16} />
                    ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      {/* Input */}
      <div className="bg-[#efeae2] border-t border-[#e9edef] px-3 py-2 flex items-center gap-2 fixed inset-x-0 bottom-0 md:static md:border-t md:px-3 md:py-2">
        <button className="p-2 hover:bg-[#e9edef] rounded-full transition-colors flex-shrink-0">
          <MdAttachFile className="text-[#54656f]" size={24} />
        </button>
        <div className="flex-1 bg-[#fff] rounded-lg px-3 py-2 flex items-center">
          <textarea
            ref={inputRef}
            rows={1}
            placeholder="Type a message"
            className="flex-1 bg-transparent outline-none text-[15px] text-[#111b21] resize-none max-h={120}px leading-snug min-h-[40px]"
            value={messageInput}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
          />
        </div>

        <button
          className="p-2 hover:bg-[#e9edef] rounded-full transition-colors disabled:opacity-40 flex-shrink-0 flex items-center justify-center"
          onClick={() => sendMessage(messageInput)}
          disabled={!messageInput.trim()}
        >
          <IoSend className="text-[#54656f]" size={24} />
        </button>
      </div>
    </div>
  );
};

export default SelectChatArea;
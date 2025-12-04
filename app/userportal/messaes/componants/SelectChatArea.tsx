"use client"
import { useState } from "react";
import { BsChatDots, BsArrowLeft } from "react-icons/bs";
import { IoSend } from "react-icons/io5";
import { MdKeyboardVoice, MdAttachFile } from "react-icons/md";
import { BiCheck, BiCheckDouble } from "react-icons/bi"; 

interface SelectChatAreaProps {
  selectedChatId: number | null;
  onBack?: () => void;
}

const SelectChatArea = ({ selectedChatId, onBack }: SelectChatAreaProps) => {
  const [messageInput, setMessageInput] = useState("");

  const chatData: Record<number, { name: string; avatar: string }> = {
    1: { name: "CEO Montasir", avatar: "https://i.pravatar.cc/150?img=12" },
    2: { name: "Yousef Khaled ", avatar: "https://i.pravatar.cc/150?img=56" },
    3: { name: "Youssef Ali", avatar: "https://i.pravatar.cc/150?img=33" },
    4: { name: "Nour Ahmed", avatar: "https://i.pravatar.cc/150?img=27" },
    5: { name: "Karim Mahmoud", avatar: "https://i.pravatar.cc/150?img=56" },
    6: { name: "Layla Ibrahim", avatar: "https://i.pravatar.cc/150?img=38" },
    7: { name: "Omar Khalil", avatar: "https://i.pravatar.cc/150?img=68" },
    8: { name: "Fatima Nasser", avatar: "https://i.pravatar.cc/150?img=48" },
  };

  if (!selectedChatId) {
    return (
      <div className="flex-1 flex-col items-center justify-center bg-[#f0f2f5] border-l border-[#e9edef] hidden md:flex">
        <BsChatDots className="text-[#8696a0] mb-4" size={120} />
        <h2 className="text-[32px] font-light text-[#41525d] mb-2">CUBECHARM-like Chat</h2>
        <p className="text-[14px] text-[#667781] text-center max-w-[440px] px-4">
          Select a conversation from the sidebar to start messaging
        </p>
      </div>
    );
  }

  const currentChat = chatData[selectedChatId];

  // 1
  const messages = [
    { id: 1, text: "Hello, I would like to rent this apartment.", sender: "other", time: "10:25 AM", seen: true },
    { id: 2, text: "Hi! Sure, it's available.", sender: "me", time: "10:27 AM", seen: true },
    { id: 3, text: "Can you tell me more about it?", sender: "other", time: "10:28 AM", seen: true },
    { id: 4, text: "Of course! It has 3 bedrooms, 2 bathrooms, and a nice kitchen.", sender: "me", time: "10:29 AM", seen: true },
    { id: 5, text: "That sounds perfect!", sender: "other", time: "10:30 AM", seen: true },
    { id: 6, text: "What is the monthly rent?", sender: "other", time: "10:30 AM", seen: true },
    { id: 7, text: "The rent is 5000 EGP per month.", sender: "me", time: "10:31 AM", seen: false },
    { id: 8, text: "Great! Can we schedule a viewing?", sender: "other", time: "10:32 AM", seen: true },
  ];

  const handleSend = () => {
    if (messageInput.trim()) {
      setMessageInput("");
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#efeae2] relative">
      {/* 2 */}
      <div className="bg-[#f0f2f5] border-b border-[#e9edef] px-4 py-3 flex items-center gap-3">
        <button
          onClick={onBack}
          className="md:hidden p-2 hover:bg-[#e9edef] rounded-full transition-colors"
        >
          <BsArrowLeft className="text-[#54656f]" size={20} />
        </button>

        <img
          src={currentChat.avatar}
          alt={currentChat.name}
          className="w-[50px] h-[50px] rounded-lg object-cover"
        />

        <div className="flex-1">
          <h3 className="text-[16px] font-medium text-[#111b21]">{currentChat.name}</h3>
          <p className="text-[13px] text-[#667781]">online</p>
        </div>
      </div>

      {/* 3 */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[65%] rounded-lg px-3 py-2 flex items-end gap-1 ${
                msg.sender === "me"
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                  : "bg-[#fff] text-[#111b21]"
              }`}
            >
              <p className="text-[14px] break-words flex-1">{msg.text}</p>
              
              <div className="flex items-center gap-1 mt-1">
                <span className={`text-[11px] ${msg.sender === "me" ? "text-white/80" : "text-[#667781]"}`}>
                  {msg.time}
                </span>
                
                {/* 4  */}
                {msg.sender === "me" && (
                  msg.seen ? (
                    <BiCheckDouble className="text-white" size={16} />
                  ) : (
                    <BiCheck className="text-white/70" size={16} />
                  )
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 5 */}
      <div className="bg-[#f0f2f5] border-t border-[#e9edef] px-3 py-2 flex items-center gap-2">
        <div className="flex items-center gap-1">
          <button className="p-2 hover:bg-[#e9edef] rounded-full transition-colors">
            <MdAttachFile className="text-[#54656f]" size={24} />
          </button>
        </div>

        <div className="flex-1 bg-[#fff] rounded-lg px-4 py-2 flex items-center">
          <input
            type="text"
            placeholder="Type a message"
            className="flex-1 bg-transparent outline-none text-[15px] text-[#111b21]"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
          />
        </div>

        {messageInput.trim() ? (
          <button
            onClick={handleSend}
            className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-full transition-colors"
          >
            <IoSend className="text-[#fff]" size={20} />
          </button>
        ) : (
          <button className="p-2 hover:bg-[#e9edef] rounded-full transition-colors">
            <MdKeyboardVoice className="text-[#54656f]" size={28} />
          </button>
        )}
      </div>
    </div>
  );
};

export default SelectChatArea;
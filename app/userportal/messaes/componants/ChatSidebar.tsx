'use client'
import { useState } from "react"; 
import { FiSearch, FiMoreVertical } from "react-icons/fi";
import { BsCheck, BsCheckAll } from "react-icons/bs"; 
import { useRouter } from "next/navigation";



// 1
type MessageStatus = "sent" | "delivered" | "read";

//2
type FilterType = "all" | "unread" | "read" | "archived"; // Filter categories

// 3
interface Chat {
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
  selectedChatId: number | null; // 4
  onSelectChat: (id: number) => void; // 5
}

const ChatSidebar = ({ selectedChatId, onSelectChat }: ChatSidebarProps) => {
  const [searchQuery, setSearchQuery] = useState(""); //6
  const [activeFilter, setActiveFilter] = useState<FilterType>("all"); // 7
  const [openMenuId, setOpenMenuId] = useState<number | null>(null); // 8
  //9
  const [chats, setChats] = useState<Chat[]>([
    {
      id: 1,
      name: "CEO-Montasir",
      avatar: "https://i.pravatar.cc/150?img=12",
      lastMessage: "Hello, I would like to rent this apartment.",
      timestamp: "10:30 AM",
      unread: true,
      status: "delivered",
      archived: false,
    },
   
    {
      id: 2,
      name: "Yousef Khaled Dev ",
      avatar: "https://i.pravatar.cc/150?img=33",
      lastMessage: "Thank you for your time!",
      timestamp: "2 days ago",
      unread: true,
      status: "delivered",
      archived: false,
    },
    {
      id: 3,
      name: "Nour Ahmed",
      avatar: "https://i.pravatar.cc/150?img=27",
      lastMessage: "Can we schedule a viewing?",
      timestamp: "3 days ago",
      unread: false,
      status: "read",
      archived: false,
    },
    {
      id: 4,
      name: "Karim Mahmoud",
      avatar: "https://i.pravatar.cc/150?img=56",
      lastMessage: "What about the price negotiation?",
      timestamp: "1 week ago",
      unread: false,
      status: "read",
      archived: false,
    },
    {
      id: 5,
      name: "Layla Ibrahim",
      avatar: "https://i.pravatar.cc/150?img=38",
      lastMessage: "🎤 Voice message",
      timestamp: "2 weeks ago",
      unread: true,
      status: "sent",
      archived: false,
    },
    {
      id: 6,
      name: "Omar Khalil",
      avatar: "https://i.pravatar.cc/150?img=68",
      lastMessage: "Perfect! I'll take it.",
      timestamp: "3 weeks ago",
      unread: false,
      status: "read",
      archived: false,
    },
    {
      id: 7,
      name: "Fatima Nasser",
      avatar: "https://i.pravatar.cc/150?img=48",
      lastMessage: "Can you send more photos?",
      timestamp: "1 month ago",
      unread: false,
      status: "read",
      archived: false,
    },
  ]);

  // 10
  const filteredChats = chats.filter((chat) => {
    const matchesSearch = chat.name.toLowerCase().includes(searchQuery.toLowerCase()); // Search filter
    const matchesFilter =
      activeFilter === "all"
        ? !chat.archived
        : activeFilter === "unread"
        ? chat.unread && !chat.archived
        : activeFilter === "read"
        ? !chat.unread && !chat.archived
        : chat.archived; 
    return matchesSearch && matchesFilter;
  });

  //11
  const toggleMenu = (chatId: number) => {
    setOpenMenuId(openMenuId === chatId ? null : chatId);
  };

  //11
  const markAsUnread = (chatId: number) => {
    setChats(chats.map((chat) => (chat.id === chatId ? { ...chat, unread: true } : chat)));
    setOpenMenuId(null);
  };

  // 13
  const archiveChat = (chatId: number) => {
    setChats(chats.map((chat) => (chat.id === chatId ? { ...chat, archived: true } : chat)));
    setOpenMenuId(null);
  };

  // 14
  const deleteChat = (chatId: number) => {
    setChats(chats.filter((chat) => chat.id !== chatId));
    setOpenMenuId(null);
  };

  // 15
  const renderStatus = (status: MessageStatus) => {
    if (status === "sent") return <BsCheck className="text-[#8696a0]" size={18} />;
    if (status === "delivered") return <BsCheckAll className="text-[#8696a0]" size={18} />; 
    return <BsCheckAll className="text-[#53bdeb]" size={18} />; 
  };
  const navigate=useRouter();
  const NAVI=()=>{
    navigate.push('/HomeList');

  }

  return (
    <div className="w-full md:w-[380px] bg-[#fff] border-r border-[#e9edef] flex flex-col h-screen">
      
   


      {/* 16*/}
      <div className="px-3 py-2 bg-[#fff]">
        
  <div className="flex items-center bg-[#f0f2f5] rounded-lg px-4 py-2 w-[80%] mx-auto">
  <FiSearch className="text-[#8696a0] mr-3" size={20} />
  <input
    type="text"
    placeholder="Search or start new chat"
    className="bg-transparent w-[200px] outline-none text-[#111b21] text-[15px]"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
  />
</div>

      </div>


      {/*17*/}
    <div className="flex gap-2 px-3 py-2 bg-[#fff] border-b border-[#e9edef] justify-center ">
  {(["all", "unread", "read", "archived"] as FilterType[]).map((filter) => (
    <button
      key={filter}
      onClick={() => setActiveFilter(filter)}
      className={`px-4 py-1.5 rounded-full text-[14px] font-medium transition-all ${
        activeFilter === filter
          ? "bg-gradient-to-r from-blue-500 to-blue-600 text-[#fff]"
          : "bg-[#f0f2f5] text-[#667781] hover:bg-[#e9edef]"
      }`}
    >
      {filter.charAt(0).toUpperCase() + filter.slice(1)}
    </button>
  ))}
</div>

      {/*18 */}
      <div className="flex-1 overflow-y-auto">
        {filteredChats.length === 0 ? (
          <div className="text-center py-8 text-[#667781]">No chats found</div>
        ) : (
          filteredChats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => onSelectChat(chat.id)}
              className={`flex items-center py-3 px-4 cursor-pointer hover:bg-[#f5f6f6] transition-colors relative ${
                selectedChatId === chat.id ? "bg-[#f0f2f5]" : ""
              }`}
            >
              {/* 19*/}
        <img
  src={chat.avatar}
  alt={chat.name}
  className="w-[50px] h-[50px] rounded-lg object-cover"
  loading="lazy"
/>


              {/* 20 */}
              <div className="flex-1 ml-4 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <p className="font-medium text-[17px] text-[#111b21] truncate">{chat.name}</p>
                  <span className="text-[12px] text-[#667781] ml-2">{chat.timestamp}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 flex-1 min-w-0">
                    {renderStatus(chat.status)}
                    <p
                      className={`text-[14px] truncate ${
                        chat.unread ? "text-[#111b21] font-medium" : "text-[#667781]"
                      }`}
                    >
                      {chat.lastMessage}
                    </p>
                  </div>

                  {/* 21 */}
                  {chat.unread && (
                    <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-[#fff] text-[12px] font-semibold rounded-full w-[20px] h-[20px] flex items-center justify-center ml-2">
                      1
                    </span>
                  )}
                </div>
              </div>

              {/* 22*/}
              <div className="relative ml-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleMenu(chat.id);
                  }}
                  className="p-2 hover:bg-[#f0f2f5] rounded-full transition-colors"
                >
                  <FiMoreVertical className="text-[#8696a0]" size={18} />
                </button>

                {/*23 */}
                {openMenuId === chat.id && (
                  <div className="absolute right-0 top-full mt-1 bg-[#fff] shadow-lg rounded-lg py-2 z-10 w-[180px] border border-[#e9edef]">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        markAsUnread(chat.id);
                      }}
                      className="w-full px-4 py-2 text-left text-[14px] text-[#111b21] hover:bg-[#f5f6f6] transition-colors"
                    >
                      Mark as unread
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        archiveChat(chat.id);
                      }}
                      className="w-full px-4 py-2 text-left text-[14px] text-[#111b21] hover:bg-[#f5f6f6] transition-colors"
                    >
                      Archive chat
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteChat(chat.id);
                      }}
                      className="w-full px-4 py-2 text-left text-[14px] text-[#ef5350] hover:bg-[#f5f6f6] transition-colors"
                    >
                      Delete chat
                    </button>
                           <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteChat(chat.id);
                      }}
                      className="w-full px-4 py-2 text-left text-[14px] text-[#ef5350] hover:bg-[#f5f6f6] transition-colors"
                    >
                      Block User
                    </button>
                           <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteChat(chat.id);
                      }}
                      className="w-full px-4 py-2 text-left text-[14px] text-[#ef5350] hover:bg-[#f5f6f6] transition-colors"
                    >
                      Report 
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;

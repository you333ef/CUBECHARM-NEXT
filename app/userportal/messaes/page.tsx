'use client'
import React, { useState } from 'react'
import ChatSidebar from './componants/ChatSidebar';
import SelectChatArea from './componants/SelectChatArea';

const page = () => {
     const [selectedChatId, setSelectedChatId] = useState<number | null>(null); // Track selected chat

  //1
  const handleBack = () => {
    setSelectedChatId(null);
  };

  return (
    <div className="flex h-screen bg-[#f0f2f5]">
      {/* 2 */}
      <div className={`${selectedChatId ? "hidden md:flex" : "flex"} w-full md:w-auto`}>
        <ChatSidebar
          selectedChatId={selectedChatId} 
          onSelectChat={setSelectedChatId} 
        />
      </div>
      
      {/*3*/}
      <div className={`${selectedChatId ? "flex" : "hidden md:flex"} flex-1 flex-col`}>
        <SelectChatArea
          selectedChatId={selectedChatId} 
          onBack={handleBack}
        />
      </div>
    </div>
  )
}

export default page
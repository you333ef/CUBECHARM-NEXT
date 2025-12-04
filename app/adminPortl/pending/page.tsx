"use client"

import React, { useState } from "react";

import TableShared from "../sharedAdmin/TableShared";
import { toast } from "sonner";
import HeadlessDemo from "../sharedAdmin/DELETE_CONFIRM";
import { FiClock } from "react-icons/fi";
import { useRouter } from "next/navigation";

// 1
interface Post {
  id: string;
  title: string;
  author: string;
  date: string;
  status: string;
}

const PENDING_POSTS = () => {
  const navigate = useRouter()
// 2
  const fakeData: Post[] = [

    { id: '1', title: 'Post 1', author: 'John Doe', date: '2025-10-26', status: 'Pending' },
    { id: '2', title: 'Post 2', author: 'Jane Smith', date: '2025-10-25', status: 'Pending' },
    
  ];

  // 3
  const headers: (keyof Post)[] = ["title", "author", "date", "status"];

  const [DATAPOSTS, setDATAPOSTS] = useState<Post[]>(fakeData);
  const [confirmReject, setConfirmReject] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Post | null>(null);
// 4
  const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const sorted = [...DATAPOSTS].sort((a, b) =>
      value === "latest" ? Number(b.id) - Number(a.id) : Number(a.id) - Number(b.id)
    );
    setDATAPOSTS(sorted);
  };
//5
  const handleApprove = (item: Post) => {
    const updated = DATAPOSTS.map(p => p.id === item.id ? { ...p, status: "Approved" } : p);
    setDATAPOSTS(updated);
    toast.success(`${item.title} is Approved`);
    setTimeout(() => setDATAPOSTS(prev => prev.filter(p => p.id !== item.id)), 2000);
  };
// 6
  const handleReject = (item: Post) => {
    const updated = DATAPOSTS.map(p => p.id === item.id ? { ...p, status: "Rejected" } : p);
       setDATAPOSTS(updated);
    toast.error(`${item.title} is Rejected`);
    setTimeout(() => setDATAPOSTS(prev => prev.filter(p => p.id !== item.id)), 2000);
  };

  const confirmRejectAction = () => {
    if (selectedItem) {
      handleReject(selectedItem);
      setConfirmReject(false);
      setSelectedItem(null);
    }
  };

  return (
    <div className="p-6">
     
      <div className="flex items-center justify-center mb-8">
        <h1 className="text-2xl font-semibold flex items-center gap-2 text-gray-800">
          <FiClock className="text-black text-3xl" />
          Pending Page
        </h1>
      </div>

    
      <div className="flex justify-end mb-6">
        <select
          onChange={handleSort}
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="oldest">Oldest to Latest</option>
          <option value="latest">Latest to Oldest</option>
        </select>
      </div>

     
      <TableShared<Post>
        rows={DATAPOSTS}
        T_Head={headers}
        funApprove={handleApprove}
        funReject={(item) => {
          setSelectedItem(item);
          setConfirmReject(true);
        }}
        funView={(item) => navigate.push(`/ADMINpro-mode/${item.id}`)}
      />

      {/* 7 */}
      {confirmReject && selectedItem && (
        <HeadlessDemo
          DeleteTrue={confirmRejectAction}
          name={selectedItem.title}
          actionType="reject"
        />
      )}
    </div>
  );
};

export default PENDING_POSTS;
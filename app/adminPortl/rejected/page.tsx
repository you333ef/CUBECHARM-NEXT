"use client"
import React, { useState } from "react";

import TableShared from "../sharedAdmin/TableShared";
import { toast } from "sonner";
import { FiXCircle } from "react-icons/fi";
import { useRouter } from "next/navigation";


// 1
interface Post {
  id: string;
  title: string;
  author: string;
  date: string;
  status: string;
  reason?: string; // 2
  [key: string]: string | undefined; // 3
}

const Rejected = () => {
  const navigate = useRouter()

  // 4
  const fakeData: Post[] = [
    { id: "6", title: "Post 6", author: "Lina Youssef", date: "2025-10-21", status: "Rejected", reason: "Inappropriate content" },
    { id: "7", title: "Post 7", author: "Omar Khaled", date: "2025-10-20", status: "Rejected", reason: "Violates community guidelines" },
    { id: "8", title: "Post 8", author: "Hana Ali", date: "2025-10-19", status: "Rejected", reason: "Incomplete information" },
    { id: "9", title: "Post 9", author: "Yara Mahmoud", date: "2025-10-18", status: "Rejected", reason: "Spam content" },
    { id: "10", title: "Post 10", author: "Adam Saeed", date: "2025-10-17", status: "Rejected", reason: "Duplicate post" },
  ];

  const headers: (keyof Post)[] = ["title", "author", "date", "status", "reason"];
  const [DATAPOSTS, setDATAPOSTS] = useState<Post[]>(fakeData);

  //5
  const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    let sorted = [...DATAPOSTS];

    if (value === "latest") {
      sorted.sort((a, b) => Number(b.id) - Number(a.id));
    } else if (value === "oldest") {
      sorted.sort((a, b) => Number(a.id) - Number(b.id));
    }

    setDATAPOSTS(sorted);
  };

  //6
  const handleShowReason = (item: Post) => {
    toast.info(`Rejection Reason for ${item.title}: ${item.reason || "No reason provided"}`);
  };

  return (
  <div>
  {/*7 */}
  <div className="flex items-center justify-center mb-8">
    <h1 className="text-2xl font-semibold flex items-center gap-2 text-gray-800">
      <FiXCircle className="text-black text-3xl" />
      Rejected Page
    </h1>
  </div>

  {/* 8*/}
  <div className="flex justify-end mb-6">
    <select
      onChange={handleSort}
      className="border border-gray-300 rounded-lg px-4 py-2 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
    >
      <option value="oldest">Oldest to Latest</option>
      <option value="latest">Latest to Oldest</option>
    </select>
  </div>

  <TableShared
    rows={DATAPOSTS}
    T_Head={headers}
    funView={(item: Post) => navigate.push(`/pro-mode/${item.id}`)}
    funShowReason={(item: Post) => handleShowReason(item)}
  />
</div>

  );
};

export default Rejected;
"use client"
import React, { useState } from "react";

import TableShared from "../sharedAdmin/TableShared";
import { toast } from "sonner";
import HeadlessDemo from "../sharedAdmin/DELETE_CONFIRM";
import { FiAlertCircle } from "react-icons/fi";
import { useRouter } from "next/navigation";

// 1
interface Report {
  id: string;
  title: string;
  num_reports: number;
  reason: string;
  date: string;
  status: string;
}

const REPORTS = () => {
  const navigate = useRouter()

  // 2
  const fakeData: Report[] = [
    { id: '1', title: 'Post 1', num_reports: 5, reason: 'Spam', date: '2025-10-26', status: 'Reported' },
    { id: '2', title: 'Post 2', num_reports: 3, reason: 'Harassment', date: '2025-10-25', status: 'Reported' },
     { id: '3', title: 'Post 3', num_reports: 3, reason: 'Harassment', date: '2025-10-25', status: 'Reported' },
     { id: '4', title: 'Post 4', num_reports: 3, reason: 'Harassment', date: '2025-10-25', status: 'Reported' },
  ];

  // 3
  const headers: (keyof Report)[] = ["title", "num_reports", "reason", "date", "status"];

  const [DATA_REPORTS, setDATA_REPORTS] = useState<Report[]>(fakeData);
  const [confirmBlock, setConfirmBlock] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Report | null>(null);

  // 4
  const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const sorted = [...DATA_REPORTS].sort((a, b) =>
      value === "latest"
        ? new Date(b.date).getTime() - new Date(a.date).getTime()
        : new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    setDATA_REPORTS(sorted);
  };

  //5
  const handleBlock = (item: Report) => {
    const updated = DATA_REPORTS.map(p => p.id === item.id ? { ...p, status: "Blocked" } : p);
    setDATA_REPORTS(updated);
    toast.error(`User blocked for 10 days for ${item.title}`);
    setTimeout(() => setDATA_REPORTS(prev => prev.filter(p => p.id !== item.id)), 2000);
  };

  //6
  const handleDelete = (item: Report) => {
    const updated = DATA_REPORTS.map(p => p.id === item.id ? { ...p, status: "Deleted" } : p);
    setDATA_REPORTS(updated);
    toast.error(`${item.title} deleted`);
    setTimeout(() => setDATA_REPORTS(prev => prev.filter(p => p.id !== item.id)), 2000);
  };

  // 7
  const confirmBlockAction = () => {
    if (selectedItem) {
      handleBlock(selectedItem);
      setConfirmBlock(false);
      setSelectedItem(null);
    }
  };

  //8
  const confirmDeleteAction = () => {
    if (selectedItem) {
      handleDelete(selectedItem);
      setConfirmDelete(false);
      setSelectedItem(null);
    }
  };

  //9
  const cancelBlockAction = () => {
    setConfirmBlock(false);
    setSelectedItem(null);
  };

  // 10
  const cancelDeleteAction = () => {
    setConfirmDelete(false);
    setSelectedItem(null);
  };

  return (
    <div className="p-6">
      
      <div className="flex items-center justify-center mb-8">
        <h1 className="text-2xl font-semibold flex items-center gap-2 text-gray-800">
          <FiAlertCircle className="text-black text-3xl" />
          Reports Page
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

      <TableShared<Report>
        rows={DATA_REPORTS}
        T_Head={headers}
        funApprove={(item) => {
          setSelectedItem(item);
          setConfirmDelete(true);
        }}
        funReject={(item) => {
          setSelectedItem(item);
          setConfirmBlock(true);
        }}
        funView={(item) => navigate.push(`/userportal/readmore/${item.id}`)}
      />

      {/* 11 */}
      {confirmBlock && selectedItem && (
        <HeadlessDemo
          DeleteTrue={confirmBlockAction}
          onCancel={cancelBlockAction}
          name={selectedItem.title}
          actionType="block"
        />
      )}

      {/* 12*/}
      {confirmDelete && selectedItem && (
        <HeadlessDemo
          DeleteTrue={confirmDeleteAction}
          onCancel={cancelDeleteAction}
          name={selectedItem.title}
          actionType="delete"
        />
      )}
    </div>
  );
};

export default REPORTS;
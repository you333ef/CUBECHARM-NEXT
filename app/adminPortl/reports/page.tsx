"use client";

import React, { useContext, useEffect, useState } from "react";
import axios from "axios";

import TableShared from "../sharedAdmin/TableShared";
import { toast } from "sonner";
import HeadlessDemo from "../sharedAdmin/DELETE_CONFIRM";
import { FiAlertCircle } from "react-icons/fi";
import { useRouter } from "next/navigation";
import AuthContext from "@/app/providers/AuthContext";

// ================= TYPES =================
interface Report {
  id: string;
  title: string;
  num_reports: number;
  reason: string;
  date: string;
  status: string;
}

// ================= HELPERS =================
const formatDate = (dateString: string) => {
  const d = new Date(dateString);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(d.getDate()).padStart(2, "0")}`;
};

// ================= COMPONENT =================
const REPORTS = () => {
  const navigate = useRouter();
  const { baseUrl } = useContext(AuthContext)!;

  const accessToken =
    typeof window !== "undefined"
      ? localStorage.getItem("accessToken")
      : null;

  // ================= STATE =================
  const [DATA_REPORTS, setDATA_REPORTS] = useState<Report[]>([]);
  const [confirmBlock, setConfirmBlock] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Report | null>(null);

  // pagination
  const [page, setPage] = useState(1);
  const pageSize = 20;

  // ================= TABLE HEADERS =================
  const headers: (keyof Report)[] = [
    "title",
    "num_reports",
    "reason",
    "date",
    "status",
  ];

  // ================= API CALL =================
  useEffect(() => {
    const getReports = async () => {
      try {
        const res = await axios.get(
          `${baseUrl}/admin/reports?page=${page}&pageSize=${pageSize}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const items = res.data.data.items

        const mappedData: Report[] = items.map((item: any) => ({
          id: String(item.id),
          title: `${item.reportType} #${item.referenceId}`,
          num_reports: 1,
          reason: item.reason,
          date: formatDate(item.createdAt),
          status: item.status,
        }));

        setDATA_REPORTS(mappedData);
      } catch (error) {
        toast.error("Failed to load reports");
        console.error(error);
      }
    };

    getReports();
  }, [baseUrl, accessToken, page]);

  // ================= SORT =================
  const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const sorted = [...DATA_REPORTS].sort((a, b) =>
      value === "latest"
        ? new Date(b.date).getTime() - new Date(a.date).getTime()
        : new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    setDATA_REPORTS(sorted);
  };

  // ================= ACTIONS =================
  const handleBlock = (item: Report) => {
    setDATA_REPORTS((prev) =>
      prev.map((p) =>
        p.id === item.id ? { ...p, status: "Blocked" } : p
      )
    );
    toast.error(`User blocked for report ${item.title}`);
  };

  const handleDelete = (item: Report) => {
    setDATA_REPORTS((prev) =>
      prev.map((p) =>
        p.id === item.id ? { ...p, status: "Deleted" } : p
      )
    );
    toast.error(`${item.title} deleted`);
  };

  const confirmBlockAction = () => {
    if (selectedItem) {
      handleBlock(selectedItem);
      setConfirmBlock(false);
      setSelectedItem(null);
    }
  };

  const confirmDeleteAction = () => {
    if (selectedItem) {
      handleDelete(selectedItem);
      setConfirmDelete(false);
      setSelectedItem(null);
    }
  };

  const cancelBlockAction = () => {
    setConfirmBlock(false);
    setSelectedItem(null);
  };

  const cancelDeleteAction = () => {
    setConfirmDelete(false);
    setSelectedItem(null);
  };

  // ================= RENDER =================
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
        funView={(item) =>
          navigate.push(`/userportal/readmore/${item.id}`)
        }
      />

      {confirmBlock && selectedItem && (
        <HeadlessDemo
          DeleteTrue={confirmBlockAction}
          onCancel={cancelBlockAction}
          name={selectedItem.title}
          actionType="block"
        />
      )}

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

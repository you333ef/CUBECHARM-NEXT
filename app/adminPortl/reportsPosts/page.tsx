"use client";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import TableShared from "../sharedAdmin/TableShared";
import { toast } from "sonner";
import HeadlessDemo from "../sharedAdmin/DELETE_CONFIRM";
import { FiAlertCircle } from "react-icons/fi";
import { useRouter } from "next/navigation";
import AuthContext from "@/app/providers/AuthContext";
import { getReports, MappedReport } from "../reports/services/adminReports";
import api from "@/app/AuthLayout/refresh";

const REPORTS_POSTS = () => {
  const navigate = useRouter();
  const { baseUrl } = useContext(AuthContext)!;
  const accessToken =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  const [DATA_REPORTS, setDATA_REPORTS] = useState<MappedReport[]>([]);
  const [sortOrder, setSortOrder] = useState<"latest" | "oldest">("latest");
  const [confirmBlock, setConfirmBlock] = useState(false);
  const [confirmDeleteContent, setConfirmDeleteContent] = useState(false);
  const [confirmRemoveReport, setConfirmRemoveReport] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MappedReport | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const headers: (keyof MappedReport)[] = [
    "title",
    "num_reports",
    "reason",
    "date",
    "status",
  ];
  // ================= FETCH =================
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await getReports(
          baseUrl,
          accessToken,
          page,
          pageSize,
          sortOrder
        );
        const filtered = response.items.filter(item => {
          return (item.raw && item.raw.postId) || (item.raw && item.raw.reportType === 'Post');
        });
        const sorted = [...filtered].sort((a, b) =>
          sortOrder === "latest"
            ? new Date(b.createdAt).getTime() -
              new Date(a.createdAt).getTime()
            : new Date(a.createdAt).getTime() -
              new Date(b.createdAt).getTime()
        );
        setDATA_REPORTS(sorted);
      } catch (error) {
        toast.error("Failed to load reports");
        console.error(error);
      }
    };
    if (baseUrl && accessToken) {
      fetchReports();
    }
  }, [baseUrl, accessToken, page, sortOrder]);
  // ================= SORT =================
  const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as "latest" | "oldest";
    setSortOrder(value);
  };
  // ================= HELPERS =================
  const resolvePropertyId = (item: MappedReport) =>
    item.propertyId || item.referenceId || item.id;
  const patchLocalReportStatus = (reportId: string, status: string) => {
    setDATA_REPORTS((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status } : r))
    );
  };
  // ================= ACTIONS =================
  const handleBlock = async (item: MappedReport) => {
    try {
      const propertyId = resolvePropertyId(item);
      const propertyRes = await api.get(
        `/Property/${propertyId}`
      );
      const ownerId = propertyRes?.data?.data?.ownerId;
      if (!ownerId) throw new Error("Owner ID not found");
      await api.post(
        `/admin/users/${ownerId}/ban`,
        {}
      );
      await api.patch(
        `/admin/reports/${item.id}/status`,
        { status: "Resolved", adminNotes: "User banned by admin" }
      );
      patchLocalReportStatus(item.id, "Resolved");
      cancelAnyConfirm();

      toast.success(`User banned and report resolved`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err.message);
      console.error(err);
    }
  };
  const handleDeleteContent = async (item: MappedReport) => {
    try {
      const propertyId = resolvePropertyId(item);
      await api.delete(
        `/posts/${propertyId}`
      );
      await api.patch(
        `/admin/reports/${item.id}/status`,
        { status: "Resolved", adminNotes: "Content deleted by admin" }
      );
      patchLocalReportStatus(item.id, "Resolved");
      cancelAnyConfirm();

      toast.success(`Content deleted and report resolved`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err.message);
      console.error(err);
    }
  };
  const handleDismiss = async (item: MappedReport) => {
    try {
      await api.patch(
        `/admin/reports/${item.id}/status`,
        { status: "Dismissed", adminNotes: "Report dismissed by admin" }
      );
      patchLocalReportStatus(item.id, "Dismissed");
      cancelAnyConfirm();

      toast.success(`Report dismissed`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err.message);
      console.error(err);
    }
  };
  const handleRemoveReport = async (item: MappedReport) => {
    try {
      await api.delete(
        `/admin/reports/${item.id}`
      );
      setDATA_REPORTS((prev) => prev.filter((r) => r.id !== item.id));
      toast.success(`Report removed`);
      cancelAnyConfirm();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err.message);
      console.error(err);
    }
  };
  // ================= CONFIRM =================
  const cancelAnyConfirm = () => {
    setConfirmBlock(false);
    setConfirmDeleteContent(false);
    setConfirmRemoveReport(false);
    setSelectedItem(null);
  };
  // ================= RENDER =================
  return (
    <div className="p-6">
      <div className="flex items-center justify-center mb-8">
        <h1 className="text-2xl font-semibold flex items-center gap-2 text-gray-800">
          <FiAlertCircle className="text-black text-3xl" />
          Reports Posts
        </h1>
      </div>
      <div className="flex justify-end mb-6">
        <select
          onChange={handleSort}
          value={sortOrder}
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="latest">Latest to Oldest</option>
          <option value="oldest">Oldest to Latest</option>
        </select>
      </div>
      <TableShared<MappedReport>
        rows={DATA_REPORTS}
        T_Head={headers}
        funApprove={(item) => {
          setSelectedItem(item);
          setConfirmDeleteContent(true);
        }}
        funReject={(item) => {
          setSelectedItem(item);
          setConfirmBlock(true);
        }}
        funView={(item) => {
      const postId =
  item.raw?.reportType === "Post"
    ? item.raw?.referenceId
    : null;

if (!postId) {
  toast.error("Invalid post reference");
  return;
}


          navigate.replace(
            `/userportal/activity?mode=admin&from=reportsPosts&reportId=${item.id}&postId=${postId}`
          );
        }}
        funRemove={(item) => {
          setSelectedItem(item);
          setConfirmRemoveReport(true);
        }}
        funShowReason={(item) => {
          handleDismiss(item);
        }}
        headerDisplayNames={{
          title: "Reported Post",
          num_reports: "Reports",
          reason: "Reason",
          date: "Date",
          status: "Status",
        }}
      />
      {confirmBlock && selectedItem && (
        <HeadlessDemo
          DeleteTrue={() => handleBlock(selectedItem)}
          onCancel={cancelAnyConfirm}
          name={selectedItem.title}
          actionType="block"
        />
      )}
      {confirmDeleteContent && selectedItem && (
        <HeadlessDemo
          DeleteTrue={() => handleDeleteContent(selectedItem)}
          onCancel={cancelAnyConfirm}
          name={selectedItem.title}
          actionType="delete"
        />
      )}
      {confirmRemoveReport && selectedItem && (
        <HeadlessDemo
          DeleteTrue={() => handleRemoveReport(selectedItem)}
          onCancel={cancelAnyConfirm}
          name={selectedItem.title}
          actionType="delete"
        />
      )}
    </div>
  );
};
export default REPORTS_POSTS;
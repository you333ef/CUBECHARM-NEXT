"use client";

import React, {
  useCallback,
  useEffect,
  useState,
  Suspense,
  useContext,
  useMemo,
} from "react";
import Taple_Two from "../sharedAdmin/TAPLE_CLIENTS";
import HeadlessDemo from "../sharedAdmin/DELETE_CONFIRM";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import axios from "axios";
import { toast } from "sonner";
import AuthContext from "@/app/providers/AuthContext";

/* ===== API User ===== */
interface User {
  userId: string;
  username: string;
  email: string;
  phoneNumber: string | null;
  postsCount: number;
  followersCount: number;
  followingCount: number;
  isActive: boolean;
  createdDate: string;
  lastLoginDate: string | null;
}

/* ===== Table Student Shape ===== */
interface Student {
  _id: string;
  first_name: string;
  last_name?: string;
  email: string;
  role: string;
  status: string;
  group?: {
    name: string;
    students: any[];
    max_students: number;
    status: string;
    createdAt: string;
  };
}

interface Pagination {
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

const USERS_PAGE = () => {
  const { baseUrl } = useContext(AuthContext)!;

  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const pageSize = 4;

  /* ===== بدل blockUser ===== */
  const [blockUserId, setBlockUserId] = useState<string | null>(null);

  const accessToken =
    typeof window !== "undefined"
      ? localStorage.getItem("accessToken")
      : null;

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };

  /* ===== Fetch users ===== */
  const getUsers = useCallback(async () => {
    if (!accessToken) return;

    try {
      setLoading(true);

      const res = await axios.get(`${baseUrl}/admin/users`, {
        ...axiosConfig,
        params: { page, pageSize },
      });

      setUsers(res.data.data.items);
      setPagination(res.data.data);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [page, accessToken, baseUrl]);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  /* ===== selected user مرة واحدة ===== */
  const selectedUser = useMemo(
    () => users.find((u) => u.userId === blockUserId) ?? null,
    [blockUserId, users]
  );

  /* ===== Block user ===== */
  const confirmBlock = useCallback(async () => {
    if (!selectedUser || !accessToken) return;

    try {
      await axios.post(
        `${baseUrl}/admin/users/${selectedUser.userId}/ban`,
        {},
        axiosConfig
      );

      toast.success("User blocked");

      setUsers((prev) =>
        prev.map((u) =>
          u.userId === selectedUser.userId
            ? { ...u, isActive: false }
            : u
        )
      );
    } catch {
      toast.error("Block failed");
    } finally {
      setBlockUserId(null);
    }
  }, [selectedUser, accessToken, baseUrl]);

  /* ===== Map Users → Students for table ===== */
  const tableData: Student[] = useMemo(
    () =>
      users.map((u) => ({
        _id: u.userId,
        first_name: u.username,
        last_name: "",
        email: u.email,
        role: "User",
        status: u.isActive ? "Active" : "Blocked",
        group: {
          name: "—",
          students: new Array(u.followersCount ?? 0),
          max_students: 0,
          status: "N/A",
          createdAt: u.createdDate,
        },
      })),
    [users]
  );

  return (
    <div className="min-h-screen bg-white p-4">
      <Suspense fallback={<div className="h-64 bg-gray-100 animate-pulse" />}>
        <Taple_Two
          data_Students={tableData}
          funBlock={(item) => {
            setBlockUserId(item._id);
          }}
        />
      </Suspense>

      {pagination && (
        <div className="flex justify-center items-center gap-3 mt-6">
          <button
            disabled={!pagination.hasPreviousPage}
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            <FiChevronLeft />
          </button>

          <span className="text-sm">
            Page {pagination.page} of {pagination.totalPages}
          </span>

          <button
            disabled={!pagination.hasNextPage}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            <FiChevronRight />
          </button>
        </div>
      )}

      {selectedUser && (
        <HeadlessDemo
          DeleteTrue={confirmBlock}
          name={selectedUser.username}
          actionType="block"
        />
      )}

      {loading && (
        <div className="fixed inset-0 bg-white/60 flex items-center justify-center">
          Loading...
        </div>
      )}
    </div>
  );
};

export default USERS_PAGE;

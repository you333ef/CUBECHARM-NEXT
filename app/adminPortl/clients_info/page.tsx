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
import ViewClient from "../sharedAdmin/VIEW_CLIENT";
import HeadlessDemo from "../sharedAdmin/DELETE_CONFIRM";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import axios from "axios";
import { toast } from "sonner";
import AuthContext from "@/app/providers/AuthContext";
import api from "@/app/AuthLayout/refresh";
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
  const [viewUser, setViewUser] = useState<Student | null>(null);
  const [showView, setShowView] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<User[] | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1);
  const pageSize = 4;
  /* ===== blockUser ===== */
  const [blockUserId, setBlockUserId] = useState<string | null>(null);

  

  
  /* ===== Fetch users ===== */
  const getUsers = useCallback(async () => {
   
    try {
      setLoading(true);
      const res = await api.get("/admin/users", {
        params: { page, pageSize },
      });
      setUsers(res.data.data.items);
      setPagination(res.data.data);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [page]);
  // Debounced search effect (case-insensitive)
  useEffect(() => {
    if (search.trim().length < 2) {
      setSearchResults(null);
      setSearchLoading(false);
      return;
    }
    let active = true;
    setSearchLoading(true);
    const handler = setTimeout(async () => {
      try {
        const res = await api.get("/admin/users", {
          params: { Search: search.trim(), page: 1, pageSize: 20 },
        });
        if (active) {
          setSearchResults(res.data.data.items || []);
        }
      } catch {
        if (active) setSearchResults([]);
      } finally {
        if (active) setSearchLoading(false);
      }
    }, 350);
    return () => {
      active = false;
      clearTimeout(handler);
    };
  }, [search]);
  useEffect(() => {
    if (search.trim().length < 2) getUsers();
  }, [getUsers, search]);
  /* ===== selected user ===== */
  const selectedUser = useMemo(
    () => users.find((u) => u.userId === blockUserId) ?? null,
    [blockUserId, users]
  );
  /* ===== Block user ===== */
  const confirmBlock = useCallback(async () => {
    if (!selectedUser ) return;

    try {
      await api.post(`/admin/users/${selectedUser.userId}/ban`, {});

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
  }, [selectedUser]);
  //only search results if present
  const tableData: Student[] = useMemo(() => {
    const source = searchResults !== null ? searchResults : users;
    return source.map((u) => ({
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
    }));
  }, [users, searchResults]);
  return (
    <div className="min-h-screen bg-white p-4">
      <div className="mb-8 flex justify-center items-center">
        <input
          type="text"
          className="border rounded-lg px-3 py-2 w-full max-w-md text-center focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Search users..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ textTransform: 'none' }}
        />
        {searchLoading && <span className="ml-2 text-blue-500 animate-pulse">Searching...</span>}
      </div>
      <Suspense fallback={<div className="h-64 bg-gray-100 animate-pulse" />}>
        <Taple_Two
          data_Students={tableData}
          funBlock={(item) => {
            setBlockUserId(item._id);
          }}
          funView={(item) => {
            setViewUser(item);
            setShowView(true);
          }}
        />
        <ViewClient setStateView={setShowView} stateView={showView} user={viewUser} />
      </Suspense>

      {pagination && search.trim().length < 2 && (
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

      {(loading || searchLoading) && (
        <div className="fixed inset-0 bg-white/60 flex items-center justify-center">
          Loading...
        </div>
      )}
    </div>
  );
};

export default USERS_PAGE;

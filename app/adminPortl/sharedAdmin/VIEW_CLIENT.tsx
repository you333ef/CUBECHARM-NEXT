"use client"
import React from "react";
import { CgProfile } from "react-icons/cg";

interface Student {
  _id: string;
  first_name: string;
  last_name?: string;
  email: string;
  role: string;
  status: string;
  group?: {
    createdAt: string;
    students: any[];
    max_students: number;
    status: string;
  };
}

interface ViewClientProps {
  setStateView: (v: boolean) => void;
  stateView: boolean;
  user: Student | null;
}

const ViewClient: React.FC<ViewClientProps> = ({ setStateView, stateView, user }) => {
  if (!stateView || !user) return null;

  const capitalize = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : "—");

  const fullName = capitalize(user.first_name);
  const groupCreated = user.group?.createdAt
    ? new Date(user.group.createdAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-black/30 to-gray-900/20 backdrop-blur-md">
      <div
        role="dialog"
        aria-modal="true"
        className="fixed left-1/2 top-1/2 z-50 w-[calc(100vw-2rem)] max-w-[500px] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-white via-gray-50 to-gray-100 p-4 sm:p-6 shadow-2xl shadow-black/15 rounded-3xl border border-gray-200/60"
        tabIndex={-1}
      >
        <div className="flex flex-col space-y-3 text-center">
          <div className="flex justify-center items-center mb-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-gray-700 to-black text-white shadow-lg shadow-gray-200/50 ring-2 ring-gray-300/60">
                <CgProfile className="w-10 h-10" />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-bold leading-tight text-slate-800 mb-1">
                  {fullName || "—"}
                </h3>
                <p className="text-sm text-gray-600 font-medium bg-gradient-to-r from-gray-100 to-white px-3 py-1 rounded-full border border-gray-200">
                  {user.role || "—"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <section aria-label="user details" className="space-y-3">
          <div className="grid grid-cols-1 min-[420px]:grid-cols-2 gap-3">
            <article className="group rounded-2xl bg-gradient-to-br from-white via-gray-50 to-gray-100 border border-gray-200/60 p-3 transition-all duration-300 hover:shadow-lg hover:shadow-gray-200/40 hover:border-gray-400/50">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Role</p>
              <p className="font-semibold text-gray-800 text-sm group-hover:text-black transition-colors text-center">
                {user.role || "—"}
              </p>
            </article>
            <article className="group rounded-2xl bg-gradient-to-br from-white via-gray-50 to-gray-100 border border-gray-200/60 p-3 transition-all duration-300 hover:shadow-lg hover:shadow-gray-200/40 hover:border-gray-400/50">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Email</p>
              <p className="font-semibold text-gray-800 text-sm break-words group-hover:text-black transition-colors text-center">
                {user.email || "—"}
              </p>
            </article>
            <article className="group rounded-2xl bg-gradient-to-br from-white via-gray-50 to-gray-100 border border-gray-200/60 p-3 transition-all duration-300 hover:shadow-lg hover:shadow-gray-200/40 hover:border-gray-400/50">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Status</p>
              <p className="font-semibold text-gray-800 text-sm group-hover:text-black transition-colors text-center">
                {user.status || "—"}
              </p>
            </article>
            <article className="group rounded-2xl bg-gradient-to-br from-white via-gray-50 to-gray-100 border border-gray-200/60 p-3 transition-all duration-300 hover:shadow-lg hover:shadow-gray-200/40 hover:border-gray-400/50">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Created in</p>
              <p className="font-semibold text-gray-800 text-sm group-hover:text-black transition-colors text-center">
                {groupCreated}
              </p>
            </article>
            <article className="group rounded-2xl bg-gradient-to-br from-white via-gray-50 to-gray-100 border border-gray-200/60 p-3 transition-all duration-300 hover:shadow-lg hover:shadow-gray-200/40 hover:border-gray-400/50">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">All Appartments</p>
              <p className="font-semibold text-gray-800 text-sm group-hover:text-black transition-colors text-center">
                <span className="text-gray-900 font-bold">{user.group?.students?.length ?? 0}</span> /{" "}
                {user.group?.max_students ?? "—"}
              </p>
            </article>
            <article className="group rounded-2xl bg-gradient-to-br from-white via-gray-50 to-gray-100 border border-gray-200/60 p-3 transition-all duration-300 hover:shadow-lg hover:shadow-gray-200/40 hover:border-gray-400/50">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Type Appartments</p>
              <p className="font-semibold text-gray-800 text-sm group-hover:text-black transition-colors text-center">
                Hotels
              </p>
            </article>
          </div>
        </section>

        <div className="flex justify-center pt-4 ">
          <button
            onClick={() => setStateView(false)}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-300 bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white hover:from-gray-800 hover:via-gray-700 hover:to-gray-900 hover:shadow-xl hover:shadow-black/20 active:scale-95 h-11 px-6 py-2 font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewClient;
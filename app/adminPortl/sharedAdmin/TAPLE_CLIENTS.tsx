"use client"
import React, { useState } from "react";
import { FiEye, FiEdit, FiTrash2, FiMoreHorizontal, FiSlash } from "react-icons/fi";

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

interface TableProps {
  data_Students?: Student[];
  funView?: (item: Student) => void;
  funEdit?: (item: Student) => void;
  funDelete?: (item: Student) => void;
  funBlock?: (item: Student) => void;
}

const Table_Two: React.FC<TableProps> = ({
  data_Students = [],
  funView,
  funEdit,
  funDelete,
  funBlock,
}) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (id: string) =>
    setOpenDropdown(openDropdown === id ? null : id);
  const closeDropdown = () => setOpenDropdown(null);

  const initials = (first?: string, last?: string) => {
    const name = `${first ?? ""} ${last ?? ""}`.trim();
    return name ? name[0].toUpperCase() : "?";
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {data_Students.map((item) => (
          <div
            key={item._id}
            className="bg-white rounded-xl border border-gray-200 shadow p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 text-white flex items-center justify-center text-lg font-semibold text-white">
                {initials(item.first_name, item.last_name)}
              </div>
              <div>
                <div className="text-lg font-semibold text-gray-900">
                  {`${item.first_name ?? ""} ${item.last_name ?? ""}`.trim() ||
                    "Unnamed"}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  <span className="font-semibold"></span>{" "}
                  {item.group?.name || "—"} •{" "}
                  {item.group?.students?.length || 0} Mempers
                </div>
              </div>
            </div>

            <div className="relative">
              <button
                onClick={() => toggleDropdown(item._id)}
                className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50"
              >
                <FiMoreHorizontal className="text-gray-500" />
              </button>

              {openDropdown === item._id && (
                <>
                  <div className="fixed inset-0 z-40" onClick={closeDropdown} />
                  <div className="absolute right-0 top-10 w-44 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="py-2">
                      {funView && (
                        <button
                          onClick={() => {
                            funView(item);
                            closeDropdown();
                          }}
                          className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                        >
                          <FiEye /> View
                        </button>
                      )}
                      {funEdit && (
                        <button
                          onClick={() => {
                            funEdit(item);
                            closeDropdown();
                          }}
                          className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                        >
                          <FiEdit /> Edit
                        </button>
                      )}
                      {funDelete && (
                        <button
                          onClick={() => {
                            funDelete(item);
                            closeDropdown();
                          }}
                          className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <FiTrash2 /> Delete
                        </button>
                      )}
                      {funBlock && (
                        <button
                          onClick={() => {
                            funBlock(item);
                            closeDropdown();
                          }}
                          className="w-full px-3 py-2 text-left text-sm text-orange-600 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <FiSlash /> Block
                        </button>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Table_Two;
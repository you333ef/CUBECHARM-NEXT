"use client"
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { FiMoreHorizontal, FiCheck, FiX, FiEye, FiInfo } from "react-icons/fi";



interface TableSharedProps<T> {
  rows: T[];
  T_Head: (keyof T)[];
  funApprove?: (item: T) => void;
  funReject?: (item: T) => void;
  funView?: (item: T) => void;
  funRemove?: (item: T) => void;
  funShowReason?: (item: T) => void;
  truncateColumns?: string[];
  headerDisplayNames?: Partial<Record<keyof T, string>>;
}

const TableShared = <T extends Record<string, any>>({
  rows = [],
  T_Head,
  funApprove,
  funReject,
  funView,
  funRemove,
  funShowReason,
  truncateColumns = [],
  headerDisplayNames = {} as any,
}: TableSharedProps<T>) => {
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);

  const toggleDropdown = (index: number) => {
    setOpenDropdown(prev => (prev === index ? null : index));
  };

  const closeDropdown = () => setOpenDropdown(null);

  const slugify = (s: string, i: number) =>
    `tablehead-${i}-${String(s || "").toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-_]/g, "")}`;
const Location = usePathname();

  const LocationContain = Location.includes('ADMIN_LAYOUT/REPORTS');

  return (
    <div className="w-full">
      <div className="hidden lg:block">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <table className="w-full text-sm table-auto">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {T_Head.map((header, index) => {
                  const hid = slugify(String(header), index);
                  const isFirst = index === 0;
                  return (
                    <th
                      key={index}
                      id={hid}
                      scope="col"
                      className={`px-4 py-3 text-center text-sm font-semibold text-gray-700 tracking-wide ${
                        isFirst ? "w-[30%] min-w-[150px] max-w-[200px]" : "w-[15%] min-w-[100px] max-w-[150px]"
                      }`}
                    >
                      {headerDisplayNames[header] || String(header).replace(/([A-Z])/g, " $1").trim()}
                    </th>
                  );
                })}
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 tracking-wide w-[10%] min-w-[80px]">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="bg-white border-t border-gray-200">
              {rows.map((item, index) => (
                <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                  {T_Head.map((column, colIndex) => {
                    const isFirst = colIndex === 0;
                    const headerId = slugify(String(column), colIndex);
                    const value = item[column];
                    const displayValue = truncateColumns.includes(String(column))
                      ? String(value || "").substring(0, 8)
                      : value ?? "—";

                    return (
                      <td
                        key={colIndex}
                        aria-labelledby={headerId}
                        className={`px-4 py-3 text-center ${isFirst ? "break-words" : "text-ellipsis overflow-hidden whitespace-nowrap"}`}
                      >
                        <div className="text-sm font-medium text-gray-900">{displayValue}</div>
                      </td>
                    );
                  })}

                  {/* Actions */}
                  <td className="px-4 py-3 text-center relative">
                    <button
                      onClick={() => toggleDropdown(index)}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                      aria-expanded={openDropdown === index}
                      aria-controls={`actions-${index}`}
                    >
                      <FiMoreHorizontal className="w-4 h-4 text-gray-500" />
                    </button>

                    {openDropdown === index && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={closeDropdown} />
                        <div
                          id={`actions-${index}`}
                          role="menu"
                          className="absolute right-0 top-10 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20"
                        >
                          <div className="py-1">
                            {funView && (
                              <button
                                onClick={() => { funView(item); closeDropdown(); }}
                                className="w-full px-4 py-2 text-left text-sm text-gray-900 hover:bg-gray-50 flex items-center gap-3"
                              >
                                <FiEye className="w-4 h-4" /> View
                              </button>
                            )}
                            {funApprove && (
                              <button
                                onClick={() => { funApprove(item); closeDropdown(); }}
                                className="w-full px-4 py-2 text-left text-sm text-gray-900 hover:bg-gray-50 flex items-center gap-3"
                              >
                             
                                <FiCheck className="w-4 h-4" />  {LocationContain?'Delete User':'Approve'}
                              </button>
                            )}
                            {funReject && (
                              <button
                                onClick={() => { funReject(item); closeDropdown(); }}
                                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50 flex items-center gap-3"
                              >
                                <FiX className="w-4 h-4" />
                                 {LocationContain?'Block User':'Reject'}
                                 
                              </button>
                            )}
                            {funRemove && (
                              <button
                                onClick={() => { funRemove(item); closeDropdown(); }}
                                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50 flex items-center gap-3"
                              >
                                <FiX className="w-4 h-4" /> Remove
                              </button>
                            )}
                            {funShowReason && (
                              <button
                                onClick={() => { funShowReason(item); closeDropdown(); }}
                                className="w-full px-4 py-2 text-left text-sm text-blue-600 hover:bg-gray-50 flex items-center gap-3"
                              >
                                <FiInfo className="w-4 h-4" /> Show Reason
                              </button>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="block lg:hidden">
        <div className="flex flex-col gap-4">
          {rows.map((item, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-base font-semibold text-gray-900 break-words pr-4">
                  {item.title || item.name || "—"}
                </h3>
                <div className="relative">
                  <button
                    onClick={() => toggleDropdown(index + 1000)}
                    className="w-8 h-8 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center"
                  >
                    <FiMoreHorizontal className="w-4 h-4 text-gray-500" />
                  </button>
                  {openDropdown === index + 1000 && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={closeDropdown} />
                      <div className="absolute right-0 top-10 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                        <div className="py-1">
                          {funView && (
                            <button onClick={() => { funView(item); closeDropdown(); }} className="w-full px-4 py-2 text-left text-sm text-gray-900 hover:bg-gray-50 flex items-center gap-3">
                              <FiEye className="w-4 h-4" /> View
                            </button>
                          )}
                          {funApprove && (
                            <button onClick={() => { funApprove(item); closeDropdown(); }} className="w-full px-4 py-2 text-left text-sm text-gray-900 hover:bg-gray-50 flex items-center gap-3">
                              <FiCheck className="w-4 h-4" /> Approve
                            </button>
                          )}
                          {funReject && (
                            <button onClick={() => { funReject(item); closeDropdown(); }} className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50 flex items-center gap-3">
                              <FiX className="w-4 h-4" /> Reject
                            </button>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                {T_Head.map((column, colIndex) => {
                  const value = item[column];
                  const displayValue = truncateColumns.includes(String(column))
                    ? String(value || "").substring(0, 8)
                    : value ?? "—";
                  return (
                    <div key={colIndex} className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">
                        {headerDisplayNames[column] || String(column).replace(/([A-Z])/g, " $1").trim()}:
                      </span>
                      <span className="text-sm text-gray-900 font-medium break-words max-w-[200px]">
                        {displayValue}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {rows.length === 0 && (
        <div className="text-center py-12 text-gray-500 text-sm">No data available</div>
      )}
    </div>
  );
};

export default TableShared;
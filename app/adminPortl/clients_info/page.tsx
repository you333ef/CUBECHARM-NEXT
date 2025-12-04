"use client"
import React, { useState, useCallback, useEffect, Suspense } from "react";
import HeadlessDemo from "../sharedAdmin/DELETE_CONFIRM";
import Taple_Two from "../sharedAdmin/TAPLE_CLIENTS";
import ViewClient from "../sharedAdmin/VIEW_CLIENT";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";


// Student interface
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
    name: string;
  };
}

// Define props interface for Taple_Two
interface TableProps {
  data_Students: Student[];
  FunGetAll: () => void;
  funView: (item: Student) => void;
  funDelete: (item: Student) => void;
  funBlock: (item: Student) => void;
}

const CLIENTS_INFO: React.FC = () => {
  // هيترمي فيها fakeStudents كمان شوية 
  const [data_Students, setDataStudents] = useState<Student[]>([]);
  const [saveInput, setSaveInput] = useState<string>("");
  const [status_Confirm, setStatus_Confirm] = useState<boolean>(false);
  const [status_BlockConfirm, setStatus_BlockConfirm] = useState<boolean>(false);
  const [id_delete, setId_Delete] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [stateView, setStateView] = useState<boolean>(false);
  //  TO Save Item When Click To View
  const [save_info, setSave_info] = useState<Student | null>(null); 
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Generate fake data هتتشال لما يكون فيه API Real
  //  ال Use Callback تُعتبر آداة تثبيت دوال بين الريندرز 
  const setupFakeData = useCallback(() => {
    const fakeStudents: Student[] = Array.from({ length: 36 }, (_, index) => ({
      _id: `${index + 1}`,
      first_name: `Clients${index + 1}`,
      last_name: `Yousef${index + 1}`,
      email: `Client${index + 1}@example.com`,
      role: "User",
      // لو كان الاندكس لا يقبل القسمة علي 2 يعني رقم فردي هيكون INACTIVE 
      status: index % 2 === 0 ? "Active" : "Inactive",
      group: {
        // بتعمل التاريخ الحالي ناقص قيمة الاندكس و بعد كدة بتحول الرقم لاسترينج 
        createdAt: new Date(Date.now() - index * 86400000).toISOString(),
        students: new Array(Math.floor(Math.random() * 10) + 1),
        max_students: 10,
        status: index % 3 === 0 ? "Open" : "Closed",
        name: `Appartment ${index + 1}`,
      },
    }));
    
    setDataStudents(fakeStudents);
  }, []);

  // Load initial data
  useEffect(() => {
    setupFakeData();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setStateView(false);
        setStatus_Confirm(false);
        setStatus_BlockConfirm(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [setupFakeData]);

  // Filter students
  //  ال USe MEMO يتحافظ علي نتيجة الفانكشن 
  //  ال USE Callback بتحافظظ علي فانكشن 
  const filteredStudents = React.useMemo(() => {

    const normalized = saveInput.trim().toLowerCase();
    const result = normalized === ""
      ? data_Students
      : data_Students.filter((s) =>
          `${s.first_name ?? ""} ${s.last_name ?? ""}`.toLowerCase().includes(normalized)
        );
    return result;
  }, [data_Students, saveInput]);

  // Pagination
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle view action
  const funView = useCallback((item: Student) => {
    setStateView(true);
    setSave_info(item);
  }, []);

  // Handle delete action
  const funDelete = useCallback((item: Student) => {
    if (item?._id) {
      setStatus_Confirm(true);
      //  رمينا ال Id + Name في ال State علشان هنستعملهم تحت 
      setId_Delete(item._id);
      setName(item.first_name);
    }
  }, []);

  // Handle block action
  const funBlock = useCallback((item: Student) => {
    if (item?._id) {
      //  افتح الكونفيرم و ارميلي ال Id + First  Name فيها 
      setStatus_BlockConfirm(true);
      setId_Delete(item._id);
      setName(item.first_name);
    }
  }, []);

  // Confirm delete
  //  لما بأكد ان Ok احذف 
  const deleteTrue = useCallback(async () => {
    //  اقفل الكونفيرم و فلتر اللداتا الموجود نزل منها ال id 
    setStatus_Confirm(false);
    setDataStudents((prev) => prev.filter((s) => s._id !== id_delete));
  }, [id_delete]);

  // Confirm block
  //  لما بأكد ال Block 
  const blockTrue = useCallback(async () => {
    setStatus_BlockConfirm(false);
    //  بنحول ال Status  بدل مهوا Active أو Inactive لBlocked
    setDataStudents((prev) =>
      prev.map((s) =>
        s._id === id_delete ? { ...s, status: "Blocked" } : s
      )
    );
  }, [id_delete]);

  return (
    <div className="min-h-screen bg-[#ffffff] p-4">
      <div className="mb-4">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="flex items-center w-full md:w-2/3 lg:w-1/2 bg-[#ffffff] border border-[#e2e8f0] rounded shadow-sm overflow-hidden mx-auto justify-center mt-2.5">
            <input
              type="text"
              value={saveInput}
              //  اي تغيير في ال Input هنرميه في ال saveInput State
              onChange={(e) => setSaveInput(e.target.value)}
              placeholder="Search students..."
              className="w-full px-3 py-2 text-sm outline-none text-[#1f2937]"
            />
            <button
              type="button"
              className="px-4 py-2 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 text-white font-bold text-sm"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      <Suspense fallback={<div className="w-full h-64 bg-[#f3f4f6] animate-pulse" />}>
        <Taple_Two
          data_Students={paginatedStudents}
          funView={funView}
          funDelete={funDelete}
          funBlock={funBlock}
        />
      </Suspense>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-2 mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          <FiChevronLeft/>
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
         <FiChevronRight/>
        </button>
      </div>

      {status_Confirm && <HeadlessDemo DeleteTrue={deleteTrue} name={name} actionType="delete" />}
      {status_BlockConfirm && <HeadlessDemo DeleteTrue={blockTrue} name={name} actionType="block" />}
      
      {stateView && (
        <ViewClient stateView={stateView} setStateView={setStateView} user={save_info} />
      )}
    </div>
  );
};

export default CLIENTS_INFO;
"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  FaHome,
  FaUsers,
  FaCheckCircle,
  FaTimesCircle,
  FaFlag,
} from "react-icons/fa";
import { MdOutlineReportProblem } from "react-icons/md";


import { MdDashboard, MdAutoStories } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";
import ADMIN_Nav from "./componants/ADMIN_Nav";
import ADMIN_SIDEBAR, { MenuItem } from "./componants/ADMIN_SIDEPAR";
import ProtectedRootAdmin from "../providers/ProtectedrootAdmin";
// 1
interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  
  const [open, setOpen] = useState(false);
  const [menuItems, setMenu] = useState<MenuItem[]>([
    { name: "Dashboard", icon: <FaHome />, path: "/adminPortl", active: false },
       { name: "Management Story", icon: <FaHome />, path: "/adminPortl/StoriesManeg", active: false },
    { name: "Clients", icon: <FaUsers />, path: "/adminPortl/clients_info", active: false },
    { name: "Reports Properties", icon: <FaFlag />, path: "/adminPortl/reports", active: false },
    { name: "Reports Posts", icon: < MdOutlineReportProblem/>, path: "/adminPortl/reportsPosts", active: false },
    { name: "Logout", icon: <FiLogOut />, active: false },
  ]);

  const pathname = usePathname();

  useEffect(() => {
    setMenu((prev) =>
      prev.map((item) => ({
        ...item,
        active: item.path === pathname
      }))
    );
  }, [pathname]);
  return (
    <div className="flex flex-col min-h-screen">
      {/* 3 */}
      <ADMIN_Nav toggleSidebar={() => setOpen(!open)} />
      {/* 4*/}
      <div className="flex flex-1">
        {/*5 */}
        <ADMIN_SIDEBAR
          open={open}
          setOpen={setOpen}
          menuItems={menuItems}
          setMenu={setMenu}
        />
        {/* 6 */}
        <main className="flex-1 p-6 bg-gray-50 overflow-y-auto">
           {/* // <ProtectedRootAdmin> */}
              
               {children}
               {/* //</ProtectedRootAdmin> */}
         
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

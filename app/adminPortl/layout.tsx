"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FaHome,
  FaUsers,
  FaCheckCircle,
  FaTimesCircle,
  FaFlag,
} from "react-icons/fa";
import { MdDashboard, MdOutlinePendingActions, MdSettings } from "react-icons/md";
import ADMIN_Nav from "./componants/ADMIN_Nav";
import ADMIN_SIDEBAR, { MenuItem } from "./componants/ADMIN_SIDEPAR";
import ProtectedRootAdmin from "../providers/ProtectedrootAdmin";
// 1
interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  
  const [open, setOpen] = useState(false);
// 2
  const [menuItems, setMenu] = useState<MenuItem[]>([
    { name: "Dashboard", icon: <FaHome />, path: "/adminPortl", active: true },
    { name: "Clients", icon: <FaUsers />, path: "/adminPortl/clients_info" },
    { name: "CateOverview", icon: <MdDashboard />, path: "/adminPortl/cateoverview" },
     { name: "CateManegment", icon: <MdDashboard />, path: "/adminPortl/CategoriesManegment" },
    // {
    //   name: "Posts",
    //   icon: <MdOutlinePendingActions />,
    //   subItems: [
    //     { name: "Pending", icon: <MdOutlinePendingActions />, path: "/adminPortl/pending" },
    //     { name: "Approved", icon: <FaCheckCircle />, path: "/adminPortl/approved" },
    //     { name: "Rejected", icon: <FaTimesCircle />, path: "/adminPortl/rejected" },
    //   ],
    // },
    { name: "Reports", icon: <FaFlag />, path: "/adminPortl/reports" },
    { name: "Settings", icon: <MdSettings />, path: "/adminPortl/settings" },
  ]);

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
            <ProtectedRootAdmin> {children}</ProtectedRootAdmin>
         
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

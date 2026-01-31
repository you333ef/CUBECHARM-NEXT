"use client"
import AuthContext from "@/app/providers/AuthContext";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from "recharts";
const ADMIN_DASHBOARD = () => {
// 1
  const topCountries = [
    { name: "Egypt", value: 70 },
    { name: "Qatar", value: 20 },
    { name: "Turkey", value: 10 },
  ];
  const propertyCategories = [
    { name: "Villas", value: 50 },
    { name: "Houses", value: 20 },
    { name: "Palaces", value: 30 },
  ];
  const COLORS = ["#3b82f6", "#64748b", "#475569", "#1e293b", "#0f172a"];
// 2
  const [totalProperties, setTotalProperties] = useState<number | null>(null);
  const [monthlyProperties, setMonthlyProperties] = useState<number | null>(null);
const [monthlyGrowth, setMonthlyGrowth] = useState<number | null>(null);
const [currentMonth, setCurrentMonth] = useState<string>("");
const [totalVisitors, setTotalVisitors] = useState<number | null>(null);

 const stats = [
  { title: "Total Properties", value: totalProperties ?? "--", change: "User" },
  { title: "Property Listers", value: monthlyProperties ?? "--", change: currentMonth },
  { title: "Site Visitors", value: totalVisitors ?? "--", change: "Visitor" },
];

// 

  const auth = useContext(AuthContext)!;
  const { baseUrl } = auth;
 const accessToken =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  

async function getTotalProperties() {
  try {
    const response = await axios.get(
      baseUrl + "/admin/dashboard/total-properties",
      {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      }
    );

    return response.data.data.totalProperties;
  } catch (error) {
    console.log(error);
    return null;
  }
}

async function getMonthlyProperties() {
  try {
    const response = await axios.get(
      baseUrl + "/admin/dashboard/monthly-properties",
      {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      }
    );

    const data = response.data.data;

    return {
      month: data.month,
      propertiesCount: data.propertiesCount,
      percentageChange: data.percentageChange,
    };
  } catch (error) {
    console.log(error);
    return null;
  }
}
async function getVisitors() {
  try {
    const response = await axios.get(
      baseUrl + "/admin/dashboard/overview",
      {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      }
    );

    const visitorsTotal = response.data.data.visitors?.total;
    return visitorsTotal ?? null;
  } catch (error) {
    console.log("Visitors API error:", error);
    return null;
  }
}

useEffect(() => {
   if (!baseUrl) return;
  async function loadDashboardData() {
    // 1️-Total Properties
    const total = await getTotalProperties();
    setTotalProperties(total);

    // 2️- Monthly Properties + Growth + Month
    const monthlyResult = await getMonthlyProperties();

    if (monthlyResult) {
      setMonthlyProperties(monthlyResult.propertiesCount);
      setMonthlyGrowth(monthlyResult.percentageChange);
      setCurrentMonth(monthlyResult.month);
    }
        const visitors = await getVisitors();
    setTotalVisitors(visitors);

  }

  loadDashboardData();
}, [baseUrl]);



  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-semibold text-blue-500 mb-6">Dashboard</h1>
     {/* 3 */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-6 mb-8">
        {stats.map((item, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-md border border-gray-200 p-5 transition-all duration-200 hover:shadow-lg"
          >
            <p className="text-gray-500 text-sm font-medium uppercase tracking-wide mb-2">
              {item.title}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-blue-500">
                {item.value}
              </span>
              <span className="text-sm font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-md">
                {item.change}
              </span>
            </div>
          </div>
        ))}
      </div>
    {/* 4 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 overflow-x-hidden">    
        {/* 5 */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <div className="w-1 h-5 bg-blue-500 rounded-sm"></div>
            Property Categories
          </h2>
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={propertyCategories}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  outerRadius={110}
                  fill="#8884d8"
                  label
                >
                  {propertyCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "10px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      {/* 6 */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <div className="w-1 h-5 bg-gray-700 rounded-sm"></div>
            Top 3 Countries with Listings
          </h2>
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topCountries} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "10px",
                  }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {topCountries.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ADMIN_DASHBOARD;

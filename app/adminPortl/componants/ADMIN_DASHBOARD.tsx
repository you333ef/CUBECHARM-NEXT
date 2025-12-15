"use client"
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
  const stats = [
    { title: "Total Properties", value: 1000, change: "User" },
    { title: "Property Listers", value: "50%", change: "This month" },
    { title: "Site Visitors", value: "3999", change: "Visitor" },
  ];

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

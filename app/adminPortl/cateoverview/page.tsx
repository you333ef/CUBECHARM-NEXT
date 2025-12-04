"use client"
import  { useState, useMemo } from "react";
import TableShared from "../sharedAdmin/TableShared";
import { FiGrid } from "react-icons/fi";
import { useRouter } from "next/navigation";

// 1
interface MainCategoryRow {
  name: string; 
  numSubCategories: number; 
  totalPosts: number; 
  lastPostDate: string; 
  path: string;
}
// 2
const fakeMainCategories: MainCategoryRow[] = [
  {
    name: "Industry-Agnostic",
    numSubCategories: 4,
    totalPosts: 100,
    lastPostDate: "2025-10-15",
    path: "/userportal/categoryBar/industryagnostic",
  },
  {
    name: "Technology & Computing",
    numSubCategories: 7,
    totalPosts: 250,
    lastPostDate: "2025-09-20",
    path: "/userportal/categoryBar/technologycomputing",
  },
  {
    name: "Healthcare & Medical",
    numSubCategories: 5,
    totalPosts: 150,
    lastPostDate: "2025-11-01",
    path: "/userportal/categoryBar/healthcaremedical",
  },
  {
    name: "Manufacturing & Industrial",
    numSubCategories: 6,
    totalPosts: 180,
    lastPostDate: "No posts yet",
    path: "/userportal/categoryBar/manufacturingindustrial",
  },
  {
    name: "Retail & E-commerc",
    numSubCategories: 8,
    totalPosts: 220,
    lastPostDate: "2025-08-05",
    path: "/userportal/categoryBar/retailecommerce",
  },
  {
    name: "Food & Beverage",
    numSubCategories: 3,
    totalPosts: 90,
    lastPostDate: "2025-10-30",
    path: "/userportal/categoryBar/foodbeverage",
  },
  {
    name: "Automotive & Transportation",
    numSubCategories: 5,
    totalPosts: 130,
    lastPostDate: "2025-09-10",
    path: "/userportal/categoryBar/automotivetransportation",
  },
  {
    name: "Fashion & Appare",
    numSubCategories: 4,
    totalPosts: 110,
    lastPostDate: "No posts yet",
    path: "/userportal/categoryBar/fashionappare",
  },
  {
    name: "Construction Architecture",
    numSubCategories: 6,
    totalPosts: 160,
    lastPostDate: "2025-07-25",
    path: "/userportal/categoryBar/constructionarchitecture",
  },
  {
    name: "Energy & Environment",
    numSubCategories: 5,
    totalPosts: 140,
    lastPostDate: "2025-11-05",
    path: "/userportal/categoryBar/energyenvironment",
  },
  {
    name: "Education & Training",
    numSubCategories: 4,
    totalPosts: 120,
    lastPostDate: "2025-10-10",
    path: "/userportal/categoryBar/educationtraining",
  },
  {
    name: "Arts & Entertainment",
    numSubCategories: 7,
    totalPosts: 200,
    lastPostDate: "No posts yet",
    path: "/userportal/categoryBar/artsentertainment",
  },
  {
    name: "Travel & Hospitality",
    numSubCategories: 6,
    totalPosts: 170,
    lastPostDate: "2025-09-15",
    path: "/userportal/categoryBar/travelhospitality",
  },
  {
    name: "Agriculture",
    numSubCategories: 3,
    totalPosts: 80,
    lastPostDate: "2025-08-20",
    path: "/userportal/categoryBar/agriculture",
  },
  {
    name: "Government & Public Sector",
    numSubCategories: 5,
    totalPosts: 150,
    lastPostDate: "2025-11-10",
    path: "/userportal/categoryBar/governmentpublicsector",
  },
  {
    name: "Real Estate",
    numSubCategories: 4,
    totalPosts: 130,
    lastPostDate: "No posts yet",
    path: "/userportal/categoryBar/realestate",
  },
  {
    name: "Residential (Accommodations)",
    numSubCategories: 6,
    totalPosts: 190,
    lastPostDate: "2025-10-25",
    path: "/userportal/categoryBar/residentialaccommodations",
  },
  {
    name: "Healthcare &Facilities",
    numSubCategories: 5,
    totalPosts: 160,
    lastPostDate: "2025-09-30",
    path: "/userportal/categoryBar/healthcarefacilities",
  },
  {
    name: "Educational Institutions",
    numSubCategories: 4,
    totalPosts: 110,
    lastPostDate: "2025-07-15",
    path: "/userportal/categoryBar/educationalinstitutions",
  },
  {
    name: "Transportation Hubs",
    numSubCategories: 5,
    totalPosts: 140,
    lastPostDate: "No posts yet",
    path: "/userportal/categoryBar/transportationhubs",
  },
  {
    name: "Shopping Venues",
    numSubCategories: 7,
    totalPosts: 210,
    lastPostDate: "2025-11-15",
    path: "/userportal/categoryBar/shoppingvenues",
  },
  {
    name: "Restaurants & Cafés",
    numSubCategories: 3,
    totalPosts: 100,
    lastPostDate: "2025-10-05",
    path: "/userportal/categoryBar/restaurantscafes",
  },
  {
    name: "Entertainment & Events",
    numSubCategories: 6,
    totalPosts: 180,
    lastPostDate: "No posts yet",
    path: "/userportal/categoryBar/entertainmentevents",
  },
  {
    name: "Sports & Fitness",
    numSubCategories: 4,
    totalPosts: 120,
    lastPostDate: "2025-09-25",
    path: "/userportal/categoryBar/sportsfitness",
  },
  {
    name: "Tourism & Heritage",
    numSubCategories: 5,
    totalPosts: 150,
    lastPostDate: "2025-08-10",
    path: "/userportal/categoryBar/tourismheritage",
  },
  {
    name: "Culture&Arts",
    numSubCategories: 7,
    totalPosts: 200,
    lastPostDate: "2025-11-20",
    path: "/userportal/categoryBar/culturearts",
  },
  {
    name: "Religious Sites",
    numSubCategories: 3,
    totalPosts: 90,
    lastPostDate: "No posts yet",
    path: "/userportal/categoryBar/religioussites",
  },
  {
    name: "Nature & Outdoors",
    numSubCategories: 5,
    totalPosts: 130,
    lastPostDate: "2025-10-20",
    path: "/userportal/categoryBar/natureoutdoors",
  },
  {
    name: "Daily Services",
    numSubCategories: 4,
    totalPosts: 110,
    lastPostDate: "2025-09-05",
    path: "/userportal/categoryBar/dailyservices",
  },
  {
    name: "Emergency & Relief",
    numSubCategories: 6,
    totalPosts: 170,
    lastPostDate: "2025-11-18",
    path: "/userportal/categoryBar/emergencyrelief",
  },
];


const CategoryOverview = () => {
  const navigate =useRouter()// 3
  const [sortOrder, setSortOrder] = useState<"latest" | "oldest">("latest"); 

  // 4
  const sortedData: MainCategoryRow[] = useMemo(() => {
    return [...fakeMainCategories].sort((a, b) => {
      if (sortOrder === "latest") {
        if (a.lastPostDate === "No posts yet") return 1; 
        if (b.lastPostDate === "No posts yet") return -1; 
        return new Date(b.lastPostDate).getTime() - new Date(a.lastPostDate).getTime(); 
      } else {
        if (a.lastPostDate === "No posts yet") return -1;
        if (b.lastPostDate === "No posts yet") return 1;
        return new Date(a.lastPostDate).getTime() - new Date(b.lastPostDate).getTime(); 
      }
    });
  }, [sortOrder]); // 5

  const headers: (keyof MainCategoryRow)[] = ["name", "numSubCategories", "totalPosts", "lastPostDate"]; // table headers

  return (
    <div className="p-6">
      {/* 6 */}
      <div className="flex items-center justify-center mb-8">
        <h1 className="text-2xl font-semibold flex items-center gap-2 text-gray-800">
          <FiGrid className="text-black text-3xl" />
          Category Overview
        </h1>
      </div>

      {/* 7 */}
      <div className="flex justify-end mb-6">
        <select
          value={sortOrder} // 8
          onChange={(e) => setSortOrder(e.target.value as "latest" | "oldest")} //9
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        >
          <option value="latest">Latest Post First</option>
          <option value="oldest">Oldest Post First</option>
        </select>
      </div>

      {/* table  */}
      <TableShared
        rows={sortedData} 
        T_Head={headers} 
        funView={(item: MainCategoryRow) => navigate.push(item.path)} // 10
        headerDisplayNames={{
          name: "Main Category", 
          numSubCategories: "Num Categories",
          totalPosts: "Num Posts", 
          lastPostDate: "Last Post", 
        }}
      />
    </div>
  );
};

export default CategoryOverview; // export component
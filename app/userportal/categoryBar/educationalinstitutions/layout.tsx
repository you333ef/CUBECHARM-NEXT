"use client";

import { useRouter, usePathname } from "next/navigation";

export default function Layout({ children }:any) {
  const router = useRouter();
  const pathname = usePathname();
  const BASE_PATH = "/userportal/categoryBar";


  const categories = [
    { name: "Public University", path: `${BASE_PATH}/PublicUniversity` },
    { name: "Private University", path: `${BASE_PATH}/PrivateUniversity` },
    { name: "Community College", path: `${BASE_PATH}/CommunityCollege` },
    { name: "Public HighSchool", path: `${BASE_PATH}/PublicHighSchool` },
    { name: "International HighSchool", path: `${BASE_PATH}/educationalinstitutions` },
    { name: "Elementary School", path: `${BASE_PATH}/ElementarySchool` },
    { name: "Kindergarten", path: `${BASE_PATH}/Kindergarten` },
    { name: "Nursery School", path: `${BASE_PATH}/NurserySchool` },
    { name: "Language Institute", path: `${BASE_PATH}/LanguageInstitute` },
    { name: "Coding Center", path: `${BASE_PATH}/CodingCenter` },
    { name: "Music Conservatory", path: `${BASE_PATH}/MusicConservatory` },
    { name: "Art Studio", path: `${BASE_PATH}/ArtStudio` },
    { name: "Online Hub", path: `${BASE_PATH}/OnlineHub` },
    { name: "Chemistry Lab", path: `${BASE_PATH}/ChemistryLab` },
    { name: "Physics Lab", path: `${BASE_PATH}/PhysicsLab` },
    { name: "Public Library", path: `${BASE_PATH}/PublicLibrary` },
    { name: "University Library", path: `${BASE_PATH}/UniversityLibrary` },
    { name: "Research Center", path: `${BASE_PATH}/ResearchCenter` },
    { name: "Vocational School", path: `${BASE_PATH}/VocationalSchool` },
    { name: "Technical Center", path: `${BASE_PATH}/TechnicalCenter` },
  ];



  const isActive = (path:any) => pathname === path;

  return (
    <div className="w-full">
      {/* Categories Bar */}
      <div className="w-full mt-10 py-4">
        <div className="flex flex-row gap-3 overflow-x-auto scrollbar-hide px-4 pb-2">
          {categories.map((cat, index) => (
            <button
              key={cat.name}
              onClick={() => router.push(cat.path)}
              style={{ animationDelay: `${index * 50}ms` }}
              className={`
                group
                flex items-center justify-center
                px-5 py-2.5
                rounded-full
                cursor-pointer
                transition-all duration-300 ease-out
                text-sm font-medium
                whitespace-nowrap
                animate-fade-in
                outline-none
                focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
                ${
                  isActive(cat.path)
                    ? "bg-[#D0E7FF] text-[#0B63C5]"
                    : "bg-[#F2F2F2] text-[#555] hover:bg-[#E5E5E5] hover:text-[#222]"
                }
              `}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Outlet → children */}
      <div className="px-4 mt-4">
        {children}
      </div>
    </div>
  );
}

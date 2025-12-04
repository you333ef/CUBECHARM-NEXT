"use client";

import { useRouter, usePathname } from "next/navigation";

export default function Layout({ children }:any) {
  const router = useRouter();
  const pathname = usePathname();
  const BASE_PATH = "/userportal/categoryBar";


  const categories= [
    { name: "Opera House", path: `${BASE_PATH}/OperaHouse` },
    { name: "Experimental Theater", path: `${BASE_PATH}/ExperimentalTheater` },
    { name: "Fine Arts Museum", path: `${BASE_PATH}/FineArtsMuseum` },
    { name: "Cinema Museum", path: `${BASE_PATH}/CinemaMuseum` },
    { name: "Historic Library", path: `${BASE_PATH}/HistoricLibrary` },
    { name: "Music Hall", path: `${BASE_PATH}/MusicHall` },
    { name: "Sculpture Exhibit", path: `${BASE_PATH}/SculptureExhibit` },
    { name: "Cultural Center", path: `${BASE_PATH}/CulturalCenter` },
    { name: "Art Workshop", path: `${BASE_PATH}/ArtWorkshop` },
    { name: "Poetry Venue", path: `${BASE_PATH}/PoetryVenue` },
    { name: "Photo Gallery", path: `${BASE_PATH}/PhotoGallery` },
    { name: "Music Education", path: `${BASE_PATH}/MusicEducation` },
    { name: "Children Museum", path: `${BASE_PATH}/ChildrenMuseum` },
    { name: "Heritage Hub", path: `${BASE_PATH}/HeritageHub` },
    { name: "Lecture Hall", path: `${BASE_PATH}/LectureHall` },
    { name: "Academic Library", path: `${BASE_PATH}/AcademicLibrary` },
    { name: "Book Fair", path: `${BASE_PATH}/BookFair` },
    { name: "Research Institute", path: `${BASE_PATH}/ResearchInstitute` },
    { name: "Digital Art Museum", path: `${BASE_PATH}/DigitalArtMuseum` },
    { name: "Street Art Zone", path: `${BASE_PATH}/StreetArtZone` },
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

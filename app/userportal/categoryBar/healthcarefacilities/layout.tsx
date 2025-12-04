"use client";

import { useRouter, usePathname } from "next/navigation";

export default function Layout({ children }:any) {
  const router = useRouter();
  const pathname = usePathname();
  const BASE_PATH = "/userportal/categoryBar";


  const categories= [
  { name: "General Hospital", path: `${BASE_PATH}/GeneralHospital` },
  { name: "Specialty Hospital", path: `${BASE_PATH}/SpecialtyHospital` },
  { name: "Dental Clinic", path: `${BASE_PATH}/DentalClinic` },
  { name: "Dermatology Clinic", path: `${BASE_PATH}/DermatologyClinic` },
  { name: "Maternity Clinic", path: `${BASE_PATH}/healthcarefacilities` },
  { name: "Eye Clinic", path: `${BASE_PATH}/OphthalmologyClinic` },
  { name: "Pediatric Clinic", path: `${BASE_PATH}/PediatricClinic` },
  { name: "Emergency Center", path: `${BASE_PATH}/EmergencyCenter24_7` },
  { name: "Blood Lab", path: `${BASE_PATH}/BloodTestingLab` },
  { name: "Urine Lab", path: `${BASE_PATH}/UrineTestingLab` },
  { name: "X-Ray Center", path: `${BASE_PATH}/XRayImagingCenter` },
  { name: "MRI Center", path: `${BASE_PATH}/MRICenter` },
  { name: "Day Pharmacy", path: `${BASE_PATH}/DayPharmacy` },
  { name: "Night Pharmacy", path: `${BASE_PATH}/NightPharmacy` },
  { name: "Physiotherapy", path: `${BASE_PATH}/PhysiotherapyCenter` },
  { name: "Rehab Center", path: `${BASE_PATH}/RehabilitationCenter` },
  { name: "Cupping Center", path: `${BASE_PATH}/CuppingTherapyCenter` },
  { name: "Massage Center", path: `${BASE_PATH}/MassageCenter` },
  { name: "Chinese Clinic", path: `${BASE_PATH}/ChineseMedicineClinic` },
  { name: "Nutrition Center", path: `${BASE_PATH}/ClinicalNutritionCenter` },
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

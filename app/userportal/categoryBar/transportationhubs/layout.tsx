"use client";

import { useRouter, usePathname } from "next/navigation";

export default function Layout({ children }:any) {
  const router = useRouter();
  const pathname = usePathname();
  const BASE_PATH = "/userportal/categoryBar";


    const categories= [
    { name: "International Airport", path: `${BASE_PATH}/InternationalAirport` },
    { name: "Domestic Airport", path: `${BASE_PATH}/DomesticAirport` },
    { name: "High-speed Rail", path: `${BASE_PATH}/HighSpeedRail` },
    { name: "Train Station", path: `${BASE_PATH}/TrainStation` },
    { name: "Metro Station", path: `${BASE_PATH}/MetroStation` },
    { name: "Tram Station", path: `${BASE_PATH}/TramStation` },
    { name: "Seaport", path: `${BASE_PATH}/Seaport` },
    { name: "River Port", path: `${BASE_PATH}/RiverPort` },
    { name: "Bus Terminal", path: `${BASE_PATH}/BusTerminal` },
    { name: "Taxi Stand", path: `${BASE_PATH}/TaxiStand` },
    { name: "Gas Station", path: `${BASE_PATH}/GasStation` },
    { name: "EV Charging", path: `${BASE_PATH}/EVCharging` },
    { name: "Car Rental", path: `${BASE_PATH}/CarRental` },
    { name: "Bicycle Rental", path: `${BASE_PATH}/BicycleRental` },
    { name: "Helicopter Pad", path: `${BASE_PATH}/HelicopterPad` },
    { name: "Cable Car", path: `${BASE_PATH}/CableCar` },
    { name: "E-scooter Zone", path: `${BASE_PATH}/EScooterZone` },
    { name: "Aircraft Maintenance", path: `${BASE_PATH}/AircraftMaintenance` },
    { name: "Train Maintenance", path: `${BASE_PATH}/TrainMaintenance` },
    { name: "Ticket Office", path: `${BASE_PATH}/TicketOffice` },
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

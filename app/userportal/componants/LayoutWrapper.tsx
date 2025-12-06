"use client";

import { usePathname } from "next/navigation";
import TopNavbar from "../../userportal/componants/shared/TopNav";
import BottomNavbar from "../componants/shared/DownNav";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideNavbar = pathname.includes("Premieum_Plane");
  const isMessages = pathname.includes("messaes");
   const isproMode = pathname.includes("proMode");
    const readmore = pathname.includes("readmore");
   


  
    if (isMessages || isproMode || readmore) {
    return <>{children}</>;
  }



  return (
    <>
      {!hideNavbar && <TopNavbar />}
      <main className="pt-5 pb-5 px-4">
        <div className="container mx-auto max-w-6xl">{children}</div>
      </main>
      {!hideNavbar && <BottomNavbar/>}
     
     
    </>
  );
}

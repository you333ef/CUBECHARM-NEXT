"use client";

import { ReactNode, Suspense } from "react";
import Left_Auth from "./Left_Auth";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="w-full flex flex-wrap min-h-screen">

      <div className="hidden lg:block lg:w-1/2 bg-red-300">
        <Left_Auth />
      </div>

    
      <Suspense fallback={<div>Loading...</div>}>
        <div className="w-full lg:w-1/2 overflow-auto flex items-center justify-center p-6">
          {children}
        </div>
      </Suspense>

    </div>
  );
}
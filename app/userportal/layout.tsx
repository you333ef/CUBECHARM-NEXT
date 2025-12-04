"use client";

import ProtectedRoute from "../providers/ProtectedRoute";
import LayoutWrapper from "./componants/LayoutWrapper";

export default function UserPortalLayout({ children }: any) {
  return (
    <LayoutWrapper>
      <ProtectedRoute guestAllowed>
        {children}
      </ProtectedRoute>
    </LayoutWrapper>
  );
}

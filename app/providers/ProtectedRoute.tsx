"use client";

import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuthContext from "./AuthContext";
import { toast } from "sonner";

type Props = {
  children: React.ReactNode;
  guestAllowed?: boolean;
  userOnly?: boolean;
  adminOnly?: boolean;
};

export default function ProtectedRoute({
  children,
  guestAllowed = false,
  userOnly = false,
  adminOnly = false,
}: Props) {
  const { role ,isAuthLoading } = useContext(AuthContext)!;
 
  const router = useRouter();

  const [authorized, setAuthorized] = useState(false);

 useEffect(() => {
  if (isAuthLoading) return;

  if (guestAllowed) {
    setAuthorized(true);
    return;
  }

  if (!role) {
    router.replace("/providers/UnAuthorized");
    return;
  }

  if (userOnly && role !== "User" && role !== "admin") {
    router.replace("/providers/UnAuthorized");
    return;
  }

  if (adminOnly && role !== "admin") {
    router.replace("/providers/UnAuthorized");
    return;
  }

  setAuthorized(true);
}, [role, isAuthLoading, guestAllowed, userOnly, adminOnly, router]);

 if (isAuthLoading) return null;
  if (!authorized) return null;

  return <>{children}</>;
}

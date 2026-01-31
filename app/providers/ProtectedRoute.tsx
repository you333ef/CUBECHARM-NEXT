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
  const { role } = useContext(AuthContext)!;
  const router = useRouter();

  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // allow guest
    if (guestAllowed) {
      setAuthorized(true);
      return;
    }

    // no role → guest
    if (!role) {
      toast("Not Authorized");
      router.replace("/providers/UnAuthorized");
      return;
    }

    // user-only
    if (userOnly && role !== "User" && role !== "admin") {
      toast("Not Authorized");
      router.replace("/providers/UnAuthorized");
      return;
    }

    // admin-only
    if (adminOnly && role !== "admin") {
      toast("Not Authorized");
      router.replace("/providers/UnAuthorized");
      return;
    }

    // passed all checks
    setAuthorized(true);
  }, [role, guestAllowed, userOnly, adminOnly, router]);

  if (!authorized) return null;

  return <>{children}</>;
}

"use client";

import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthContext from "./AuthContext";
import { toast } from "sonner";

// admin-protect
export default function ProtectedRootAdmin({ children }: { children: React.ReactNode }) {
  const { role } = useContext(AuthContext)!;
  const router = useRouter();

  // check-admin
  useEffect(() => {
    if (role !== "admin") {
      toast("Not Authorized");
      router.replace("/providers/UnAuthorized"); // go-unauth
    }
  }, [role, router]);

  // no-access
  if (role !== "admin") return null;

  // allowed
  return <>{children}</>;
}

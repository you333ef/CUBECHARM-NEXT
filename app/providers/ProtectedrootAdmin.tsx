"use client";

import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuthContext from "./AuthContext";

export default function ProtectedRootAdmin({
  children,
}: {
  children: React.ReactNode;
}) {
  const { role, isAuthLoading } = useContext(AuthContext)!;
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    if (isAuthLoading) return;

    if (role !== "admin") {
      router.replace("/providers/UnAuthorized");
      return;
    }

    setAllowed(true);
  }, [role, isAuthLoading, router]);

  if (isAuthLoading || !allowed) return null;

  return <>{children}</>;
}
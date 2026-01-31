"use client";

import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import AuthContext from "@/app/providers/AuthContext";

export default function GoogleCallbackPage() {
  const router = useRouter();
  const auth = useContext(AuthContext)!;
  const { baseUrl } = auth;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (!code) {
      if (window.opener) {
        window.opener.postMessage(
          { type: "GOOGLE_LOGIN_FAILED" },
          window.location.origin
        );
        window.close();
      }
      return;
    }

    const loginWithGoogle = async () => {
      try {
        const response = await axios.post(
          baseUrl + "/Auth/google",
          { code },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const { accessToken } = response.data;

        localStorage.setItem("accessToken", accessToken);

        if (window.opener) {
          window.opener.postMessage(
            { type: "GOOGLE_LOGIN_SUCCESS" },
            window.location.origin
          );
          window.close();
        } else {
          toast.success("Logged in with Google successfully ");
          router.replace("/");
        }
      } catch (error) {
        console.error("Google login error:", error);

        if (window.opener) {
          window.opener.postMessage(
            { type: "GOOGLE_LOGIN_FAILED" },
            window.location.origin
          );
          window.close();
        } else {
          toast.error("Google login failed. Please try again.");
          router.replace("/AuthLayout/Login");
        }
      }
    };

    loginWithGoogle();
  }, [router, baseUrl]);

  return (
    <div className="flex h-screen items-center justify-center">
      <p className="text-gray-600 text-sm">
        Logging you in with Google…
      </p>
    </div>
  );
}

"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import AuthContext from "@/app/providers/AuthContext";
import { toast } from "sonner";

type VerifyForm = {
  email: string;
  otp: string;
  terms: boolean;
};

export default function VerifyPage() {
  const router = useRouter();
  const { baseUrl } = useContext(AuthContext)!;
  const [isResending, setIsResending] = useState(false);

  const { register, handleSubmit, formState: { errors }, watch } = useForm<VerifyForm>();

  const onSubmit = async (data: VerifyForm) => {
    try {
      const res = await fetch(`${baseUrl}/Auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email, otp: data.otp }),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        localStorage.setItem("resetToken", result.accessToken);
        toast.success("Verification successful");
        router.push("/AuthLayout/Login");
      } else {
        if (Array.isArray(result.errors)) {
          result.errors.forEach((err: string) => toast.error(err));
        } else {
          toast.error(result.message || "Verification failed");
        }
      }
    } catch (error) {
      toast.error("Network error, please try again");
      console.error("OTP verification error:", error);
    }
  };

  const resendCode = async () => {
    setIsResending(true);
    try {
      const email = watch("email");
      if (!email) {
        toast.error("Enter your email first");
        setIsResending(false);
        return;
      }

      const res = await fetch(`${baseUrl}/Auth/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        toast.success("OTP resent successfully");
      } else {
        toast.error(result.message || "Resend failed");
      }
    } catch (error) {
      toast.error("Network error, please try again");
      console.error("Resend OTP error:", error);
    } finally {
      setIsResending(false);
    }
  };

  const goToLogin = () => router.push("/AuthLayout/Login");

  return (
    <div className="flex justify-center items-center h-screen bg-[#FFFFFF] p-3">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl px-6 py-6">
        <div className="flex justify-center mb-5">
          <h2 className="text-2xl font-extrabold text-[#111827] tracking-tight">
            CUBECHARM
          </h2>
        </div>

        <p className="text-center text-[#6B7280] text-sm mb-5">
          Verify your account to access CUBECHARM.
        </p>

        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-200" />
          <span className="px-3 text-xs text-gray-400">OTP VERIFICATION</span>
          <div className="flex-grow border-t border-gray-200" />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <input
              type="email"
              placeholder="Email address"
              {...register("email", {
                required: "Email is required",
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email format" },
              })}
              className="w-full rounded-lg border border-[#E5E7EB] p-3 text-sm focus:ring-2 focus:ring-[#4B3CF5] focus:outline-none"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <input
              type="text"
              placeholder=""
              maxLength={6}
              {...register("otp", {
                required: "OTP required",
                minLength: { value: 6, message: "Must be 6 digits" },
                maxLength: { value: 6, message: "Must be 6 digits" },
                pattern: { value: /^[0-9]+$/, message: "Numbers only" },
              })}
              className="w-full rounded-lg border border-[#E5E7EB] p-1 text-2xl font-bold text-center tracking-widest focus:ring-2 focus:ring-[#4B3CF5] focus:outline-none"
            />
            {errors.otp && <p className="text-red-500 text-xs text-center mt-2">{errors.otp.message}</p>}
          </div>

          <p
            className="text-blue-500 cursor-pointer text-center font-medium"
            onClick={resendCode}
          >
            {isResending ? "Resending..." : "Resend Code"}
          </p>

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-[#4B3CF5] hover:bg-[#362BBD] text-white font-semibold transition transform hover:scale-105"
          >
            Confirm
          </button>
        </form>

        <p className="text-center text-sm text-[#6B7280] mt-6">
          Return to login?{" "}
          <button onClick={goToLogin} className="text-[#4B3CF5] font-medium hover:underline">
            Login
          </button>
        </p>
      </div>
    </div>
  );
}

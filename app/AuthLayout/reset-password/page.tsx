"use client";

import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { useContext } from "react";
import AuthContext from "@/app/providers/AuthContext";
import { toast } from "sonner";
import api from "../refresh";
import axios from "axios";

type FormData = {
  newPassword: string;
  confirmNewPassword: string;
};

export default function ResetPasswordForm() {
  const { baseUrl } = useContext(AuthContext)!;
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>();

  const newPassword = watch("newPassword");

  if (!token || !email) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 text-lg">
          Invalid or expired reset link
        </p>
      </div>
    );
  }

  const onSubmit = async (data: FormData) => {
    try {
      const response = await api.post("/Auth/reset-password", {
        token,
        email,
        newPassword: data.newPassword,
        confirmNewPassword: data.confirmNewPassword,
      });

      const result = response.data;

      if (result.success) {
        toast.success("Password reset successfully");
        router.push("/AuthLayout/Login");
      } else {
        if (result.errors && Array.isArray(result.errors)) {
          result.errors.forEach((err: string) => toast.error(err));
        } else if (result.message) {
          toast.error(result.message);
        } else {
          toast.error("Reset password failed");
        }
      }
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        const msg =
          error.response?.data?.message ||
          (error.response?.data?.errors && error.response.data.errors[0]) ||
          "Network error, please try again";
        toast.error(msg);
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Unexpected error occurred");
      }
      console.error("Reset password error:", error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-[#FFFFFF] p-3">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl px-6 py-6 mx-auto">
        <div className="flex items-center justify-center mb-5">
          <h2 className="text-2xl font-extrabold text-[#111827] tracking-tight">
            CUBECHARM
          </h2>
        </div>

        <div className="text-center mb-5">
          <p className="text-[#6B7280] text-sm">
            Reset your password to access CUBECHARM.
          </p>
        </div>

        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="px-2 text-xs text-gray-400">Reset Password</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <input
              type="email"
              value={email}
              readOnly
              className="w-full rounded-lg border border-[#E5E7EB] p-3 text-sm bg-gray-100 text-gray-500"
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="New Password"
              {...register("newPassword", {
                required: "New password is required",
                minLength: { value: 6, message: "Password must be at least 6 characters" },
              })}
              className="w-full rounded-lg border border-[#E5E7EB] p-3 text-sm focus:ring-2 focus:ring-[#4B3CF5] focus:outline-none"
            />
            {errors.newPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.newPassword.message}</p>
            )}
          </div>

          <div>
            <input
              type="password"
              placeholder="Confirm New Password"
              {...register("confirmNewPassword", {
                required: "Confirm password is required",
                validate: (value) =>
                  value === newPassword || "Passwords do not match",
              })}
              className="w-full rounded-lg border border-[#E5E7EB] p-3 text-sm focus:ring-2 focus:ring-[#4B3CF5] focus:outline-none"
            />
            {errors.confirmNewPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.confirmNewPassword.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg text-white font-semibold shadow-md transition duration-300 bg-[#4B3CF5] hover:bg-[#362BBD] transform hover:scale-105"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}
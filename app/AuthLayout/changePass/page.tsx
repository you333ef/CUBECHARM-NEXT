"use client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import AuthContext from "@/app/providers/AuthContext";
import { toast } from "sonner";

const ChangePass = () => {
  const { baseUrl } = useContext(AuthContext)!;

  const user = {
    id: "12345",
    name: "Youssef",
    email: "yusuf@example.com",
  };
  const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const newPassword = watch("newPassword");
  const router = useRouter();

  const onSubmit = async (data: any) => {
    try {
      const res = await fetch(`${baseUrl}/Auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          userId: user.id,
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        }),
      });

      const text = await res.text();
      const result = text ? JSON.parse(text) : null;

      if (res.ok && result?.success) {
        toast.success("Password changed successfully");
        router.push("/AuthLayout/Login");
      } else {
        if (Array.isArray(result?.errors)) {
          result.errors.forEach((err: string) => toast.error(err));
        } else {
          toast.error(result?.message || "Change password failed");
        }
      }
    } catch (error) {
      toast.error("Network error, please try again");
      console.error(error);
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
            change your password to access cubecharm .
          </p>
        </div>

        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="px-2 text-xs text-gray-400">change Password</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <input
              type="password"
              placeholder="Current Password"
              {...register("currentPassword", {
                required: "Current password is required",
              })}
              className="w-full rounded-lg border border-[#E5E7EB] p-3 text-sm focus:ring-2 focus:ring-[#4B3CF5] focus:outline-none"
            />
            {errors.currentPassword && (
              <p className="text-red-500 text-xs mt-1">
                {errors.currentPassword.message as string}
              </p>
            )}
          </div>

          <div>
            <input
              type="password"
              placeholder="New Password"
              {...register("newPassword", {
                required: "New password is required",
                minLength: { value: 6, message: "New password must be at least 6 chars" },
              })}
              className="w-full rounded-lg border border-[#E5E7EB] p-3 text-sm focus:ring-2 focus:ring-[#4B3CF5] focus:outline-none"
            />
            {errors.newPassword && (
              <p className="text-red-500 text-xs mt-1">
                {errors.newPassword.message as string}
              </p>
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
              <p className="text-red-500 text-xs mt-1">
                {errors.confirmNewPassword.message as string}
              </p>
            )}
          </div>

          <div className="flex items-center text-sm">
            <input
              type="checkbox"
              className="mr-2"
              {...register("terms", { required: "You must agree" })}
            />
            <span className="text-[#111827]">
              I agree the{" "}
              <a href="#" className="text-[#4B3CF5] font-medium">Terms</a> and{" "}
              <a href="#" className="text-[#4B3CF5] font-medium">Privacy</a>
            </span>
          </div>

          {errors.terms && (
            <p className="text-red-500 text-xs mt-1">
              {errors.terms.message as string}
            </p>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-lg text-white font-semibold shadow-md transition duration-300 bg-[#4B3CF5] hover:bg-[#362BBD]"
          >
            change Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePass;

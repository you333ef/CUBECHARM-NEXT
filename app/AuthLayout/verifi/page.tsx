"use client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation"
// 1
type VerifyForm = {
  otp: string;
  terms: boolean;
};
export default function VerifyPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyForm>();
  // 2
  const onSubmit = async (data: VerifyForm) => {
    console.log("OTP submitted ", data.otp);

  };

// 3
  const goToLogin = () => router.push("/AuthLayout/Login");

  return (
    <div className="flex justify-center items-center h-screen bg-[#FFFFFF] p-3">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl px-6 py-6">
{/* 4 */}
        
        <div className="flex justify-center mb-5">
          <h2 className="text-2xl font-extrabold text-[#111827] tracking-tight">
            CUBECHARM
          </h2>
        </div>

       {/* 5 */}
        <p className="text-center text-[#6B7280] text-sm mb-5">
          Verify your account to access CUBECHARM.
        </p>

       
        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-200" />
          <span className="px-3 text-xs text-gray-400">OTP VERIFICATION</span>
          <div className="flex-grow border-t border-gray-200" />
        </div>   
        {/* 6 */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* 7 */}
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
          <label className="flex items-center text-sm">
            <input
              type="checkbox"
              className="mr-2"
              {...register("terms", { required: "You must agree" })}
            />
            <span className="text-[#111827]">
              I agree to the{" "}
              <a href="#" className="text-[#4B3CF5] font-medium">Terms</a> and{" "}
              <a href="#" className="text-[#4B3CF5] font-medium">Privacy</a>
            </span>
          </label>
          {/* 8 */}
          {errors.terms && <p className="text-red-500 text-xs">{errors.terms.message}</p>}
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-[#4B3CF5] hover:bg-[#362BBD] text-white font-semibold transition transform hover:scale-105"
          >
            Confirm
          </button>
        </form>
        {/* 9 */}
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
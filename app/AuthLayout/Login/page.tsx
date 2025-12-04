
"use client"; 

import { useForm } from "react-hook-form";
import { FaGoogle } from "react-icons/fa";
import { useRouter } from "next/navigation"; 

// 1
type FormData = {
  email: string;
  password: string;
  terms: boolean;
};

export default function LoginPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>();

  const password = watch("password");

  //  2
  const onSubmit = async (data: FormData) => {
    console.log("Login payload ", data);
    
  };

  // 3 
  const goToForget = () => router.push("/AuthLayout/forget");

  return (
    <div className="flex justify-center items-center h-screen bg-[#FFFFFF] p-3">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl px-6 py-6">

       {/*  4 */}
        <div className="flex items-center justify-center mb-5">
          <h2 className="text-2xl font-extrabold text-[#111827] tracking-tight">
            CUBECHARM
          </h2>
        </div>

        {/* 5 */}
        <p className="text-center text-[#6B7280] text-sm mb-5">
          Log in to CUBECHARM and access your properties
        </p>

        {/*6*/}
        <button className="w-full flex items-center justify-center border border-[#E5E7EB] rounded-lg py-3 text-sm font-medium text-[#111827] hover:bg-gray-50 transition mb-5">
          <FaGoogle className="w-5 h-5 mr-2" />
          Continue with Google
        </button>

        {/* 7 */}
        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-200" />
          <span className="px-3 text-xs text-gray-400">OR LOGIN WITH EMAIL</span>
          <div className="flex-grow border-t border-gray-200" />
        </div>

        {/* 8 */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          {/* 9  */}
          <div>
            <input
              type="email"
              placeholder="Email address"
              {...register("email", { required: "Email required" })}
              className="w-full rounded-lg border border-[#E5E7EB] p-3 text-sm focus:ring-2 focus:ring-[#4B3CF5] focus:outline-none"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          {/* 10  */}
          <div>
            <input
              type="password"
              placeholder="Password"
              {...register("password", {
                required: "Password required",
                minLength: { value: 6, message: "Min 6 characters" },
              })}
              className="w-full rounded-lg border border-[#E5E7EB] p-3 text-sm focus:ring-2 focus:ring-[#4B3CF5] focus:outline-none"
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          {/*  11 */}
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
          {errors.terms && <p className="text-red-500 text-xs">{errors.terms.message}</p>}

          {/* 12 */}
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-[#4B3CF5] hover:bg-[#362BBD] text-white font-semibold transition transform hover:scale-105"
          >
            Login
          </button>
        </form>

        {/* 13 */}
        <p className="text-center text-sm text-[#6B7280] mt-6">
          Forgot your password?{" "}
          <button onClick={goToForget} className="text-[#4B3CF5] font-medium hover:underline">
            Click Here
          </button>
        </p>
      </div>
    </div>
  );
}
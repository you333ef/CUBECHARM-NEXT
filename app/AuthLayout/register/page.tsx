
"use client";
import { useForm } from "react-hook-form";
import { FaGoogle } from "react-icons/fa6";
import { useRouter } from "next/navigation";

// 1
type RegisterForm = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
};

export default function RegisterPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterForm>();

  const password = watch("password");

  // 2
  const onSubmit = async (data: RegisterForm) => {
    console.log("Register payload →", data);
   
  };

  // 3
  const goToLogin = () => router.push("/AuthLayout/Login");

  return (
    <div className="min-h-screen bg-[#FFFFFF] p-3 overflow-y-auto">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl px-6 py-6 mx-auto">

       {/* 4 */}
        <div className="flex justify-center mb-5">
          <h2 className="text-2xl font-extrabold text-[#111827] tracking-tight">
            CUBECHARM
          </h2>
        </div>

       {/* 5 */}
        <p className="text-center text-[#6B7280] text-sm mb-5">
          Join CUBECHARM and start exploring properties
        </p>

       
        <button className="w-full flex items-center justify-center border border-[#E5E7EB] rounded-lg py-3 text-sm font-medium text-[#111827] hover:bg-gray-50 transition mb-5">
          <FaGoogle className="w-5 h-5 mr-2" />
          Continue with Google
        </button>

       
        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-200" />
          <span className="px-3 text-xs text-gray-400">REGISTER WITH EMAIL</span>
          <div className="flex-grow border-t border-gray-200" />
        </div>

        {/* 6 */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

         
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

           {/* 7 */}
            <div>
              <input
                placeholder="First name"
                {...register("firstName", { required: "First name required" })}
                className="w-full rounded-lg border border-[#E5E7EB] p-3 text-sm focus:ring-2 focus:ring-[#4B3CF5] focus:outline-none"
              />
              {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
            </div>

            
            <div>
              <input
                placeholder="Last name"
                {...register("lastName", { required: "Last name required" })}
                className="w-full rounded-lg border border-[#E5E7EB] p-3 text-sm focus:ring-2 focus:ring-[#4B3CF5] focus:outline-none"
              />
              {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
            </div>
          </div>

          
          <div>
            <input
              type="email"
              placeholder="Email address"
              {...register("email", { required: "Email required" })}
              className="w-full rounded-lg border border-[#E5E7EB] p-3 text-sm focus:ring-2 focus:ring-[#4B3CF5] focus:outline-none"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          
          <div>
            <input
              type="tel"
              placeholder="Phone number"
              {...register("phone", { required: "Phone required" })}
              className="w-full rounded-lg border border-[#E5E7EB] p-3 text-sm focus:ring-2 focus:ring-[#4B3CF5] focus:outline-none"
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
          </div>

          
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

         
          <div>
            <input
              type="password"
              placeholder="Confirm password"
              {...register("confirmPassword", {
                required: "Confirm password",
                validate: (val) => val === password || "Passwords don't match",
              })}
              className="w-full rounded-lg border border-[#E5E7EB] p-3 text-sm focus:ring-2 focus:ring-[#4B3CF5] focus:outline-none"
            />
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
          </div>

          {/* 8 */}
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

          
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-[#4B3CF5] hover:bg-[#362BBD] text-white font-semibold transition transform hover:scale-105"
          >
            Create Account
          </button>
        </form>

       {/* 9 */}
        <p className="text-center text-sm text-[#6B7280] mt-6">
          Already have an account?{" "}
          <button onClick={goToLogin} className="text-[#4B3CF5] font-medium hover:underline">
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}
"use client";
import { useRouter } from "next/navigation";


import { FiCheck, FiX } from "react-icons/fi";

const Premieum_Plane = () => {
  const router = useRouter();

  // Pricing plans with concise features (max 2 lines on small screens)
const plans = [
  {
    name: "Free",
    price: "Free",
    badge: "",
    isCurrent: true,
    buttonText: "Current Plan",
    buttonDisabled: true,
    features: {
      proPostsPerMonth: 1,
      unlimitedPosts: false,
      fullFeatures: false,
      prioritySupport: false,
    },
  },
  {
    name: "Medium",
    price: "$5",
    badge: "Best Value",
    isCurrent: false,
    buttonText: "Upgrade to Medium",
    buttonDisabled: false,
    features: {
      proPostsPerMonth: 6,
      unlimitedPosts: false,
      fullFeatures: true,
      prioritySupport: false,
    },
  },
  {
    name: "Unlimited",
    price: "$7",
    badge: "Popular",
    isCurrent: false,
    buttonText: "Upgrade to Unlimited",
    buttonDisabled: false,
    features: {
      proPostsPerMonth: "Unlimited",
      unlimitedPosts: true,
      fullFeatures: true,
      prioritySupport: true,
    },
  },
];

const featureList = [
  { key: "proPostsPerMonth", label: "PRO Posts / Month" },
  { key: "unlimitedPosts", label: "Unlimited Posting" },
  { key: "fullFeatures", label: "All Features Access" },
  { key: "prioritySupport", label: "Priority Support" },
];

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-12 font-sans">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-1xl md:text-5xl font-semibold  mb-2 text-blue-500">cubecharm</h1>
        <p className="text-gray-600">Social Premaim Plane</p>
      </div>

      {/* Plans Grid */}
      <div className="w-full max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`relative bg-white rounded-3xl p-6 border ${
                plan.badge
                  ? "border-blue-500 shadow-xl shadow-blue-50 scale-105"
                  : "border-gray-200 shadow-md hover:shadow-lg"
              } transition-all`}
            >
              {/* Plan Header */}
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                {plan.badge && (
                  <span className="bg-blue-500 text-white text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {plan.badge}
                  </span>
                )}
              </div>

              {/* Price */}
              <div className="mb-5">
                <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                {plan.price !== "Free" && (
                  <span className="text-blue-600 text-sm font-medium ml-1">/Month</span>
                )}
              </div>

              {/* CTA Button */}
<button
  disabled={plan.buttonDisabled}
  onClick={() => router.push("/userportal/payment")}
  className={`w-full py-3 rounded-2xl font-semibold text-sm transition-all ${
    plan.buttonDisabled
      ? "bg-gray-100 text-gray-500 cursor-not-allowed"
      : "bg-blue-500 text-white hover:bg-blue-600 active:scale-95"
  }`}
>
  {plan.buttonText}
</button>

              {/* Features Table */}
              <div className="mt-6 space-y-2.5">
                {featureList.map((feat) => {
                  const hasFeature = plan.features[feat.key as keyof typeof plan.features];
                  return (
                    <div key={feat.key} className="flex items-center justify-between text-sm">
                      <span className="text-gray-700 font-medium">{feat.label}</span>
                      {hasFeature ? (
                        <FiCheck className="w-4 h-4 text-green-500" />
                      ) : (
                        <FiX className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Current Plan Badge */}
              {plan.isCurrent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-gray-200 text-gray-700 text-xs font-medium px-3 py-1 rounded-full">
                    Current Plan
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="text-center mt-8 text-xs text-gray-500">
          <p>Social meets real estate.</p>
        </div>
      </div>
    </div>
  );
};

export default Premieum_Plane;
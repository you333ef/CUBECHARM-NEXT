'use client'
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhone,
  FaCalendarAlt,
  FaShieldAlt,
  FaCheckCircle,
} from "react-icons/fa";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ProfileInfo = () => {
  const userData = {
    userName: "Yousef Khaled",
    email: "yousef.khaled.frontend@gmail.com",
    country: "Egypt",
    phoneNumber: "01117254520",
    creationDate: "2025-06-27T16:25:20.119Z",
    role: "User",
    isActivated: true,
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const navi = useRouter();
  const NaviTo_Update = (): void => {
    navi.push("/HomeList/ProfileE/UpdateProfile");
  };

  const [Loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (Loading) {
    return (
      <div className="min-h-screen bg-[#f7f9fc] overflow-y-auto font-sans pt-20 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-4xl font-bold text-[#0a0a0f] mb-2">
              <Skeleton width={250} height={40} />
            </h1>
            <p className="text-[#6b7280]">
              <Skeleton width={300} height={20} />
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-8 lg:p-10 animate-scale-in border border-[#e5e7eb] backdrop-blur-sm">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="group">
                    <Skeleton width={100} height={14} />
                    <Skeleton height={50} />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="group">
                    <Skeleton width={100} height={14} />
                    <Skeleton height={50} />
                  </div>
                ))}
              </div>

              <div>
                <div className="group">
                  <Skeleton width={100} height={14} />
                  <Skeleton height={50} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="group">
                    <Skeleton width={100} height={14} />
                    <Skeleton height={50} />
                  </div>
                ))}
              </div>

              <div className="text-center mt-8 pt-6 border-t border-[#e5e7eb]">
                <Skeleton width={180} height={50} borderRadius={9999} />
              </div>
            </div>
          </div>

          <div className="mt-6 bg-[#f3f4f6] rounded-2xl p-6 backdrop-blur-sm border border-[#e5e7eb] animate-fade-in">
            <Skeleton width={`80%`} height={20} style={{ margin: "0 auto" }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f9fc] overflow-y-auto font-sans pt-20 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-[#0a0a0f] mb-2">
            Profile Information
          </h1>
          <p className="text-[#6b7280]">
            View and update your account information.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-8 lg:p-10 animate-scale-in border border-[#e5e7eb] backdrop-blur-sm">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group">
                <label className="flex items-center gap-2 font-semibold text-[#0a0a0f] text-sm mb-3">
                  <FaUser className="w-4 h-4 text-[#3b82f6]" />
                  User Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={userData.userName}
                    readOnly
                    className="w-full px-5 py-4 border-2 border-[#e5e7eb] rounded-xl text-center bg-[#f9fafb] text-[#0a0a0f]"
                  />
                </div>
              </div>

              <div className="group">
                <label className="flex items-center gap-2 font-semibold text-[#0a0a0f] text-sm mb-3">
                  <FaEnvelope className="w-4 h-4 text-[#3b82f6]" />
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={userData.email}
                    readOnly
                    className="w-full px-5 py-4 border-2 border-[#e5e7eb] rounded-xl text-center bg-[#f9fafb]"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group">
                <label className="flex items-center gap-2 font-semibold text-[#0a0a0f] text-sm mb-3">
                  <FaMapMarkerAlt className="w-4 h-4 text-[#3b82f6]" />
                  Country
                </label>
                <input
                  type="text"
                  value={userData.country}
                  readOnly
                  className="w-full px-5 py-4 border-2 border-[#e5e7eb] rounded-xl text-center bg-[#f9fafb]"
                />
              </div>

              <div className="group">
                <label className="flex items-center gap-2 font-semibold text-[#0a0a0f] text-sm mb-3">
                  <FaPhone className="w-4 h-4 text-[#3b82f6]" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={userData.phoneNumber}
                  readOnly
                  className="w-full px-5 py-4 border-2 border-[#e5e7eb] rounded-xl text-center bg-[#f9fafb]"
                />
              </div>
            </div>

            <div>
              <div className="group">
                <label className="flex items-center gap-2 font-semibold text-[#0a0a0f] text-sm mb-3">
                  <FaCalendarAlt className="w-4 h-4 text-[#3b82f6]" />
                  Join Date
                </label>
                <input
                  type="text"
                  value={formatDate(userData.creationDate)}
                  readOnly
                  className="w-full px-5 py-4 border-2 border-[#e5e7eb] rounded-xl text-center bg-[#f9fafb]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group">
                <label className="flex items-center gap-2 font-semibold text-[#0a0a0f] text-sm mb-3">
                  <FaShieldAlt className="w-4 h-4 text-[#3b82f6]" />
                  Role
                </label>
                <input
                  type="text"
                  value={userData.role}
                  readOnly
                  className="w-full px-5 py-4 border-2 border-[#e5e7eb] rounded-xl text-center bg-[#f9fafb]"
                />
              </div>

              <div className="group">
                <label className="flex items-center gap-2 font-semibold text-[#0a0a0f] text-sm mb-3">
                  <FaCheckCircle className="w-4 h-4 text-[#3b82f6]" />
                  Account Status
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={userData.isActivated ? "Active" : "Inactive"}
                    readOnly
                    className={`w-full px-5 py-4 border-2 rounded-xl text-center font-semibold ${
                      userData.isActivated
                        ? "bg-[#dbeafe] border-[#3b82f6] text-[#3b82f6]"
                        : "bg-[#fee2e2] border-[#ef4444] text-[#ef4444]"
                    }`}
                  />
                </div>
              </div>
            </div>

            <div
              className="text-center mt-8 pt-6 border-t border-[#e5e7eb]"
              onClick={NaviTo_Update}
            >
              <button className="bg-[#3b82f6] hover:bg-[#60a5fa] text-white px-10 py-4 rounded-full font-semibold uppercase shadow-md transition-all duration-300">
                Change Info
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-[#f3f4f6] rounded-2xl p-6 backdrop-blur-sm border border-[#e5e7eb] animate-fade-in">
          <p className="text-center text-[#6b7280] text-sm">
            Need to update your information? Click the button above to make
            changes to your profile.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;

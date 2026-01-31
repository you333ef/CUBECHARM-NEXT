"use client";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";

import { toast } from "sonner";

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
import AuthContext from "@/app/providers/AuthContext";


const ProfileInfo = () => {
  const { baseUrl } = useContext(AuthContext)!;
  const accessToken =
    typeof window !== "undefined"
      ? localStorage.getItem("accessToken")
      : null;

  const [profileInfo, setProfileInfo] = useState<any>(null);
  const [Loading, setLoading] = useState(true);

  const FetchProfile_Info = async () => {
    try {
      const res = await axios.get(`${baseUrl}/users/profiles/me`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (res.data?.success) {
        setProfileInfo(res.data.data);
      }
    } catch (error) {
      toast.error("Failed to load profile info");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    FetchProfile_Info();
  }, []);

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const navi = useRouter();
  const NaviTo_Update = (): void => {
    navi.push("/userportal/Settings/profilesettings/update");
  };

  if (Loading) {
    return (
      <div className="min-h-screen bg-[#f7f9fc] overflow-y-auto font-sans pt-20 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <Skeleton width={250} height={40} />
            <Skeleton width={300} height={20} />
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-8 lg:p-10 border border-[#e5e7eb]">
            <div className="space-y-6">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} height={50} />
              ))}
              <Skeleton width={180} height={50} borderRadius={9999} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const userData = {
    userName: profileInfo?.fullName || "N/A",
    email: profileInfo?.email || "N/A",
    country: profileInfo?.country || "unknown",
    phoneNumber: profileInfo?.phoneNumber || "un known",
    creationDate: profileInfo?.createdDate,
    role: profileInfo?.verifiedBadge ? "Verified User" : "User",
    isActivated: !!profileInfo?.email,
  };

  return (
    <div className="min-h-screen bg-[#f7f9fc] overflow-y-auto font-sans pt-20 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#0a0a0f] mb-2">
            Profile Information
          </h1>
          <p className="text-[#6b7280]">
            View and update your account information.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-8 lg:p-10 border border-[#e5e7eb]">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 font-semibold text-sm mb-3">
                  <FaUser className="text-[#3b82f6]" />
                  User Name
                </label>
                <input
                  type="text"
                  value={userData.userName}
                  readOnly
                  className="w-full px-5 py-4 border-2 rounded-xl text-center bg-[#f9fafb]"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 font-semibold text-sm mb-3">
                  <FaEnvelope className="text-[#3b82f6]" />
                  Email
                </label>
                <input
                  type="email"
                  value={userData.email}
                  readOnly
                  className="w-full px-5 py-4 border-2 rounded-xl text-center bg-[#f9fafb]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 font-semibold text-sm mb-3">
                  <FaMapMarkerAlt className="text-[#3b82f6]" />
                  Country
                </label>
                <input
                  type="text"
                  value={userData.country}
                  readOnly
                  className="w-full px-5 py-4 border-2 rounded-xl text-center bg-[#f9fafb]"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 font-semibold text-sm mb-3">
                  <FaPhone className="text-[#3b82f6]" />
                  Phone Number
                </label>
                <input
                  type="text"
                  value={userData.phoneNumber}
                  readOnly
                  className="w-full px-5 py-4 border-2 rounded-xl text-center bg-[#f9fafb]"
                />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 font-semibold text-sm mb-3">
                <FaCalendarAlt className="text-[#3b82f6]" />
                Join Date
              </label>
              <input
                type="text"
                value={formatDate(userData.creationDate)}
                readOnly
                className="w-full px-5 py-4 border-2 rounded-xl text-center bg-[#f9fafb]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 font-semibold text-sm mb-3">
                  <FaShieldAlt className="text-[#3b82f6]" />
                  Role
                </label>
                <input
                  type="text"
                  value={userData.role}
                  readOnly
                  className="w-full px-5 py-4 border-2 rounded-xl text-center bg-[#f9fafb]"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 font-semibold text-sm mb-3">
                  <FaCheckCircle className="text-[#3b82f6]" />
                  Account Status
                </label>
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

            <div
              className="text-center mt-8 pt-6 border-t border-[#e5e7eb]"
              onClick={NaviTo_Update}
            >
              <button className="bg-[#3b82f6] hover:bg-[#60a5fa] text-white px-10 py-4 rounded-full font-semibold uppercase shadow-md transition-all">
                Change Info
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;

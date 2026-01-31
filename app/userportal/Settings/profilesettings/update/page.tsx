"use client";
import { useState, useCallback, useEffect, useRef, useContext } from "react";
import { useDropzone } from "react-dropzone";
import { FaTrash, FaCamera } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import axios from "axios";
import { toast } from "sonner";
import AuthContext from "@/app/providers/AuthContext";
import { useRouter } from "next/navigation";

const UpdateProfile = () => {
  const { baseUrl } = useContext(AuthContext)!;
  const accessToken =
    typeof window !== "undefined"
      ? localStorage.getItem("accessToken")
      : null;

  const navi = useRouter();

  const [file, setFile] = useState<File & { preview?: string } | null>(null);
  const [serverImage, setServerImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    userName: "",
    firstName: "",
    lastName: "",
    bio: "",
    phoneNumber: "",
  });

  const imgRef = useRef<HTMLDivElement | null>(null);

  const onDrop = useCallback((accepted: File[]) => {
    const selectedFile = accepted[0];
    if (selectedFile) {
      const img = Object.assign(selectedFile, {
        preview: URL.createObjectURL(selectedFile),
      });
      setFile(img);
    }
  }, []);

  const { getInputProps, open } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true,
    accept: { "image/*": [] },
  });

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${baseUrl}/users/profiles/me`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (res.data?.success) {
        const data = res.data.data;

        setFormData({
          userName: data.userName || "",
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          bio: data.bio || "",
          phoneNumber: data.phoneNumber || "",
        });

        if (data.profilePicture) {
          setServerImage(`http://localhost:5000/${data.profilePicture}`);
        }
      }
    } catch {
      toast.error("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const removeImage = () => {
    setFile(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const payload = new FormData();
      payload.append("Username", formData.userName);
      payload.append("FirstName", formData.firstName);
      payload.append("LastName", formData.lastName);
      payload.append("Bio", formData.bio);
      payload.append("PhoneNumber", formData.phoneNumber);

      if (file) payload.append("ProfilePicture", file);

      const res = await axios.patch(
        `${baseUrl}/users/profiles/me`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (res.data?.success) {
        toast.success("Profile updated successfully");
        navi.push("/userportal/Settings/profilesettings/profile_info");
      }
    } catch {
      toast.error("Failed to update profile");
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f9fc] flex justify-center p-4 sm:p-6 overflow-y-auto pb-24">
      <div className="bg-white shadow-2xl rounded-3xl w-full max-w-3xl p-6 sm:p-10">
        {loading ? (
          <div className="animate-pulse">
            <Skeleton height={35} width={250} className="mx-auto mb-8" />
            <div className="flex flex-col items-center mb-8 gap-4">
              <Skeleton circle height={160} width={160} />
              <div className="flex gap-3">
                <Skeleton height={44} width={150} className="rounded-full" />
                <Skeleton height={44} width={150} className="rounded-full" />
              </div>
            </div>
          </div>
        ) : (
          <>
            <h2 className="text-3xl font-bold text-[#1f2937] mb-8 text-center">
              Update Profile
            </h2>

            <div className="flex flex-col items-center mb-8 gap-4">
              <div
                ref={imgRef}
                className="relative w-40 h-40 rounded-full border-4 border-[#e5e7eb] flex items-center justify-center overflow-hidden bg-[#f9fafb] shadow-lg"
                style={{
                  backgroundImage: file
                    ? `url(${file.preview})`
                    : serverImage
                    ? `url(${serverImage})`
                    : "",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={open}
                  className="flex items-center gap-2 bg-[#3b82f6] hover:bg-[#2563eb] text-white px-6 py-3 rounded-full font-semibold shadow-md transition-all"
                >
                  <FaCamera size={18} />
                  <span>Change Photo</span>
                </button>

                <button
                  type="button"
                  onClick={removeImage}
                  disabled={!file}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all ${
                    file
                      ? "bg-[#ef4444] text-white"
                      : "bg-[#e5e7eb] text-[#9ca3af]"
                  }`}
                >
                  <FaTrash size={16} />
                  <span>Remove</span>
                </button>
              </div>

              <input {...getInputProps()} />
            </div>

            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  name="userName"
                  value={formData.userName}
                  placeholder="User Name"
                  onChange={handleChange}
                  className="w-full px-4 py-4 border-2 rounded-2xl text-center"
                />
                <input
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  placeholder="Phone Number"
                  onChange={handleChange}
                  className="w-full px-4 py-4 border-2 rounded-2xl text-center"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  name="firstName"
                  value={formData.firstName}
                  placeholder="First Name"
                  onChange={handleChange}
                  className="w-full px-4 py-4 border-2 rounded-2xl text-center"
                />
                <input
                  name="lastName"
                  value={formData.lastName}
                  placeholder="Last Name"
                  onChange={handleChange}
                  className="w-full px-4 py-4 border-2 rounded-2xl text-center"
                />
              </div>

              <input
                name="bio"
                value={formData.bio}
                placeholder="Bio"
                onChange={handleChange}
                className="w-full px-4 py-4 border-2 rounded-2xl text-center"
              />

              <div className="text-center pt-4 pb-2">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-12 py-4 rounded-full font-bold shadow-lg transition-all"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default UpdateProfile;

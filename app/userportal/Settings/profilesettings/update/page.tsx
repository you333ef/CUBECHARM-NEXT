"use client"
import { useState, useCallback, useEffect, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { FaTrash, FaCamera } from "react-icons/fa";
import Image from "next/image";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const UpdateProfile = () => {
  const [file, setFile] = useState<File & { preview?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageVisible, setImageVisible] = useState(false); // Lazy loading trigger
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

  // Handle skeleton loader
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Lazy load image using IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setImageVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );

    if (imgRef.current) observer.observe(imgRef.current);

    return () => observer.disconnect();
  }, []);

  const removeImage = () => setFile(null);

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
            <div className="space-y-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Skeleton height={70} className="rounded-2xl" />
                  <Skeleton height={70} className="rounded-2xl" />
                </div>
              ))}
              <Skeleton height={70} className="rounded-2xl" />
              <div className="text-center pt-4 pb-2">
                <Skeleton
                  height={55}
                  width={200}
                  className="mx-auto rounded-full"
                />
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
                  backgroundImage:
                    imageVisible && file
                      ? `url(${file.preview})`
                      : imageVisible
                      ? ``
                      : "none",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {!imageVisible && (
                  <Skeleton
                    circle
                    height={160}
                    width={160}
                    className="absolute top-0 left-0"
                  />
                )}
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={open}
                  className="flex items-center gap-2 bg-[#3b82f6] hover:bg-[#2563eb] text-white px-6 py-1 rounded-full font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
                >
                  <FaCamera size={18} />
                  <span>Change Photo</span>
                </button>

                <button
                  type="button"
                  onClick={removeImage}
                  disabled={!file}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold shadow-md transition-all duration-300 ${
                    file
                      ? "bg-[#ef4444] hover:bg-[#dc2626] text-white hover:shadow-lg hover:scale-105 cursor-pointer"
                      : "bg-[#e5e7eb] text-[#9ca3af] cursor-not-allowed"
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
                <div>
                  <label className="block text-sm font-semibold text-[#4b5563] mb-2 text-left">
                    User Name
                  </label>
                  <input
                    type="text"
                    defaultValue="Ahmed Mohamed"
                    className="w-full px-4 py-4 border-2 border-[#e5e7eb] rounded-2xl 
                    focus:ring-4 focus:ring-[#93c5fd] focus:border-[#3b82f6] 
                    focus:outline-none text-center text-[#1f2937] font-medium 
                    transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#4b5563] mb-2 text-left">
                    Email
                  </label>
                  <input
                    type="email"
                    defaultValue="ahmed@example.com"
                    className="w-full px-4 py-4 border-2 border-[#e5e7eb] rounded-2xl 
                    focus:ring-4 focus:ring-[#93c5fd] focus:border-[#3b82f6] 
                    focus:outline-none text-center text-[#1f2937] font-medium 
                    transition-all duration-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-[#4b5563] mb-2 text-left">
                    Country
                  </label>
                  <input
                    type="text"
                    defaultValue="Egypt"
                    className="w-full px-4 py-4 border-2 border-[#e5e7eb] rounded-2xl 
                    focus:ring-4 focus:ring-[#93c5fd] focus:border-[#3b82f6] 
                    focus:outline-none text-center text-[#1f2937] font-medium 
                    transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#4b5563] mb-2 text-left">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    defaultValue="+20123456789"
                    className="w-full px-4 py-4 border-2 border-[#e5e7eb] rounded-2xl 
                    focus:ring-4 focus:ring-[#93c5fd] focus:border-[#3b82f6] 
                    focus:outline-none text-center text-[#1f2937] font-medium 
                    transition-all duration-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#4b5563] mb-2 text-left">
                  Confirm Password
                </label>
                <input
                  type="password"
                  defaultValue="********"
                  className="w-full px-4 py-4 border-2 border-[#e5e7eb] rounded-2xl 
                  focus:ring-4 focus:ring-[#93c5fd] focus:border-[#3b82f6] 
                  focus:outline-none text-center text-[#1f2937] font-medium 
                  transition-all duration-300"
                />
              </div>

              <div className="text-center pt-4 pb-2">
                <button
                  type="button"
                  className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-12 py-4 
                             rounded-full font-bold uppercase shadow-lg 
                             hover:shadow-2xl hover:scale-105 active:scale-95 
                             transition-all duration-300 focus:outline-none 
                             focus:ring-4 focus:ring-[#93c5fd]"
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

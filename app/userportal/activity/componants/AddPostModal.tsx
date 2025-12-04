"use client";

import { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import { FaCamera, FaTimes } from "react-icons/fa";

// 1-
const ReactPhotoSphereViewerLazy = dynamic(
  () => import("react-photo-sphere-viewer").then((mod) => ({ default: mod.ReactPhotoSphereViewer })),
  { ssr: false }
);

// 2-
export default function AddPostModal({ onClose }: { onClose: () => void }) {
  const [media, setMedia] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<"image" | "360" | "video" | null>(null);
  const [description, setDescription] = useState("");

  // 3-
  const onDrop = useCallback((files: File[]) => {
    const file = files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);

    if (file.type.startsWith("image/")) {
      setMediaType(file.name.toLowerCase().includes("360") ? "360" : "image");
    } else if (file.type.startsWith("video/")) {
      setMediaType("video");
    }
    setMedia(url);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [], "video/*": [] },
    maxFiles: 1,
  });

  // 4-
  const handlePublish = useCallback(() => {
    toast.success("Post published!");
    onClose();
    if (media) URL.revokeObjectURL(media);
  }, [media, onClose]);

  // 5-
  useEffect(() => {
    return () => {
      if (media) URL.revokeObjectURL(media);
    };
  }, [media]);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
     
      <div 
        className="bg-white rounded-2xl w-full max-w-sm shadow-2xl flex flex-col"
        style={{ maxHeight: "80vh" }} 
      >
        {/* 6 */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Add New Post</h2>
          <button
            onClick={() => {
              onClose();
              if (media) URL.revokeObjectURL(media);
            }}
            className="text-gray-600 hover:text-red-500 transition-all hover:rotate-90"
          >
            <FaTimes size={22} />
          </button>
        </div>
{/* 7 */}
       
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl text-center cursor-pointer transition-all mb-4
              ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"}`}
          >
            <input {...getInputProps()} />

            {media ? (
           
              <div className="w-full h-56 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                {mediaType === "360" ? (
                  <div className="w-full h-full">
                    <ReactPhotoSphereViewerLazy src={media} height="100%" width="100%" />
                  </div>
                ) : mediaType === "video" ? (
                  <video src={media} controls className="w-full h-full object-contain bg-black" />
                ) : (
                  <div className="relative w-full h-full">
                    <Image
                      src={media}
                      alt="Preview"
                      fill
                      sizes="(max-width: 768px) 100vw, 400px"
                      className="object-contain" 
                      priority
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="py-10">
                <FaCamera size={44} className="mx-auto mb-3 text-gray-400" />
                <p className="font-medium text-gray-700">
                  {isDragActive ? "Drop here..." : "Upload Photo or Video"}
                </p>
                <p className="text-xs text-gray-500 mt-1">JPG, PNG, MP4, 360°</p>
              </div>
            )}
          </div>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Write a description..."
            className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={3}
          />
        </div>
        {/* 8 */}

        <div className="flex justify-end gap-3 px-5 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={() => {
              onClose();
              if (media) URL.revokeObjectURL(media);
            }}
            className="px-5 py-2.5 rounded-lg bg-gray-200 hover:bg-gray-300 font-semibold transition"
          >
            Cancel
          </button>
          <button
            onClick={handlePublish}
            disabled={!media}
            className="px-5 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Publish
          </button>
        </div>
      </div>
    </div>
  );
}
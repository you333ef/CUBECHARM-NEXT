"use client";

import React, { useRef } from "react";
import { toast } from "sonner";

interface Props {
  file: File | null;
  previewUrl: string | null;
  onSelect: (file: File | null) => void;
}

const MAX_DURATION_SEC = 30;
const MAX_SIZE_MB = 50;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

function getVideoDuration(f: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    const url = URL.createObjectURL(f);

    video.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      resolve(video.duration);
    };
    video.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load video"));
    };
    video.src = url;
  });
}

export default function MediaUploader({ file, previewUrl, onSelect }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (f?: File) => {
    if (!f) return;
    if (!f.type.startsWith("image/") && !f.type.startsWith("video/")) return;

    if (f.size > MAX_SIZE_BYTES) {
   toast.error(`File size exceeds the allowed ${MAX_SIZE_MB} MB.`);
      return;
    }

    if (f.type.startsWith("video/")) {
      try {
        const duration = await getVideoDuration(f);
        if (duration > MAX_DURATION_SEC) {
          toast.error(`Video duration exceeds the allowed ${MAX_DURATION_SEC} seconds.`);
          return;
        }
      } catch {
        toast.error("Failed to read video");
        return;
      }
    }

    onSelect(f);
  };

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(null);
  };

  return (
    <div
      onClick={() => {
        if (!file) fileRef.current?.click();
      }}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        if (!file) handleFile(e.dataTransfer.files?.[0]);
      }}
      className="border-2 border-dashed rounded-xl cursor-pointer relative w-full"
    >
      {!file && (
        <div className="py-10 text-center text-gray-500">
          Drag & drop or click to upload
        </div>
      )}

      {file && previewUrl && (
        <div className="relative flex justify-center items-center h-[200px] w-full overflow-hidden">
          {file.type.startsWith("image/") ? (
            <img
              src={previewUrl}
              alt="Preview"
              className="h-[180px] w-full object-contain max-w-full"
            />
          ) : (
            <video
              src={previewUrl}
              className="h-[180px] w-full object-contain max-w-full"
              controls
              loop
              muted
              playsInline
              onClick={(e) => e.stopPropagation()}
            />
          )}

          <button
            type="button"
            onClick={removeFile}
            className="absolute top-2 left-2 w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 transition-colors z-10"
            aria-label="Remove"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/*,video/*"
        hidden
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  );
}

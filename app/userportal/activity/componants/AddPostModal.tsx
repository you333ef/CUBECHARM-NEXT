"use client";

import { useState, useEffect, useCallback } from "react";
import { FaTimes } from "react-icons/fa";
import MediaUploader from "../../profilee/ComPonatntModals.tsx/shared/MediaUploader";

interface AddPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: { content: string; media?: File[] }) => Promise<any>;
  isEditMode?: boolean;
  story?: any;
}

export default function AddPostModal({
  isOpen,
  onClose,
  onSubmit,
  isEditMode = false,
  story,
}: AddPostModalProps) {
  const [media, setMedia] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (isEditMode && story) {
      const slide = story?.slides?.[0];
      if (slide?.caption) setDescription(slide.caption);
      if (slide?.mediaUrl) setMedia(slide.mediaUrl);
    }
  }, [isEditMode, story]);

  const handleSelectMedia = (file: File | null) => {
    if (isUploading) return; // prevent changing media while uploading

    if (!file) {
      if (media && mediaFile) URL.revokeObjectURL(media);
      setMediaFile(null);
      setMedia(null);
      return;
    }

    if (media && mediaFile) URL.revokeObjectURL(media);

    const url = URL.createObjectURL(file);
    setMediaFile(file);
    setMedia(url);
  };

  const handlePublish = useCallback(async () => {
    if (!isEditMode && !mediaFile) return;
    if (isUploading) return;

    setIsUploading(true);

    try {
      await onSubmit({
        content: description,
        media: mediaFile ? [mediaFile] : [],
      });

      if (media && mediaFile) URL.revokeObjectURL(media);
      // onClose is called after success
      onClose();
    } catch (err) {
      // keep modal open on error
      console.error("Upload failed:", err);
    } finally {
      setIsUploading(false);
    }
  }, [description, mediaFile, onSubmit, onClose, isEditMode, media, isUploading]);

  useEffect(() => {
    return () => {
      if (media && mediaFile) URL.revokeObjectURL(media);
    };
  }, [media, mediaFile]);

  if (!isOpen) return null;

  const isVideoFile = mediaFile?.type?.startsWith("video");
  const publishDisabled = (!isEditMode && !mediaFile) || isUploading;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div
        className="bg-white w-full sm:max-w-sm sm:rounded-2xl rounded-t-2xl shadow-2xl flex flex-col border border-gray-200/60"
        style={{ maxHeight: "calc(100dvh - 80px)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 shrink-0">
          <h2 className="text-base font-semibold text-gray-800">
           Add New Post !
          </h2>
          <button
            onClick={() => {
              if (isUploading) return;
              onClose();
              if (media && mediaFile) URL.revokeObjectURL(media);
            }}
            disabled={isUploading}
            className="text-gray-400 hover:text-red-500 transition-all hover:rotate-90 disabled:opacity-50 disabled:cursor-not-allowed p-1"
          >
            <FaTimes size={18} />
          </button>
        </div>

        {/* Content - scrollable */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-0">
          <MediaUploader
            file={mediaFile}
            previewUrl={media}
            onSelect={handleSelectMedia}
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Write a description..."
            disabled={isUploading}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 resize-none disabled:opacity-50 disabled:cursor-not-allowed transition"
            rows={2}
          />
        </div>

        {/* Footer - always visible */}
        <div className="flex justify-end gap-2.5 px-4 py-3 border-t border-gray-100 bg-gray-50/80 shrink-0 sm:rounded-b-2xl">
          <button
            onClick={() => {
              if (isUploading) return;
              onClose();
              if (media && mediaFile) URL.revokeObjectURL(media);
            }}
            disabled={isUploading}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handlePublish}
            disabled={publishDisabled}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2 min-w-[90px] justify-center"
          >
            {isUploading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                <span>Uploading...</span>
              </>
            ) : isEditMode ? (
              "Update"
            ) : (
              "Publish"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

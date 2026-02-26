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

  useEffect(() => {
    if (isEditMode && story) {
      const slide = story?.slides?.[0];
      if (slide?.caption) setDescription(slide.caption);
      if (slide?.mediaUrl) setMedia(slide.mediaUrl);
    }
  }, [isEditMode, story]);

  const handleSelectMedia = (file: File | null) => {
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

    await onSubmit({
      content: description,
      media: mediaFile ? [mediaFile] : [],
    });

    onClose();

    if (media && mediaFile) URL.revokeObjectURL(media);
  }, [description, mediaFile, onSubmit, onClose, isEditMode, media]);

  useEffect(() => {
    return () => {
      if (media && mediaFile) URL.revokeObjectURL(media);
    };
  }, [media, mediaFile]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div
        className="bg-white rounded-2xl w-full max-w-sm shadow-2xl flex flex-col"
        style={{ maxHeight: "80vh" }}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">
            {isEditMode ? "Update Story" : "Add New Story"}
          </h2>
          <button
            onClick={() => {
              onClose();
              if (media && mediaFile) URL.revokeObjectURL(media);
            }}
            className="text-gray-600 hover:text-red-500 transition-all hover:rotate-90"
          >
            <FaTimes size={22} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          <MediaUploader
            file={mediaFile}
            previewUrl={media}
            onSelect={handleSelectMedia}
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Write a description..."
            className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={3}
          />
        </div>

        <div className="flex justify-end gap-3 px-5 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={() => {
              onClose();
              if (media && mediaFile) URL.revokeObjectURL(media);
            }}
            className="px-5 py-2.5 rounded-lg bg-gray-200 hover:bg-gray-300 font-semibold transition"
          >
            Cancel
          </button>
          <button
            onClick={handlePublish}
            disabled={!isEditMode && !mediaFile}
            className="px-5 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {isEditMode ? "Update" : "Publish"}
          </button>
        </div>
      </div>
    </div>
  );
}
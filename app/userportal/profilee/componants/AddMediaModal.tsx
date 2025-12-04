"use client";

import React, { useState, useRef } from "react";
import { FaTimes } from "react-icons/fa";
import { toast } from "sonner";
// 6
export interface AddMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  isPost: boolean;
}

const AddMediaModal = ({ isOpen, onClose, isPost }: { isOpen: boolean; onClose: () => void; isPost: boolean }) => {
  if (!isOpen) return null;

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1
  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
      toast.error("Please select an image or video");
      return;
    }
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  // 2
  const openFilePicker = () => fileInputRef.current?.click();

  // 3
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  //4
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  //5
  const handlePublish = () => {
    if (!selectedFile) {
      toast.error("Add a photo or video first");
      return;
    }
    toast.success(isPost ? "Post published!" : "Story added!");
    onClose();
  };

  // 6
  const handleClose = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(null);
    setPreviewUrl(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 space-y-6">
        {/* 7 */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">{isPost ? "Create Post" : "Add Story"}</h2>
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes size={22} />
          </button>
        </div>

        {/* 8*/}
        <div
          onClick={openFilePicker}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="relative border-2 border-dashed border-gray-300 rounded-xl overflow-hidden cursor-pointer hover:border-gray-400 transition-colors"
        >
          {/* 9*/}
          {!selectedFile && (
            <div className="p-12 text-center text-gray-500">
              <p className="text-lg font-medium">Drag & drop or click to upload</p>
              <p className="text-sm mt-1">(Image or Video)</p>
            </div>
          )}

          {/* 10 */}
          {selectedFile && previewUrl && (
            <div className="relative">
              {selectedFile.type.startsWith("image/") ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-64 object-contain bg-black"
                />
              ) : (
                <video
                  src={previewUrl}
                  controls
                  className="w-full h-64 object-contain bg-black"
                />
              )}

              {/*11 */}
              <div className="absolute inset-x-0 bottom-0 bg-black/70 text-white p-3 flex items-center justify-between">
                <span className="text-sm truncate max-w-[70%]">{selectedFile.name}</span>
                <span className="text-xs bg-white/20 px-2 py-1 rounded">Click to change</span>
              </div>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            onChange={handleInputChange}
            className="hidden"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            onClick={handleClose}
            className="px-5 py-2.5 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={handlePublish}
            disabled={!selectedFile}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Publish
          </button>
        </div>
      </div>
    </div>
  );
};
export default AddMediaModal;
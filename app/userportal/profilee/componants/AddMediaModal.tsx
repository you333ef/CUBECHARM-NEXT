"use client";

import React, { useState, useRef, useContext } from "react";
import axios from "axios";
import { FaTimes } from "react-icons/fa";
import { toast } from "sonner";
import AuthContext from "@/app/providers/AuthContext";

type Mode = "user" | "admin";
type Flow =
  | "addStory"          
  | "addStoryToAlbum"|'addStoryOnly'; 
type action = "add" | "edit";

interface AddMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  isPost: boolean;
  onStoryAdded: () => void;
  mode?: Mode;
  flow?: Flow;
  action?: action;
  
}

const AddMediaModal = ({
  isOpen,
  onClose,
  isPost,
  onStoryAdded,
  mode = "user",
  flow="addStory",
  action,
  
}: AddMediaModalProps) => {
  if (!isOpen) return null;

  const { baseUrl } = useContext(AuthContext)!;

  const accessToken =
    typeof window !== "undefined"
      ? localStorage.getItem("accessToken")
      : null;

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);
  /* ---------- ADMIN STATES (NEW) ---------- */
  const [selectedAlbum, setSelectedAlbum] = useState<string>("");
  const [timer, setTimer] = useState<number | "">("");
  const [albumTimer, setAlbumTimer] = useState<number | "">("");
  const [storyTimer, setStoryTimer] = useState<number | "">("");
  const [adminTimer, setAdminTimer] = useState<number | "">("");
  /* ---------------- File Handlers ---------------- */
  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
      toast.error("Please select an image or video");
      return;
    }
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  };
  const openFilePicker = () => fileInputRef.current?.click();
  /* ---------------- API Call ---------------- */
  const handlePublish = async () => {
    if (!selectedFile) {
      toast.error("Media file is required");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("Slides[0].MediaFile", selectedFile);
      formData.append("Slides[0].DisplayOrder", "1");

      if (description.trim()) {
        formData.append("Slides[0].Caption", description.trim());
      }

      if (link.trim()) {
        formData.append("Slides[0].LinkUrl", link.trim());
      }

      /* ---------- ADMIN DATA (READY FOR BACKEND) ---------- */
      if (mode === "admin") {
        if (selectedAlbum) {
          formData.append("AlbumId", selectedAlbum);
        }
        if (flow === "addStoryToAlbum") {
          formData.append("CreateNewAlbum", "true");
        }

        if (timer !== "") {
          formData.append("Timer", timer.toString());
        }
      }

      const response = await axios.post(
        `${baseUrl}/stories`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data?.success) {
        toast.success(response.data.message || "Story added successfully");
        onStoryAdded();
        handleClose();
      } else {
        toast.error(response.data?.message || "Something went wrong");
      }
    } catch (error: any) {
      const apiErrors = error?.response?.data?.errors;
      if (apiErrors?.length) {
        apiErrors.forEach((err: string) => toast.error(err));
      } else {
        toast.error("Failed to upload story");
      }
    } finally {
      setLoading(false);
    }
  };
  /* ---------------- Close ---------------- */
  const handleClose = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(null);
    setPreviewUrl(null);
    setDescription("");
    setLink("");
    setSelectedAlbum("");
    setTimer("");
    setAlbumTimer("");
    setStoryTimer("");
    setAdminTimer("");
    onClose();
  };
  /* ---------------- UI ---------------- */
const isEditAlbum = action === "edit" && flow === "addStoryToAlbum";
const isEditStory = action === "edit" && flow === "addStory";
const getModalTitle = () => {
  // ---------- EDIT ----------
  if (action === "edit") {
    if (flow === "addStory") {
      return mode === "admin"
        ? "Update Story (Admin)"
        : "Update Story";
    }

    if (flow === "addStoryToAlbum") {
      return mode === "admin"
        ? "Update Album (Admin)"
        : "Update Album";
    }
  }

  // ---------- ADD ----------
  if (flow === "addStoryToAlbum") {
    return mode === "admin"
      ? "Add Album & Story (Admin)"
      : "Add Album & Story";
  }

  return mode === "admin"
    ? "Add Story (Admin)"
    : "Add Story (User)";
};
  return (
 <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
  <div className="bg-white rounded-2xl w-full max-w-md p-5 space-y-4">
 <div className="flex justify-between items-center">
  <h2 className="text-lg font-semibold">
    {getModalTitle()}
  </h2>
  <button
    onClick={handleClose}
    className="text-gray-500 hover:text-gray-700"
  >
    <FaTimes size={20} />
  </button>
</div>
{isEditAlbum ? (
  <>
    <input
      type="text"
      placeholder="Album Title"
      value={selectedAlbum}
      onChange={(e) => setSelectedAlbum(e.target.value)}
      className="w-full px-3 py-2 text-sm border rounded-lg"
    />

    <div className="flex justify-end gap-3 pt-2">
      <button
        onClick={handleClose}
        className="px-4 py-2 text-sm bg-gray-200 rounded-lg"
      >
        Cancel
      </button>
      <button
        onClick={handleClose}
        className="px-5 py-2 text-sm bg-blue-600 text-white rounded-lg"
      >
        Update
      </button>
    </div>
  </>
) : isEditStory ? (
  <>
    <input
      type="text"
      placeholder="Caption Story"
      value={description}
      onChange={(e) => setDescription(e.target.value)}
      className="w-full px-3 py-2 text-sm border rounded-lg"
    />

    <div className="flex justify-end gap-3 pt-2">
      <button
        onClick={handleClose}
        className="px-4 py-2 text-sm bg-gray-200 rounded-lg"
      >
        Cancel
      </button>
      <button
        onClick={handleClose}
        className="px-5 py-2 text-sm bg-blue-600 text-white rounded-lg"
      >
        Update
      </button>
    </div>
  </>
) : (
  <>
    <div
      onClick={openFilePicker}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className="border-2 border-dashed border-gray-300 rounded-xl cursor-pointer overflow-hidden"
    >
      {!selectedFile && (
        <div className="py-10 text-center text-gray-500">
          <p className="font-medium">Drag & drop or click to upload</p>
          <p className="text-xs mt-1">(Image || Video)</p>
        </div>
      )}

      {selectedFile && previewUrl &&
        (selectedFile.type.startsWith("image/") ? (
          <img
            src={previewUrl}
            className="w-full max-w-[320px] h-[180px] object-contain bg-black mx-auto rounded-lg"
          />
        ) : (
          <video
            src={previewUrl}
            controls
            className="w-full max-w-[320px] h-[180px] object-contain bg-black mx-auto rounded-lg"
          />
        ))}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        onChange={handleInputChange}
        className="hidden"
      />
    </div>

    {mode === "admin" && flow === "addStory" && (
      <>
        <select
          value={selectedAlbum}
          onChange={(e) => setSelectedAlbum(e.target.value)}
          className="w-full px-3 py-2 text-sm border rounded-lg"
        >
          <option value="">Select Album</option>
          <option value="1">Album 1</option>
        </select>

        <input
          type="number"
          placeholder="Timer (seconds)"
          value={timer}
          min={1}
          onChange={(e) =>
            setTimer(e.target.value === "" ? "" : Number(e.target.value))
          }
          className="w-full px-3 py-2 text-sm border rounded-lg"
        />
      </>
    )}

    {mode === "user" && flow === "addStoryToAlbum" && (
      <>
        <select
          value={selectedAlbum}
          onChange={(e) => setSelectedAlbum(e.target.value)}
          className="w-full px-3 py-2 text-sm border rounded-lg"
        >
          <option value="">Select Album</option>
          <option value="1">Album 1</option>
        </select>
      </>
    )}

    {mode === "user" && flow === "addStory" && (
      <>
        <input
          type="text"
          placeholder="Album Name"
          value={selectedAlbum}
          onChange={(e) => setSelectedAlbum(e.target.value)}
          className="w-full px-3 py-2 text-sm border rounded-lg"
        />

   
      
      </>
    )}

    {mode === "user" && flow === "addStoryOnly" && null}

    <input
      type="text"
      placeholder="Caption Story !"
      value={description}
      onChange={(e) => setDescription(e.target.value)}
      className="w-full px-3 py-2 text-sm border rounded-lg"
    />
    {mode === "admin" && (




  <input
    type="text"
    placeholder="Alpom Name"
    value={adminTimer}
    onChange={(e) =>
      setAdminTimer(e.target.value === "" ? "" : Number(e.target.value))
    }
    className="w-full px-3 py-2 text-sm border rounded-lg"
  />




)}


    <div className="flex justify-end gap-3 pt-2">
      <button
        onClick={handleClose}
        className="px-4 py-2 text-sm bg-gray-200 rounded-lg"
      >
        Cancel
      </button>

      <button
        onClick={handlePublish}
        disabled={!selectedFile || loading}
        className="px-5 py-2 text-sm bg-blue-600 text-white rounded-lg disabled:opacity-50"
      >
        {loading ? "Publishing..." : "Publish"}
      </button>
    </div>
  </>
)}


  </div>
</div>

  );
};

export default AddMediaModal;

"use client";

import React, { useState, useContext } from "react";
import { FaTimes } from "react-icons/fa";
import { toast } from "sonner";
import AuthContext from "@/app/providers/AuthContext";
import api from "@/app/AuthLayout/refresh";
import MediaUploader from ".././ComPonatntModals.tsx/shared/MediaUploader";

type Mode = "user" | "admin";
type Flow = "addStory" | "addStoryToAlbum" | "addStoryOnly";
type action = "add" | "edit";

interface AddMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  isPost: boolean;
  onStoryAdded: () => void;
  mode?: Mode;
  flow?: Flow;
  action?: action;
  adminAlbums?: { id: number; albumName: string }[];
  onCreateAlbum?: (
    albumName: string,
    stories: {
      slides: {
        file: File;
        mediaType: "Image" | "Video";
        duration: number;
        order: number;
      }[];
    }[]
  ) => Promise<any>;
  onAddStoryToAlbum?: (
    albumId: number,
    slides: {
      file: File;
      mediaType: "Image" | "Video";
      duration: number;
      order: number;
    }[]
  ) => Promise<any>;
}

const AddMediaModal = ({
  isOpen,
  onClose,
  isPost,
  onStoryAdded,
  mode = "user",
  flow = "addStory",
  action,
  adminAlbums = [],
  onCreateAlbum,
  onAddStoryToAlbum,
}: AddMediaModalProps) => {
  if (!isOpen) return null;

  const { baseUrl } = useContext(AuthContext)!;

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [albumName, setAlbumName] = useState("");
  const [selectedAlbum, setSelectedAlbum] = useState<string>("");
  const [timer, setTimer] = useState<number | "">("");
  const [albumTimer, setAlbumTimer] = useState<number | "">("");
  const [storyTimer, setStoryTimer] = useState<number | "">("");
  const [adminTimer, setAdminTimer] = useState<string>("");

  const handleMediaSelect = (file: File | null) => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(file);
    setPreviewUrl(file ? URL.createObjectURL(file) : null);
  };

  const handlePublish = async () => {
    if (!selectedFile) {
      toast.error("Image or video is required");
      return;
    }

    if (
      !selectedFile.type.startsWith("image/") &&
      !selectedFile.type.startsWith("video/")
    ) {
      toast.error("Only image or video allowed");
      return;
    }

    const maxBytes = 50 * 1024 * 1024;
    if (selectedFile.size > maxBytes) {
      toast.error("File size must be 50MB or less");
      return;
    }

    const mediaType: "Image" | "Video" = selectedFile.type.startsWith("image/")
      ? "Image"
      : "Video";

    const duration = mediaType === "Video" ? 10 : 5;
    if (duration < 1 || duration > 60) {
      toast.error("Duration must be between 1 and 60 seconds");
      return;
    }

    if (mode === "admin") {
      if (flow === "addStoryToAlbum") {
        const albumName =
          (adminTimer && adminTimer.trim()) || selectedAlbum || "";
        if (!albumName || albumName.length < 3) {
          toast.error("Album name is required (min 3 chars)");
          return;
        }
      }

      if (flow === "addStory") {
        if (!selectedAlbum) {
          toast.error("Please select an album");
          return;
        }
        const albumId = Number(selectedAlbum);
        if (Number.isNaN(albumId) || albumId <= 0) {
          toast.error("Invalid album id");
          return;
        }
      }
    }

    try {
      setLoading(true);

      const slidesPayload = [
        {
          file: selectedFile,
          mediaType,
          duration,
          order: 1,
        },
      ];

      if (mode === "admin") {
        if (flow === "addStoryToAlbum") {
          if (!onCreateAlbum) {
            toast.error("Admin create handler not provided");
            return;
          }
          const albumName =
            (adminTimer && adminTimer.trim()) ||
            selectedAlbum ||
            "New Album";
          await onCreateAlbum(albumName, [{ slides: slidesPayload }]);
          toast.success("Album & Story created");
          handleClose();
          return;
        }

        if (flow === "addStory") {
          if (!onAddStoryToAlbum) {
            toast.error("Admin add-story handler not provided");
            return;
          }
          const albumId = Number(selectedAlbum);
          await onAddStoryToAlbum(albumId, slidesPayload);
          toast.success("Story added to album");
          handleClose();
          return;
        }

        toast.error("Invalid admin flow");
        return;
      }

      const formData = new FormData();
      formData.append("Slides[0].MediaFile", selectedFile);
      formData.append("Slides[0].MediaType", mediaType);
      formData.append("Slides[0].Duration", String(duration));
      formData.append("Slides[0].Order", "1");

      if (description.trim()) {
        formData.append("Slides[0].Caption", description.trim());
      }
      if (link.trim()) {
        formData.append("Slides[0].LinkUrl", link.trim());
      }

      const response = await api.post(`/stories`, formData);

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

  const isEditAlbum = action === "edit" && flow === "addStoryToAlbum";
  const isEditStory = action === "edit" && flow === "addStory";

  const getModalTitle = () => {
    if (action === "edit") {
      if (flow === "addStory") {
        return mode === "admin" ? "Update Story (Admin)" : "Update Story";
      }
      if (flow === "addStoryToAlbum") {
        return mode === "admin" ? "Update Album (Admin)" : "Update Album";
      }
    }
    if (flow === "addStoryToAlbum") {
      return mode === "admin" ? "Add Album & Story (Admin)" : "Add Album & Story";
    }
    return mode === "admin" ? "Add Story (Admin)" : "Add Story (User)";
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-5 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">{getModalTitle()}</h2>
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-700">
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
              <button onClick={handleClose} className="px-4 py-2 text-sm bg-gray-200 rounded-lg">
                Cancel
              </button>
              <button onClick={handleClose} className="px-5 py-2 text-sm bg-blue-600 text-white rounded-lg">
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
              <button onClick={handleClose} className="px-4 py-2 text-sm bg-gray-200 rounded-lg">
                Cancel
              </button>
              <button onClick={handleClose} className="px-5 py-2 text-sm bg-blue-600 text-white rounded-lg">
                Update
              </button>
            </div>
          </>
        ) : (
          <>
            <MediaUploader
              file={selectedFile}
              previewUrl={previewUrl}
              onSelect={handleMediaSelect}
            />

            {mode === "admin" && flow === "addStory" && (
              <select
                value={selectedAlbum}
                onChange={(e) => setSelectedAlbum(e.target.value)}
                className="w-full px-3 py-2 text-sm border rounded-lg"
              >
                <option value="">Select Album</option>
                {adminAlbums.map((album) => (
                  <option key={album.id} value={album.id.toString()}>
                    {album.albumName}
                  </option>
                ))}
              </select>
            )}

            {mode === "user" && flow === "addStoryToAlbum" && (
              <select
                value={selectedAlbum}
                onChange={(e) => setSelectedAlbum(e.target.value)}
                className="w-full px-3 py-2 text-sm border rounded-lg"
              >
                <option value="">Select Album</option>
                <option value="1">Album 1</option>
              </select>
            )}

            {mode === "user" && flow === "addStory" && (
              <input
                type="text"
                placeholder="Album Name"
                value={selectedAlbum}
                onChange={(e) => setSelectedAlbum(e.target.value)}
                className="w-full px-3 py-2 text-sm border rounded-lg"
              />
            )}

            <input
              type="text"
              placeholder="Caption Story !"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-sm border rounded-lg"
            />

            {mode === "admin" && flow === "addStoryToAlbum" && (
              <input
                type="text"
                placeholder="Album Name"
                value={adminTimer}
                onChange={(e) => setAdminTimer(e.target.value)}
                className="w-full px-3 py-2 text-sm border rounded-lg"
              />
            )}

            <div className="flex justify-end gap-3 pt-2">
              <button onClick={handleClose} className="px-4 py-2 text-sm bg-gray-200 rounded-lg">
                Cancel
              </button>
              <button
                onClick={handlePublish}
                disabled={loading}
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

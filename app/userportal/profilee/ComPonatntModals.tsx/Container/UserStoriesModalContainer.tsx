"use client";

import { useContext, useEffect, useState, useCallback, useMemo } from "react";
import AddStoryModal from "../AddStoryModal";
import AddAlbumWithStoryModal from "../AddAlbumWithStoryModal";
import AddStoryToAlbumModal from "../AddStoryToAlbumModal";

import {
  addUserStory,
  createUserAlbumWithStory,
  addStoryToUserAlbum,
  getMyUserAlbums,
} from "../../services/userStories.service";
import AuthContext from "@/app/providers/AuthContext";
import { toast } from "sonner";
type OpenType = "story" | "albumWithStory" | "storyToAlbum" | null;
export default function UserStoriesModalContainer({ 
  openType, 
  onClose,
  onRefreshAlbums,
  onStoryAdded,
  parentAlbums = [],
}: any) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [albums, setAlbums] = useState<any[]>(parentAlbums);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { baseUrl } = useContext(AuthContext)!;
 

  // Sync albums
  useEffect(() => {
    setAlbums(parentAlbums);
  }, [parentAlbums]);

  const setMedia = useCallback((f: File | null) => {
    setFile(f);
    if (f) {
      setPreviewUrl(URL.createObjectURL(f));
    } else {
      setPreviewUrl(null);
    }
  }, []);

  const resetState = useCallback(() => {
    setFile(null);
    setPreviewUrl(null);
  }, []);

  const handleClose = useCallback(() => {
    resetState();
    setIsSubmitting(false);
    onClose();
  }, [resetState, onClose]);

  const loadAlbums = useCallback(async () => {
   
    try {
      const data = await getMyUserAlbums(baseUrl);
      setAlbums(data);
    } catch (error: any) {
      toast.error("Failed to load albums");
    }
  }, [baseUrl]);

  useEffect(() => {
    setAlbums(parentAlbums);
  }, [parentAlbums]);

  const handleAddStory = useCallback(async (data?: any) => {
    if (isSubmitting || !file) return;
    setIsSubmitting(true);
    try {
      await addUserStory({ file, baseUrl, caption: data?.caption });
      toast.success("Story added successfully");
      onStoryAdded?.();
      onRefreshAlbums?.();
      handleClose();
    } catch (error: any) {
      toast.error(error.message || "Failed to add story");
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, file, baseUrl, onStoryAdded, onRefreshAlbums, handleClose]);

  const handleCreateAlbum = useCallback(async (data: any) => {
    if (isSubmitting || !file ) return;
    setIsSubmitting(true);
    try {
      await createUserAlbumWithStory({
        albumName: data.albumName,
        files: [file],
      
        baseUrl,
        caption: data.caption,
      });
      toast.success("Album created successfully");
      handleClose();
      onRefreshAlbums?.();
    } catch (error: any) {
      toast.error(error.message || "Failed to create album");
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, file, baseUrl, onRefreshAlbums, handleClose]);

  const handleAddStoryToAlbum = useCallback(async (data: any) => {
    if (isSubmitting || !file) return;
    setIsSubmitting(true);
    try {
      await addStoryToUserAlbum({
        albumId: data.albumId,
        files: [file],
      
        baseUrl,
        caption: data.caption,
      });
      toast.success("Story added to album successfully");
      handleClose();
      onRefreshAlbums?.();
    } catch (error: any) {
      toast.error(error.message || "Failed to add story to album");
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, file, baseUrl, onRefreshAlbums, handleClose]);

  if (!openType) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center">
      <div className={`bg-white p-5 rounded-2xl w-[400px] space-y-3 relative ${isSubmitting ? 'pointer-events-none' : ''}`}>
        {isSubmitting && (
          <div className="absolute inset-0 bg-white/80 rounded-2xl flex items-center justify-center z-10">
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-gray-700">Processing...</span>
            </div>
          </div>
        )}
        
        {openType === "story" && (
          <AddStoryModal
            file={file}
            previewUrl={previewUrl}
            setFile={setMedia}
            onSubmit={handleAddStory}
            onClose={handleClose}
          />
        )}

        {openType === "albumWithStory" && (
          <AddAlbumWithStoryModal
            file={file}
            previewUrl={previewUrl}
            setFile={setMedia}
            onSubmit={handleCreateAlbum}
            onClose={handleClose}
            isSubmitting={isSubmitting}
          />
        )}

        {openType === "storyToAlbum" && (
          <AddStoryToAlbumModal
            file={file}
            previewUrl={previewUrl}
            setFile={setMedia}
            onSubmit={handleAddStoryToAlbum}
            onClose={handleClose}
            albums={albums}
            isSubmitting={isSubmitting}
          />
        )}
      </div>
    </div>
  );
}

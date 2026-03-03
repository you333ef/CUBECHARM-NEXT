"use client";

import { useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import AuthContext from "@/app/providers/AuthContext";
import { EllipsisVertical } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import PostOptionDialogClient from "@/app/userportal/activity/componants/PostOptionsClient";
import HeadlessDemo from "@/app/adminPortl/sharedAdmin/DELETE_CONFIRM";
import api from "@/app/AuthLayout/refresh";

type Slide = {
  id: number;
  mediaUrl: string;
};
type Album = {
  id: number;
  albumName: string;
  slides: Slide[];
};
type ViewerMode = "viewer" | "owner" | "admin";
export default function StoriesProfilee({
  albums: initialAlbums,
  loading = false,
  onAlbumsChange,
  viewerMode = "viewer",
  onRequestAddAlbumWithStory,
  onRequestAddStoryToAlbum,
}: {
  albums: Album[];
  loading?: boolean;
  onAlbumsChange?: (albums: Album[]) => void;
  viewerMode?: ViewerMode;
  onRequestAddAlbumWithStory?: () => void;
  onRequestAddStoryToAlbum?: () => void;
}) {

  const { baseUrl } = useContext(AuthContext)!;
  const pathname = typeof window !== "undefined" ? window.location.pathname : undefined;
  const [alignClass, setAlignClass] = useState("justify-center items-center");

  useEffect(() => {
    if (pathname === "/" || pathname === "") {
      setAlignClass("justify-start items-center");
    } else {
      setAlignClass("justify-center items-center");
    }
  }, [pathname]);

  const [albums, setAlbums] = useState<Album[]>(initialAlbums);
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);
  const [deletingAlbumId, setDeletingAlbumId] = useState<number | null>(null);
  const [updatingAlbum, setUpdatingAlbum] = useState<Album | null>(null);
  const [updateAlbumName, setUpdateAlbumName] = useState("");

  // Sync from props
  useEffect(() => {
    setAlbums(initialAlbums);
  }, [initialAlbums])
 
  const openStory = (albumId: number) => {
    const cleanedAlbums = albums.map(album => ({
      ...album,
      slides: album.slides?.filter(slide => slide.mediaUrl && slide.mediaUrl.trim() !== "") || []
    })).filter(album => album.slides.length > 0);
    
    window.dispatchEvent(
      new CustomEvent("openStory", {
        detail: {
          albums: cleanedAlbums,
          startAlbumId: albumId,
        },
      })
    );
  };

  const handleDeleteAlbum = async (albumId: number) => {
    try {
      await api.delete(`/albums/${albumId}`, 
    
    );

      const updatedAlbums = albums.filter((a) => a.id !== albumId);
      setAlbums(updatedAlbums);
      onAlbumsChange?.(updatedAlbums);

      toast.success("Album deleted successfully");
      setDeletingAlbumId(null);
      setMenuOpenId(null);
    } catch (error: any) {
      const msg = error?.response?.data?.message || "Failed to delete album";
      toast.error(msg);
    }
  };

  const handleUpdateAlbum = async () => {
    if (!updatingAlbum || !updateAlbumName.trim()) {
      toast.error("Album name cannot be empty");
      return;
    }

    try {
      await api.put(
        `/albums/${updatingAlbum.id}/name`,
        { albumName: updateAlbumName },
      
      );

      const updatedAlbums = albums.map((a) =>
        a.id === updatingAlbum.id ? { ...a, albumName: updateAlbumName } : a
      );
      setAlbums(updatedAlbums);
      onAlbumsChange?.(updatedAlbums);

      toast.success("Album name updated successfully");
      setUpdatingAlbum(null);
      setUpdateAlbumName("");
      setMenuOpenId(null);
    } catch (error: any) {
      const msg = error?.response?.data?.message || "Failed to update album";
      toast.error(msg);
    }
  };
  const isVideo = (url: string) => /\.(mp4|webm|ogg)$/i.test(url);

  return (
    <>
      <div className="overflow-visible">
        <div className={`flex gap-3 overflow-x-auto py-4 px-2 scrollbar-hide ${alignClass}`}>
        {viewerMode === "owner" && !loading && (
          <>
            <div className="flex-shrink-0 flex flex-col items-center gap-2">
              <button
                onClick={onRequestAddAlbumWithStory}
                className="p-[2px] rounded-xl bg-gray-400 hover:bg-gray-500 transition cursor-pointer"
              >
                <div className="bg-white p-1 rounded-xl">
                  <div className="w-16 h-16 rounded-xl bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition">
                    <span className="text-2xl text-gray-600 font-light">+</span>
                  </div>
                </div>
              </button>
              <span className="text-xs text-gray-700 truncate max-w-20 text-center">
                New Album
              </span>
            </div>

            <div className="flex-shrink-0 flex flex-col items-center gap-2">
              <button
                onClick={onRequestAddStoryToAlbum}
                className="p-[2px] rounded-xl bg-gray-400 hover:bg-gray-500 transition cursor-pointer"
              >
                <div className="bg-white p-1 rounded-xl">
                  <div className="w-16 h-16 rounded-xl bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition">
                    <span className="text-2xl text-gray-600 font-light">+</span>
                  </div>
                </div>
              </button>
              <span className="text-xs text-gray-700 truncate max-w-20 text-center">
                Add to Album
              </span>
            </div>
          </>
        )}
        {loading ? (
          Array(3)
            .fill(0)
            .map((_, i) => (
              <div key={`skeleton-${i}`} className="flex-shrink-0 flex flex-col items-center gap-2">
                <div className="p-[2px] rounded-xl bg-gray-300 animate-pulse">
                  <div className="bg-gray-200 p-1 rounded-xl">
                    <div className="w-16 h-16 rounded-xl bg-gray-300 animate-pulse" />
                  </div>
                </div>
                <div className="w-16 h-4 bg-gray-300 rounded animate-pulse" />
              </div>
            ))
        ) : (
          albums.map((album) => {
            const validSlides = album.slides?.filter(slide => slide.mediaUrl && slide.mediaUrl.trim() !== "") || [];
            const firstSlide = validSlides[0];
            if (!firstSlide) return null;
            return (
              <div key={album.id} className="flex-shrink-0">
                <div className="relative flex flex-col items-center gap-2">
                  <div
                    onClick={() => openStory(album.id)}
                    className="p-[2px] rounded-xl bg-blue-500 relative cursor-pointer hover:opacity-90 transition"
                  >
                    <div className="bg-white p-1 rounded-xl">
                      <div className="w-16 h-16 rounded-xl overflow-hidden">
                         {isVideo(firstSlide.mediaUrl) ? (
    <video
      src={`http://localhost:5000/${firstSlide.mediaUrl}`}
      className="w-full h-full object-cover"
      width={64}
      height={64}
      muted
      playsInline
      preload="metadata"
    />
  ) : (
    <img
      src={`http://localhost:5000/${firstSlide.mediaUrl}`}
      alt={album.albumName}
      className="w-full h-full object-cover"
      width={64}
      height={64}
      loading="lazy"
      decoding="async"
    />
  )}
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpenId(menuOpenId === album.id ? null : album.id);
                      }}
                      className="absolute top-0 right-0 p-1 bg-white rounded-full shadow-md hover:bg-gray-100 transition"
                      type="button"
                      style={{ display: viewerMode === "owner" ? "flex" : "none" }}
                    >
                      <EllipsisVertical size={16} className="text-gray-700" />
                    </button>
                  </div>

                  <span className="text-xs text-gray-700 truncate max-w-20">
                    {album.albumName}
                  </span>

                  {viewerMode === "owner" && (
                    <PostOptionDialogClient
                      open={menuOpenId === album.id}
                      onClose={() => setMenuOpenId(null)}
                      isOwner={true}
                      postId={album.id}
                      showUpdate={true}
                      onDelete={() => {
                        setDeletingAlbumId(album.id);
                        setMenuOpenId(null);
                      }}
                      onUpdate={() => {
                        setUpdatingAlbum(album);
                        setUpdateAlbumName(album.albumName);
                        setMenuOpenId(null);
                      }}
                      onReport={() => {}}
                    />
                  )}
                </div>
              </div>
            );
          })
        )}
        </div>
      </div>

      {deletingAlbumId && (
        <HeadlessDemo
          key={`delete-album-${deletingAlbumId}`}
          DeleteTrue={() => handleDeleteAlbum(deletingAlbumId)}
          onCancel={() => setDeletingAlbumId(null)}
          name={albums.find((a) => a.id === deletingAlbumId)?.albumName || ""}
          actionType="delete"
        />
      )}

      {updatingAlbum && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => {
              setUpdatingAlbum(null);
              setUpdateAlbumName("");
            }}
          />
          <div className="relative z-10 w-full max-w-md bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-medium mb-3">Update album name</h3>

            <label className="text-sm text-gray-600">Old name</label>
            <input
              type="text"
              value={updatingAlbum.albumName}
              readOnly
              className="w-full border rounded px-3 py-2 mt-1 mb-3 bg-gray-100"
            />

            <label className="text-sm text-gray-600">New name</label>
            <input
              type="text"
              value={updateAlbumName}
              onChange={(e) => setUpdateAlbumName(e.target.value)}
              className="w-full border rounded px-3 py-2 mt-1 mb-4"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setUpdatingAlbum(null);
                  setUpdateAlbumName("");
                }}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                type="button"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateAlbum}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                type="button"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

import { useState } from "react";
import axios from "axios";
import api from "@/app/AuthLayout/refresh";

export interface AdMedia {
  id?: number;
  uid?: string; 
  file?: File;
  url?: string;
  type: "image" | "video";
  isMain: boolean;
  status?: "pending" | "uploaded" | "error";
}

interface UseAdMediaProps {
  baseUrl: string;
 
}

export const useAdMedia = ({  }: UseAdMediaProps) => {
  const [media, setMedia] = useState<AdMedia[]>([]);
  const [mainMediaCount, setMainMediaCount] = useState(0);

  // Add new media files
  const addMedia = (files: FileList | null, type: "image" | "video") => {
    if (!files) return;

    setMedia((prev) => {
      const hasMain = prev.some((m) => m.isMain);

      const newMedia: AdMedia[] = Array.from(files).map((file, index) => ({
        uid: `${Date.now()}-${Math.random()}`,
        file,
        url: URL.createObjectURL(file),
        type,
        isMain: !hasMain && index === 0 && type === "image",
        status: "pending",
      }));

      return [...prev, ...newMedia];
    });
  };

  // Remove media by id, uid, or index
  const removeMedia = (identifier: number | string) => {
    setMedia((prev) => {
      const updated = prev.filter((item) => {
        // Match by API id
        if (item.id && item.id === identifier) return false;
        // Match by uid (local media)
        if (item.uid && item.uid === identifier) return false;
        return true;
      });

      //  object URLs for removed items
      prev.map((item) => {
        if (!updated.includes(item) && item.url?.startsWith("blob:")) {
          URL.revokeObjectURL(item.url);
        }
      });

      return updated;
    });
  };

  // Set/unset main media (support up to 2 main images)
  const setMain = (identifier: number | string) => {
    setMedia((prev) =>
      prev.map((item) => {
        // Match by id or uid
        const isMatch = (item.id && item.id === identifier) || (item.uid && item.uid === identifier);

        if (isMatch) {
          // Toggle if already main
          if (item.isMain) {
            return { ...item, isMain: false };
          }

          // If already have 2 main items, don't add more
          const mainCount = prev.filter((m) => m.isMain).length;
          if (mainCount >= 2) {
            return item;
          }

          return { ...item, isMain: true };
        }

        return item;
      })
    );

    // Update count
    const newCount = media.filter((m) => m.isMain).length;
    setMainMediaCount(newCount);
  };

  // Sync API media on load (merges with existing local media, doesn't overwrite)
  const syncFromApi = (apiMedia: any[], baseURL?: string) => {
    const defaultBaseUrl = "http://localhost:5000";
    const finalBaseUrl = baseURL || defaultBaseUrl;
    
    const synced: AdMedia[] = apiMedia.map((item) => ({
      id: item.mediaId,
      url: `${finalBaseUrl}/${item.localPath}`,
      type: "image",
      isMain: item.isMain,
      status: "uploaded",
    }));

    // Merge: Keep API media + preserve any pending local uploads
    setMedia((prev) => {
      const pendingLocal = prev.filter((m) => m.status === "pending");
      return [...synced, ...pendingLocal];
    });
    
    const mainCount = synced.filter((m) => m.isMain).length;
    setMainMediaCount(mainCount);
  };

  // Upload new media files (not from API)
  const uploadNewMedia = async (propertyId: number) => {
    const pendingMedia = media.filter((m) => m.status === "pending" && m.file);

    if (pendingMedia.length === 0) return;

    // Upload in parallel
    const uploadPromises = pendingMedia.map(async (item) => {
      if (!item.file) return;

      const formData = new FormData();
      formData.append("File", item.file);
      formData.append("MediaType", item.type === "image" ? "1" : "2");
      formData.append("IsMain", String(item.isMain));
      formData.append("Caption", "temp");
      formData.append("AnyRequiredField1", "temp");
      formData.append("AnyRequiredField2", "temp");

      try {
        const res = await api.post(
          `/Property/${propertyId}/media`,
          formData,
         
        );

        return { file: item.file, status: "uploaded" as const, id: res.data?.data?.mediaId };
      } catch (error) {
        return { file: item.file, status: "error" as const };
      }
    });

    const results = await Promise.all(uploadPromises);

    // Update media statuses and add returned ID
    setMedia((prev) =>
      prev.map((item) => {
        const result = results.find((r) => r?.file === item.file);
        if (result) {
          return { ...item, status: result.status, id: result.id };
        }
        return item;
      })
    );
  };

  // Set main media on API (for update mode)
  const setMainOnApi = async (propertyId: number, mediaId: number) => {
    try {
      await api.patch(
        `/Property/${propertyId}/media/${mediaId}/set-main`,
        {},
      
      );

      // Update local state
      setMedia((prev) =>
        prev.map((item) => {
          if (item.id === mediaId) {
            const newIsMain = !item.isMain;
            // If enabling main, check 2-main limit
            if (newIsMain) {
              const mainCount = prev.filter((m) => m.isMain).length;
              if (mainCount >= 2) return item;
            }
            return { ...item, isMain: newIsMain };
          }
          return item;
        })
      );
    } catch (error) {
      console.error("Failed to set main media", error);
      throw error;
    }
  };

  // Delete media from API
  const deleteMediaFromApi = async (propertyId: number, mediaId: number) => {
    try {
      await api.delete(
        `/Property/${propertyId}/media/${mediaId}`,
        
      );

      // Remove from local state
      removeMedia(mediaId);
    } catch (error) {
      console.error("Failed to delete media", error);
      throw error;
    }
  };

  // Get count of different media types
  const getMediaStats = () => {
    const images = media.filter((m) => m.type === "image").length;
    const videos = media.filter((m) => m.type === "video").length;
    const mainCount = media.filter((m) => m.isMain).length;
    const totalCount = media.length;

    return { images, videos, mainCount, totalCount };
  };

  // Validation
  const validateMedia = () => {
    return {
      hasMinimum: media.length >= 4,
      mainCount: media.filter((m) => m.isMain).length,
      totalCount: media.length,
      error:
        media.length < 4
          ? `A minimum of 4 media items is required. You have ${media.length}`
          : null,
    };
  };

  return {
    media,
    mainMediaCount,
    addMedia,
    removeMedia,
    setMain,
    syncFromApi,
    uploadNewMedia,
    setMainOnApi,
    deleteMediaFromApi,
    getMediaStats,
    validateMedia,
  };
};

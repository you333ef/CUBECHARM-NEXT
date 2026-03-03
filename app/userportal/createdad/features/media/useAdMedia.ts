import { useState } from "react";
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

export const useAdMedia = ({ }: UseAdMediaProps) => {
  const [media, setMedia] = useState<AdMedia[]>([]);
  const [mainMediaCount, setMainMediaCount] = useState(0);

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

  const removeMedia = (identifier: number | string) => {
    setMedia((prev) => {
      const updated = prev.filter((item) => {
        if (item.id && item.id === identifier) return false;
        if (item.uid && item.uid === identifier) return false;
        return true;
      });

      prev.forEach((item) => {
        if (!updated.includes(item) && item.url?.startsWith("blob:")) {
          URL.revokeObjectURL(item.url);
        }
      });

      return updated;
    });
  };

  const setMain = (identifier: number | string) => {
    setMedia((prev) => {
      const target = prev.find(
        (item) =>
          item.type === "image" &&
          ((item.id && item.id === identifier) || (item.uid && item.uid === identifier))
      );

      const shouldSetMain = target ? !target.isMain : true;

      const updated = prev.map((item) => {
        if (item.type === "video" && item.isMain) {
          return { ...item, isMain: false };
        }

        const isMatch =
          item.type === "image" &&
          ((item.id && item.id === identifier) || (item.uid && item.uid === identifier));

        if (isMatch) {
          return { ...item, isMain: shouldSetMain };
        }

        if (shouldSetMain && item.type === "image") {
          return { ...item, isMain: false };
        }

        return item;
      });

      const newCount = updated.filter((m) => m.isMain && m.type === "image").length;
      setMainMediaCount(newCount);
      return updated;
    });
  };

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

    setMedia((prev) => {
      const pendingLocal = prev.filter((m) => m.status === "pending");
      return [...synced, ...pendingLocal];
    });

    const mainCount = synced.filter((m) => m.isMain).length;
    setMainMediaCount(mainCount);
  };

  const uploadNewMedia = async (propertyId: number) => {
    const pendingMedia = media.filter((m) => m.status === "pending" && m.file);

    if (pendingMedia.length === 0) return [];

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
        const res = await api.post(`/Property/${propertyId}/media`, formData, {});

        return {
          file: item.file,
          status: "uploaded" as const,
          id: res.data?.data?.mediaId,
        };
      } catch {
        return { file: item.file, status: "error" as const };
      }
    });

    const results = await Promise.all(uploadPromises);

    setMedia((prev) =>
      prev.map((item) => {
        const result = results.find((r) => r?.file === item.file);
        if (result) {
          return { ...item, status: result.status, id: result.id };
        }
        return item;
      })
    );
    return results;
  };

  const setMainOnApi = async (propertyId: number, mediaId: number) => {
    try {
      await api.patch(`/Property/${propertyId}/media/${mediaId}/set-main`, {}, {});

      setMedia((prev) => {
        const updated = prev.map((item) => {
          if (item.type === "video" && item.isMain) {
            return { ...item, isMain: false };
          }

          if (item.id === mediaId && item.type === "image") {
            const newIsMain = !item.isMain;

            if (!newIsMain) {
              return { ...item, isMain: false };
            }

            return { ...item, isMain: true };
          }

          if (item.type === "image") {
            return { ...item, isMain: false };
          }

          return item;
        });
        const mainCount = updated.filter((m) => m.isMain && m.type === "image").length;
        setMainMediaCount(mainCount);
        return updated;
      });
    } catch (error) {
      console.error("Failed to set main media", error);
      throw error;
    }
  };
  const deleteMediaFromApi = async (propertyId: number, mediaId: number) => {
    try {
      await api.delete(`/Property/${propertyId}/media/${mediaId}`, {});
      removeMedia(mediaId);
    } catch (error) {
      console.error("Failed to delete media", error);
      throw error;
    }
  };

  const getMediaStats = () => {
    const images = media.filter((m) => m.type === "image").length;
    const videos = media.filter((m) => m.type === "video").length;
    const mainCount = media.filter((m) => m.isMain).length;
    const totalCount = media.length;

    return { images, videos, mainCount, totalCount };
  };

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


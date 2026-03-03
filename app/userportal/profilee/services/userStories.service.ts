// userStories.service.ts
import api from "@/app/AuthLayout/refresh";
import axios from "axios";

interface AddStoryPayload {
  file: File;
  duration?: number;
  caption?: string;
  accessToken?: string;
  baseUrl: string;
}

export const addUserStory = async ({
  file,
  duration = 5,
  caption,
  accessToken,
  baseUrl,
}: AddStoryPayload) => {
  const formData = new FormData();

  formData.append("Slides[0].MediaFile", file);
  formData.append(
    "Slides[0].MediaType",
    file.type.startsWith("video") ? "Video" : "Image"
  );
  formData.append("Slides[0].Duration", String(duration));
  formData.append("Slides[0].Order", "1");
  formData.append("Slides[0].Caption", caption?.trim() || "");

  try {
    const res = await api.post(
      `/stories`,
      formData,
      {
        
        timeout: 30000, 
      }
    );

    if (res.data?.success) {
      return res.data.data;
    }

    throw new Error(res.data?.message || "Failed to add story");
  } catch (error: any) {
    if (error.code === 'ECONNABORTED') {
      throw new Error("Upload timeout - please try again with a smaller file");
    }
    throw error;
  }
};

interface CreateAlbumPayload {
  albumName: string;
  files: File[];
  accessToken?: string;
  baseUrl: string;
}

export const createUserAlbumWithStory = async ({
  albumName,
  files,
  accessToken,
  baseUrl,
  caption,
}: {
  albumName: string;
  files: File[];
  accessToken?: string;
  baseUrl: string;
  caption?: string;
}) => {
  const formData = new FormData();
  formData.append("AlbumName", albumName);

  files.forEach((file, index) => {
    const isVideo = file.type.startsWith("video");

    formData.append(`Slides[${index}].MediaFile`, file);
    formData.append(`Slides[${index}].MediaType`, isVideo ? "Video" : "Image");
    formData.append(`Slides[${index}].Caption`, caption?.trim() || "");
    formData.append(`Slides[${index}].LinkUrl`, "");
    formData.append(`Slides[${index}].DisplayOrder`, (index + 1).toString());
  });

  try {
    const res = await api.post(`/albums`, formData, {
     
      timeout: 30000, 
    });

    return res.data?.data || res.data;
  } catch (error: any) {
    if (error.code === 'ECONNABORTED') {
      throw new Error("Upload timeout - please try again with a smaller file");
    }
    throw error;
  }
};

interface AddStoryToAlbumPayload {
  albumId: string;
  files: File[];
  caption?: string;
  accessToken?: string;
  baseUrl: string;
}

export const addStoryToUserAlbum = async ({
  albumId,
  files,
  caption,
}: AddStoryToAlbumPayload) => {
  const formData = new FormData();

  formData.append("AlbumId", String(albumId));

  files.forEach((file, index) => {
    const isVideo = file.type.startsWith("video");

    formData.append(`Slides[${index}].MediaFile`, file);
    formData.append(
      `Slides[${index}].MediaType`,
      isVideo ? "Video" : "Image"
    );
    formData.append(
      `Slides[${index}].Duration`,
      String(isVideo ? 10 : 5)
    );
    formData.append(
      `Slides[${index}].Order`, 
      String(index + 1)
    );
    formData.append(
      `Slides[${index}].Caption`,
      caption?.trim() || ""
    );
  });
  
  const res = await api.post(
    `/albums/add-story`,
    formData,
    {
      timeout: 30000,
    }
  );

  return res.data?.data || res.data;
};

export const getMyUserAlbums = async (
  baseUrl: string,
  accessToken?: string
) => {
  try {
    const res = await api.get(`/albums/my-albums`);

    return res.data.data;
  } catch (error: any) {
    throw error;
  }
};
 
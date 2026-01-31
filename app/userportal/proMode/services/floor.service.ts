import axios from "axios";

export const createFloorPlan = async ({
  baseUrl,
  accessToken,
  propertyId,
  payload,
}: {
  baseUrl: string;
  accessToken: string | null;
  propertyId: number;
  payload: {
    floorNumber: number;
    gridCellsX: number;
    gridCellsY: number;
    multiImageCount: number;
    backgroundImage: File;
  };
}) => {
  // validation before hitting the API
  if (!accessToken) {
    throw new Error("Session expired. Please login again.");
  }
  if (!payload?.backgroundImage) {
    throw new Error("Background image is required");
  }
  try {
    const formData = new FormData();
    // Floor configuration
    formData.append("FloorNumber", String(payload.floorNumber));
    formData.append("GridCellsX", String(payload.gridCellsX));
    formData.append("GridCellsY", String(payload.gridCellsY));
    formData.append("MultiImageCount", String(payload.multiImageCount));
    formData.append("BackgroundImageFile", payload.backgroundImage);
    const response = await axios.post(
      `${baseUrl}/properties/${propertyId}/floors`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
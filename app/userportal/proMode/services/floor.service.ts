import api from "@/app/AuthLayout/refresh";

export const createFloorPlan = async ({
  baseUrl,
 
  propertyId,
  payload,
}: {
  baseUrl: string;

  propertyId: number;
  payload: {
    floorNumber: number;
    gridCellsX: number;
    gridCellsY: number;
    multiImageCount: number;
    backgroundImage: File;
  };
}) => {
  
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
    const response = await api.post(
      `/properties/${propertyId}/floors`,
      formData,
      
    );
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
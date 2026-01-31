"use client";
import React, { useState, useRef, useContext, useEffect } from "react";
import { FiUpload, FiTrash2, FiImage, FiX, FiMoreHorizontal, FiInfo, FiPlus } from "react-icons/fi";
import { toast } from 'sonner';
import HeadlessDemo from "../componants/shared/DELETE_CONFIRM";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import AuthContext from "@/app/providers/AuthContext";
import FloorPlanInstructionsModal from "./floor-plan/FloorPlanInstructionsModal";
import CellActionsModal from "./floor-plan/CellActionsModal";
import { createFloorPlan } from "./services/floor.service";
import CenterGrid from "./components/floor/CenterGrid";
import GridAxis from "./components/floor/GridAxis";
interface CellData {
  id: string;
  images: File[];
  imageUrls: string[];
}
interface FloorData {
  id: number;
  width: number;
  height: number;
  cells: Record<string, CellData>;
  gridBackgroundFile: File | null;
  gridBackgroundUrl: string | null;
  multiImageCount: number;
  apiFloorId?: number;
}
const Pro_Mode_Cycle = () => {
  // ( id from query)
  const searchParams = useSearchParams();
  const propertyId = Number(searchParams.get("id") ?? searchParams.get("propertyId"));
  const router = useRouter();
// Auth context & API base config
  const auth = useContext(AuthContext)!;
  const { baseUrl } = auth;
  const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
// Floor data model (all floors with their grid + cells)
  const [floors, setFloors] = useState<FloorData[]>([
    {
      id: 1,
      width: 0,
      height: 0,
      cells: {},
      gridBackgroundFile: null,
      gridBackgroundUrl: null,
      multiImageCount: 1
    }
  ]);
  // Currently active floor 
  const [currentFloorIndex, setCurrentFloorIndex] = useState(0);
  const currentFloor = floors[currentFloorIndex];
  const backgroundInputRef = useRef<HTMLInputElement>(null);
  // UI interaction
  const [hoveredCell, setHoveredCell] = useState<string | null>(null);
  const [selectedCellForMenu, setSelectedCellForMenu] = useState<string | null>(null);
  // Pending action on a cell (add&update images)
  const [actionCell, setActionCell] = useState<{ cellId: string; action: 'add' | 'update' } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // UI modals & confirmation
  const [showInstructions, setShowInstructions] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  // Submission & async operation states
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

const updateFloorAtIndex = (
  index: number,
  updater: (floor: FloorData) => FloorData
) => {
  setFloors(prev => {
    const copy = [...prev];
    copy[index] = updater(copy[index]);
    return copy;
  });
};
const updateCell = (
  cellId: string,
  updater: (cell?: CellData) => CellData | undefined
) => {
  updateFloorAtIndex(currentFloorIndex, floor => {
    const nextCells = { ...floor.cells };
    const updatedCell = updater(nextCells[cellId]);

    if (!updatedCell) {
      delete nextCells[cellId];
    } else {
      nextCells[cellId] = updatedCell;
    }

    return {
      ...floor,
      cells: nextCells,
    };
  });
};

  // Effect check params are valid
  useEffect(() => {
    if (!propertyId || isNaN(propertyId)) {
      toast.error("Invalid property ID");
       router.back();
      return;
    }
  }, [propertyId]);
  
// Important Fun => Upload all cell images for the current floor in batches
const uploadFloorCellsImages = async (floorId?: number) => {
  // Get  floor id from API 
  const targetFloor = floors[currentFloorIndex];
  const id = floorId ?? targetFloor?.apiFloorId;
  if (!id) toast.dismiss("NO FLOOR ID Now");
  // Collect only cells that contain new image files
  const cellsMap = new Map<string, { col: number; row: number; files: File[] }>();
  Object.entries(floors[currentFloorIndex].cells).forEach(([cellId, cell]: any) => {
    const imgs: File[] = cell?.images ?? [];
    if (!imgs.length) return;
    // Extract row&col from cell id
    const [, rowStr, colStr] = cellId.split("-");
    const row = Number(rowStr);
    const col = Number(colStr);
    const key = `${col}-${row}`;
    cellsMap.set(key, { col, row, files: imgs });
  });
  const totalCells = cellsMap.size;
  if (totalCells === 0) toast.dismiss("no Images - nothing to upload");
  const allKeys = Array.from(cellsMap.keys());
  const BATCH_SIZE = 10; // upload 10 cells per request
  let processedCells = 0;
  const aggregatedResults: any[] = [];
  let aggregatedTotalImages = 0;
  // Split uploads into batches to avoid request
  const batchPromises = Array.from({ length: Math.ceil(allKeys.length / BATCH_SIZE) }).map(async (_, batchIndex) => {
    const i = batchIndex * BATCH_SIZE;
    const batchKeys = allKeys.slice(i, i + BATCH_SIZE);
    const formData = new FormData();
    const batchCellKeys = new Set<string>();
    // Add files of this batch to FormData using API field format
    batchKeys.forEach((k) => {
      const entry = cellsMap.get(k)!;
      entry.files.forEach((file, h) => {
        const fieldName = `Cell${entry.row}[${entry.col}][${h}]`;
        formData.append(fieldName, file);
        batchCellKeys.add(`${entry.col}-${entry.row}`);
      });
    });
    // Send batch to server
    const resp = await axios.post(
      `${baseUrl}/properties/${propertyId}/floors/${id}/cells/batch-upload`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    // Collect server response info
    if (resp?.data?.data) {
      aggregatedTotalImages += resp.data.data.totalImagesUploaded || 0;
      if (Array.isArray(resp.data.data.results)) {
        aggregatedResults.push(...resp.data.data.results);
      }
    }
    // Update progress based on finished cells
    processedCells += batchCellKeys.size;
    setUploadProgress(Math.min(1, processedCells / totalCells));
  });
  // Wait for all batches to finish
  await Promise.all(batchPromises);
  // Final result summary
  return {
    success: true,
    data: {
      totalCellsProcessed: processedCells,
      totalImagesUploaded: aggregatedTotalImages,
      results: aggregatedResults,
    },
  };
};
 // Create floor upload its images, then submit it
const handleCreateAndSubmitFloor = async () => {
  // Prevent double submit (To safe)
  if (isLoading || isSubmitted) return;
  setIsLoading(true);
  try {
    //  current UI state into floors array
    const updatedFloors = [...floors];
    updatedFloors[currentFloorIndex] = {
      ...updatedFloors[currentFloorIndex],
      width: currentFloor.width,
      height: currentFloor.height,
      cells: floors[currentFloorIndex].cells,
      gridBackgroundFile: currentFloor.gridBackgroundFile,
      gridBackgroundUrl: currentFloor.gridBackgroundUrl,
      multiImageCount: currentFloor.multiImageCount,
    };
    setFloors(updatedFloors);
    let apiFloorId = updatedFloors[currentFloorIndex].apiFloorId;
    // If floor not created yet create it first
    if (!apiFloorId) {
      if (!(currentFloor.gridBackgroundFile instanceof File)) {
        toast.error("Background image is required");
        setIsLoading(false);
        return;
      }
      const created = await createFloorPlan({
        baseUrl,
        accessToken,
        propertyId,
        payload: {
          gridCellsX: currentFloor.width,
          gridCellsY: currentFloor.height,
          floorNumber: updatedFloors[currentFloorIndex].id,
          multiImageCount: currentFloor.multiImageCount,
          backgroundImage: currentFloor.gridBackgroundFile,
        },
      });
      apiFloorId = created?.data?.id ?? created?.id ?? null;
      if (!apiFloorId) toast.error("NO FLOOR ID");
      // Save new API floor id locally
      updatedFloors[currentFloorIndex].apiFloorId = apiFloorId;
      setFloors(updatedFloors);
    }
    // Upload all cell images for this floor
    setUploadProgress(0);
    const uploadResp = await uploadFloorCellsImages(Number(apiFloorId));
    if (uploadResp?.data) {
      const processed = uploadResp.data.totalCellsProcessed ?? 0;
      const imagesUploaded = uploadResp.data.totalImagesUploaded ?? 0;
      toast.success(`Uploaded ${processed} cells, ${imagesUploaded} images`);
      setUploadProgress(1);
    }
    // Final submit step (mark floor as completed in backend)
    await axios.post(
      `${baseUrl}/properties/${propertyId}/floors/${apiFloorId}/submit-promode`,
      null,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    // After successful submit reset local state and go back
    setIsSubmitted(true);
  router.replace(`/userportal/property/${propertyId}`);
    setFloors(prev => {
      const up = [...prev];
      up[currentFloorIndex] = { ...up[currentFloorIndex], cells: {} };
      return up;
    });
    toast.success("Floor created and submitted successfully");
   
  } catch (error: any) {
    console.error("handleCreateAndSubmitFloor error:", error);
    // Handle known errors
    if (error?.message === "NO FLOOR ID") {
      toast.error("Missing floor id");
    } else if (error?.message) {
      toast.error(error.message);
    } else if (axios.isAxiosError(error)) {
      const serverMessage =
        error.response?.data?.message ||
        error.response?.data?.errors?.join(", ") ||
        "Submission failed";
      toast.error(serverMessage);
    } else {
      toast.error("submit failed");
      router.back(); // TODO: maybe redirect to a safer page
    }
  } finally {
    setIsLoading(false);
    setUploadProgress(0);
  }
};
// Update grid width from input
const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  updateFloorAtIndex(currentFloorIndex, floor => ({
    ...floor,
    width: Number(e.target.value),
  }));
};
// Update grid height from input
const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  updateFloorAtIndex(currentFloorIndex, floor => ({
    ...floor,
    height: Number(e.target.value),
  }));
};
 // Handle image upload for a grid cell (server or local)
const handleImageUpload = async (
  cellId: string,
  event: React.ChangeEvent<HTMLInputElement>
) => {
  const files = event.target.files;
  if (!files || files.length === 0) return;
  const fileArray = Array.from(files);
  // Create mode store locally
    addImagesLocally(cellId, fileArray);
  // Reset input value
  event.target.value = "";
};
// Store images locally before final submit
const addImagesLocally = (cellId: string, files: File[]) => {
  const urls = files.map(file => URL.createObjectURL(file));
  updateCell(cellId, cell => ({
    id: cellId,
    images: [...(cell?.images ?? []), ...files],
    imageUrls: [...(cell?.imageUrls ?? []), ...urls],
  }));
  toast.success("Images added (local)");
};
// Handle deleting images from a cell (server or local)
const handleImageDelete = async (cellId: string) => {
  // Create mode => delete locally
    deleteImagesLocally(cellId);
  // Close context menu after delete
  setSelectedCellForMenu(null);
};
// Delete cell images locally before submit
const deleteImagesLocally = (cellId: string) => {
  updateCell(cellId, cell => {
    if (!cell) return undefined;

    cell.imageUrls.forEach(URL.revokeObjectURL);
    return undefined; // remove cell
  });

  toast.success("Images removed (local)");
};
// Increment + DecreMent In Cell
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  if (!actionCell) return;
  const files = event.target.files;
  if (!files || files.length === 0) return;
  const fileArray = Array.from(files);
  const urls = fileArray.map(file => URL.createObjectURL(file));
  updateCell(actionCell.cellId, cell => {
    if (actionCell.action === 'update') {
      cell?.imageUrls.forEach(URL.revokeObjectURL);
      return {
        id: actionCell.cellId,
        images: fileArray,
        imageUrls: urls,
      };
    }
    return {
      id: actionCell.cellId,
      images: [...(cell?.images ?? []), ...fileArray],
      imageUrls: [...(cell?.imageUrls ?? []), ...urls],
    };
  });

  event.target.value = '';
  setActionCell(null);
  setSelectedCellForMenu(null);
};

  const handleBackgroundUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (currentFloor.gridBackgroundUrl) {
      URL.revokeObjectURL(currentFloor.gridBackgroundUrl);
    }
    const url = URL.createObjectURL(file);
    updateFloorAtIndex(currentFloorIndex, floor => ({
      ...floor,
      gridBackgroundFile: file,
      gridBackgroundUrl: url,
    }));
    event.target.value = '';
  };
 // Clear background and reset grid data
const removeBackground = () => {
  if (currentFloor.gridBackgroundUrl?.startsWith("blob:")) {
    URL.revokeObjectURL(currentFloor.gridBackgroundUrl);
  }
  updateFloorAtIndex(currentFloorIndex, floor => ({
    ...floor,
    gridBackgroundUrl: null,
    gridBackgroundFile: null,
    width: 0,
    height: 0,
    cells: {},
  }));
};

  const getBackgroundStyle = () => {
    const isWiderThanTall = currentFloor.width > currentFloor.height;
    const isTallerThanWide = currentFloor.height > currentFloor.width;
    return {
      backgroundImage: currentFloor.gridBackgroundUrl ? `url(${currentFloor.gridBackgroundUrl})` : 'none',
      backgroundSize: 'contain',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      ...(isWiderThanTall && { alignItems: 'center' }),
      ...(isTallerThanWide && { justifyContent: 'center' }),
    };
  };
  const total = currentFloor.width * currentFloor.height;
  const selectedCount = Object.keys(floors[currentFloorIndex].cells).length;
  const required = Math.ceil(total * 0.4);
  const multiRequired = Math.ceil(required * 0.4);
  const multiCount = Object.values(currentFloor.cells)
  .filter(c => c.imageUrls.length >= currentFloor.multiImageCount).length;

  const MIN_CELLS_TO_SUBMIT = 10;
  const isSubmitAllowed = () => {
    const hasMinimumCells = selectedCount >= MIN_CELLS_TO_SUBMIT;
    const oldValidation =
      selectedCount >= required &&
      multiCount >= multiRequired &&
      !!currentFloor.gridBackgroundUrl &&
      currentFloor.width > 0 &&
      currentFloor.height > 0;
    return hasMinimumCells && oldValidation;
  };
  const isReady = isSubmitAllowed();
  const performDeleteFloor = async () => {
    const deletedFloor = floors[currentFloorIndex];
    try {
      if (deletedFloor.apiFloorId) {
        await axios.delete(
          `${baseUrl}/properties/${propertyId}/floors/${deletedFloor.apiFloorId}/cancel`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
      }
      if (deletedFloor.gridBackgroundUrl) {
        URL.revokeObjectURL(deletedFloor.gridBackgroundUrl);
      }
      Object.values(deletedFloor.cells).forEach((cell: any) => {
        (cell.imageUrls || []).forEach(URL.revokeObjectURL);
      });
      let updatedFloors = floors.filter((_, idx) => idx !== currentFloorIndex);
      if (updatedFloors.length === 0) {
        updatedFloors = [
          {
            id: 1,
            width: 0,
            height: 0,
            cells: {},
            gridBackgroundFile: null,
            gridBackgroundUrl: null,
            multiImageCount: 1,
          },
        ];
      } else {
        updatedFloors.forEach((floor, idx) => {
          floor.id = idx + 1;
        });
      }
      setFloors(updatedFloors);
      const newIndex = currentFloorIndex > 0 ? currentFloorIndex - 1 : 0;
      setCurrentFloorIndex(newIndex);
      router.back()
      toast.success("Floor deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete floor");
    }
  };
  const handleDeleteFloor = () => {
    setConfirmDelete(true);
  };
  const confirmDeleteAction = () => {
    performDeleteFloor();
    setConfirmDelete(false);
  };
  const cancelDeleteAction = () => {
    setConfirmDelete(false);
  };
  return (
    <div className="flex flex-col-reverse lg:flex-row min-h-screen bg-background p-4 md:p-8 gap-4 md:gap-8">
      <div className="w-full lg:w-64 space-y-6">
        <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Grid Controls</h2>
            <button
              onClick={() => setShowInstructions(true)}
              className="p-2 hover:bg-accent rounded-lg transition-colors"
              title="View Instructions"
            >
              <FiInfo className="w-5 h-5 text-muted-foreground hover:text-foreground" />
            </button>
            <FloorPlanInstructionsModal
            isOpen={showInstructions}
            onClose={() => setShowInstructions(false)}
          />

          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="width" className="text-sm font-medium text-foreground block">Width</label>
              <input id="width" type="number" min="0" max="200" value={currentFloor.width} onChange={handleWidthChange}
                className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Enter width"
                disabled={!currentFloor.gridBackgroundUrl}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="height" className="text-sm font-medium text-foreground block">Height</label>
              <input id="height" type="number" min="0" max="200" value={currentFloor.height} onChange={handleHeightChange}
                className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Enter height"
                disabled={!currentFloor.gridBackgroundUrl}
              />
            </div>
           <div className="space-y-2">
    <label
      htmlFor="multiCount"
      className="text-sm font-medium text-foreground block"
    >
      Multi Image Count
    </label>

    <input
      id="multiCount"
      type="number"
      min="1"
      value={currentFloor.multiImageCount}
      onChange={e => updateFloorAtIndex(currentFloorIndex, floor => ({
        ...floor,
        multiImageCount: Number(e.target.value),
      }))}
      className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      placeholder="Enter multi image count"
      disabled={!currentFloor.gridBackgroundUrl}
    />
  </div>

          
            <div className="space-y-2">
              <label htmlFor="required" className="text-sm font-medium text-foreground block">Minimum required items</label>
              <input id="required" type="number" readOnly value={required}
                className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground"
                disabled={!currentFloor.gridBackgroundUrl}
              />
            </div>
           <div className="space-y-2">
    <label
      htmlFor="multiRequired"
      className="text-sm font-medium text-foreground block"
    >
      Final Required Cells
    </label>

    <input
      id="multiRequired"
      type="number"
      readOnly
      value={multiRequired}
      className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground"
      disabled={!currentFloor.gridBackgroundUrl}
    />
  </div>


            <div className="space-y-3 pt-4 border-t border-border">
              <div className="flex gap-2">
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => backgroundInputRef.current?.click()}
                    className={`flex items-center justify-center gap-2 py-2 px-4 rounded-md transition-colors text-sm font-medium ${currentFloor.gridBackgroundUrl ? 'bg-blue-500/20 text-blue-700 hover:bg-blue-500/30 border border-blue-500/50' : 'bg-accent text-accent-foreground hover:bg-accent/90'}`}
                  >
                    <FiImage className="w-4 h-4" />
                    {currentFloor.gridBackgroundUrl ? 'Change Background' : 'Choose Background'}
                  </button>

                  {currentFloor.gridBackgroundUrl && (
                    <button
                      onClick={removeBackground}
                      className="flex items-center justify-center gap-1 bg-destructive/10 text-destructive py-2 px-3 rounded-md hover:bg-destructive/20 transition-colors text-sm"
                    >
                      <FiX className="w-4 h-4" />
                      Remove
                    </button>
                  )}
                </div>
              </div>
              <input
                ref={backgroundInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleBackgroundUpload}
              />
              {currentFloor.gridBackgroundUrl && (
                <div className="text-xs text-muted-foreground">
                  Background applied
                </div>
              )}
            </div>
          </div>
          <div className="mt-6 p-4 bg-muted rounded-xl space-y-4">
            <div className="space-y-2">
              <label htmlFor="total" className="text-sm font-medium text-foreground block">Total</label>
              <input id="total" type="number" readOnly value={currentFloor.width * currentFloor.height}
                className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground"
              />
            </div>

            <button 
              onClick={handleDeleteFloor}
              className="w-full text-white py-2 rounded-md transition-colors flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-400"
            >
              <FiTrash2 className="w-4 h-4" />
              Cancel this Floor
            </button>

            <button
              onClick={async () => {
                try {
                    await handleCreateAndSubmitFloor();
                } catch (err) {
                  console.error(err);
                  toast.error("Operation failed");
                }
              }}
              disabled={!isReady}
              className={`w-full text-white py-2 rounded-md transition-colors ${isReady ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-300 cursor-not-allowed'}`}
            >
              {'Submit'}
            </button>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-auto flex flex-col">
        <div className="inline-flex flex-col items-start min-w-fit">
          {currentFloor.width > 0 && <GridAxis direction="top" count={currentFloor.width} />}

          <div className="flex">
            {currentFloor.height > 0 && <GridAxis direction="left" count={currentFloor.height} />}

            <div
              className="bg-muted/30 min-w-[200px] min-h-[200px] flex items-center justify-center overflow-hidden"
              style={getBackgroundStyle()}
            >
              {currentFloor.width > 0 && currentFloor.height > 0 ? (
                <CenterGrid
                  height={currentFloor.height}
                  width={currentFloor.width}
                  cells={floors[currentFloorIndex].cells}
                  hoveredCell={hoveredCell}
                  onHover={setHoveredCell}
                  onImageUpload={handleImageUpload}
                  onShowMenu={setSelectedCellForMenu}
                />
              ) : (
                <p className="text-muted-foreground text-center">
                  To create grid
                  <br />
                  Choose Background Image<br /> & Set Width Height
                </p>
              )}
            </div>

            {currentFloor.height > 0 && <GridAxis direction="right" count={currentFloor.height} />}
          </div>

          {currentFloor.width > 0 && <GridAxis direction="bottom" count={currentFloor.width} />}
        </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
     
            <CellActionsModal
          isOpen={!!selectedCellForMenu}
          onClose={() => setSelectedCellForMenu(null)}
          onDelete={() => {
            if (!selectedCellForMenu) return;
            handleImageDelete(selectedCellForMenu);
          }}
          onAdd={() => {
            if (!selectedCellForMenu) return;
            setActionCell({ cellId: selectedCellForMenu, action: "add" });
            fileInputRef.current?.click();
          }}
        />

      {confirmDelete && (
        <HeadlessDemo
          DeleteTrue={confirmDeleteAction}
          onCancel={cancelDeleteAction}
          name={`Floor ${currentFloor.id}`}
          actionType="delete"
        />
      )}
    </div>
  );
};

export default Pro_Mode_Cycle;
"use client";

import React, { useState, useRef } from "react";
import { FiUpload, FiEdit, FiTrash2, FiImage, FiX, FiMoreHorizontal, FiInfo, FiPlus } from "react-icons/fi";

import { toast } from 'sonner';
import HeadlessDemo from "../componants/shared/DELETE_CONFIRM";
import { useRouter } from "next/navigation";

// data Types  each cell 
interface CellData {
  id: string;
  imageUrls: string[];
}

// floor data Types structure
interface FloorData {
  id: number;
  width: number;
  height: number;
  cells: Record<string, CellData>;
  gridBackground: string | null;
  multiImageCount: number;
}
// Instructions Modal Component
const InstructionsModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  //  if not open , return null
  if (!isOpen) return null;
  //  if open , show modal
  return (
    <div onClick={onClose} className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-3xl w-full max-w-lg shadow-2xl">
        <div className="px-6 pt-6 pb-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900">Instructions</h3>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
              <FiX className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          
          <div className="space-y-4 text-gray-700">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold  mb-2 flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 bg-blue-500 text-white rounded-full text-sm">1</span>
                Grid Creation Requirements
              </h4>
              <p className="text-sm ml-8">
                To create a grid, you must first select a <strong>Background Image</strong>, then set both <strong>Width</strong> and <strong>Height</strong> values.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold  mb-2 flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 bg-blue-500 text-white rounded-full text-sm">2</span>
                Minimum Required Items
              </h4>
              <p className="text-sm ml-8">
                You must add images to meet the minimum required number of cells. This value is automatically calculated based on your grid size and is displayed in the <strong>Minimum required items</strong> field.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200  rounded-lg p-4">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 bg-blue-500 text-white rounded-full text-sm">3</span>
                Multi Image Count Rule
              </h4>
              <p className="text-sm ml-8">
                When setting <strong>Multi Image Count</strong> to a value greater than 1, you are required to fill at least 40% of the minimum required items with multiple images. The exact number needed is shown in the <strong>Final Required Cells</strong> field.
              </p>
            </div>
            
          </div>
        </div>

        
      </div>
    </div>
  );
};
//  Propes Modal || Options 
const CellMenuModal = ({ isOpen, onClose, onUpdate, onDelete, onAdd }:any) => {
  if (!isOpen) return null;
  return (
    <div onClick={onClose} className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-3xl w-full max-w-sm shadow-2xl">
        <div className="px-3 pb-2 space-y-1">
          <button onClick={onUpdate} className="w-full py-3 border rounded-xl flex items-center justify-center gap-2"><FiEdit /> Update</button>
          <button onClick={onDelete} className="w-full py-3 border rounded-xl flex items-center justify-center gap-2 text-red-600"><FiTrash2 /> Delete</button>
          <button onClick={onAdd} className="w-full py-3 border rounded-xl flex items-center justify-center gap-2"><FiUpload /> Add</button>
        </div>

        <div className="px-6 pb-5 pt-3">
          <button onClick={onClose} className="w-full py-3 bg-gray-100 rounded-xl">Cancel</button>
        </div>
      </div>
    </div>
  );
};
const TEST_PRO = () => {
  // current floor index
  const [currentFloorIndex, setCurrentFloorIndex] = useState(0);
  // all floors data
  const [floors, setFloors] = useState<FloorData[]>([
    {
      id: 1,
      width: 0,
      height: 0,
      cells: {},
      gridBackground: null,
      multiImageCount: 1
    }
  ]);
  // get current floor data
  const currentFloor = floors[currentFloorIndex];
  
  // size states
  const [width, setWidth] = useState(currentFloor.width);
  const [height, setHeight] = useState(currentFloor.height);
  // all cells with images
  const [cells, setCells] = useState<Record<string, CellData>>(currentFloor.cells);
  // track hovered cell for UI
  const [hoveredCell, setHoveredCell] = useState<string | null>(null);
  // background image for  grid
  const [gridBackground, setGridBackground] = useState<string | null>(currentFloor.gridBackground);
  // hidden file input refrence
  const backgroundInputRef = useRef<HTMLInputElement>(null);
  const navigate =useRouter()
  // multi image count
  const [multiImageCount, setMultiImageCount] = useState(currentFloor.multiImageCount);
  // selected cell for menu
  const [selectedCellForMenu, setSelectedCellForMenu] = useState<string | null>(null);
  // action for upload
  const [actionCell, setActionCell] = useState<{ cellId: string; action: 'add' | 'update' } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // instructions modal state
  const [showInstructions, setShowInstructions] = useState(false);
  // This tracks if the delete confirmation should be visible
  const [confirmDelete, setConfirmDelete] = useState(false);
  // save current floor data before watching
  const saveCurrentFloorData = () => {
    const updatedFloors = [...floors];
    updatedFloors[currentFloorIndex] = {
      id: currentFloor.id,
      width: width,
      height: height,
      cells: cells,
      gridBackground: gridBackground,
      multiImageCount: multiImageCount
    };
    setFloors(updatedFloors);
  };
  // add new floor
  const handleAddNewFloor = () => {
    // Save current floor data manually and get updated array
    const updatedFloors = [...floors];
    updatedFloors[currentFloorIndex] = {
      id: currentFloor.id,
      width: width,
      height: height,
      cells: cells,
      gridBackground: gridBackground,
      multiImageCount: multiImageCount
    };
    
    // Add new floor
    const newFloor: FloorData = {
      id: floors.length + 1,
      width: 0,
      height: 0,
      cells: {},
      gridBackground: null,
      multiImageCount: 1
    };
    updatedFloors.push(newFloor);
    
    setFloors(updatedFloors);
    setCurrentFloorIndex(updatedFloors.length - 1);
    setWidth(0);
    setHeight(0);
    setCells({});
    setGridBackground(null);
    setMultiImageCount(1);
    toast.success('New floor added');
  };
  // switch to specific floor
  const handleSwitchFloor = (index: number) => {
    // Save current floor data manually
    const updatedFloors = [...floors];
    updatedFloors[currentFloorIndex] = {
      id: currentFloor.id,
      width: width,
      height: height,
      cells: cells,
      gridBackground: gridBackground,
      multiImageCount: multiImageCount
    };
    setFloors(updatedFloors);
    
    setCurrentFloorIndex(index);
    const targetFloor = updatedFloors[index];
    setWidth(targetFloor.width);
    setHeight(targetFloor.height);
    setCells(targetFloor.cells);
    setGridBackground(targetFloor.gridBackground);
    setMultiImageCount(targetFloor.multiImageCount);
  };
  // handle width input change
  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWidth(Number(e.target.value));
  };
  // handle height input change
  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHeight(Number(e.target.value));
  };
  // upload image  specific cell
  const handleImageUpload = (cellId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      const existingCell = cells[cellId];
      const existingUrls = existingCell ? existingCell.imageUrls : [];
      const newUrls = [...existingUrls, imageUrl];
      const updatedCells = { ...cells };
      updatedCells[cellId] = {
        id: cellId,
        imageUrls: newUrls
      };
      setCells(updatedCells);
    }
  };
  // delete images from a cell
  const handleImageDelete = (cellId: string) => {
    const updatedCells = { ...cells };
    if (updatedCells[cellId]?.imageUrls) {
      updatedCells[cellId].imageUrls.forEach(URL.revokeObjectURL);
    }
    delete updatedCells[cellId];
    setCells(updatedCells);
    setSelectedCellForMenu(null);
  };
  // handle global image change
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!actionCell) return;
    const file = event.target.files?.[0];
    if (file) {
      const newUrl = URL.createObjectURL(file);
      const updatedCells = { ...cells };
      const cell = updatedCells[actionCell.cellId] || { id: actionCell.cellId, imageUrls: [] };
      let newUrls = cell.imageUrls;
      if (actionCell.action === 'update') {
        cell.imageUrls.forEach(URL.revokeObjectURL);
        newUrls = [newUrl];
      } else {
        newUrls = [...cell.imageUrls, newUrl];
      }
      updatedCells[actionCell.cellId] = { ...cell, imageUrls: newUrls };
      setCells(updatedCells);
    }
    event.target.value = '';
    setActionCell(null);
    setSelectedCellForMenu(null);
  };
  // handle background image upload
  const handleBackgroundUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // clean old url first
      if (gridBackground) {
        URL.revokeObjectURL(gridBackground);
      }
      const imageUrl = URL.createObjectURL(file);
      setGridBackground(imageUrl);
    }
    // allow same file again
    if (event.target) {
      event.target.value = '';
    }
  };
  // remove background image
  const removeBackground = () => {
    if (gridBackground) {
      URL.revokeObjectURL(gridBackground);
    }
    setGridBackground(null);
    setWidth(0);
    setHeight(0);
  };
  // render top row numbers
 const renderTopButtons = () => (
  <>
    {/*Empety Button */}
    <div className="w-10 h-10 m-auto bg-transparent border border-border flex items-center justify-center font-light text-xs"></div>

   {/*  Buttons Index +1  */}
    {Array.from({ length: width }).map((_, i) => (
      <div
        key={`top-${i}`}
        className="w-10 h-10 m-auto bg-[hsl(var(--grid-width))] border border-border flex items-center justify-center font-light text-xs transition-all hover:scale-105"
      >
        {i + 1}
      </div>
    ))}
  </>
);
  // bottom same as top
  const renderBottomButtons = () => renderTopButtons();
  // left column numbers
  const renderLeftButtons = () =>
    Array.from({ length: height }).map((_, i) => (
      <div
        key={`left-${i}`}
        className="w-10 h-10 m-0 bg-[hsl(var(--grid-height))] border border-border flex items-center justify-center font-light text-xs transition-all hover:scale-105"
      >
        {i + 1}
      </div>
    ));
  // right same as left
  const renderRightButtons = () => renderLeftButtons();

  // main grid cells with hover actions
  const renderCenterGrid = () =>
    Array.from({ length: height }).map((_, rowIndex) => (
      <div key={`row-${rowIndex}`} className="flex">
        {Array.from({ length: width }).map((_, colIndex) => {
          const cellId = `cell-${rowIndex}-${colIndex}`;
          const cellData = cells[cellId];
          const isHovered = hoveredCell === cellId;
          const hasCellImage = !!cellData?.imageUrls?.length;

          return (
            <div
              key={cellId}
              className={`
                relative w-10 h-10 m-0 border border-border overflow-hidden group cursor-pointer transition-all hover:shadow-lg
              `}
              onMouseEnter={() => setHoveredCell(cellId)}
              onMouseLeave={() => setHoveredCell(null)}
            >
              {/* base background for empty cells */}
              {!hasCellImage && (
                <div
                  className={`absolute inset-0 ${
                    gridBackground ? 'bg-blue-500/20' : 'bg-white/50'
                  }`}
                />
              )}

              {/* show cell image count if exists */}
              {hasCellImage && (
                <div className="absolute inset-0 bg-gray-300/50 flex items-center justify-center text-black font-light text-xs">
                  {cellData.imageUrls.length}
                </div>
              )}

              {/* hover overlay with actions */}
              {isHovered && (
                <div className="absolute inset-0 bg-white/80 flex items-center justify-center gap-1 animate-in fade-in duration-150 pointer-events-auto">
                  {!hasCellImage ? (
                    // upload new image
                    <label className="cursor-pointer p-0 rounded-full bg-accent hover:bg-accent/80 transition-colors">
                      <FiUpload className="w-3 h-3 text-accent-foreground" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={e => handleImageUpload(cellId, e)}
                      />
                    </label>
                  ) : (
                    // Menu button
                    <button
                      onClick={() => setSelectedCellForMenu(cellId)}
                      className="p-0.5 rounded-full bg-black hover:bg-black/80 transition-colors"
                    >
                      <FiMoreHorizontal className="w-3 h-3 text-white" />
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    ));

  // smart background fit
  const getBackgroundStyle = () => {
    const isWiderThanTall = width > height;
    const isTallerThanWide = height > width;
    
    return {
      backgroundImage: gridBackground ? `url(${gridBackground})` : 'none',
      backgroundSize: 'contain',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      // center image properly
      ...(isWiderThanTall && { alignItems: 'center' }),
      ...(isTallerThanWide && { justifyContent: 'center' }),
    };
  };

  const total = width * height;
  const selectedCount = Object.keys(cells).length;
  //  20%
  const required = Math.ceil(total * 0.2);
  //  40%
  const multiRequired = Math.ceil(required * 0.4);
  const multiCount = Object.values(cells).filter(c => c.imageUrls.length >= multiImageCount).length;
  // Ternary  width ,if background Not Selected Dont Allow Increment Widta & Height 
  const isReady = selectedCount >= required && multiCount >= multiRequired && !!gridBackground && (gridBackground ? (width > 0 && height > 0) : (width === 0 && height === 0));

  //  handles the actual floor deletion process
  const performDeleteFloor = () => {
    if (floors.length <= 1) return;

    // Revoke URLs for the deleted floor to free memory
    const deletedFloor = floors[currentFloorIndex];
    if (deletedFloor.gridBackground) {
      URL.revokeObjectURL(deletedFloor.gridBackground);
    }
    Object.values(deletedFloor.cells).forEach(cell => {
      cell.imageUrls.forEach(URL.revokeObjectURL);
    });

    // Remove the current floor
    const updatedFloors = floors.filter((_, idx) => idx !== currentFloorIndex);

    // Renumber the floor IDs
    updatedFloors.forEach((floor, idx) => {
      floor.id = idx + 1;
    });

    setFloors(updatedFloors);

    // Switch to the previous floor or the last one if deleting the last
    const newIndex = currentFloorIndex > 0 ? currentFloorIndex - 1 : 0;
    setCurrentFloorIndex(newIndex);

    // Update local states to match the new current floor
    const targetFloor = updatedFloors[newIndex];
    setWidth(targetFloor.width);
    setHeight(targetFloor.height);
    setCells(targetFloor.cells);
    setGridBackground(targetFloor.gridBackground);
    setMultiImageCount(targetFloor.multiImageCount);

    toast.success('Floor deleted');
  };

  //  shows the confirmation when the delete button is clicked
  const handleDeleteFloor = () => {
    setConfirmDelete(true);
  };

  //  runs if the user confirms the delete in the modal
  const confirmDeleteAction = () => {
    performDeleteFloor();
    setConfirmDelete(false);
  };

  //  closes the modal if cancel is chosen
  const cancelDeleteAction = () => {
    setConfirmDelete(false);
  };

  return (
    <div className="flex flex-col-reverse lg:flex-row min-h-screen bg-background p-4 md:p-8 gap-4 md:gap-8">
      {/* Control Panel */}
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
          </div>
          <div className="space-y-4">
            {/* width input */}
            <div className="space-y-2">
              <label htmlFor="width" className="text-sm font-medium text-foreground block">Width</label>

              <input id="width" type="number" min="0" max="200" value={width } onChange={handleWidthChange}
                className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Enter width"
                disabled={!gridBackground}
              />
              
            </div>
            {/* height input */}
            <div className="space-y-2">
              <label htmlFor="height" className="text-sm font-medium text-foreground block">Height</label>
              <input id="height" type="number" min="0" max="200" value={height} onChange={handleHeightChange}
                className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Enter height"
                disabled={!gridBackground}
              />
            </div>
            {/* multi image input */}
            <div className="space-y-2">
              <label htmlFor="multiCount" className="text-sm font-medium text-foreground block">Multi Image Count</label>
              <input id="multiCount" type="number" min="1" value={multiImageCount} onChange={e => setMultiImageCount(Number(e.target.value))}
                className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Enter multi image count"
                disabled={!gridBackground}
              />
            </div>
            {/* required cells input */}
            <div className="space-y-2">
              <label htmlFor="required" className="text-sm font-medium text-foreground block">Minimum required items</label>
              <input id="required" type="number" readOnly value={required}
                className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground"
                disabled={!gridBackground}
              />
            </div>
            {/* multi required cells input */}
            <div className="space-y-2">
              <label htmlFor="multiRequired" className="text-sm font-medium text-foreground block">Final Required Cells</label>
              <input id="multiRequired" type="number" readOnly value={multiRequired}
                className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground"
                disabled={!gridBackground}
              />
            </div>

            {/* Background upload section */}
            <div className="space-y-3 pt-4 border-t border-border">
              <div className="flex gap-2">
                <div className="flex flex-col gap-3">
                  {/* trigger background picker */}
                  <button
                    onClick={() => backgroundInputRef.current?.click()}
                    className={`
                      flex items-center justify-center gap-2 py-2 px-4 rounded-md transition-colors text-sm font-medium
                      ${gridBackground 
                        ? 'bg-blue-500/20 text-blue-700 hover:bg-blue-500/30 border border-blue-500/50' 
                        : 'bg-accent text-accent-foreground hover:bg-accent/90'
                      }
                    `}
                  >
                    <FiImage className="w-4 h-4" />
                    {gridBackground ? 'Change Background' : 'Choose Background'}
                  </button>

                  {/* remove background button */}
                  {gridBackground && (
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
              {/* hidden file input */}
              <input
                ref={backgroundInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleBackgroundUpload}
              />
              {/* status text */}
              {gridBackground && (
                <div className="text-xs text-muted-foreground">
                  Background applied
                </div>
              )}
            </div>
          </div>
          {/* total cells & submit */}
          <div className="mt-6 p-4 bg-muted rounded-xl space-y-4">
            <div className="space-y-2">
              <label htmlFor="total" className="text-sm font-medium text-foreground block">Total</label>
              <input id="total" type="number" readOnly value={width * height}
                className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground"
              />
            </div>
          <button 
  onClick={handleAddNewFloor}
  disabled={!isReady}
  className={`w-full text-white py-2 rounded-md transition-colors flex items-center justify-center gap-2 ${
    isReady 
      ? 'bg-blue-600 hover:bg-blue-400'
      : 'bg-blue-300 cursor-not-allowed'
  }`}
>
  <FiPlus className="w-4 h-4" />
  Add New Floor
</button>

            {floors.length >= 2 && (
              <button 
                onClick={handleDeleteFloor}
                className="w-full text-white py-2 rounded-md transition-colors flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-400"
              >
                <FiTrash2 className="w-4 h-4" />
                Cancel this Floor
              </button>
            )}

            <button 
              onClick={() => {
                saveCurrentFloorData();
                toast.success(' The Process Sucess');
                navigate.push('/PRO_MODE/1');
              }}
              disabled={!isReady}
              className={`w-full text-white py-2 rounded-md transition-colors ${
                isReady 
                  ? 'bg-blue-500 hover:bg-blue-600' 
                  : 'bg-blue-300 cursor-not-allowed'
              }`}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
      {/* Main Grid View */}
      <div className="flex-1 overflow-auto flex flex-col">
        {/* Pagination at top - only show when there are 2 or more floors */}
        {floors.length >= 2 && (
          <div className="mb-4 flex justify-center">
            <div className="inline-flex gap-2 bg-card rounded-lg p-2 border border-border shadow-sm">
              {floors.map((floor, index) => (
                <button
                  key={floor.id}
                  onClick={() => handleSwitchFloor(index)}
                  className={`px-4 py-2 rounded-md transition-all font-medium ${
                    index === currentFloorIndex
                      ? 'bg-blue-500/20 text-blue-700 border border-blue-500/30'
                      : 'bg-muted/50 text-muted-foreground hover:bg-muted/70'
                  }`}
                >
                  Map {floor.id}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="inline-flex flex-col items-start min-w-fit">
          {/* top labels */}
          {width > 0 && <div className="flex mb-0 gap-0">{renderTopButtons()}</div>}

          <div className="flex">
            {/* left labels */}
            {height > 0 && <div className="flex flex-col mr-0 gap-0">{renderLeftButtons()}</div>}

            {/* center grid with background */}
            <div
              className="bg-muted/30 min-w-[200px] min-h-[200px] flex items-center justify-center overflow-hidden"
              style={getBackgroundStyle()}
            >
              {width > 0 && height > 0 ? (
                <div className="flex flex-col p-0">{renderCenterGrid()}</div>
              ) : (
                <p className="text-muted-foreground text-center">
                  To create grid
                  <br />
                  Choose Background Image<br/>  & Set Width  Height
                </p>
              )}
            </div>

            {/* right labels */}
            {height > 0 && <div className="flex flex-col ml-0 gap-0">{renderRightButtons()}</div>}
          </div>

          {/* bottom labels */}
          {width > 0 && <div className="flex mt-0 gap-0">{renderBottomButtons()}</div>}
        </div>
      </div>
      {/* global file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageChange}
      />
      {/* Instructions modal */}
      <InstructionsModal
        isOpen={showInstructions}
        onClose={() => setShowInstructions(false)}
      />
      {/* cell menu modal */}
      <CellMenuModal
        isOpen={!!selectedCellForMenu}
        onClose={() => setSelectedCellForMenu(null)}
        onUpdate={() => {
          if (selectedCellForMenu) {
            setActionCell({ cellId: selectedCellForMenu, action: 'update' });
            fileInputRef.current?.click();
          }
        }}
        onDelete={() => {
          if (selectedCellForMenu) {
            handleImageDelete(selectedCellForMenu);
          }
        }}
        onAdd={() => {
          if (selectedCellForMenu) {
            setActionCell({ cellId: selectedCellForMenu, action: 'add' });
            fileInputRef.current?.click();
          }
        }}
      />
      {/* Delete confirmation modal */}
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
export default TEST_PRO;
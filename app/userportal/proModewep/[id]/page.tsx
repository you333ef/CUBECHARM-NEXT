"use client"
import { useState, lazy, Suspense } from "react";

import { MdLocationOn } from "react-icons/md";
import type { StaticImageData } from "next/image";
import Image from "next/image";

// Lazy load ReactPhotoSphereViewer
const ReactPhotoSphereViewer = lazy(() =>
  import("react-photo-sphere-viewer").then((m) => ({ default: m.ReactPhotoSphereViewer }))
);

// data shape for each cell
interface CellData {
  id: string;
  name: string;
  size: string;
  area: string;
  imageUrl: string| StaticImageData;
  is360: boolean;
}
const masterBedroomImg = "/images/hugo-rouquette-8RrDGp_4S9E-unsplash.jpg";
const bedroom1Img = "/images/tomas-cocacola-1MCdcbJxViE-unsplash.jpg";
const bedroom2Img = "/images/bedroom3.jpg";
const bedroom3Img = "/images/Master.jpg";
const livingRoomImg = "/images/Living_ONe.jpg";
const bathroom1Img = "/images/Kitchen.jpg";
const bathroom2Img = "/images/bedroom2.jpg";
const kitchenImg = "/images/Kitchen2.jpg";
const Updated_Map = "/images/UpdatedMap.jpg";

const PRO_MODE = () => {
  // fixed grid FAKE
  const width = 20;
  const height = 10;
  // static background
  const gridBackground = Updated_Map;
  // example cells
  const cells: Record<string, CellData> = {
    "cell-2-4": {
      id: "cell-2-4",
      name: "Master Bedroom",
      size: "5.0 × 5.0 m",
      area: "25 m²",
      imageUrl: masterBedroomImg,
      is360: false,
    },
    "cell-3-6": {
      id: "cell-3-6",
      name: "Bedroom 1",
      size: "4.0 × 4.2 m",
      area: "16.8 m²",
      imageUrl: bedroom1Img,
      is360: true,
    },
    "cell-5-2": {
      id: "cell-5-2",
      name: "Bedroom 2",
      size: "4.0 × 5.0 m",
      area: "20 m²",
      imageUrl: bedroom2Img,
      is360: false,
    },
    "cell-6-8": {
      id: "cell-6-8",
      name: "Bedroom 3",
      size: "4.0 × 4.1 m",
      area: "16.4 m²",
      imageUrl: bedroom3Img,
      is360: false,
    },
    "cell-8-5": {
      id: "cell-8-5",
      name: "Living Room",
      size: "5.8 × 6.4 m",
      area: "37.1 m²",
      imageUrl: livingRoomImg,
      is360: false,
    },
    "cell-10-3": {
      id: "cell-10-3",
      name: "Bathroom 1",
      size: "2.5 × 1.6 m",
      area: "4 m²",
      imageUrl: bathroom1Img,
      is360: false,
    },
    "cell-11-7": {
      id: "cell-11-7",
      name: "Bathroom 2",
      size: "1.6 × 2.1 m",
      area: "3.4 m²",
      imageUrl: bathroom2Img,
      is360: false,
    },
    "cell-13-4": {
      id: "cell-13-4",
      name: "Kitchen",
      size: "3.0 × 3.4 m",
      area: "10.2 m²",
      imageUrl: kitchenImg,
      is360: false,
    },
  };

  const [selectedCell, setSelectedCell] = useState<CellData | null>(cells["cell-3-6"]);

  // render top row numbers
  const renderTopButtons = () =>
    Array.from({ length: width }).map((_, i) => (
      <div
        key={`top-${i}`}
        className="w-10 h-10 m-0 bg-[hsl(var(--grid-width))] border border-border flex items-center justify-center font-medium text-sm transition-all hover:scale-105"
      >
        {i + 1}
      </div>
    ));

  // bottom same as top
  const renderBottomButtons = () => renderTopButtons();
  // left column numbers
  const renderLeftButtons = () =>
    Array.from({ length: height }).map((_, i) => (
      <div
        key={`left-${i}`}
        className="w-10 h-10 m-0 bg-[hsl(var(--grid-height))] border border-border flex items-center justify-center font-medium text-sm transition-all hover:scale-105"
      >
        {i + 1}
      </div>
    ));
  // right same as left
  const renderRightButtons = () => renderLeftButtons();

  // main grid cells
  const renderCenterGrid = () =>
    Array.from({ length: height }).map((_, rowIndex) => (
      <div key={`row-${rowIndex}`} className="flex">
        {Array.from({ length: width }).map((_, colIndex) => {
          const cellId = `cell-${rowIndex}-${colIndex}`;
          const cellData = cells[cellId];
          const hasCellImage = !!cellData?.imageUrl;

          return (
            <div
              key={cellId}
              className={`relative w-10 h-10 m-0 border border-border overflow-hidden ${
                hasCellImage ? "cursor-pointer transition-all hover:shadow-lg" : ""
              }`}
              onClick={() => hasCellImage && setSelectedCell(cellData)}
            >
              {/* base background for empty cells */}
              {!hasCellImage && (
                <div
                  className={`absolute inset-0 ${gridBackground ? "bg-blue-500/20" : "bg-white/50"}`}
                />
              )}

              {/* show blurred cell image if exists */}
              {cellData?.imageUrl && (
                <div
                  className={`absolute inset-0 ${gridBackground ? "bg-black-800/20" : "bg-white/50"}`}
                />
              )}
            </div>
          );
        })}
      </div>
    ));

  // background fit
  const getBackgroundStyle = () => {
    const isWiderThanTall = width > height;
    const isTallerThanWide = height > width;

    return {
      backgroundImage: gridBackground ? `url(${gridBackground})` : "none",
      backgroundSize: "contain",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      // center image properly
      ...(isWiderThanTall && { alignItems: "center" }),
      ...(isTallerThanWide && { justifyContent: "center" }),
    };
  };

  return (
    <div className="bg-[#f7f9fc]">
      {/* Header */}
     
      {/* Main */}
      <main className="min-h-screen">
        <div className="max-w-screen-lg mx-auto p-4 md:p-6 flex flex-col gap-8">
          {/* Viewer Section */}
          <section className="rounded-2xl shadow-lg p-6 border">
            {selectedCell ? (
              <div className=""></div>
            ) : (
              <div className="text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-[#3b82f6] mb-2">Select a Room</h2>
                <p className="text-base md:text-lg text-gray-600">Click on a cell below to view</p>
              </div>
            )}
            <div className="rounded-xl overflow-hidden mt-4">
              {/* Use Suspense for lazy loading */}
              <Suspense fallback={<div className="h-[600px] bg-gray-100 animate-pulse rounded-xl" />}>
                {selectedCell ? (
                  selectedCell.is360 ? (
                   <ReactPhotoSphereViewer 
  src={typeof selectedCell.imageUrl === "string" 
    ? selectedCell.imageUrl 
    : selectedCell.imageUrl.src} 
  height="600px" 
  width="100%" 
/>
                  ) : (
                    <Image
                      src={selectedCell.imageUrl}
                      alt={selectedCell.name}
                       width={1000}
  height={600}
                      className="h-[600px] w-full object-contain"
                      loading="lazy"
                    />
                  )
                ) : (
                  <div className="h-[600px] w-full bg-gray-100 flex items-center justify-center text-gray-500">
                    No image selected
                  </div>
                )}
                
              </Suspense>
            </div>
          </section>

          {/* Grid Section Under Viewer */}
          <section className="rounded-2xl shadow-lg p-6 border">
            <h2 className="text-2xl md:text-3xl font-bold text-[#3b82f6] mb-6 text-center">Floor Plan</h2>
            <div className="overflow-auto">
              <div className="mx-auto flex flex-col items-start min-w-fit">
                {/* top labels */}
                {width > 0 && <div className="flex mb-0 pl-10 pr-10">{renderTopButtons()}</div>}

                <div className="flex">
                  {/* left labels */}
                  {height > 0 && <div className="flex flex-col mr-0">{renderLeftButtons()}</div>}

                  {/* center grid with background */}
                  <div
                    className="bg-muted/30 rounded-2xl border-2 border-dashed border-border min-w-[200px] min-h-[200px] flex items-center justify-center overflow-hidden"
                    style={getBackgroundStyle()}
                  >
                    {width > 0 && height > 0 ? (
                      <div className="flex flex-col p-0">{renderCenterGrid()}</div>
                    ) : (
                      <p className="text-muted-foreground text-center">No grid available</p>
                    )}
                  </div>

                  {/* right labels */}
                  {height > 0 && <div className="flex flex-col ml-0">{renderRightButtons()}</div>}
                </div>

                {/* bottom labels */}
                {width > 0 && <div className="flex mt-0 pl-10 pr-10">{renderBottomButtons()}</div>}
              </div>
            </div>
            {selectedCell && (
              <div className="mt-6 bg-blue-200 p-4 rounded-lg text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-black mb-2">The area of the unit</h2>
                <p className="text-base md:text-lg text-gray-800 whitespace-nowrap">
                  {selectedCell.size} • {selectedCell.area}
                </p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default PRO_MODE;
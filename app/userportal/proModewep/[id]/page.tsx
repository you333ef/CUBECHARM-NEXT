"use client";

import { useState, Suspense, memo, useCallback, useMemo } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import type { StaticImageData } from "next/image";

// 1. Dynamic import for the heavy 360 viewer with fallback
const ReactPhotoSphereViewer = dynamic(
  () => import("react-photo-sphere-viewer").then((mod) => ({
    default: mod.ReactPhotoSphereViewer,
  })).catch((err) => {
    console.warn("360 viewer failed → using static image fallback", err);
    return {
      default: ({ src }: any) => (
        <div className="relative w-full h-full bg-muted rounded-xl overflow-hidden">
          <Image src={src} alt="360 fallback" fill className="object-contain" unoptimized />
        </div>
      ),
    };
  }),
  {
    ssr: false,
    loading: () => (
      <div className="h-[600px] w-full bg-gray-200/80 animate-pulse rounded-xl flex items-center justify-center">
        <span className="text-gray-500 font-medium">Loading 360 view...</span>
      </div>
    ),
  }
);

// 2. Cell data structure
interface CellData {
  id: string;
  name: string;
  size: string;
  area: string;
  imageUrl: string | StaticImageData;
  is360: boolean;
}

// 3. Image paths
const masterBedroomImg = "/images/hugo-rouquette-8RrDGp_4S9E-unsplash.jpg";
const bedroom1Img = "/images/tomas-cocacola-1MCdcbJxViE-unsplash.jpg";
const bedroom2Img = "/images/bedroom3.jpg";
const bedroom3Img = "/images/Master.jpg";
const livingRoomImg = "/images/Living_ONe.jpg";
const bathroom1Img = "/images/Kitchen.jpg";
const bathroom2Img = "/images/bedroom2.jpg";
const kitchenImg = "/images/Kitchen2.jpg";
const Updated_Map = "/images/UpdatedMap.jpg";

// 4. Memoized single grid cell – avoids re-renders
const GridCell = memo(({ 
  cellData, 
  onSelect 
}: { 
  cellData?: CellData; 
  onSelect: () => void;
}) => {
  const hasImage = !!cellData?.imageUrl;

  return (
    <div
      className={`relative w-10 h-10 border border-border overflow-hidden ${
        hasImage ? "cursor-pointer transition-shadow hover:shadow-lg" : ""
      }`}
      onClick={onSelect}
    >
      {/* Light blue tint for empty cells (exactly like original) */}
      {!hasImage && (
        <div className="absolute inset-0 bg-blue-500/20" />
      )}
      {/* Dark overlay when cell has an image */}
      {hasImage && (
        <div className="absolute inset-0 bg-black/20" />
      )}
    </div>
  );
});
GridCell.displayName = "GridCell";

// 5. Main component
const PRO_MODE = () => {
  const width = 20;
  const height = 10;
  const gridBackground = Updated_Map;

  // Populated cells data
  const cells: Record<string, CellData> = {
    "cell-2-4": { id: "cell-2-4", name: "Master Bedroom", size: "5.0 × 5.0 m", area: "25 m²", imageUrl: masterBedroomImg, is360: false },
    "cell-3-6": { id: "cell-3-6", name: "Bedroom 1", size: "4.0 × 4.2 m", area: "16.8 m²", imageUrl: bedroom1Img, is360: true },
    "cell-5-2": { id: "cell-5-2", name: "Bedroom 2", size: "4.0 × 5.0 m", area: "20 m²", imageUrl: bedroom2Img, is360: false },
    "cell-6-8": { id: "cell-6-8", name: "Bedroom 3", size: "4.0 × 4.1 m", area: "16.4 m²", imageUrl: bedroom3Img, is360: false },
    "cell-8-5": { id: "cell-8-5", name: "Living Room", size: "5.8 × 6.4 m", area: "37.1 m²", imageUrl: livingRoomImg, is360: false },
    "cell-10-3": { id: "cell-10-3", name: "Bathroom 1", size: "2.5 × 1.6 m", area: "4 m²", imageUrl: bathroom1Img, is360: false },
    "cell-11-7": { id: "cell-11-7", name: "Bathroom 2", size: "1.6 × 2.1 m", area: "3.4 m²", imageUrl: bathroom2Img, is360: false },
    "cell-13-4": { id: "cell-13-4", name: "Kitchen", size: "3.0 × 3.4 m", area: "10.2 m²", imageUrl: kitchenImg, is360: false },
  };

  const [selectedCell, setSelectedCell] = useState<CellData | null>(cells["cell-3-6"]);

  // Stable click handler
  const handleCellClick = useCallback((cell: CellData) => {
    setSelectedCell(cell);
  }, []);

  // 6. Full grid – built once and fully cached
  const gridContent = useMemo(() => {
    const rows = [];
    for (let row = 0; row < height; row++) {
      const cellsInRow = [];
      for (let col = 0; col < width; col++) {
        const cellId = `cell-${row}-${col}`;
        const cellData = cells[cellId];

        cellsInRow.push(
          <GridCell
            key={cellId}
            cellData={cellData}
            onSelect={() => cellData && handleCellClick(cellData)}
          />
        );
      }
      rows.push(
        <div key={`row-${row}`} className="flex">
          {cellsInRow}
        </div>
      );
    }
    return rows;
  }, [handleCellClick]);

  // 7. Number labels (top/bottom/left/right)
  const renderNumberLabels = () =>
    Array.from({ length: Math.max(width, height) }, (_, i) => (
      <div
        key={i}
        className="w-10 h-10 border border-border bg-[hsl(var(--grid-width))] flex items-center justify-center text-sm font-medium hover:scale-105 transition-transform"
      >
        {i + 1}
      </div>
    ));

  // 8. Background map style
  const backgroundStyle = {
    backgroundImage: gridBackground ? `url(${gridBackground})` : "none",
    backgroundSize: "contain",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  } as const;

  return (
    <div className="bg-[#f7f9fc] min-h-screen">
      <main className="max-w-screen-lg mx-auto p-4 md:p-6 flex flex-col gap-8">
        {/* Viewer Section */}
        <section className="rounded-2xl shadow-lg p-6 border bg-white">
          <div className="rounded-xl overflow-hidden mt-4">
            <Suspense fallback={<div className="h-[600px] bg-gray-100 animate-pulse rounded-xl" />}>
              {selectedCell ? (
                selectedCell.is360 ? (
                  <ReactPhotoSphereViewer
                    src={typeof selectedCell.imageUrl === "string" ? selectedCell.imageUrl : selectedCell.imageUrl.src}
                    height="600px"
                    width="100%"
                  />
                ) : (
                  // Normal images show full content (contain) – no cropping
                  <Image
                    src={selectedCell.imageUrl}
                    alt={selectedCell.name}
                    width={1200}
                    height={600}
                    className="w-full h-[600px] object-contain bg-black rounded-xl"
                    priority
                  />
                )
              ) : (
                <div className="h-[600px] w-full bg-gray-100 flex items-center justify-center text-gray-500 rounded-xl">
                  Select a room from the floor plan
                </div>
              )}
            </Suspense>
          </div>
        </section>

        {/* Floor Plan Section */}
        <section className="rounded-2xl shadow-lg p-6 border bg-white">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-[#3b82f6] mb-6">
            Floor Plan
          </h2>

          <div className="overflow-auto">
            <div className="mx-auto flex flex-col items-start min-w-fit">
              {/* Top labels */}
              <div className="flex mb-0 pl-10 pr-10">{renderNumberLabels()}</div>

              <div className="flex">
                {/* Left labels */}
                <div className="flex flex-col mr-0">
                  {Array.from({ length: height }, (_, i) => (
                    <div
                      key={`left-${i}`}
                      className="w-10 h-10 border border-border bg-[hsl(var(--grid-height))] flex items-center justify-center text-sm font-medium hover:scale-105 transition-transform"
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>

                {/* Main grid with background */}
                <div
                  className="relative bg-muted/30 rounded-2xl border-2 border-dashed border-border overflow-hidden min-w-[800px] min-h-[400px]"
                  style={backgroundStyle}
                >
                  <div className="flex flex-col p-0">{gridContent}</div>
                </div>

                {/* Right labels */}
                <div className="flex flex-col ml-0">
                  {Array.from({ length: height }, (_, i) => (
                    <div
                      key={`right-${i}`}
                      className="w-10 h-10 border border-border bg-[hsl(var(--grid-height))] flex items-center justify-center text-sm font-medium hover:scale-105 transition-transform"
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom labels */}
              <div className="flex mt-0 pl-10 pr-10">{renderNumberLabels()}</div>
            </div>
          </div>

          {/* Selected room info */}
          {selectedCell && (
            <div className="mt-6 bg-blue-200 p-4 rounded-lg text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-black mb-2">The area of the unit</h2>
              <p className="text-base md:text-lg text-gray-800 whitespace-nowrap">
                {selectedCell.size} • {selectedCell.area}
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default PRO_MODE;
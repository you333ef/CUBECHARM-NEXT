"use client";

import { useState, Suspense, memo, useCallback, useMemo, lazy } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import type { StaticImageData } from "next/image";
import PhotoSphereViewer from "../../componants/shared/PhotoSphereViewer";



// 2. 
interface CellData {
  id: string;
  name: string;
  size: string;
  area: string;
  imageUrl: string | StaticImageData;
  is360: boolean;
}

// 3. 
const masterBedroomImg = "/images/hugo-rouquette-8RrDGp_4S9E-unsplash.jpg";
const bedroom1Img = "/images/tomas-cocacola-1MCdcbJxViE-unsplash.jpg";
const bedroom2Img = "/images/bedroom3.jpg";
const bedroom3Img = "/images/Master.jpg";
const livingRoomImg = "/images/Living_ONe.jpg";
const bathroom1Img = "/images/Kitchen.jpg";
const bathroom2Img = "/images/bedroom2.jpg";
const kitchenImg = "/images/Kitchen2.jpg";
const Updated_Map = "/images/UpdatedMap.jpg";

// 4.
const GridCell = memo(({ cellData, onSelect }: { cellData?: CellData; onSelect: () => void }) => {
  const hasImage = !!cellData?.imageUrl;

  return (
    <div
      className={`relative w-10 h-10 border border-border overflow-hidden ${
        hasImage ? "cursor-pointer transition-shadow hover:shadow-lg" : ""
      }`}
      onClick={onSelect}
    >
      {!hasImage && <div className="absolute inset-0 bg-blue-500/20" />}
      {hasImage && <div className="absolute inset-0 bg-black/20" />}
    </div>
  );
});
GridCell.displayName = "GridCell";

// 5.
const PRO_MODE = () => {
  const width = 20;
  const height = 10;
  const gridBackground = Updated_Map;

  // 6.
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

  // 7. 
  const [selectedCell, setSelectedCell] = useState<CellData | null>(null);

  // 8. 
  const handleCellClick = useCallback((cell: CellData) => {
    setSelectedCell(cell);
  }, []);

  // 9.
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
      rows.push(<div key={`row-${row}`} className="flex">{cellsInRow}</div>);
    }
    return rows;
  }, [handleCellClick]);

  // 10
  const renderNumberLabels = () =>
    Array.from({ length: Math.max(width, height) }, (_, i) => (
      <div
        key={i}
        className="w-10 h-10 border border-border bg-[hsl(var(--grid-width))] flex items-center justify-center text-sm font-medium hover:scale-105 transition-transform"
      >
        {i + 1}
      </div>
    ));

  // 11.
  const backgroundStyle = {
    backgroundImage: gridBackground ? `url(${gridBackground})` : "none",
    backgroundSize: "contain",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  } as const;

  return (
    <div className="bg-[#f7f9fc] min-h-screen">
      <main className="max-w-screen-lg mx-auto p-4 md:p-6 flex flex-col gap-8">
      
        <section className="rounded-2xl shadow-lg p-6 border bg-white">
          <div className="rounded-xl overflow-hidden mt-4">
            <Suspense fallback={<div className="h-[600px] bg-gray-100 animate-pulse rounded-xl" />}>
              {selectedCell ? (
                selectedCell.is360 ? (
                  // 12.
                  <PhotoSphereViewer
                    src={typeof selectedCell.imageUrl === "string" ? selectedCell.imageUrl : selectedCell.imageUrl.src}
                    
                    
                  />
                ) : (
                  // 13.
                  <Image
                    src={selectedCell.imageUrl}
                    alt={selectedCell.name}
                    width={1200}
                    height={600}
                    className="w-full h-[600px] object-contain bg-black rounded-xl"
                    priority={false}
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAA..." // optional: add real base64 if you want
                  />
                )
              ) : (
                // 14
                <div className="h-[600px] w-full rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center text-center px-8">
                  <div className="bg-white/90 backdrop-blur-sm p-10 rounded-3xl shadow-2xl max-w-md">
                    <div className="w-20 h-20 bg-blue-600 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                      <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    </div>
                    <h3 className="text-3xl font-light text-gray-800 mb-3">
                     Choose room  to explore
                    </h3>
                    
                  </div>
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
              <div className="flex mb-0 pl-10 pr-10">{renderNumberLabels()}</div>

              <div className="flex">
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

                <div
                  className="relative bg-muted/30 rounded-2xl border-2 border-dashed border-border overflow-hidden min-w-[800px] min-h-[400px]"
                  style={backgroundStyle}
                >
                  <div className="flex flex-col p-0">{gridContent}</div>
                </div>

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

              <div className="flex mt-0 pl-10 pr-10">{renderNumberLabels()}</div>
            </div>
          </div>

          {/* Room info card */}
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
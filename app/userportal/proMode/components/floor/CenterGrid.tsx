import React from "react";
import { FiUpload, FiMoreHorizontal } from "react-icons/fi";

interface CellData {
  id: string;
  images?: File[];
  imageUrls: string[];
}

interface CenterGridProps {
  height: number;
  width: number;
  cells: Record<string, CellData>;
  hoveredCell: string | null;
  onHover: (cellId: string | null) => void;
  onImageUpload: (cellId: string, event: React.ChangeEvent<HTMLInputElement>) => void;
  onShowMenu: (cellId: string) => void;
}

const CenterGrid: React.FC<CenterGridProps> = ({
  height,
  width,
  cells,
  hoveredCell,
  onHover,
  onImageUpload,
  onShowMenu,
}) => {
  return (
    <div className="flex flex-col p-0">
      {Array.from({ length: height }).map((_, rowIndex) => (
        <div key={`row-${rowIndex}`} className="flex">
          {Array.from({ length: width }).map((_, colIndex) => {
            const cellId = `cell-${rowIndex}-${colIndex}`;
            const cellData = cells[cellId];
            const isHovered = hoveredCell === cellId;
            const hasCellImage = !!cellData?.imageUrls?.length;
            return (
              <div
                key={cellId}
                className="relative w-10 h-10 m-0 border border-border overflow-hidden group cursor-pointer transition-all hover:shadow-lg"
                onMouseEnter={() => onHover(cellId)}
                onMouseLeave={() => onHover(null)}
              >
                {!hasCellImage && (
                  <div className="absolute inset-0 bg-blue-500/20" />
                )}
                {hasCellImage && (
                  <div className="absolute inset-0 bg-gray-300/50 flex items-center justify-center text-black font-light text-xs">
                    {cellData.imageUrls.length}
                  </div>
                )}
                {isHovered && (
                  <div className="absolute inset-0 bg-white/80 flex items-center justify-center gap-1 animate-in fade-in duration-150 pointer-events-auto">
                    {!hasCellImage ? (
                      <label className="cursor-pointer p-0 rounded-full bg-accent hover:bg-accent/80 transition-colors">
                        <FiUpload className="w-3 h-3 text-accent-foreground" />
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={(e) => onImageUpload(cellId, e)}
                        />
                      </label>
                    ) : (
                      <button
                        onClick={() => onShowMenu(cellId)}
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
      ))}
    </div>
  );
};

export default CenterGrid;
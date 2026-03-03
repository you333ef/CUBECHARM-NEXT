"use client";

import {
  useState,
  Suspense,
  memo,
  useMemo,
  useEffect,
  useContext,
} from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import PhotoSphereViewer from "../../componants/shared/PhotoSphereViewer";
import AuthContext from "@/app/providers/AuthContext";
import ConfirmDeleteModal from '../../../adminPortl/sharedAdmin/DELETE_CONFIRM';
import PostOptionDialog from "../../activity/componants/PostOptionDialog";
import { FiMoreVertical } from "react-icons/fi";
import api from "@/app/AuthLayout/refresh";

interface ApiImage {
  url?: string;
  is360?: boolean;
  name?: string;
  heightLevel?: number;
}
interface ApiCell {
  hasImages: boolean;
  images: ApiImage[];
}
interface Floor {
  id: number;
  floorNumber: number;
  gridCellsX: number;
  gridCellsY: number;
  backgroundImageUrl?: string | null;
  cells: Record<string, ApiCell>;
  filledCells?: number;
  ownerId?: string;
}
interface CellData {
  id: string;
  images: ApiImage[];
}
/* UI sizes */
const CELL_SIZE = 40;
const GridCell = memo(
  ({ count, hasImage, onClick }: { count: number; hasImage: boolean; onClick: () => void }) => {
    return (
      <div
        onClick={hasImage ? onClick : undefined}
        style={{ width: CELL_SIZE, height: CELL_SIZE }}
        className={`relative border transition ${
          hasImage ? "cursor-pointer bg-black/30 hover:bg-black/40" : "bg-blue-500/20"
        }`}
      >
        {count > 1 && (
          <div className="absolute top-0 right-0 m-0.5 bg-black/80 text-white text-[10px] px-1 rounded">
            {count}
          </div>
        )}
      </div>
    );
  }
);
GridCell.displayName = "GridCell";
const PRO_MODE = () => {
  const auth = useContext(AuthContext)!;
const { baseUrl, user } = auth;

  const params = useParams();
  const propertyId = Number(params.id);

  const API_ASSETS_BASE = "http://localhost:5000";

  const [floors, setFloors] = useState<Floor[]>([]);
  const [selectedCell, setSelectedCell] = useState<{
    id: string;
    images: ApiImage[];
    index: number;
  } | null>(null);
  const [viewerActive, setViewerActive] = useState(false);
  const [viewerSrc, setViewerSrc] = useState<string | null>(null);

  const [optionsPost, setOptionsPost] = useState<any>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    if (!propertyId || !baseUrl) return;

    const fetchFloors = async () => {
      try {
        const res = await api.get(`/properties/${propertyId}/floors`);
      const floorPlan = res.data.data?.floorPlan;

if (floorPlan) {
  setFloors([floorPlan]);
} else {
  setFloors([]);
}

setSelectedCell(null);

      } catch (err) {
        console.error("fetchFloors error", err);
      }
    };

    fetchFloors();
  }, [propertyId, baseUrl]);

  const currentFloor = floors[0];

  const buildFullUrl = (url?: string) => {
    if (!url) return undefined;
    if (/^https?:\/\//i.test(url)) return url;
    return `${API_ASSETS_BASE}/${url.replace(/^\//, "")}`;
  };

  const cellMap = useMemo<Record<string, CellData>>(() => {
    if (!currentFloor) return {};
    const map: Record<string, CellData> = {};
    Object.entries(currentFloor.cells || {}).forEach(([id, cell]) => {
      if (!cell.hasImages) return;
      map[id] = {
        id,
        images: cell.images.map(img => ({
          ...img,
          url: img.url ? buildFullUrl(img.url) : undefined,
        })),
      };
    });
    return map;
  }, [currentFloor]);

  const cols = currentFloor?.gridCellsX ?? 0;
  const rows = currentFloor?.gridCellsY ?? 0;

  const gridWidth = cols * CELL_SIZE;
  const gridHeight = rows * CELL_SIZE;

const onCellClick = (id: string) => {
  const cell = cellMap[id];
  if (!cell) return;

  setSelectedCell((prev) => {
    let next: { id: string; images: ApiImage[]; index: number };

    if (!prev || prev.id !== id) {
      next = { id, images: cell.images, index: 0 };
    } else {
      const nextIndex = (prev.index + 1) % prev.images.length;
      next = { id, images: prev.images, index: nextIndex };
    }

    const img = next.images[next.index];
    if (isImage360(img) && img.url) {
      setViewerSrc(img.url);
      setViewerActive(true);
    } else {
      setViewerActive(false);
    }

    return next;
  });
};

  const grid = useMemo(() => {
    return Array.from({ length: rows }).map((_, row) => (
      <div key={row} className="flex">
        {Array.from({ length: cols }).map((_, col) => {
          const id = `cell-${row}-${col}`;
          const cell = cellMap[id];
          const hasImage = !!cell;
          const count = cell?.images.length ?? 0;
          return (
            <GridCell
              key={id}
              count={count}
              hasImage={hasImage}
              onClick={() => onCellClick(id)}
            />
          );
        })}
      </div>
    ));
  }, [rows, cols, cellMap]);

const  navi=  useRouter()
//  Delete  Floor Plane 
 const FunDeleteFloor = async () => {
  if (!currentFloor?.id) {
    console.error("floorId not found");
    return;
  }
  try {
    const response = await api.delete(
      `/properties/${propertyId}/floors/${currentFloor.id}/cancel`
    );

    console.log("Floor deleted:", response.data);
    navi.push(`/userportal/property/${propertyId}`)
  } catch (error) {
    console.error("Delete floor error:", error);
  }
};

  const handleOptionDelete = () => {
    setIsConfirmOpen(true);
    setOptionsPost(null);
  };

 const isOwner =
  !!user?.sub &&
  !!currentFloor?.ownerId &&
  user.sub === currentFloor.ownerId;


  const handleConfirmTrue = async () => {
    await FunDeleteFloor();
    setIsConfirmOpen(false);
    setFloors([]);
  };

  const isImage360 = (img?: ApiImage | null) =>
    !!img &&
    !!img.url &&
    (img.is360 === true ||
      img.url.toLowerCase().includes("360") ||
      img.url.toLowerCase().includes("pano"));

  const currentImage =
    selectedCell && selectedCell.images.length
      ? selectedCell.images[selectedCell.index]
      : null;

  return (
    <div className="bg-[#f7f9fc] min-h-screen">
      <main className="max-w-screen-lg mx-auto p-6 space-y-8">
        <section className="bg-white rounded-2xl shadow p-6 space-y-3">
          <div className="relative w-full max-w-4xl mx-auto">
            {/* Fixed-height container to avoid CLS */}
            <div className="relative w-full h-[420px] sm:h-[480px] md:h-[520px] bg-black rounded-xl overflow-hidden">
              {currentImage?.url ? (
                <Image
                  src={currentImage.url}
                  alt={currentImage.name || "room"}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 900px"
                  className="object-contain rounded-xl"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  Select a cell
                </div>
              )}

              {/* 360 viewer overlay - mounted once, just hidden/shown */}
              <Suspense fallback={null}>
                <PhotoSphereViewer src={viewerSrc} active={viewerActive} />
              </Suspense>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl shadow p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-blue-500">Plane Floor</h2>
          {isOwner && (
  <div 
    onClick={() =>
        setOptionsPost({
          id: currentFloor?.id,
          isOwner: true,
        })
      }
  
  className="p-2 rounded-full hover:bg-gray-200 transition">
    <FiMoreVertical
      size={18}
      className="text-gray-600"
    
    />
  </div>
)}

          </div>

          <div className="flex justify-center">
            <div
              className="relative border-2 border-dashed rounded-xl"
              style={{
                width: gridWidth,
                height: gridHeight,
              }}
            >
              {currentFloor?.backgroundImageUrl && (
                <Image
                  src={`${API_ASSETS_BASE}/${currentFloor.backgroundImageUrl.replace(/^\//, "")}`}
                  alt="Floor Plan"
                  fill
                  unoptimized
                  className="object-contain"
                />
              )}

              <div className="absolute inset-0">{grid}</div>
            </div>
          </div>
        </section>
      </main>

      {optionsPost && (
        <PostOptionDialog
          open={!!optionsPost}
          postId={optionsPost.id}
          username=""
          isOwner={isOwner}
          onClose={() => setOptionsPost(null)}
          onDelete={handleOptionDelete}
         
          
    showUpdate={true}     
          onBlock={() => {}}
          onReport={() => {}}
        />
      )}

      {isConfirmOpen && (
        <ConfirmDeleteModal
          DeleteTrue={handleConfirmTrue}
          name="Floor Plane"
          actionType="delete"
          onCancel={() => setIsConfirmOpen(false)}
        />
      )}
    </div>
  );
};
export default PRO_MODE;
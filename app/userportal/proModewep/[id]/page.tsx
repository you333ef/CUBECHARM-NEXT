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
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import PhotoSphereViewer from "../../componants/shared/PhotoSphereViewer";
import AuthContext from "@/app/providers/AuthContext";
import ConfirmDeleteModal from '../../../adminPortl/sharedAdmin/DELETE_CONFIRM';
import PostOptionDialog from "../../activity/componants/PostOptionDialog";
import { FiMoreVertical } from "react-icons/fi";

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

  const [optionsPost, setOptionsPost] = useState<any>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    if (!propertyId || !baseUrl) return;

    const fetchFloors = async () => {
      try {
        const res = await axios.get(`${baseUrl}/properties/${propertyId}/floors`);
        const all = res.data.data?.floors || [];
        const nonEmpty = all.filter((f: Floor) => (f.filledCells ?? 0) > 0);
        const lastFilled = nonEmpty.length ? nonEmpty[nonEmpty.length - 1] : null;
        setFloors(lastFilled ? [lastFilled] : []);
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

    setSelectedCell(prev => {
      if (!prev || prev.id !== id) {
        return { id, images: cell.images, index: 0 };
      } else {
        const nextIndex = (prev.index + 1) % prev.images.length;
        return { id, images: prev.images, index: nextIndex };
      }
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
    const response = await axios.delete(
      `${baseUrl}/properties/${propertyId}/floors/${currentFloor.id}/cancel`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
      }
    
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

  return (
    <div className="bg-[#f7f9fc] min-h-screen">
      <main className="max-w-screen-lg mx-auto p-6 space-y-8">
        <section className="bg-white rounded-2xl shadow p-6">
          <Suspense fallback={<div className="h-[600px]" />}>
            {selectedCell ? (
              selectedCell.images[selectedCell.index]?.is360 ? (
                <PhotoSphereViewer src={selectedCell.images[selectedCell.index].url!} />
              ) : (
                <Image
                  src={selectedCell.images[selectedCell.index].url!}
                  alt={selectedCell.images[selectedCell.index].name || "room"}
                  width={1200}
                  height={600}
                  unoptimized
                  className="w-full h-[600px] object-contain bg-black rounded-xl"
                />
              )
            ) : (
              <div className="h-[600px] flex items-center justify-center text-gray-500">
                Select a cell
              </div>
            )}
          </Suspense>
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
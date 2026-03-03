import { useEffect, useRef, useState } from "react";

interface MediaCardProps {
  item: any;
  index: number | string;
  isApiMedia: boolean;
  isUpdateMode: boolean;
  currentMainCount: number;
  maxMainCount: number;
  isActive?: boolean;
  onRemove: () => Promise<void>;
  onSetMain: () => Promise<void>;
}

const MediaCard = ({
  item,
  index,
  isApiMedia,
  isUpdateMode,
  currentMainCount,
  maxMainCount,
  isActive = true,
  onRemove,
  onSetMain,
}: MediaCardProps) => {
  const isImage = item.type === "image";
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const canAddMain = isImage && (currentMainCount < maxMainCount || item.isMain);
  const showSetMainButton = isImage && (!isUpdateMode || !isApiMedia) && canAddMain;

  const handleToggleVideo = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    if (!isActive && videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [isActive]);

  return (
    <div className="relative group overflow-hidden rounded-lg bg-gray-50 border w-full aspect-[4/3]">
      <div className="w-full h-full overflow-hidden bg-gray-100">
        {item.type === "image" ? (
          <img
            src={item.url}
            alt={`media-${index}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <video
            ref={videoRef}
            src={item.url}
            className="w-full h-full object-cover"
            controls={isPlaying}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
          >
            <source src={item.url} />
          </video>
        )}
      </div>

      {item.isMain && (
        <span className="absolute bottom-2 left-2 z-20 bg-blue-600 text-white text-xs px-2 py-1 rounded-full shadow-sm">
          Main
        </span>
      )}

      <button
        type="button"
        onClick={onRemove}
        className="absolute top-2 left-2 z-20 inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-white text-xs hover:bg-black/80"
        aria-label="Remove media"
      >
        ×
      </button>

      {showSetMainButton && (
        <button
          type="button"
          onClick={onSetMain}
          className={`absolute top-2 right-2 z-20 inline-flex h-8 w-8 items-center justify-center rounded-full border bg-white/90 text-blue-600 shadow-sm hover:bg-blue-50 ${
            item.isMain ? "ring-2 ring-blue-500" : ""
          }`}
          aria-label={item.isMain ? "Unset main image" : "Set as main image"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="h-4 w-4"
          >
            <path
              d="M7 3h10l-2 6 3 3-3 3-3-3-3 3-3-3 3-3-2-6z"
              className={item.isMain ? "fill-blue-600" : "fill-transparent"}
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>
        </button>
      )}

      {item.type === "video" && (
        <button
          type="button"
          onClick={handleToggleVideo}
          className={`absolute inset-0 z-10 flex items-center justify-center transition-opacity ${
            isPlaying ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
          aria-label={isPlaying ? "Pause video" : "Play video"}
        >
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-black/60 text-white text-sm">
            {isPlaying ? "❚❚" : "▶"}
          </span>
        </button>
      )}
    </div>
  );
};

export default MediaCard;


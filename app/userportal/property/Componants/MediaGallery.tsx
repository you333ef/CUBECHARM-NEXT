// ============================================================
// 1. Media Gallery Component
// ============================================================
// A performant media gallery supporting images, videos, and 360°.
// Uses CSS-based responsive sizing to avoid reflow/repaint issues.
// ============================================================
"use client";
import { useState, Suspense, lazy, useCallback, memo, ComponentType } from "react";
import { mediaItems } from "../../../utils/mediaItems";
import Image from "next/image";

// 2. Type for 360 viewer props
interface PhotoSphereProps {
  src: string;
  width: string;
  height: string;
}

// 3. Lazy load heavy 360 viewer library (install: npm i react-photo-sphere-viewer)
const ReactPhotoSphereViewer = lazy(() =>
  import("react-photo-sphere-viewer").then((m) => ({ 
    default: m.ReactPhotoSphereViewer as ComponentType<PhotoSphereProps>
  })).catch(() => ({
    // 4. Fallback if library not installed
    default: ({ src }: PhotoSphereProps) => (
      <div className="w-full h-full flex items-center justify-center bg-muted rounded-lg">
        <img src={src} alt="360 View" className="w-full h-full object-cover rounded-lg" />
      </div>
    )
  }))
);

// 5. Skeleton loader for suspense fallback
const MediaGallerySkeleton = () => (
  <div className="w-full">
    <div 
      className="w-full bg-muted animate-pulse rounded-lg" 
      style={{ aspectRatio: "16/9" }} 
    />
    <div className="flex overflow-x-auto gap-3 mt-4 pb-2">
      {[1, 2, 3, 4].map((i) => (
        <div 
          key={i} 
          className="flex-shrink-0 h-20 w-28 sm:h-24 sm:w-32 bg-muted animate-pulse rounded-lg" 
        />
      ))}
    </div>
  </div>
);

// 6. Main MediaGallery component
const MediaGallery = memo(() => {
  // 7. Track currently selected media item
  const [selectedMedia, setSelectedMedia] = useState(mediaItems[0]);

  // 8. Memoized handler for thumbnail selection
  const handleThumbnailClick = useCallback((media: any) => {
    setSelectedMedia(media);
  }, []);

  return (
    <div className="w-full media-gallery">
    {/* 9. 360 Viewer - lazy loaded */}
{selectedMedia.is360 && !selectedMedia.isVideo ? (
  <Suspense fallback={<MediaGallerySkeleton />}>
    <div className="viewer-360 rounded-lg overflow-hidden relative">
      {/* Placeholder صغير أثناء التحميل */}
      <div className="absolute inset-0 bg-gray-200 animate-pulse z-0"></div>
      
      <ReactPhotoSphereViewer
        src={selectedMedia.src}
        width="100%"
        height="100%"
       
      />
    </div>
  </Suspense>
) : !selectedMedia.isVideo ? (
  // 10. Image container - CSS-based responsive sizing
  <div className="main-image-container relative mx-auto w-full max-w-[900px] overflow-hidden rounded-2xl">
  <div className="main-image-container relative mx-auto w-full max-w-[900px] overflow-hidden rounded-2xl aspect-[16/9]">
  <Image
    src={selectedMedia.src}
    alt={selectedMedia.alt || "Property"}
    fill
    className="object-cover"
    priority={selectedMedia.id === mediaItems[0].id}
    placeholder="blur"
    blurDataURL="data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAB..."
  />
</div>

  </div>
) : null}


{/* 11. Video iframe */}
{selectedMedia.isVideo && (
  <div className="w-full aspect-video relative">
    {/* Placeholder صغير قبل تحميل الفيديو */}
    <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg"></div>

    <iframe
      width="100%"
      height="100%"
      src={selectedMedia.src}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      title="Property Video"
      loading="lazy" // lazy للـ iframe لتأخير التحميل
      className="rounded-lg relative z-10"
    />
  </div>
)}


   {/* 12. Thumbnail navigation strip */}
<div className="w-full overflow-x-auto scrollbar-hide">
  <div className="flex gap-3 mt-4 pb-2 justify-center w-max mx-auto px-4">
    {mediaItems.map((item, index) => (
      <div key={item.id} className="flex-shrink-0 contain-layout contain-paint">
        {item.isVideo ? (
          <div
            onClick={() => handleThumbnailClick(item)}
            className={`relative h-16 w-24 sm:h-20 sm:w-28 md:h-24 md:w-32 cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200 hover:scale-105 hover:shadow-lg ${
              selectedMedia.id === item.id
                ? "border-primary ring-2 ring-primary/30"
                : "border-transparent hover:border-primary/50"
            }`}
          >
            <Image
              src={item.thumbnail}
              alt={`Video thumbnail ${index + 1}`}
              fill
              className="object-cover"
            />

            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-6 h-6 text-white opacity-90" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        ) : (
          <Image
            src={item.thumbnail}
            alt={item.alt || `Thumbnail ${index + 1}`}
            onClick={() => handleThumbnailClick(item)}
            className={`h-16 w-24 sm:h-20 sm:w-28 md:h-24 md:w-32 object-cover rounded-lg cursor-pointer border-2 transition-all duration-200 hover:scale-105 hover:shadow-lg ${
              selectedMedia.id === item.id
                ? "border-primary ring-2 ring-primary/30"
                : "border-transparent hover:border-primary/50"
            }`}
            width={150}
            height={100}
            loading={selectedMedia.id === item.id ? "eager" : "lazy"}
            decoding="async"
            priority={selectedMedia.id === item.id}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAB..."
          />
        )}
      </div>
    ))}
  </div>
</div>


    </div>
  );
});

MediaGallery.displayName = "MediaGallery";

export default MediaGallery;

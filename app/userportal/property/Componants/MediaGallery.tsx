// 1. Media Gallery Component

"use client";
import { useState, useCallback, memo } from "react";
import { mediaItems } from "../../../utils/mediaItems";
import Image from "next/image";
import dynamic from "next/dynamic";

// 2. 
interface PhotoSphereProps {
  src: string;
  width: string;
  height: string;
}

const ReactPhotoSphereViewer = dynamic<PhotoSphereProps>(
  () => import("react-photo-sphere-viewer").then((mod) => {
    
    return { default: mod.ReactPhotoSphereViewer };
  }).catch(() => {
   
    return {
      default: ({ src }: PhotoSphereProps) => (
        <div className="w-full h-full flex items-center justify-center bg-muted rounded-lg">
          <Image 
            src={src} 
            alt="360 View" 
            fill
            className="object-cover rounded-lg" 
          />
        </div>
      )
    };
  }),
  {
    ssr: false,
    loading: () => (
      <div className="w-full aspect-video bg-gray-200 animate-pulse rounded-lg" />
    ),
  }
);

// 5
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

// 6
const MediaGallery = memo(() => {
  // 7
  const [selectedMedia, setSelectedMedia] = useState(mediaItems[0]);

  // 8
  const handleThumbnailClick = useCallback((media: any) => {
    setSelectedMedia(media);
  }, []);

  return (
    <div className="w-full media-gallery">
    
    {/* 9 */}
    {selectedMedia.is360 && !selectedMedia.isVideo ? (
      <div className="viewer-360 rounded-lg overflow-hidden relative w-full aspect-video">
        <ReactPhotoSphereViewer
          src={selectedMedia.src}
          width="100%"
          height="100%"
        />
      </div>
    ) : !selectedMedia.isVideo ? (
      // 10
      <div className="relative w-full max-w-[900px] mx-auto overflow-hidden rounded-2xl bg-gray-100">
       
        <div className="relative pb-[56.25%]">
          <Image
            src={selectedMedia.src}
            alt={selectedMedia.alt || "Property"}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 900px"
            className="object-cover rounded-2xl"
            loading="eager"
            placeholder="blur"
            blurDataURL="/blur.png"
            fetchPriority="high"
          />
        </div>
      </div>
    ) : null}

    {/* 11.  */}
    {selectedMedia.isVideo && (
      <div className="w-full aspect-video relative">
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg"></div>
        <iframe
          width="100%"
          height="100%"
          src={selectedMedia.src}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Property Video"
          loading="lazy" 
          className="rounded-lg relative z-10"
        />
      </div>
    )}

    {/* 12. */}
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
                width={96}
                height={64}
                loading={item.id === mediaItems[0].id ? "eager" : "lazy"}
                decoding="async"
                priority={item.id === mediaItems[0].id}
                placeholder="blur"
                blurDataURL="/blur.png"
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
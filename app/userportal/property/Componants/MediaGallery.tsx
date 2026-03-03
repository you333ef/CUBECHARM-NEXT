"use client";
import { useState, useCallback, memo, useMemo, useEffect } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";

interface PhotoSphereProps {
  src: string;
  width: string;
  height: string;
}

interface MediaGalleryProps {
  images: {
    id: number;
    url: string;
    isMain?: boolean;
  }[];
}

const ReactPhotoSphereViewer = dynamic<PhotoSphereProps>(
  () =>
    import("react-photo-sphere-viewer")
      .then((mod) => ({ default: mod.ReactPhotoSphereViewer }))
      .catch(() => ({
        default: ({ src }: PhotoSphereProps) => (
          <div className="relative w-full h-full min-h-[200px] bg-muted rounded-lg">
            <Image src={src} alt="360 View" fill className="object-cover rounded-lg" unoptimized />
          </div>
        ),
      })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full aspect-video bg-gray-200 animate-pulse rounded-lg" aria-hidden />
    ),
  }
);

const MediaGallerySkeleton = () => (
  <div className="w-full">
    <div className="w-full bg-muted animate-pulse rounded-lg" style={{ aspectRatio: "16/9" }} />
    <div className="flex overflow-x-auto gap-3 mt-4 pb-2">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex-shrink-0 h-20 w-28 sm:h-24 sm:w-32 bg-muted animate-pulse rounded-lg" />
      ))}
    </div>
  </div>
);

function getProxyUrlIfExternal(url: string): string {
  if (typeof url !== "string") return url;
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return `/api/proxy-image?url=${encodeURIComponent(url)}`;
  }
  return url;
}

const MediaGallery = memo(({ images }: MediaGalleryProps) => {
  const mediaItems = useMemo(
    () =>
      images.map((img, index) => ({
        id: img.id,
        src: img.url,
        thumbnail: img.url,
        alt: `Property image ${index + 1}`,
        isVideo: false,
        is360: img.url.toLowerCase().includes("360"),
      })),
    [images]
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedMedia = mediaItems[selectedIndex] ?? mediaItems[0];
  const [isMobile, setIsMobile] = useState(false);
  const [viewerReady, setViewerReady] = useState(false);
  const [isMainImageLoading, setIsMainImageLoading] = useState(false);

  // Keep selection in range if images change
  useEffect(() => {
    if (!mediaItems.length) return;
    setSelectedIndex((prev) => {
      if (Number.isNaN(prev) || prev < 0) return 0;
      if (prev >= mediaItems.length) return mediaItems.length - 1;
      return prev;
    });
  }, [mediaItems]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!selectedMedia?.is360) {
      setViewerReady(false);
      return;
    }
    setViewerReady(!isMobile);
  }, [selectedMedia, isMobile]);
  const proxyPath = selectedMedia?.is360
    ? getProxyUrlIfExternal(selectedMedia.src)
    : "";
  const viewerSrc = useMemo(() => {
    if (!selectedMedia?.is360) return selectedMedia?.src;
    if (typeof window === "undefined") return proxyPath;
    return proxyPath.startsWith("/")
      ? `${window.location.origin}${proxyPath}`
      : proxyPath;
  }, [selectedMedia?.is360, selectedMedia?.src, proxyPath]);

  const handleThumbnailClick = useCallback(
    (index: number) => {
      if (index === selectedIndex) return;
      setSelectedIndex(index);
      setIsMainImageLoading(true);
    },
    [selectedIndex]
  );

  useEffect(() => {
    if (!mediaItems.length || typeof window === "undefined") return;
    mediaItems.forEach((item) => {
      if (!item.src || item.is360) return;
      const img = new window.Image();
      img.src = item.src;
    });
  }, [mediaItems]);

  if (!mediaItems.length) return <MediaGallerySkeleton />;

  return (
    <div className="w-full media-gallery">

      <div className="relative w-full max-w-[600px] mx-auto overflow-hidden rounded-2xl bg-gray-100">
        <div className="relative w-full aspect-[4/3] max-h-[420px]">
          {selectedMedia?.is360 ? (
            <div className="absolute inset-0 w-full h-full min-h-[260px] md:min-h-[320px]">
              {viewerReady ? (
                <ReactPhotoSphereViewer
                  src={viewerSrc}
                  width="100%"
                  height="100%"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setViewerReady(true)}
                  className="w-full h-full flex flex-col items-center justify-center bg-black/80 text-white text-sm gap-3"
                >
                  <span className="px-3 py-1 rounded-full bg-white/10 border border-white/30">
                    Tap to view 360°
                  </span>
                  <span className="text-xs text-white/70 max-w-[260px] text-center">
                    360° view is heavy on mobile. Tap once to load it.
                  </span>
                </button>
              )}
            </div>
          ) : (
            <div className="absolute inset-0">
              <Image
                src={selectedMedia?.src}
                alt={selectedMedia?.alt || "Property"}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 900px"
                className="object-cover rounded-2xl"
                loading="eager"
                decoding="async"
                placeholder={selectedIndex === 0 ? "blur" : undefined}
                blurDataURL={selectedIndex === 0 ? "/blur.png" : undefined}
                fetchPriority="high"
                unoptimized
                onLoadingComplete={() => setIsMainImageLoading(false)}
              />
              {isMainImageLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                  <div className="h-8 w-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="w-full overflow-x-auto scrollbar-hide">
        <div className="flex gap-3 mt-4 pb-2 justify-center w-max mx-auto px-4">
          {mediaItems.map((item, index) => (
          <div key={item.id} className="relative">
              {item.is360 && (
                <div className="absolute top-1 left-1 bg-black/60 text-white text-xs px-1 py-[2px] rounded">
                  360°
                </div>
              )}

              <Image
                src={item.thumbnail}
                alt={item.alt}
                unoptimized
                onClick={() => handleThumbnailClick(index)}
                className={`h-16 w-24 sm:h-20 sm:w-28 md:h-24 md:w-32 object-cover rounded-lg cursor-pointer border-2 transition-all duration-200 hover:scale-105 hover:shadow-lg ${
                  selectedMedia.id === item.id
                    ? "border-primary ring-2 ring-primary/30"
                    : "border-transparent hover:border-primary/50"
                }`}
                width={96}
                height={64}
                loading={index === 0 ? "eager" : "lazy"}
                decoding="async"
                priority={index === 0}
                placeholder={index === 0 ? "blur" : undefined}
                blurDataURL={index === 0 ? "/blur.png" : undefined}
              />
            </div>
          ))}
        </div>
      </div>

    </div>
  );
});

MediaGallery.displayName = "MediaGallery";

export default MediaGallery;
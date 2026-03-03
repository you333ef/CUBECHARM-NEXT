"use client";

import { useEffect, useState, useRef, useCallback, useContext } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { FaChevronLeft, FaChevronRight, FaTimes, FaEllipsisV } from "react-icons/fa";
import Image from "next/image";
import { toast } from "sonner";
import AuthContext from "@/app/providers/AuthContext";
import api from "@/app/AuthLayout/refresh";

type Slide = {
  id: number;
  slideId?: number;
  mediaUrl: string;
  caption?: string | null;
  userId?: string | number;
};

type Album = {
  id: number;
  albumName: string;
  slides: Slide[];
  userId?: string | number;
};

type ViewerMode = "viewer" | "owner" | "admin";

const BASE_MEDIA_URL = "http://localhost:5000";

const VIDEO_EXTENSIONS = /\.(mp4|webm|mov|ogg)(\?|$)/i;

const isVideo = (url: string) => VIDEO_EXTENSIONS.test(url || "");

const buildMediaSrc = (mediaUrl: string) =>
  mediaUrl.startsWith("http") ? mediaUrl : `${BASE_MEDIA_URL}/${mediaUrl}`;

const hasValidMedia = (slide: Slide) =>
  slide.mediaUrl?.trim?.()?.length > 0;

const filterValidSlides = (slides: Slide[]) =>
  slides.filter(hasValidMedia);

function MediaLoader() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
      <div className="w-10 h-10 border-2 border-white border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function SlideMedia({
  slide,
  isActive,
}: {
  slide: Slide;
  isActive: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loaded, setLoaded] = useState(false);
  const src = buildMediaSrc(slide.mediaUrl);
  const showVideo = isVideo(slide.mediaUrl);

  useEffect(() => {
    if (!showVideo || !videoRef.current) return;
    const video = videoRef.current;
    if (isActive) {
      const playPromise = video.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch((err: unknown) => {
          const e = err as { name?: string };
          if (e?.name === "AbortError" || e?.name === "NotAllowedError") return;
          console.warn("Video play failed", err);
        });
      }
    } else {
      video.pause();
    }
  }, [showVideo, isActive]);

  const handleReady = () => setLoaded(true);

  const mediaStyle = { opacity: loaded ? 1 : 0 };

  return (
    <div className="w-full h-full flex items-center justify-center relative min-h-[200px]">
      {!loaded && <MediaLoader />}
      {showVideo ? (
        <video
          ref={videoRef}
          src={src}
          className="max-w-full max-h-full object-contain"
          playsInline
          
          loop
          onCanPlay={handleReady}
          onLoadedData={handleReady}
          onError={handleReady}
          style={mediaStyle}
        />
      ) : (
        <img
          src={src}
          alt=""
          className="max-w-full max-h-full object-contain"
          onLoad={handleReady}
          onError={handleReady}
          style={mediaStyle}
        />
      )}
    </div>
  );
}

function ProgressBars({ count, activeIndex }: { count: number; activeIndex: number }) {
  return (
    <div className="absolute top-4 left-6 right-6 flex gap-1 z-50">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
          <div
            className="h-full bg-white transition-all duration-300"
            style={{ width: idx <= activeIndex ? "100%" : "0%" }}
          />
        </div>
      ))}
    </div>
  );
}

function DeleteConfirmModal({
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative bg-white rounded-xl shadow-xl w-[320px] p-6 flex flex-col items-center gap-4 z-[100001]">
        <p className="text-lg font-semibold text-gray-800 text-center">
          Are you sure you want to delete this story?
        </p>
        <div className="flex gap-3 w-full">
          <button
            onClick={onConfirm}
            className="flex-1 bg-black text-white py-2 rounded-lg transition hover:bg-gray-900"
          >
            Delete
          </button>
          <button
            onClick={onCancel}
            className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

type OpenStoryDetail = {
  albums: Album[];
  startAlbumId: number;
  userName?: string;
  userProfileImage?: string;
};

function applyOpenDetail(
  detail: OpenStoryDetail,
  setters: {
    setAlbums: (a: Album[]) => void;
    setCurrentAlbumIndex: (n: number) => void;
    setCurrentSlideIndex: (n: number) => void;
    setIsOpen: (b: boolean) => void;
    setPendingDeleteSlideId: (n: number | null) => void;
    setViewerUserName: (s: string | undefined) => void;
    setViewerUserImage: (s: string | undefined) => void;
  }
) {
  const { albums: evtAlbums, startAlbumId, userName: evtUserName, userProfileImage: evtUserImage } = detail;
  if (!evtAlbums?.length) return;
  const startIndex = evtAlbums.findIndex((a: Album) => a.id === startAlbumId);
  setters.setAlbums(evtAlbums);
  setters.setCurrentAlbumIndex(startIndex >= 0 ? startIndex : 0);
  setters.setCurrentSlideIndex(0);
  setters.setIsOpen(true);
  setters.setPendingDeleteSlideId(null);
  if (evtUserName) setters.setViewerUserName(evtUserName);
  if (evtUserImage) setters.setViewerUserImage(evtUserImage);
  document.body.style.overflow = "hidden";
}

export default function StoryViewer({
  mode = "viewer",
  isOwner = false,
  profileUserId,
  onSlideDeleted,
  onStoriesRefresh,
  userName,
  userProfileImage,
  initialOpenDetail,
}: {
  mode?: ViewerMode;
  isOwner?: boolean;
  profileUserId?: string | number;
  onSlideDeleted?: (slideId: number, albumId: number) => void;
  onStoriesRefresh?: () => void;
  userName?: string;
  userProfileImage?: string;
  /** When viewer is mounted after openStory event, pass the event detail so it opens immediately without waiting for a second event */
  initialOpenDetail?: OpenStoryDetail | null;
}) {
  const { baseUrl, user, fetchMyStories } =
    useContext(AuthContext) || { baseUrl: "", user: null, fetchMyStories: null };
  const swiperRef = useRef<any>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [currentAlbumIndex, setCurrentAlbumIndex] = useState(0);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [pendingDeleteSlideId, setPendingDeleteSlideId] = useState<number | null>(null);
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);
  const [deletingSlideId, setDeletingSlideId] = useState<number | null>(null);
  const [viewerUserName, setViewerUserName] = useState<string | undefined>(userName);
  const [viewerUserImage, setViewerUserImage] = useState<string | undefined>(userProfileImage);

  const currentAlbum = albums[currentAlbumIndex];
  const validSlides = currentAlbum ? filterValidSlides(currentAlbum.slides) : [];
  const currentSlide = validSlides[currentSlideIndex];

  const handleOpenStory = useCallback((e: Event) => {
    const detail = (e as CustomEvent).detail as OpenStoryDetail;
    applyOpenDetail(detail, {
      setAlbums,
      setCurrentAlbumIndex,
      setCurrentSlideIndex,
      setIsOpen,
      setPendingDeleteSlideId,
      setViewerUserName,
      setViewerUserImage,
    });
    setTimeout(() => swiperRef.current?.slideTo(0), 0);
  }, []);

  const closeViewer = useCallback(() => {
    setIsOpen(false);
    setAlbums([]);
    setCurrentSlideIndex(0);
    setPendingDeleteSlideId(null);
    setMenuOpenId(null);
    setDeletingSlideId(null);
    document.body.style.overflow = "unset";
  }, []);

  useEffect(() => {
    if (initialOpenDetail?.albums?.length) {
      applyOpenDetail(initialOpenDetail, {
        setAlbums,
        setCurrentAlbumIndex,
        setCurrentSlideIndex,
        setIsOpen,
        setPendingDeleteSlideId,
        setViewerUserName,
        setViewerUserImage,
      });
      setTimeout(() => swiperRef.current?.slideTo(0), 0);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    window.addEventListener("openStory", handleOpenStory as EventListener);
    window.addEventListener("closeStoryViewer", closeViewer);
    return () => {
      window.removeEventListener("openStory", handleOpenStory as EventListener);
      window.removeEventListener("closeStoryViewer", closeViewer);
    };
  }, [handleOpenStory, closeViewer]);

  const confirmDeleteStory = useCallback(
    async (slideId: number) => {
      if (!isOwner) {
        toast.error("You can only delete your own stories");
        return;
      }

      try {
        await api.delete(`/stories/slides/${slideId}`);
        toast.success("Story deleted successfully!");

        const removeSlide = (album: Album) =>
          album.id === currentAlbum?.id
            ? { ...album, slides: album.slides.filter((s) => s.id !== slideId) }
            : album;

        const hasSlides = (album: Album) =>
          album.slides.some((s) => s.mediaUrl && s.mediaUrl.trim() !== "");

        const updatedAlbums = albums.map(removeSlide).filter(hasSlides);

        if (updatedAlbums.length === 0) {
          closeViewer();
           if (onSlideDeleted && currentAlbum) {
    onSlideDeleted(slideId, currentAlbum.id);
  }

  onStoriesRefresh?.();   
  fetchMyStories?.();     

  return;
          return;
        }

        setAlbums(updatedAlbums);
        const newIndex = Math.min(currentAlbumIndex, updatedAlbums.length - 1);
        setCurrentAlbumIndex(newIndex);

        const targetAlbum = updatedAlbums[newIndex];
        const targetSlides = filterValidSlides(targetAlbum.slides);
        const swiperIndex = swiperRef.current?.activeIndex ?? 0;

        if (swiperIndex >= targetSlides.length) {
          setTimeout(
            () => swiperRef.current?.slideTo(Math.max(0, targetSlides.length - 1)),
            50
          );
        }

        setDeletingSlideId(null);
        setMenuOpenId(null);

        if (onSlideDeleted && currentAlbum) {
          onSlideDeleted(slideId, currentAlbum.id);
        }
        fetchMyStories?.();
      } catch {
        toast.error("Failed to delete story");
      } finally {
        setDeletingSlideId(null);
        setMenuOpenId(null);
      }
    },
    [isOwner, currentAlbum, currentAlbumIndex, albums, closeViewer, onSlideDeleted, fetchMyStories]
  );

  const goNext = useCallback(() => {
    if (!swiperRef.current || !currentAlbum) return;

    const isLastSlide = swiperRef.current.activeIndex === validSlides.length - 1;

    if (!isLastSlide) {
      swiperRef.current.slideNext();
      return;
    }
    if (currentAlbumIndex < albums.length - 1) {
      setCurrentAlbumIndex((i) => i + 1);
      setCurrentSlideIndex(0);
      setTimeout(() => swiperRef.current?.slideTo(0), 0);
      return;
    }
    closeViewer();
  }, [currentAlbum, currentAlbumIndex, albums.length, validSlides.length, closeViewer]);

  const goPrev = useCallback(() => {
    if (!swiperRef.current || !currentAlbum) return;

    const isFirstSlide = swiperRef.current.activeIndex === 0;

    if (!isFirstSlide) {
      swiperRef.current.slidePrev();
      return;
    }
    if (currentAlbumIndex > 0) {
      const prevIndex = currentAlbumIndex - 1;
      const prevSlides = filterValidSlides(albums[prevIndex].slides);
      setCurrentAlbumIndex(prevIndex);
      setTimeout(() => swiperRef.current?.slideTo(prevSlides.length - 1), 0);
    }
  }, [currentAlbum, currentAlbumIndex, albums]);

  useEffect(() => {
    const handleKeys = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "Escape") closeViewer();
    };
    if (!isOpen) return;
    window.addEventListener("keydown", handleKeys);
    return () => window.removeEventListener("keydown", handleKeys);
  }, [isOpen, goNext, goPrev, closeViewer]);

  const handleSlideChange = (swiper: { activeIndex: number }) => {
    setCurrentSlideIndex(swiper.activeIndex);
    setMenuOpenId(null);
    setDeletingSlideId(null);
  };

  const clearDeleteState = () => {
    setDeletingSlideId(null);
    setMenuOpenId(null);
  };

  const toggleMenu = () =>
    setMenuOpenId(menuOpenId === currentSlide?.id ? null : currentSlide?.id);

  const openDeleteConfirm = () => {
    setMenuOpenId(null);
    setDeletingSlideId(currentSlide?.id ?? null);
  };

  const profileImg = viewerUserImage
    ? viewerUserImage.startsWith("http")
      ? viewerUserImage
      : `${BASE_MEDIA_URL}/${viewerUserImage}`
    : "/images/default-avatar.png";

  const showDeleteConfirm =
    isOwner && currentSlide && deletingSlideId === currentSlide?.id;

  const showMoreMenu =
    isOwner && currentSlide && deletingSlideId !== currentSlide?.id;

  if (!isOpen || !currentAlbum) return null;

  return (
    <div className="fixed inset-0 bg-black z-[99999] flex items-center justify-center">
      <ProgressBars count={validSlides.length} activeIndex={currentSlideIndex} />

      <div className="absolute top-9 left-6 right-6 z-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {viewerUserName && (
            <Image
              src={profileImg}
              alt={viewerUserName}
              width={40}
              height={40}
              className="rounded-lg object-cover w-10 h-10"
              unoptimized
            />
          )}
          <div className="flex flex-col">
            {viewerUserName && (
              <span className="text-white font-medium text-sm leading-tight">
                {viewerUserName}
              </span>
            )}
            <span className="text-white font-semibold text-lg leading-tight">
              {currentAlbum.albumName}
            </span>
          </div>

          {showMoreMenu && (
            <div className="relative">
              <button
                onClick={toggleMenu}
                className="p-2 hover:bg-white/20 rounded-full transition"
                title="More options"
              >
                <FaEllipsisV size={16} className="text-white" />
              </button>
              {menuOpenId === currentSlide?.id && (
                <div className="absolute top-9 left-0 bg-white border rounded shadow-lg min-w-max z-[100]">
                  <button
                    onClick={openDeleteConfirm}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 transition text-sm"
                  >
                    Delete Story
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <button
          onClick={closeViewer}
          className="text-white p-2 hover:scale-110 transition"
          title="Close"
        >
          <FaTimes size={26} />
        </button>
      </div>

      {showDeleteConfirm && (
        <DeleteConfirmModal
          onConfirm={() =>
            confirmDeleteStory(currentSlide?.id ?? currentSlide?.slideId ?? 0)
          }
          onCancel={clearDeleteState}
        />
      )}

      <button
        onClick={goPrev}
        className="absolute left-6 top-1/2 -translate-y-1/2 text-white z-50"
      >
        <FaChevronLeft size={30} />
      </button>

      <button
        onClick={goNext}
        className="absolute right-6 top-1/2 -translate-y-1/2 text-white z-50"
      >
        <FaChevronRight size={30} />
      </button>

      <Swiper
        onSwiper={(s) => (swiperRef.current = s)}
        onSlideChange={handleSlideChange}
        className="w-full h-full flex items-center justify-center"
      >
        {validSlides.map((slide, idx) => (
          <SwiperSlide key={slide.id}>
            <div className="w-full h-full flex items-center justify-center relative">
              <SlideMedia slide={slide} isActive={idx === currentSlideIndex} />

              {mode === "admin" && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (pendingDeleteSlideId !== slide.id) {
                      setPendingDeleteSlideId(slide.id);
                      return;
                    }
                    window.dispatchEvent(
                      new CustomEvent("deleteSlide", {
                        detail: { albumId: currentAlbum.id, slideId: slide.id },
                      })
                    );
                    setPendingDeleteSlideId(null);
                  }}
                  className="absolute top-6 left-6 bg-red-600 text-white px-3 py-1 rounded-md text-xs z-50 flex items-center gap-2"
                >
                  {pendingDeleteSlideId === slide.id ? "Confirm Delete" : "Delete"}
                </button>
              )}

            {slide.caption && (
  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[min(90%,800px)] px-4">
    <div className="bg-black/60 backdrop-blur-md rounded-2xl px-6 py-3 text-center">
      <p className="text-white font-semibold text-lg leading-snug">
        {slide.caption}
      </p>
    </div>
  </div>
)}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

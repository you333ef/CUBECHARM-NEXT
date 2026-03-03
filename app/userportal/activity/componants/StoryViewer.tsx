"use client";

import { useEffect, useState, useCallback, useRef, useContext } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { FaTimes, FaChevronLeft, FaChevronRight, FaEllipsisV } from "react-icons/fa";
import Image from "next/image";
import { toast } from "sonner";
import AuthContext from "@/app/providers/AuthContext";
import api from "@/app/AuthLayout/refresh";

type Slide = {
  id: number;
  storyId: number;
  mediaType: string;
  mediaUrl: string;
  caption?: string | null;
  duration: number;
};

type StoryDetail = {
  userId: string;
  userName: string;
  userFullName: string;
  userProfileImageUrl: string;
  slides: Slide[];
  isOwner: boolean;
};

const BASE_URL = "http://localhost:5000";

const isVideo = (mediaType: string) => mediaType?.toLowerCase() === "video";

const buildSrc = (mediaUrl: string) =>
  mediaUrl?.startsWith("http") ? mediaUrl : `${BASE_URL}/${mediaUrl}`;

const filterValidSlides = (slides: Slide[]) =>
  slides.filter((s) => s.mediaUrl?.trim?.());

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
  const src = buildSrc(slide.mediaUrl);
  const showVideo = isVideo(slide.mediaType);

  useEffect(() => {
    if (!showVideo || !videoRef.current) return;
    isActive ? videoRef.current.play() : videoRef.current.pause();
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
          autoPlay
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
            className="h-full bg-white transition-all"
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
            className="flex-1 bg-black text-white py-2 rounded-lg hover:bg-gray-900"
          >
            Delete
          </button>
          <button
            onClick={onCancel}
            className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-100"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default function StoryViewer({ onStoryDeleted }: { onStoryDeleted?: () => void }) {
  const { baseUrl } = useContext(AuthContext)!;
  const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  const swiperRef = useRef<any>(null);
  const wasAtEndRef = useRef(false);

  const [isOpen, setIsOpen] = useState(false);
  const [story, setStory] = useState<StoryDetail | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [deletingSlideId, setDeletingSlideId] = useState<number | null>(null);

  const closeViewer = useCallback(() => {
    setIsOpen(false);
    setStory(null);
    setCurrentIndex(0);
    setMenuOpen(false);
    setDeletingSlideId(null);
    document.body.style.overflow = "unset";
  }, []);

  const handleOpen = useCallback((e: Event) => {
    const detail = (e as CustomEvent<StoryDetail>).detail;
    if (!detail?.slides?.length) return;

    setStory(detail);
    setCurrentIndex(0);
    setIsOpen(true);
    setMenuOpen(false);
    setDeletingSlideId(null);
    document.body.style.overflow = "hidden";
    setTimeout(() => swiperRef.current?.slideTo(0), 0);
  }, []);

  useEffect(() => {
    window.addEventListener("openActivityStory", handleOpen as EventListener);
    return () => {
      window.removeEventListener("openActivityStory", handleOpen as EventListener);
      document.body.style.overflow = "unset";
    };
  }, [handleOpen]);

  const deleteSlide = useCallback(
    async (slideId: number) => {
      if (!accessToken || !story) return;
      try {
        await api.delete(`/stories/slides/${slideId}`, {
       
        });
        toast.success("Story deleted");

        const remaining = story.slides.filter((s) => s.id !== slideId);
        if (remaining.length === 0) {
          closeViewer();
          return;
        }

        setStory({ ...story, slides: remaining });
        const newIdx = Math.min(currentIndex, remaining.length - 1);
        setCurrentIndex(newIdx);
        setTimeout(() => swiperRef.current?.slideTo(newIdx), 50);
        setDeletingSlideId(null);
        setMenuOpen(false);
        onStoryDeleted?.();
      } catch {
        toast.error("Failed to delete story");
        setDeletingSlideId(null);
      }
    },
    [accessToken, baseUrl, story, currentIndex, closeViewer, onStoryDeleted]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        swiperRef.current?.isEnd ? closeViewer() : swiperRef.current?.slideNext();
      }
      if (e.key === "ArrowLeft") swiperRef.current?.slidePrev();
      if (e.key === "Escape") closeViewer();
    },
    [closeViewer]
  );

  useEffect(() => {
    if (!isOpen) return;
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleKeyDown]);

  const handleSlideChange = (swiper: { activeIndex: number }) => {
    setCurrentIndex(swiper.activeIndex);
    setMenuOpen(false);
    setDeletingSlideId(null);
  };

  const goNext = () => {
    swiperRef.current?.isEnd ? closeViewer() : swiperRef.current?.slideNext();
  };

  const goPrev = () => swiperRef.current?.slidePrev();

  const toggleMenu = () => setMenuOpen((m) => !m);

  const openDeleteConfirm = () => {
    setMenuOpen(false);
    currentSlide && setDeletingSlideId(currentSlide.id);
  };

  const clearDeleteState = () => setDeletingSlideId(null);

  if (!isOpen || !story) return null;

  const validSlides = filterValidSlides(story.slides);
  const currentSlide = validSlides[currentIndex];
  const profileImg = story.userProfileImageUrl
    ? `${BASE_URL}/${story.userProfileImageUrl}`
    : "/images/default-avatar.png";

  const showDeleteConfirm =
    story.isOwner && currentSlide && deletingSlideId === currentSlide.id;

  const showMoreMenu =
    story.isOwner && currentSlide && deletingSlideId !== currentSlide.id;

  return (
  <div className="fixed inset-0 bg-black z-[99999] flex items-center justify-center">
  <ProgressBars count={validSlides.length} activeIndex={currentIndex} />

  <div className="absolute top-9 left-6 right-6 z-50 flex items-center justify-between">
    <div className="flex items-center gap-3">
      <Image
        src={profileImg}
        alt={story.userFullName}
        width={40}
        height={40}
        className="rounded-lg object-cover w-10 h-10"
        unoptimized
      />
      <span className="text-white font-medium text-lg">{story.userFullName}</span>
      {showMoreMenu && (
        <div className="relative">
          <button
            onClick={toggleMenu}
            className="p-2 hover:bg-white/20 rounded-full transition"
          >
            <FaEllipsisV size={16} className="text-white" />
          </button>
          {menuOpen && (
            <div className="absolute top-9 left-0 bg-white border rounded shadow-lg min-w-max z-[100]">
              <button
                onClick={openDeleteConfirm}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
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
    >
      <FaTimes size={26} />
    </button>
  </div>

  {showDeleteConfirm && currentSlide && (
    <DeleteConfirmModal
      onConfirm={() => deleteSlide(currentSlide.id)}
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
    onTouchStart={(s) => {
      wasAtEndRef.current = s.isEnd;
    }}
    onTouchEnd={(s) => {
      if (wasAtEndRef.current && s.isEnd && s.swipeDirection === "next") {
        closeViewer();
      }
    }}
    className="w-full h-full flex items-center justify-center"
  >
    {validSlides.map((slide, idx) => (
      <SwiperSlide key={slide.id}>
        <div className="w-full h-full flex items-center justify-center relative">
          <SlideMedia slide={slide} isActive={idx === currentIndex} />
        </div>
      </SwiperSlide>
    ))}
  </Swiper>

  {currentSlide?.caption && (
    <div
      className="absolute left-1/2 bottom-10 transform -translate-x-1/2 z-50 w-full flex justify-center pointer-events-none"
      role="status"
    >
      <span
        className="bg-gray-800 bg-opacity-95 px-6 py-3 rounded-2xl text-white font-normal text-base shadow-lg max-w-xl w-auto text-center pointer-events-auto"
        style={{backdropFilter: 'blur(6px)', fontWeight: 400, opacity: 0.92}}
      >
        {currentSlide.caption}
      </span>
    </div>
  )}
</div>
  );
}
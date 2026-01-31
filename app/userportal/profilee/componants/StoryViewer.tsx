"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { usePathname } from "next/navigation";

type Slide = {
  id: number;
  mediaUrl: string;
  caption?: string | null;
  linkUrl?: string | null;
  duration?: number;
};

type Story = {
  id: number;
  slides: Slide[];
};

const BASE_MEDIA_URL = "http://localhost:5000";
const STORY_DURATION = 12;

export default function StoryViewer() {
  const pathname = usePathname();
  const swiperRef = useRef<any>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [story, setStory] = useState<Story | null>(null);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  const isOwner =
    pathname.includes("/userportal/profilee") ||
    pathname.includes("/admin");

  const closeViewer = useCallback(() => {
    setIsOpen(false);
    setStory(null);
    setSlides([]);
    setCurrentIndex(0);
    setMenuOpen(false);
    document.body.style.overflow = "unset";
  }, []);

  const handleOpenStory = useCallback((e: Event) => {
    const incomingStory = (e as CustomEvent<Story>).detail;
    if (!incomingStory?.slides?.length) return;

    setStory(incomingStory);
    setSlides(incomingStory.slides);
    setCurrentIndex(0);
    setIsOpen(true);
    document.body.style.overflow = "hidden";
  }, []);

  useEffect(() => {
    window.addEventListener("openStory", handleOpenStory as EventListener);
    return () => {
      window.removeEventListener("openStory", handleOpenStory as EventListener);
      document.body.style.overflow = "unset";
    };
  }, [handleOpenStory]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") swiperRef.current?.slideNext();
      if (e.key === "ArrowLeft") swiperRef.current?.slidePrev();
      if (e.key === "Escape") closeViewer();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, closeViewer]);

  useEffect(() => {
    closeViewer();
  }, [pathname, closeViewer]);

 
useEffect(() => {
  if (!swiperRef.current?.autoplay) return;

  if (menuOpen) {
    swiperRef.current.autoplay.stop();
  } else {
    swiperRef.current.autoplay.start();
  }
}, [menuOpen]);

  if (!isOpen || !story) return null;

  const currentSlide = slides[currentIndex];

  const handleEdit = () => {
    closeViewer();
    window.dispatchEvent(new CustomEvent("editStory", { detail: story }));
    
  };

  const handleDelete = () => {
      closeViewer();
    window.dispatchEvent(new CustomEvent("deleteStory", { detail: story }));
  
  };

  return (
    <div className="fixed inset-0 bg-black z-[99999] flex items-center justify-center">
      <button
        onClick={closeViewer}
        className="absolute top-6 right-6 z-50 text-white text-4xl bg-black/50 w-12 h-12 rounded-full"
      >
        ×
      </button>

      {isOwner && (
        <div className="absolute top-6 left-6 z-50">
          <button
            onClick={() => setMenuOpen((p) => !p)}
            className="text-white text-3xl bg-black/50 w-10 h-10 rounded-full"
          >
            ⋯
          </button>

      {menuOpen && (
  <div
    className="mt-2 bg-black/80 rounded-lg overflow-hidden text-sm"
    onClick={(e) => e.stopPropagation()} 
  >
    <button
      onClick={(e) => {
        e.stopPropagation();
        handleDelete();
      }}
      className="block px-4 py-2 text-red-400 hover:bg-white/10 w-full text-left"
    >
      Delete
    </button>

    <button
      onClick={(e) => {
        e.stopPropagation();
        handleEdit();
      }}
      className="block px-4 py-2 text-white hover:bg-white/10 w-full text-left"
    >
      Edit
    </button>
  </div>
)}

        </div>
      )}

      <Swiper
        modules={[Autoplay]}
        autoplay={{
          delay: STORY_DURATION * 1000,
          disableOnInteraction: false,
        }}
        speed={600}
        loop={false}
        className="w-full h-full"
        onSlideChange={(s) => setCurrentIndex(s.activeIndex)}
        onSwiper={(s) => (swiperRef.current = s)}
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src={
                  slide.mediaUrl
                    ? `${BASE_MEDIA_URL}${slide.mediaUrl}`
                    : "/placeholder-story.jpg"
                }
                onError={(e) => {
                  e.currentTarget.src = "/placeholder-story.jpg";
                }}
                className="max-w-full max-h-full object-contain rounded-xl"
              />

              {slide.caption && (
                <div className="absolute bottom-20 left-6 right-6 text-white text-lg">
                  {slide.caption}
                </div>
              )}

              <div className="absolute top-4 left-4 right-4 flex gap-1">
                {slides.map((_, idx) => (
                  <div key={idx} className="flex-1 h-1 bg-white/30 rounded-full">
                    <div
                      className="h-full bg-white"
                      style={{
                        width:
                          idx < currentIndex
                            ? "100%"
                            : idx === currentIndex
                            ? undefined
                            : "0%",
                        animation:
                          idx === currentIndex
                            ? `progress ${STORY_DURATION}s linear forwards`
                            : "none",
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

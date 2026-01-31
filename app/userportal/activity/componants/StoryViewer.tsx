
//   مش هي بتاعتنا 
"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

import { usePathname } from "next/navigation";

/* ---------- Types ---------- */
type Slide = {
  id: number;
  mediaUrl: string;
  caption?: string | null;
  linkUrl?: string | null;
  duration: number;
};

type Story = {
  id: number;
  slides: Slide[];
};

const BASE_MEDIA_URL = "http://localhost:5000";

export default function StoryViewer() {





  useEffect(() => {
  setIsOpen(false);
  setSlides([]);
  setCurrentIndex(0);
}, []);

  const pathname = usePathname();
  const swiperRef = useRef<any>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const closeViewer = useCallback(() => {
    setIsOpen(false);
    setSlides([]);
    setCurrentIndex(0);
    document.body.style.overflow = "unset";
  }, []);

  const handleOpenStory = useCallback((e: Event) => {
    const story = (e as CustomEvent<Story>).detail;

    if (!story || !story.slides || story.slides.length === 0) {
      return;
    }

    setSlides(story.slides);
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
    if (isOpen && currentIndex >= slides.length - 1) {
      const t = setTimeout(closeViewer, 800);
      return () => clearTimeout(t);
    }
  }, [currentIndex, slides.length, isOpen, closeViewer]);

  if (!isOpen || slides.length === 0) return null;

  const isProfilePage = pathname === "/userportal/profilee";

  return (
    <div className="fixed inset-0 bg-black z-[99999] flex items-center justify-center">
      <button
        onClick={closeViewer}
        className="absolute top-6 right-6 z-50 text-white text-5xl font-light bg-black/50 hover:bg-black/70 w-14 h-14 rounded-full flex items-center justify-center"
      >
        ×
      </button>

      <Swiper
        modules={[Autoplay]}
        autoplay={{
          delay: slides[currentIndex]?.duration
            ? slides[currentIndex].duration * 1000
            : 4000,
          disableOnInteraction: false,
        }}
        speed={600}
        loop={false}
        className="w-full h-full"
        onSlideChange={(s) => setCurrentIndex(s.activeIndex)}
        onSwiper={(s) => (swiperRef.current = s)}
      >
        {slides.map((slide, i) => (
          <SwiperSlide key={slide.id}>
            <div
              className={`relative w-full h-full flex items-center justify-center ${
                isProfilePage ? "pr-24" : ""
              }`}
            >
              <img
                src={
                  slide.mediaUrl
                    ? `${BASE_MEDIA_URL}${slide.mediaUrl}`
                    : "/placeholder-story.jpg"
                }
                onError={(e) => {
                  e.currentTarget.src = "/placeholder-story.jpg";
                }}
                alt="Story"
                className="max-w-full max-h-full object-contain rounded-xl select-none"
              />

              {slide.caption && (
                <div className="absolute bottom-20 left-6 right-6 text-white text-lg">
                  {slide.caption}
                </div>
              )}

              <div className="absolute top-4 left-4 right-4 flex gap-1">
                {slides.map((_, idx) => (
                  <div
                    key={idx}
                    className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden"
                  >
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
                            ? `progress ${
                                slides[currentIndex]?.duration || 4
                              }s linear forwards`
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

import { useRef, useState, type ChangeEvent, type RefObject } from "react";
import { toast } from "sonner";
import MediaCard from "./MediaCard";
import type { AdMedia } from "../features/media/useAdMedia";

interface MediaGalleryProps {
  media: AdMedia[];
  isUpdate: boolean;
  propertyId: string | null;
  deleteMediaFromApi: (propertyId: number, mediaId: number) => Promise<void>;
  removeMedia: (id: number | string) => void;
  setMainOnApi: (propertyId: number, mediaId: number) => Promise<void>;
  setMain: (id: number | string) => void;
  onImagesChange: (files: FileList | null) => void;
  onVideoChange: (event: ChangeEvent<HTMLInputElement>) => void;
  videoInputRef: RefObject<HTMLInputElement | null>;
}

const MediaGallery = ({
  media,
  isUpdate,
  propertyId,
  deleteMediaFromApi,
  removeMedia,
  setMainOnApi,
  setMain,
  onImagesChange,
  onVideoChange,
  videoInputRef,
}: MediaGalleryProps) => {
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const desktopSliderRef = useRef<HTMLDivElement | null>(null);

  const mediaLength = media.length;

  const handleNextMedia = () => {
    if (mediaLength === 0) return;
    setActiveMediaIndex((prev) => (prev + 1) % mediaLength);
  };

  const handlePrevMedia = () => {
    if (mediaLength === 0) return;
    setActiveMediaIndex((prev) => (prev === 0 ? mediaLength - 1 : prev - 1));
  };

  const scrollDesktopSlider = (direction: "next" | "prev") => {
    const container = desktopSliderRef.current;
    if (!container) return;

    const firstCard = container.querySelector<HTMLElement>("[data-media-card]");
    const step =
      firstCard?.getBoundingClientRect().width || container.clientWidth / 4 || 0;

    if (!step) return;

    const offset = direction === "next" ? step : -step;
    container.scrollBy({ left: offset, behavior: "smooth" });
  };

  const handleRemove = async (item: AdMedia) => {
    if (isUpdate && item.id && !item.file && propertyId) {
      try {
        await deleteMediaFromApi(Number(propertyId), Number(item.id));
        toast.error("Media deleted");
      } catch {
        toast.error("Failed to delete media");
      }
    } else if (item.id || item.uid) {
      removeMedia((item.id || item.uid) as string | number);
      if (item.type === "video" && videoInputRef.current) {
        videoInputRef.current.value = "";
      }
    }
  };

  const handleSetMain = async (item: AdMedia) => {
    if (item.type !== "image") {
      return;
    }

    if (isUpdate && item.id && !item.file && propertyId) {
      try {
        await setMainOnApi(Number(propertyId), Number(item.id));
      } catch {
        toast.error("Failed to set main media");
      }
    } else if (item.id || item.uid) {
      setMain((item.id || item.uid) as string | number);
    }
  };

  const currentMainCount = media.filter((m) => m.isMain).length;

  if (media.length === 0) {
    return (
      <div className="md:col-span-5 space-y-6">
        <h3 className="text-lg font-semibold text-gray-800">Property Media</h3>
        <UploadSection
          media={media}
          onImagesChange={onImagesChange}
          onVideoChange={onVideoChange}
          videoInputRef={videoInputRef}
        />
      </div>
    );
  }

  return (
    <div className="md:col-span-5 space-y-6">
      <h3 className="text-lg font-semibold text-gray-800">Property Media</h3>

      <div className="space-y-4">
        <h4 className="text-base font-medium text-gray-700">
          Media Preview ({media.length})
        </h4>
        {media.length <= 4 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {media.map((item, idx) => (
              <MediaCard
                key={item.id || item.uid || idx}
                item={item}
                index={(item.id || item.uid || idx) as string | number}
                isApiMedia={!!item.id && !item.file}
                isUpdateMode={isUpdate}
                currentMainCount={currentMainCount}
                maxMainCount={1}
                onRemove={() => handleRemove(item)}
                onSetMain={() => handleSetMain(item)}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-5">
            {/* Mobile: one media per view */}
            <div className="relative w-full md:hidden">
              <div className="overflow-hidden rounded-lg">
                <div
                  className="flex transition-transform duration-300 ease-out"
                  style={{ transform: `translateX(-${activeMediaIndex * 100}%)` }}
                >
                  {media.map((item, idx) => (
                    <div
                      key={item.id || item.uid || idx}
                      className="w-full flex-shrink-0 px-1 sm:px-2"
                    >
                      <MediaCard
                        item={item}
                        index={(item.id || item.uid || idx) as string | number}
                        isApiMedia={!!item.id && !item.file}
                        isUpdateMode={isUpdate}
                        currentMainCount={currentMainCount}
                        maxMainCount={1}
                        isActive={idx === activeMediaIndex}
                        onRemove={() => handleRemove(item)}
                        onSetMain={() => handleSetMain(item)}
                      />
                    </div>
                  ))}
                </div>
              </div>
              {media.length > 1 && (
                <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-2 sm:px-4 pointer-events-none">
                  <button
                    type="button"
                    onClick={handlePrevMedia}
                    className="pointer-events-auto inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-gray-700 shadow-sm hover:bg-white"
                    aria-label="Previous media"
                  >
                    <span className="sr-only">Previous</span>
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={handleNextMedia}
                    className="pointer-events-auto inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-gray-700 shadow-sm hover:bg-white"
                    aria-label="Next media"
                  >
                    <span className="sr-only">Next</span>
                    ›
                  </button>
                </div>
              )}
            </div>

            {media.length > 1 && (
              <div className="flex justify-center gap-1.5 md:hidden">
                {media.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setActiveMediaIndex(index)}
                    className={`h-1.5 rounded-full transition-all ${
                      index === activeMediaIndex ? "w-5 bg-blue-600" : "w-2 bg-gray-300"
                    }`}
                    aria-label={`Go to media ${index + 1}`}
                  />
                ))}
              </div>
            )}

            {/* Desktop: 4 items per view with arrows */}
            <div className="relative hidden md:block">
              <div className="overflow-hidden rounded-lg">
                <div
                  ref={desktopSliderRef}
                  className="flex gap-4 overflow-x-auto pb-2 scroll-smooth"
                >
                  {media.map((item, idx) => (
                    <div
                      key={item.id || item.uid || idx}
                      className="basis-1/4 flex-shrink-0 px-1 lg:px-2"
                      data-media-card
                    >
                      <MediaCard
                        item={item}
                        index={(item.id || item.uid || idx) as string | number}
                        isApiMedia={!!item.id && !item.file}
                        isUpdateMode={isUpdate}
                        currentMainCount={currentMainCount}
                        maxMainCount={1}
                        onRemove={() => handleRemove(item)}
                        onSetMain={() => handleSetMain(item)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {media.length > 4 && (
                <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-2 lg:px-4 pointer-events-none">
                  <button
                    type="button"
                    onClick={() => scrollDesktopSlider("prev")}
                    className="pointer-events-auto inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-sm hover:bg-white"
                    aria-label="Previous media group"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollDesktopSlider("next")}
                    className="pointer-events-auto inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-sm hover:bg-white"
                    aria-label="Next media group"
                  >
                    ›
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <UploadSection
        media={media}
        onImagesChange={onImagesChange}
        onVideoChange={onVideoChange}
        videoInputRef={videoInputRef}
      />
    </div>
  );
};

interface UploadSectionProps {
  media: AdMedia[];
  onImagesChange: (files: FileList | null) => void;
  onVideoChange: (event: ChangeEvent<HTMLInputElement>) => void;
  videoInputRef: RefObject<HTMLInputElement | null>;
}

const UploadSection = ({
  media,
  onImagesChange,
  onVideoChange,
  videoInputRef,
}: UploadSectionProps) => (
  <div className="space-y-4">
    {/* Images Upload */}
    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50">
      <p className="text-gray-600 mb-4 font-medium">Upload Images</p>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => {
          onImagesChange(e.target.files);
        }}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
      {media.filter((m) => m.type === "image").length > 0 && (
        <p className="mt-3 text-sm text-green-600">
          {media.filter((m) => m.type === "image").length} image(s) added
        </p>
      )}
    </div>

    {/* Video Upload */}
    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50">
      <p className="text-gray-600 mb-4 font-medium">Upload Video (Optional)</p>
      <input
        type="file"
        accept="video/*"
        ref={videoInputRef}
        onChange={onVideoChange}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
      />
      {media.filter((m) => m.type === "video").length > 0 && (
        <p className="mt-3 text-sm text-green-600">
          {media.filter((m) => m.type === "video").length} video(s) added
        </p>
      )}
    </div>
  </div>
);

export default MediaGallery;


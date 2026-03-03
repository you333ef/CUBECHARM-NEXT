"use client";

import Input from "../componants/shared/Input";
import Textarea from "../componants/shared/Textarea";
import Button from "../componants/shared/Button";
import CategoryDropdown from "../componants/shared/CategoryDropdown";
import { useEffect, useRef, type ChangeEvent } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAdForm, type FormData } from "../hooks/useAdForm.logic";
import MediaGallery from "./components/MediaGallery";
import { useAdMedia } from "./features/media/useAdMedia";
import api from "@/app/AuthLayout/refresh";
const CreateAd = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const propertyId = searchParams.get("id");
  const source = searchParams.get("source");
  const isUpdate = !!propertyId;
  const isProMode = source === "new_upload_with_pro_mode";
  const hasLoadedMediaRef = useRef(false);
  const videoInputRef = useRef<HTMLInputElement | null>(null);
  const form = useAdForm({
    isUpdate,
    propertyId,
    onMediaSync: undefined,
  });
  const adMedia = useAdMedia({ baseUrl: "http://localhost:5000" });

  useEffect(() => {
    if (!isUpdate || !propertyId || hasLoadedMediaRef.current) return;

    hasLoadedMediaRef.current = true;

    const fetchMedia = async () => {
      try {
        const res = await api.get(`/Property/${propertyId}`, {});

        const mediaData = res.data.data?.media || [];
        if (mediaData.length > 0) {
          adMedia.syncFromApi(mediaData, "http://localhost:5000");
        }
      } catch (error) {
        console.error("Failed to fetch media:", error);
      }
    };

    fetchMedia();
  }, [isUpdate, propertyId, adMedia]);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = form;

  const handleVideoChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const existingVideosCount = adMedia.media.filter((m) => m.type === "video").length;

    if (existingVideosCount >= 1 || files.length > 1) {
      toast.error("Only one video is allowed (max 50MB and 30 seconds).");
      event.target.value = "";
      return;
    }

    const file = files[0];
    const maxSizeBytes = 50 * 1024 * 1024; // 50MB

    if (file.size > maxSizeBytes) {
      toast.error("Video must be 30 seconds or less and no larger than 50MB.");
      event.target.value = "";
      return;
    }

    const isDurationValid = await validateVideoDuration(file, 30);
    if (!isDurationValid) {
      toast.error("Video must be 30 seconds or less and no larger than 50MB.");
      event.target.value = "";
      return;
    }

    adMedia.addMedia(files, "video");
  };

  const handleFormSubmit = async (data: FormData) => {
    const validation = adMedia.validateMedia();
    if (!validation.hasMinimum) {
      toast.error(
        validation.error || " minimum of 4 items is required"
      );
      return;
    }

    if (validation.mainCount === 0) {
      toast.error("Please set at least one image as Main before submitting.");
      return;
    }

    try {
      const createdPropertyId = await form.onSubmit(data);

      if (!createdPropertyId) {
        toast.error("Server did not return property id");
        return;
      }

      if (adMedia.media.some((m) => m.status === "pending")) {
        const mediaUploadResults = await adMedia.uploadNewMedia(createdPropertyId);

        const hasMediaError =
          mediaUploadResults &&
          Array.isArray(mediaUploadResults) &&
          mediaUploadResults.some((r) => r && r.status === "error");

        // if (hasMediaError) {
        //   try {
          
        //     await api.delete(`/Property/${createdPropertyId}`);
        //   } catch (e) {
        //     console.error("Rollback property delete failed", e);
        //   }

        //   toast.error("Failed to upload media. Announcement not created.");
        //   // Go back one step so user can retry cleanly
        //   router.back();
        //   return;
        // }
      }

      if (isUpdate) {
        return;
      }

      toast.success("Announcement created successfully!");

      if (isProMode) {
        router.push(
          `/userportal/proMode?id=${createdPropertyId}&source=new_upload_with_pro_mode`
        );
      } else {
        router.push(`/userportal/property/${createdPropertyId}`);
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("Failed to submit form");
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 pt-6 sm:pt-8 pb-28">
      <div
        className="w-full sm:max-w-2xl md:max-w-3xl lg:max-w-screen-xl mx-auto px-2 sm:px-4"
      >
        <div
          className="bg-white rounded-lg shadow-md p-4 sm:p-8 border-0 sm:border md:border md:p-8"
        >
          <div className="text-center mb-10 pt-3 pb-4 sm:pt-4 sm:pb-5">
            <h1 className="text-3xl font-bold text-gray-800">
              {isUpdate ? "Update an Announcement" : "Create  an Announcement"}
            </h1>
            <p className="text-gray-600 mt-2 hidden md:block">
              Please fill out all required fields.
            </p>
          </div>

          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 sm:gap-6">
                  {/* Title */}
              <div className="md:col-span-5">
                <Input
                  placeholder="Title"
                  type="text"
                  {...register("title", { required: "Title is required" })}
                  className={`p-3 border rounded-lg w-full bg-gray-50 focus:ring-2 focus:ring-blue-200 ${errors.title ? "border-red-500" : "border-gray-200"} sm:text-base text-sm max-w-full`}
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
              </div>

              {/* Category */}
              {!isUpdate && (
              <div className="md:col-span-5">
                <div className="w-full max-w-full">
                  <CategoryDropdown {...register("category", { required: "Category is required" })} />
                </div>
                {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
              </div>
              )}

              {/* Listing Type */}
              <div className="md:col-span-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">Listing Type</label>
                <select
                  {...register("listingType", { required: "Listing type is required" })}
                  className={`p-3 border rounded-lg w-full bg-gray-50 focus:ring-2 focus:ring-blue-200 ${errors.listingType ? "border-red-500" : "border-gray-200"} sm:text-base text-sm max-w-full`}>
                 
                  <option value="rent">Rent</option>
                  <option value="daily">Daily Rental</option>
                  <option value="sale">Sale</option>

                </select>
                {errors.listingType && <p className="text-red-500 text-sm mt-1">{errors.listingType.message}</p>}
              </div>

              {/* Size */}
              <div className="md:col-span-2">
                <Input
                  placeholder="Full Size"
                  type="number"
                  {...register("size", { required: "Size is required" })}
                  className={`p-3 border rounded-lg w-full bg-gray-50 focus:ring-2 focus:ring-blue-200 ${errors.size ? "border-red-500" : "border-gray-200"} sm:text-base text-sm max-w-full`}
                />
                {errors.size && <p className="text-red-500 text-sm mt-1">{errors.size.message}</p>}
              </div>

              {/* Width & Height */}
              <div className="flex gap-4 md:col-span-3">
                <div className="flex-1">
                  <Input
                    placeholder="Width"
                    type="number"
                    {...register("width", { required: "Width is required" })}
                    className={`p-3 border rounded-lg w-full bg-gray-50 focus:ring-2 focus:ring-blue-200 ${errors.width ? "border-red-500" : "border-gray-200"} sm:text-base text-sm max-w-full`}
                  />
                  {errors.width && <p className="text-red-500 text-sm mt-1">{errors.width.message}</p>}
                </div>
                <div className="flex-1">
                  <Input
                    placeholder="Height"
                    type="number"
                    {...register("length", { required: "Height is required" })}
                    className={`p-3 border rounded-lg w-full bg-gray-50 focus:ring-2 focus:ring-blue-200 ${errors.length ? "border-red-500" : "border-gray-200"} sm:text-base text-sm max-w-full`}
                  />
                  {errors.length && <p className="text-red-500 text-sm mt-1">{errors.length.message}</p>}
                </div>
              </div>

              {/* City & Address */}
              <div className="grid md:grid-cols-2 gap-4 md:col-span-5">
                <div>
                  <Input
                    placeholder="City"
                    type="text"
                    {...register("city", { required: "City is required" })}
                    className={`p-3 border rounded-lg w-full bg-gray-50 focus:ring-2 focus:ring-blue-200 ${errors.city ? "border-red-500" : "border-gray-200"} sm:text-base text-sm max-w-full`}
                  />
                  {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>}
                </div>
                <div>
                  <Input
                    placeholder="Address"
                    type="text"
                    {...register("address", { required: "Address is required" })}
                    className={`p-3 border rounded-lg w-full bg-gray-50 focus:ring-2 focus:ring-blue-200 ${errors.address ? "border-red-500" : "border-gray-200"} sm:text-base text-sm max-w-full`}
                  />
                  {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
                </div>
              </div>
                 {/* Location Link  */}
              <div className="md:col-span-5">
                <Input
                  placeholder="Location Link"
                  type="text"
                  {...register("locationLink", {
                    required: "Location link is required",
                    pattern: { value: /^https?:\/\/.+/, message: "Enter a valid URL (must start with http/https)" },
                  })}
                  className={`p-3 border rounded-lg w-full bg-gray-50 focus:ring-2 focus:ring-blue-200 ${errors.locationLink ? "border-red-500" : "border-gray-200"} sm:text-base text-sm max-w-full`}
                />
                {errors.locationLink && <p className="text-red-500 text-sm mt-1">{errors.locationLink.message}</p>}
              </div>

            {/* Phone */}
              {!isUpdate && (
              <div className="md:col-span-5">
                <Input
                  placeholder="Phone"
                  type="tel"
                  {...register("phone",{ required: "Phone  Number  is required" })}
                  className={`p-3 border rounded-lg w-full bg-gray-50 focus:ring-2 focus:ring-blue-200 ${errors.phone ? "border-red-500" : "border-gray-200"} sm:text-base text-sm max-w-full`}
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
              </div>
              )}
       <div className="grid md:grid-cols-2 gap-4 md:col-span-5">

  {/* Price */}
  <div>
    <Input
      placeholder="Price"
      type="number"
      {...register("price", { required: "Price is required" })}
      className={`p-3 border rounded-lg w-full bg-gray-50 focus:ring-2 focus:ring-blue-200 ${
        errors.price ? "border-red-500" : "border-gray-200"
      } sm:text-base text-sm max-w-full`}
    />
    {errors.price && (
      <p className="text-red-500 text-sm mt-1">
        {errors.price.message}
      </p>
    )}
  </div>

  {/* Currency */}
  <div>
    <select
      {...register("currency", { required: "Currency is required" })}
      className={`p-3 border rounded-lg w-full bg-gray-50 focus:ring-2 focus:ring-blue-200 ${
        errors.currency ? "border-red-500" : "border-gray-200"
      } sm:text-base text-sm max-w-full`}
    >
    
      <option value="EGP">EGP</option>
      <option value="USD">USD</option>
     
    </select>
    {errors.currency && (
      <p className="text-red-500 text-sm mt-1">
        {errors.currency.message}
      </p>
    )}
  </div>

</div>

              {/* Description */}
              <div className="md:col-span-5">
                <Textarea
                  placeholder="Description"
                  rows={4}
                  {...register("description", { required: "Description is required" })}
                  className={`p-3 border rounded-lg w-full bg-gray-50 focus:ring-2 focus:ring-blue-200 ${errors.description ? "border-red-500" : "border-gray-200"} sm:text-base text-sm max-w-full`}
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
              </div>

              {/* Media Management */}
              <MediaGallery
                media={adMedia.media}
                isUpdate={isUpdate}
                propertyId={propertyId}
                deleteMediaFromApi={adMedia.deleteMediaFromApi}
                removeMedia={adMedia.removeMedia}
                setMainOnApi={adMedia.setMainOnApi}
                setMain={adMedia.setMain}
                onImagesChange={(files) => adMedia.addMedia(files, "image")}
                onVideoChange={handleVideoChange}
                videoInputRef={videoInputRef}
              />

              {/* Submit  must be last */}
              <div className="md:col-span-5">
                <Button
                  name={isUpdate ? "Update Announcement" : "Create Announcement"}
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-4 rounded-xl transition"
                />
              </div>
            </div>
          </form>
          
        </div>
      </div>
    </div>
  );

};

export default CreateAd;

async function validateVideoDuration(file: File, maxSeconds: number): Promise<boolean> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement("video");
    video.preload = "metadata";
    const cleanup = () => {
      URL.revokeObjectURL(url);
    };
    video.onloadedmetadata = () => {
      const duration = video.duration;
      cleanup();
      if (!Number.isFinite(duration)) {
        resolve(false);
        return;
      }
      resolve(duration <= maxSeconds);
    };

    video.onerror = () => {
      cleanup();
      resolve(false);
    };

    video.src = url;
  });
}

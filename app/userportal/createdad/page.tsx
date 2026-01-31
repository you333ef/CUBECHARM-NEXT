"use client";

import Input from "../componants/shared/Input";
import Textarea from "../componants/shared/Textarea";
import Button from "../componants/shared/Button";
import CategoryDropdown from "../componants/shared/CategoryDropdown";
import { useContext, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import AuthContext from "@/app/providers/AuthContext";
import { useAdForm, type FormData } from "../hooks/useAdForm.logic";
import { useAdMedia } from "../hooks/useAdMedia.logic";
import axios from "axios";
const CreateAd = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const propertyId = searchParams.get("id");
  const source = searchParams.get("source");
  const isUpdate = !!propertyId;
  const isProMode = source === "new_upload_with_pro_mode";
  
  // Prevent  sync calls
  const hasLoadedMediaRef = useRef(false);

  const { baseUrl } = useContext(AuthContext)!;
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("accessToken")
      : null;

  // media logic first
  const adMedia = useAdMedia({
    baseUrl: baseUrl || "",
    token: token || "",
  });

  //form logic WITHOUT onMediaSync callback
  const form = useAdForm({
    isUpdate,
    propertyId,
    onMediaSync: undefined,
  });

  // Fetch and sync media separately for update mode
  useEffect(() => {
    // Only run once and only in update mode
    if (!isUpdate || !propertyId || !token || hasLoadedMediaRef.current) return;

    hasLoadedMediaRef.current = true;

    const fetchMedia = async () => {
      try {
        const res = await axios.get(`${baseUrl}/Property/${propertyId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const mediaData = res.data.data?.media || [];
        if (mediaData.length > 0) {
          adMedia.syncFromApi(mediaData, "http://localhost:5000");
        }
      } catch (error) {
        console.error("Failed to fetch media:", error);
      }
    };

    fetchMedia();
  }, [isUpdate, propertyId, token, baseUrl, adMedia]);

  // Destructure form methods and state
  const { register, formState: { errors }, handleSubmit } = form;

  const handleFormSubmit = async (data: FormData) => {
    // Validate media count
    const validation = adMedia.validateMedia();
    if (!validation.hasMinimum) {
      toast.error(
        validation.error || "A minimum of 4 media items is required"
      );
      return;
    }

    try {
      // Submit form and get the created/updated property ID
      const createdPropertyId = await form.onSubmit(data);

      // Upload new media for both create and update modes
      if (createdPropertyId && adMedia.media.some((m) => m.status === "pending")) {
        await adMedia.uploadNewMedia(createdPropertyId);
      }

      // Handle routing after success
      if (isUpdate) {
        // Update mode - already handled in form.onSubmit with toast
        return;
      }

      // Create mode -  success and redirect based on source
      toast.success("Announcement created successfully!");
      
      if (isProMode) {
        // Redirect to ProMode

        router.push(
          `/userportal/proMode?id=${createdPropertyId}&source=new_upload_with_pro_mode`
        );
      } else {
        // Redirect to property page
        router.push(`/userportal/property/${createdPropertyId}`);
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("Failed to submit form");
    }
  };
 return (
   <div className="min-h-screen bg-gray-50 py-12">
      <div className="container max-w-screen-xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-800">{isUpdate ? "Update an Announcement" : "Create  an Announcement"}</h1>
            <p className="text-gray-600 mt-2 hidden md:block">Please fill out all required fields.</p>
          </div>

          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                  {/* Title */}
              <div className="md:col-span-5">
                <Input
                  placeholder="Title"
                  type="text"
                  {...register("title", { required: "Title is required" })}
                  className={`p-3 border rounded-lg w-full bg-gray-50 ${errors.title ? "border-red-500" : ""}`}
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
              </div>

              {/* Category */}
              <div className="md:col-span-5">
                <CategoryDropdown {...register("category", { required: "Category is required" })} />
                {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
              </div>

              {/* Listing Type (rent / sale) */}
              <div className="md:col-span-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">Listing Type</label>
                <select
                  {...register("listingType", { required: "Listing type is required" })}
                  className={`p-3 border rounded-lg w-full bg-gray-50 ${errors.listingType ? "border-red-500" : ""}`}>
                 
                  <option value="rent">Rent</option>
                  <option value="rent">Daily Rental</option>
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
                  className={`p-3 border rounded-lg w-full bg-gray-50 ${errors.size ? "border-red-500" : ""}`}
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
                    className={`p-3 border rounded-lg w-full bg-gray-50 ${errors.width ? "border-red-500" : ""}`}
                  />
                  {errors.width && <p className="text-red-500 text-sm mt-1">{errors.width.message}</p>}
                </div>
                <div className="flex-1">
                  <Input
                    placeholder="Height"
                    type="number"
                    {...register("length", { required: "Height is required" })}
                    className={`p-3 border rounded-lg w-full bg-gray-50 ${errors.length ? "border-red-500" : ""}`}
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
                    className={`p-3 border rounded-lg w-full bg-gray-50 ${errors.city ? "border-red-500" : ""}`}
                  />
                  {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>}
                </div>
                <div>
                  <Input
                    placeholder="Address"
                    type="text"
                    {...register("address", { required: "Address is required" })}
                    className={`p-3 border rounded-lg w-full bg-gray-50 ${errors.address ? "border-red-500" : ""}`}
                  />
                  {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
                </div>
              </div>
                 {/* Location Link (required) */}
              <div className="md:col-span-5">
                <Input
                  placeholder="Location Link (required)"
                  type="text"
                  {...register("locationLink", {
                    required: "Location link is required",
                    pattern: { value: /^https?:\/\/.+/, message: "Enter a valid URL (must start with http/https)" },
                  })}
                  className={`p-3 border rounded-lg w-full bg-gray-50 ${errors.locationLink ? "border-red-500" : ""}`}
                />
                {errors.locationLink && <p className="text-red-500 text-sm mt-1">{errors.locationLink.message}</p>}
              </div>

            {/* Phone */}
              <div className="md:col-span-5">
                <Input
                  placeholder="Phone"
                  type="tel"
                  {...register("phone",{ required: "Phone  Number  is required" })}
                  className={`p-3 border rounded-lg w-full bg-gray-50 ${errors.phone ? "border-red-500" : ""}`}
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
              </div>


 <div className="grid md:grid-cols-2 gap-4 md:col-span-5">

  {/* Price */}
  <div>
    <Input
      placeholder="Price"
      type="number"
      {...register("price", { required: "Price is required" })}
      className={`p-3 border rounded-lg w-full bg-gray-50 ${
        errors.price ? "border-red-500" : ""
      }`}
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
      className={`p-3 border rounded-lg w-full bg-gray-50 ${
        errors.currency ? "border-red-500" : ""
      }`}
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



              {/* Negotiable checkbox (optional) */}
              <div className="md:col-span-5">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    {...register("negotiable")}
                    id="negotiable"
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  <label htmlFor="negotiable" className="text-gray-700">Negotiable</label>
                </div>
              </div>
              {/* Description */}
              <div className="md:col-span-5">
                <Textarea
                  placeholder="Description"
                  rows={4}
                  {...register("description", { required: "Description is required" })}
                  className={`p-3 border rounded-lg w-full bg-gray-50 ${errors.description ? "border-red-500" : ""}`}
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
              </div>

              {/* Media Management */}
              <div className="md:col-span-5 space-y-6">
                <h3 className="text-lg font-semibold text-gray-800">Property Media</h3>

                {/* Media Gallery - Show First */}
                {adMedia.media.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-base font-medium text-gray-700">Media Preview ({adMedia.media.length})</h4>
                    {adMedia.media.length <= 4 ? (
                      // Grid layout for 4 or fewer items
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {adMedia.media.map((item, idx) => (
                          <MediaCard
                            key={item.id || item.uid || idx}
                            item={item}
                            index={(item.id || item.uid || idx) as string | number}
                            isApiMedia={!!item.id && !item.file}
                            isUpdateMode={isUpdate}
                            currentMainCount={adMedia.media.filter((m) => m.isMain).length}
                            maxMainCount={2}
                            onRemove={async () => {
                              if (isUpdate && item.id && !item.file) {
                                try {
                                  await adMedia.deleteMediaFromApi(Number(propertyId), Number(item.id));
                                  toast.error("Media deleted");
                                } catch (error) {
                                  toast.error("Failed to delete media");
                                }
                              } else {
                                adMedia.removeMedia((item.id || item.uid) as string | number);
                              }
                            }}
                            onSetMain={async () => {
                              if (isUpdate && item.id && !item.file) {
                                try {
                                  await adMedia.setMainOnApi(Number(propertyId), Number(item.id));
                                } catch (error) {
                                  toast.error("Failed to set main media");
                                }
                              } else {
                                adMedia.setMain((item.id || item.uid) as string | number);
                              }
                            }}
                          />
                        ))}
                      </div>
                    ) : (
                      // Horizontal scroll for more than 4 items
                      <div className="overflow-x-auto pb-2">
                        <div className="flex gap-4">
                          {adMedia.media.map((item, idx) => (
                            <MediaCard
                              key={item.id || item.uid || idx}
                              item={item}
                              index={(item.id || item.uid || idx) as string | number}
                              isApiMedia={!!item.id && !item.file}
                              isUpdateMode={isUpdate}
                              currentMainCount={adMedia.media.filter((m) => m.isMain).length}
                              maxMainCount={2}
                              isScrollMode={true}
                              onRemove={async () => {
                                if (isUpdate && item.id && !item.file) {
                                  try {
                                    await adMedia.deleteMediaFromApi(Number(propertyId), Number(item.id));
                                    toast.error("Media deleted");
                                  } catch (error) {
                                    toast.error("Failed to delete media");
                                  }
                                } else {
                                  adMedia.removeMedia((item.id || item.uid) as string | number);
                                }
                              }}
                              onSetMain={async () => {
                                if (isUpdate && item.id && !item.file) {
                                  try {
                                    await adMedia.setMainOnApi(Number(propertyId), Number(item.id));
                                  } catch (error) {
                                    toast.error("Failed to set main media");
                                  }
                                } else {
                                  adMedia.setMain((item.id || item.uid) as string | number);
                                }
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Upload Section - Show After Gallery */}
                <div className="space-y-4">
                  {/* Images Upload */}
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50">
                    <p className="text-gray-600 mb-4 font-medium">Upload Images</p>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => adMedia.addMedia(e.target.files, "image")}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {adMedia.media.filter((m) => m.type === "image").length > 0 && (
                      <p className="mt-3 text-sm text-green-600">
                        {adMedia.media.filter((m) => m.type === "image").length} image(s) added
                      </p>
                    )}
                  </div>

                  {/* Video Upload */}
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50">
                    <p className="text-gray-600 mb-4 font-medium">Upload Video (Optional)</p>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          adMedia.addMedia(e.target.files, "video");
                        }
                      }}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                    />
                    {adMedia.media.filter((m) => m.type === "video").length > 0 && (
                      <p className="mt-3 text-sm text-green-600">
                        {adMedia.media.filter((m) => m.type === "video").length} video(s) added
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit (Create / Update) - must be last */}
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

// MediaCard Component - Reusable media preview with actions
interface MediaCardProps {
  item: any; // AdMedia type
  index: number | string;
  isApiMedia: boolean;
  isUpdateMode: boolean;
  currentMainCount: number;
  maxMainCount: number;
  isScrollMode?: boolean;
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
  isScrollMode = false,
  onRemove,
  onSetMain,
}: MediaCardProps) => {
  const canAddMain = currentMainCount < maxMainCount || item.isMain;
  // Hide Set Main button in update mode for API media
  const showSetMainButton = !isUpdateMode || !isApiMedia;

  return (
    <div className={`relative group overflow-hidden rounded-lg bg-gray-50 border ${isScrollMode ? "flex-shrink-0 w-40 h-40" : "w-full"}`}>
      {/* Media Preview */}
      <div className="w-full h-full overflow-hidden bg-gray-100">
        {item.type === "image" ? (
          <img
            src={item.url}
            alt={`media-${index}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <video
            src={item.url}
            className="w-full h-full object-cover"
            controls={false}
          >
            <source src={item.url} />
          </video>
        )}
      </div>

      {/* Main Badge */}
      {item.isMain && (
        <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
          Main
        </span>
      )}

      {/* Status Indicator - Blue Background */}
      {item.status === "pending" && (
        <span className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
          Uploading...
        </span>
      )}

      {/* Actions Overlay */}
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2 flex-wrap p-2">
        {showSetMainButton && !item.isMain && canAddMain && (
          <button
            type="button"
            onClick={onSetMain}
            className="px-3 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 whitespace-nowrap"
          >
            Set Main
          </button>
        )}
        {item.isMain && showSetMainButton && (
          <button
            type="button"
            onClick={onSetMain}
            className="px-3 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 whitespace-nowrap"
          >
            Unset
          </button>
        )}
        <button
          type="button"
          onClick={onRemove}
          className="px-3 py-1 text-xs bg-red-600 text-white rounded-md hover:bg-red-700 whitespace-nowrap"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default CreateAd;

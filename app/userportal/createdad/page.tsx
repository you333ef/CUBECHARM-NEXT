"use client";

import Input from "../componants/shared/Input";
import Textarea from "../componants/shared/Textarea";
import Button from "../componants/shared/Button";
import CategoryDropdown from "../componants/shared/CategoryDropdown";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";

type FormData = {
  category: string;
  size: string;
  Width: string;
  Height: string;
  city: string;
  address: string;
  title: string;
  price: string;
  description: string;
};

const CreateAd = () => {
  const [images, setImages] = useState<File[]>([]);
  const [video, setVideo] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  const router = useRouter();

  const onSubmit = (data: FormData) => {
    console.log("Form:", data);
    console.log("Images:", images);
    console.log("Video:", video);
    alert("Announcement created successfully!");
    reset();
    setImages([]);
    setVideo(null);
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container max-w-screen-xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-800">Create an Announcement</h1>
            <p className="text-gray-600 mt-2 hidden md:block">Please fill out all required fields.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">

              {/* Category */}
              <div className="md:col-span-5">
                <CategoryDropdown {...register("category", { required: "Category is required" })} />
                {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
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
                    {...register("Width", { required: "Width is required" })}
                    className={`p-3 border rounded-lg w-full bg-gray-50 ${errors.Width ? "border-red-500" : ""}`}
                  />
                  {errors.Width && <p className="text-red-500 text-sm mt-1">{errors.Width.message}</p>}
                </div>
                <div className="flex-1">
                  <Input
                    placeholder="Height"
                    type="number"
                    {...register("Height", { required: "Height is required" })}
                    className={`p-3 border rounded-lg w-full bg-gray-50 ${errors.Height ? "border-red-500" : ""}`}
                  />
                  {errors.Height && <p className="text-red-500 text-sm mt-1">{errors.Height.message}</p>}
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

              {/* Price */}
              <div className="md:col-span-5">
                <Input
                  placeholder="Price"
                  type="number"
                  {...register("price", { required: "Price is required" })}
                  className={`p-3 border rounded-lg w-full bg-gray-50 ${errors.price ? "border-red-500" : ""}`}
                />
                {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
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

              {/* Images Upload */}
              <div className="md:col-span-5">
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50">
                  <p className="text-gray-600 mb-4 font-medium">Upload Images</p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => e.target.files && setImages(Array.from(e.target.files))}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {images.length > 0 && (
                    <p className="mt-3 text-sm text-green-600">{images.length} image(s) selected</p>
                  )}
                </div>
              </div>

              {/* Video Upload */}
              <div className="md:col-span-5">
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50">
                  <p className="text-gray-600 mb-4 font-medium">Upload Video (Optional)</p>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => e.target.files?.[0] && setVideo(e.target.files[0])}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                  />
                  {video && (
                    <p className="mt-3 text-sm text-green-600">Video selected: {video.name}</p>
                  )}
                </div>
              </div>

              {/* Submit */}
              <div className="md:col-span-5">
                <Button
                  name="Create Announcement"
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
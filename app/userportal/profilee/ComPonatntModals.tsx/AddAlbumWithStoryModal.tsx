"use client";

import { useForm } from "react-hook-form";
import MediaUploader from "./shared/MediaUploader";
import { toast } from "sonner";

type FormValues = {
  albumName: string;
  caption: string;
};

export default function AddAlbumWithStoryModal({
  file,
  previewUrl,
  setFile,
  onSubmit,
  onClose,
  isSubmitting = false,
}: any) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  const validateBeforeSubmit = (data: FormValues) => {
    if (!file) {
      toast.error("Media is required");
      onClose();
      return;
    }

    const isVideo = file.type.startsWith("video");
    const maxSize = isVideo ? 50 * 1024 * 1024 : 5 * 1024 * 1024;

    if (file.size > maxSize) {
      toast.error(isVideo ? "Video max 50MB" : "Image max 5MB");
      onClose();
      return;
    }

    onSubmit(data);
    reset();
  };

  return (
    <>
      <h2 className="text-lg font-semibold">Add Album With Story</h2>

      <MediaUploader file={file} previewUrl={previewUrl} onSelect={setFile} />

      <input
        {...register("albumName", {
          required: "Album name is required",
          minLength: 3,
          maxLength: 50,
        })}
        placeholder="Album Name"
        className="w-full border px-3 py-2 rounded-lg"
      />

      <input
        {...register("caption", {
          maxLength: 200,
        })}
        placeholder="Caption Story"
        className="w-full border px-3 py-2 rounded-lg"
      />

      <div className="flex justify-end gap-2">
        <button onClick={onClose} disabled={isSubmitting}>Cancel</button>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleSubmit(validateBeforeSubmit)}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating..." : "Create"}
        </button>
      </div>
    </>
  );
}

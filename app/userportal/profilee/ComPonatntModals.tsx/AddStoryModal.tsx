"use client";

import { useForm } from "react-hook-form";
import MediaUploader from "./shared/MediaUploader";
import { toast } from "sonner";

type FormValues = {
  caption: string;
};

export default function AddStoryModal({
  file,
  previewUrl,
  setFile,
  onSubmit,
  onClose,
}: any) {
  const {
    register,
    handleSubmit,
    reset,
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
      <h2 className="text-lg font-semibold">Add Story</h2>

      <MediaUploader file={file} previewUrl={previewUrl} onSelect={setFile} />

      <input
        {...register("caption", { maxLength: 200 })}
        placeholder="Caption Story"
        className="w-full border px-3 py-2 rounded-lg"
      />

      <div className="flex justify-end gap-2">
        <button onClick={onClose}>Cancel</button>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          onClick={handleSubmit(validateBeforeSubmit)}
        >
          Publish
        </button>
      </div>
    </>
  );
}

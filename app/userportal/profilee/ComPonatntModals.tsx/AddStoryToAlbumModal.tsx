"use client";

import { useForm } from "react-hook-form";
import MediaUploader from "./shared/MediaUploader";
import { toast } from "sonner";

type FormValues = {
  albumId: string;
  caption: string;
};

export default function AddStoryToAlbumModal({
  file,
  previewUrl,
  setFile,
  albums,
  onSubmit,
  onClose,
  isSubmitting = false,
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

    if (!data.albumId) {
      toast.error("Select album first");
      onClose();
      return;
    }

    onSubmit(data);
    reset();
  };

  return (
    <>
      <h2 className="text-lg font-semibold">Add Story To Album</h2>

      <MediaUploader file={file} previewUrl={previewUrl} onSelect={setFile} />

     <select
  {...register("albumId", { required: true })}
  className="w-full border px-3 py-2 rounded-lg"
>
  <option value="">Select Album</option>
  {albums?.map((album: any) => (
    <option key={album.id} value={album.id}>
      {album.albumName}
    </option>
  ))}
</select>


      <input
        {...register("caption", { maxLength: 200 })}
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
          {isSubmitting ? "Publishing..." : "Publish"}
        </button>
      </div>
    </>
  );
}

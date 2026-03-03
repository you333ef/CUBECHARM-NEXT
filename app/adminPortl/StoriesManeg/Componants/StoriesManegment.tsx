"use client";

import { Pencil, Settings, Trash } from "lucide-react";
import { useEffect, useState, useContext } from "react";
import { IoIosAddCircle } from "react-icons/io";
import axios from "axios";
import StoryViewer from "../../../../app/features/stories/engine/StoryViewer";
import AddMediaModal from "@/app/userportal/profilee/componants/AddMediaModal";
import HeadlessDemo from "../../sharedAdmin/DELETE_CONFIRM";
import AuthContext from "@/app/providers/AuthContext";
import { toast } from "sonner";
import api from "@/app/AuthLayout/refresh";

type Slide = {
  id: number;
  mediaUrl: string;
  mediaType: "Image" | "Video";
};

type AdminAlbum = {
  id: number;
  albumName: string;
  slides: Slide[];
};

const StoriesManagement = () => {
  const { baseUrl } = useContext(AuthContext)!;
  const [albums, setAlbums] = useState<AdminAlbum[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedStory, setSelectedStory] = useState<AdminAlbum | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // NEW: state for Rename modal
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [updateAlbumName, setUpdateAlbumName] = useState("");

 

  const fetchAlbums = async () => {
    try {
      const res = await api.get("/admin/admin-albums");

      if (res.data?.success) {
        setAlbums(res.data.data);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load albums");
    } finally {
      setLoading(false);
    }
  };

  // numberOfAlbums (you used it for Add flow)
  const [numberOfAlbums, setNumberOfAlbums] = useState<number>(1);

  useEffect(() => {
    fetchAlbums();
  }, []);

  const [flow, setFlow] = useState<"addStory" | "addStoryToAlbum" | null>(
    null
  );

  const openAdd = () => {
    if (numberOfAlbums === 0) {
      toast.error("Please create an album before adding stories.");
    } else {
      setIsEditMode(false);
      setSelectedStory(null);
      setFlow("addStory");
      setIsAddOpen(true);
    }
  };

  const openCreateAlbum = () => {
    setFlow("addStoryToAlbum");
    setIsAddOpen(true);
  };

  const confirmDelete = () => {
    setIsDeleteOpen(false);
    setSelectedStory(null);
  };

  const handleSubmit = () => {
    setIsAddOpen(false);
    setIsEditMode(false);
    setSelectedStory(null);
    fetchAlbums();
  };

  useEffect(() => {
    const handleDeleteStory = (e: Event) => {
      const story = (e as CustomEvent<AdminAlbum>).detail;
      setSelectedStory(story);
      setIsDeleteOpen(true);
    };

    window.addEventListener("deleteStory", handleDeleteStory);
    return () => {
      window.removeEventListener("deleteStory", handleDeleteStory);
    };
  }, []);

  useEffect(() => {
    const handleEditStory = (e: Event) => {
      const story = (e as CustomEvent<AdminAlbum>).detail;
      setSelectedStory(story);
      setIsEditMode(true);
      setFlow("addStory");
      setIsAddOpen(true);
    };

    window.addEventListener("editStory", handleEditStory);
    return () => {
      window.removeEventListener("editStory", handleEditStory);
    };
  }, []);

  const closeAddModal = () => {
    setIsAddOpen(false);
    setFlow(null);
    setIsEditMode(false);
    setSelectedStory(null);
  };

  // Create Admin Album
  const createAdminAlbum = async (
    albumName: string,
    stories: {
      slides: {
        file: File;
        mediaType: "Image" | "Video";
        duration: number;
        order: number;
      }[];
    }[]
  ) => {
    try {
      const formData = new FormData();
      formData.append("AlbumName", albumName);
      stories[0].slides.forEach((slide, index) => {
        formData.append(`Slides[${index}].MediaFile`, slide.file);
        formData.append(`Slides[${index}].MediaType`, slide.mediaType);
        formData.append(`Slides[${index}].Duration`, slide.duration.toString());
        formData.append(`Slides[${index}].Order`, slide.order.toString());
      });

      const res = await api.post("/admin/admin-albums", formData);
      

      if (res.data?.success) {
        toast.success("Admin album created successfully");
        fetchAlbums();
        await fetchAdminAlbums(); 
          handleSubmit();
        return res.data.data;
      } else {
        toast.error(res.data?.message || "Failed to create album");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  // Add Story To Existing Admin Album
const addStoryToExistingAdminAlbum = async (
  albumId: number,
  slides: {
    file: File;
    mediaType: "Image" | "Video";
    duration: number;
    order: number;
  }[]
) => {
  try {
    const formData = new FormData();
    formData.append("AlbumId", albumId.toString());

    slides.forEach((slide, index) => {
      formData.append(`Slides[${index}].MediaFile`, slide.file);
      formData.append(`Slides[${index}].MediaType`, slide.mediaType);
      formData.append(`Slides[${index}].Duration`, slide.duration.toString());
      formData.append(`Slides[${index}].DisplayOrder`, slide.order.toString());

    });

    const res = await api.post("/admin/admin-albums/add-story", formData);

    if (res.data?.success) {
      toast.success("Story added to album successfully");
      fetchAlbums();
       handleSubmit(); 
      return res.data.data;
    } else {
      toast.error(res.data?.message || "Failed to add story");
    }
  } catch (error: any) {
    toast.error(error?.response?.data?.message || "Something went wrong");
  }
};

  // Admin albums 
  const [adminAlbums, setAdminAlbums] = useState<
    { id: number; albumName: string }[]
  >([]);

  const fetchAdminAlbums = async () => {
    try {
      const res = await api.get("/admin/admin-albums");

      if (res.data?.success) {
        setAdminAlbums(res.data.data);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load albums");
    }
  };

  useEffect(() => {
    fetchAdminAlbums();
  }, []);

  // delete slide event 
  useEffect(() => {
    const handleDeleteSlide = async (e: Event) => {
      const { albumId, slideId } = (e as CustomEvent).detail;

      try {
        await api.delete(`/admin/admin-stories/slides/${slideId}`);

        toast.success("Slide deleted successfully");
        window.dispatchEvent(new Event("closeStoryViewer"));
        fetchAdminAlbums(); 
        fetchAlbums();
      } catch (err) {
        toast.error("Failed to delete slide");
      }
    };

    window.addEventListener("deleteSlide", handleDeleteSlide);
    return () => window.removeEventListener("deleteSlide", handleDeleteSlide);
  }, []);

  // ----- Delete album Confirm  -----
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AdminAlbum | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const openDeleteConfirm = (album: AdminAlbum) => {
    setDeleteTarget(album);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    try {
      await api.delete(`/admin/admin-albums/${deleteTarget.id}`);

      toast.success("Album deleted successfully");
      await fetchAlbums();
      await fetchAdminAlbums();

      setIsConfirmOpen(false);
      setDeleteTarget(null);
    } catch (error: any) {
      console.error("Delete album error:", error);
      const msg =
        error?.response?.data?.message || "Failed to delete album. Try again.";
      toast.error(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setIsConfirmOpen(false);
    setDeleteTarget(null);
  };
  const mediaBase = "http://localhost:5000";

  // ----------  Rename modal handlers ----------
  const openUpdateModal = (album: AdminAlbum) => {
    setSelectedStory(album);
    setUpdateAlbumName(album.albumName ?? "");
    setIsUpdateOpen(true);
  };

  const handleUpdateCancel = () => {
    setIsUpdateOpen(false);
    setSelectedStory(null);
    setUpdateAlbumName("");
  };

  const handleUpdateSubmit = async () => {
    if (!selectedStory) return;
    try {
      const res = await api.put(`/albums/${selectedStory.id}/name`, {
        albumName: updateAlbumName,
      });

      if (res.data?.success) {
        toast.success(res.data?.message || "Album name updated successfully");

        // refresh both 
        await fetchAlbums();
        await fetchAdminAlbums();

        // optionally emit a custom event (if other parts of app listen)
        try {
          window.dispatchEvent(
            new CustomEvent("albumNameUpdated", {
              detail: { albumId: selectedStory.id, albumName: updateAlbumName },
            })
          );
        } catch (e) {
          /* noop */
        }

        // close modal
        setIsUpdateOpen(false);
        setSelectedStory(null);
        setUpdateAlbumName("");
      } else {
        toast.error(res.data?.message || "Failed to update album name");
      }
    } catch (error: any) {
      console.error("Update album name error:", error);
      toast.error(
        error?.response?.data?.message || "Failed to update album name"
      );
    }
  };
  // ---------- Rename modal handlers ----------
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b sticky top-0 bg-white z-30">
        <div className="flex justify-between items-center px-4 py-4">
          <div>
            <h1 className="text-xl font-semibold">Stories Management</h1>
            <p className="text-sm text-gray-500">Manage stories</p>
          </div>
          <Settings className="w-5 h-5 text-gray-500" />
        </div>
      </header>

      <main className="px-4 py-6 ">
        <div className="flex justify-around items-center mb-4">
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            <IoIosAddCircle size={20} />
            Add Story
          </button>
          <button
            onClick={openCreateAlbum}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            <IoIosAddCircle size={20} />
            Create Albom & Add Story
          </button>
        </div>

        

        {/*  Albums grid with delete icon on each album */}
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-lg font-medium mb-4">Admin Albums</h2>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {Array(6)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className="h-40 bg-gray-100 rounded-lg animate-pulse"
                  />
                ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {albums.map((alb) => {
                const cover = alb.slides?.[0]?.mediaUrl
                  ? `${mediaBase}/${alb.slides[0].mediaUrl}`.replace(/([^:]\/)\/+/g, "$1")
                  : "";

                return (
                  <div
                    key={alb.id}
                    onClick={() =>
                      window.dispatchEvent(
                        new CustomEvent("openStory", {
                          detail: {
                            albums,
                            startAlbumId: alb.id,
                          },
                        })
                      )
                    }
                    className="relative bg-white border rounded-lg overflow-hidden shadow-sm cursor-pointer hover:shadow-md transition"
                  >
                 <div className="h-40 flex items-center justify-center bg-gray-50">
  {alb.slides?.length > 0 ? (
    alb.slides[0].mediaType === "Video" ? (
      <video
        src={`${mediaBase}/${alb.slides[0].mediaUrl}`.replace(/([^:]\/)\/+/g, "$1")}
        className="object-contain max-h-full max-w-full"
        muted
        playsInline
        preload="metadata"
      />
    ) : (
      <img
        src={`${mediaBase}/${alb.slides[0].mediaUrl}`.replace(/([^:]\/)\/+/g, "$1")}
        alt={alb.albumName}
        className="object-contain max-h-full max-w-full"
      />
    )
  ) : (
    <div className="text-gray-400">No cover</div>
  )}
</div>

                    <div className="p-3 flex items-center justify-between gap-2">
                      <div className="flex-1">
                        <div className="font-medium text-sm">{alb.albumName}</div>
                        <div className="text-xs text-gray-500">
                          {alb.slides?.length ?? 0} slide
                          {alb.slides && alb.slides.length > 1 ? "s" : ""}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Rename album button (NEW) */}
                        <button
                          title="Rename album"
                          className="p-2 rounded-md hover:bg-gray-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            openUpdateModal(alb);
                          }}
                        >
                          <Settings className="w-4 h-4 text-gray-600" />
                        </button>

                        {/* Edit button placeholder if needed */}
                      

                        {/* Delete album icon */}
                        <button
                          title="Delete album"
                          className="p-2 rounded-md hover:bg-gray-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            openDeleteConfirm(alb);
                          }}
                        >
                          <Trash className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {isAddOpen && flow && (
        <AddMediaModal
          isOpen={isAddOpen}
          onClose={closeAddModal}
          onStoryAdded={handleSubmit}
          onCreateAlbum={createAdminAlbum}
          onAddStoryToAlbum={addStoryToExistingAdminAlbum}
          adminAlbums={adminAlbums}
          isPost={false}
          mode="admin"
          flow={flow}
          action={isEditMode ? "edit" : "add"}
        />
      )}

      <div className="justify-center items-center d-flex">
        <StoryViewer mode="admin" />
      </div>

      {/* Existing delete modal for single story */}
      {isDeleteOpen && selectedStory && (
        <HeadlessDemo
          DeleteTrue={confirmDelete}
          onCancel={() => setIsDeleteOpen(false)}
          name="this story"
          actionType="delete"
        />
      )}

      {/*  Confirm dialog for deleting album */}
      {isConfirmOpen && deleteTarget && (
        <HeadlessDemo
          key={`delete-album-${deleteTarget.id}`}
          DeleteTrue={handleConfirmDelete}
          onCancel={handleCancelDelete}
          name={deleteTarget.albumName}
          actionType="delete"
        />
      )}

      {/* ----------  Rename Modal ---------- */}
      {isUpdateOpen && selectedStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={handleUpdateCancel}
          />
          <div className="relative z-10 w-full max-w-md bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-medium mb-3">Update album name</h3>

            <label className="text-sm text-gray-600">Old name</label>
            <input
              type="text"
              value={selectedStory.albumName}
              readOnly
              className="w-full border rounded px-3 py-2 mt-1 mb-3 bg-gray-100"
            />

            <label className="text-sm text-gray-600">New name</label>
            <input
              type="text"
              value={updateAlbumName}
              onChange={(e) => setUpdateAlbumName(e.target.value)}
              className="w-full border rounded px-3 py-2 mt-1 mb-4"
              placeholder="Vacation 2026 - Updated"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={handleUpdateCancel}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateSubmit}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
     
    </div>
  );
};

export default StoriesManagement;

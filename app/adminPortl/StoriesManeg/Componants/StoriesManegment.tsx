"use client";

import { Pencil, Settings } from "lucide-react";
import { useEffect, useState, useContext } from "react";
import { IoIosAddCircle } from "react-icons/io";
import axios from "axios";

import StoriesProfilee from "@/app/userportal/profilee/componants/StoriesProfilee";
import StoryViewer from "@/app/userportal/profilee/componants/StoryViewer";
import AddMediaModal from "@/app/userportal/profilee/componants/AddMediaModal";
import HeadlessDemo from "../../sharedAdmin/DELETE_CONFIRM";
import AuthContext from "@/app/providers/AuthContext";
import { toast } from "sonner";

type ApiStory = {
  id: number;
  hasViewed: boolean;
  slides: { id: number; mediaUrl: string }[];
};

const StoriesManagement = () => {
  const { baseUrl } = useContext(AuthContext)!;
  const [stories, setStories] = useState<ApiStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedStory, setSelectedStory] = useState<ApiStory | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
const accessToken =
  typeof window !== "undefined"
    ? localStorage.getItem("accessToken")
    : null;

  const fetchStories = async () => {

    try {
    
      const res = await axios.get(`${baseUrl}/stories/my-stories`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.data?.success) {
        setStories(res.data.data);
      }
    } finally {
      setLoading(false);
    }
  };
//   Number alpoms on Here 
const [numberOfAlbums, setNumberOfAlbums] = useState<number>(1);
  useEffect(() => {
    fetchStories();
  }, []);
  const [flow, setFlow] = useState<"addStory" | "addStoryToAlbum" | null>(null);
  const openAdd = () => {
    if (numberOfAlbums === 0) 
      {
        toast.error("Please create an album before adding stories.");
      }else{
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
    fetchStories();
  };

useEffect(() => {
  const handleDeleteStory = (e: Event) => {
    const story = (e as CustomEvent<ApiStory>).detail;
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
    const story = (e as CustomEvent<ApiStory>).detail;

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


  if (loading) return null;
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
            Create  Albom & Add Story
          </button>
        </div>

<div className="relative inline-block">
  <StoriesProfilee
    stories={stories}
    setStories={setStories}
  />

  {/* Edit Button Overlay */}
  {stories.length > 0 && (
    <button
      onClick={() => {
        setSelectedStory(stories[0]);
        setIsEditMode(true);
        setIsAddOpen(true);
        setFlow("addStoryToAlbum"); 
      }}
      className="absolute top-2 right-2 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-blue-600 z-10"
    >
      <Pencil size={12} />
    </button>
  )}
</div>

  
      </main>

    {isAddOpen && flow && (
  <AddMediaModal
    isOpen={isAddOpen}
    onClose={closeAddModal}
    onStoryAdded={handleSubmit}
    isPost={false}
    mode="admin"
    flow={flow}
      action={isEditMode ? "edit" : "add"}
    
  />
)}



<div className="justify-center items-center d-flex">
 <StoryViewer
       />
  </div>

     

      {isDeleteOpen && selectedStory && (
        <HeadlessDemo
          DeleteTrue={confirmDelete}
          onCancel={() => setIsDeleteOpen(false)}
          name="this story"
          actionType="delete"
        />
      )}
    </div>
  );
};

export default StoriesManagement;

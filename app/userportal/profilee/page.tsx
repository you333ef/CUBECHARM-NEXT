"use client";

import dynamic from "next/dynamic";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import AuthContext from "@/app/providers/AuthContext";
import Personal_Data_Profile from "./componants/Personal_Data_Profile";
import { IoIosAddCircle } from "react-icons/io";
import { Pencil } from "lucide-react";
import HeadlessDemo from "../../adminPortl/sharedAdmin/DELETE_CONFIRM";
import { useParams } from "next/navigation";


const StoryViewer = dynamic(() => import("./componants/StoryViewer"), { ssr: false });
const StoriesProfilee = dynamic(() => import("./componants/StoriesProfilee"), { ssr: false });
const ADsAnd_Videos = dynamic(() => import("./componants/ADsAnd_Videos"), { ssr: false });
const AddMediaModal = dynamic(() => import("./componants/AddMediaModal"), { ssr: false });

export default function Account() {
  const { baseUrl } = useContext(AuthContext)!;
  const accessToken =
    typeof window !== "undefined"
      ? localStorage.getItem("accessToken")
      : null;
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  /* modal control */
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [flow, setFlow] = useState<"addStory" | "addStoryToAlbum" | "addStoryOnly" | null>(null);

  /* fetch */
  const fetchMyStories = async () => {
    try {
      const res = await axios.get(`${baseUrl}/stories/my-stories`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (res.data?.success) {
        setStories(res.data.data);
      }
    } catch {
      toast.error("Failed to load stories");
    } finally {
      setLoading(false);
    }
  };

  const handleStoryAdded = async () => {
    await fetchMyStories();
  };
  useEffect(() => {
    fetchMyStories();
  }, []);
const [selectedStory, setSelectedStory] = useState<any | null>(null);
const [isEditMode, setIsEditMode] = useState(false);
const [isDeleteOpen, setIsDeleteOpen] = useState(false);
useEffect(() => {
  const handleEditStory = (e: Event) => {
    const story = (e as CustomEvent<any>).detail;

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
useEffect(() => {
  const handleDeleteStory = (e: Event) => {
    const story = (e as CustomEvent<any>).detail;

    setSelectedStory(story);
    setIsDeleteOpen(true);
  };

  window.addEventListener("deleteStory", handleDeleteStory);
  return () => {
    window.removeEventListener("deleteStory", handleDeleteStory);
  };
}, []);

const confirmDelete = async () => {
  try {
    await axios.delete(
      `${baseUrl}/stories/${selectedStory.id}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    toast.success("Story deleted successfully");
    fetchMyStories();
  } catch {
    toast.error("Failed to delete story");
  } finally {
    setIsDeleteOpen(false);
    setSelectedStory(null);
  }
};
const resetModalState = () => {
  setIsAddOpen(false);
  setFlow(null);
  setIsEditMode(false);
  setSelectedStory(null);
};
//  Fetch Data Profile 
const [profileInfo, setProfileInfo] = useState<any>();
const FetchProfile_Info = async () => {
  try {
    const res = await axios.get(`${baseUrl}/users/profiles/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (res.data?.success) {
      setProfileInfo(res.data.data);
    }
  } catch (error) {
    toast.error("Failed to load profile info");
  }
};
const [followStatus, setFollowStatus] = useState<any>(null);
const Fetch_Follow_Status=async ()=>{
  try {
    const res=await axios.get(`${baseUrl}/users/follows/stats`,{
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if(res.data?.success){
      setFollowStatus(res.data.data);
     
    }
    
  } catch (error) {
    toast.error("Failed to load follow status");
    
  }
}
//  Diffrance between Followers  && Following 
const [followersCount, setFollowersCount] = useState<any[]>([]);
const GetFollowers=async()=>{
  try {
    const res=await axios.get(`${baseUrl}/users/follows/followers`,{
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if(res.data?.success){
      setFollowersCount(res.data.data);
    }
    

  } catch (error) {
    
  }
}
const [Following, setFollowing] = useState<any[]>([]);

const GetFollowing=async()=>{
  try {
    const res=await axios.get(`${baseUrl}/users/follows/following`,{
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if(res.data?.success){
      setFollowing(res.data.data);
    }
    

  } catch (error) {
    
  }
}

const params = useParams();
const profileUserId = params?.userId as string | undefined;
const { user } = useContext(AuthContext)!;
const loggedInUserId = user?.sub;

const isOwner =
  !profileUserId || profileUserId === loggedInUserId;




const { refresh_data,setrerefresh_data  } = useContext(AuthContext)!;

useEffect(() => {
  FetchProfile_Info();
  Fetch_Follow_Status()
  GetFollowers()
  GetFollowing()
 
}, [refresh_data]);
 console.log(followersCount,'Followers')
  console.log(Following,'Following')
  console.log(followStatus,'FollowStatus')

  if (!profileInfo) {
  return <div>Loading...</div>;
}


  return (
    <section aria-label="User profile" className="p-4 max-w-screen-xl mx-auto">
    <Personal_Data_Profile
  onStoryAdded={handleStoryAdded}
  onAddStory={() => {
    setFlow("addStoryOnly");
    setIsAddOpen(true);

  }}
  profile={{
  ...profileInfo,
  followersCount: followStatus?.followersCount ?? 0,
  followingCount: followStatus?.followingCount ?? 0,
}}
  followers={followersCount}
  following={Following}


    isOwner={true}
 
/>


      {/* Stories */}
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
       setFlow("addStoryToAlbum");
      setIsAddOpen(true);
    }}
    className="absolute top-2 right-2 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-blue-600 z-10"
  >
    <Pencil size={12} />
  </button>
)}

     </div>

      {/*  Buttons UNDER stories */}
      <div className="flex justify-center gap-4 mt-4">
        <button
          onClick={() => {
            setFlow("addStoryToAlbum");
            setIsAddOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          <IoIosAddCircle size={20} />
          Add Story to Album
        </button>
{/*  */}
        <button
          onClick={() => {
            setFlow("addStory");
            setIsAddOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          <IoIosAddCircle size={20} />
          Add Album & Story
        </button>
      </div>

      <StoryViewer />

      {/* Modal */}
      {isAddOpen && flow && (
        <AddMediaModal
          isOpen={isAddOpen}
          onClose={resetModalState}
          onStoryAdded={handleStoryAdded}
          isPost={false}
          mode="user"
           action={isEditMode ? "edit" : "add"}

          flow={flow}
        />
      )}
      {isDeleteOpen && selectedStory && (
  <HeadlessDemo
    DeleteTrue={confirmDelete}
    onCancel={() => setIsDeleteOpen(false)}
    name="this story"
    actionType="delete"
  />
)}


      <ADsAnd_Videos 
        isOwner={isOwner}
  profileUserId={profileUserId}
      
      />
    </section>
  );
}

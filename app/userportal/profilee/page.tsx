"use client";

import dynamic from "next/dynamic";
import { useCallback, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import AuthContext from "@/app/providers/AuthContext";
import Personal_Data_Profile from "./componants/Personal_Data_Profile";
import { useParams } from "next/navigation";
import api from "@/app/AuthLayout/refresh";
import { getToken } from "@/app/AuthLayout/Token_Manager";

const UserStoriesModalContainer = dynamic(
  () => import("./ComPonatntModals.tsx/Container/UserStoriesModalContainer"),
  { ssr: false }
);
const StoryViewer = dynamic(() => import("../../../app/features/stories/engine/StoryViewer"), { ssr: false });
const StoriesProfilee = dynamic(() => import("../../../app/features/stories/engine/StoriesProfilee"), { ssr: false });
const ADsAnd_Videos = dynamic(() => import("./componants/ADsAnd_Videos"), { ssr: false });
export default function Account() {
 
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [albumsLoading, setAlbumsLoading] = useState(false);

  const { fetchMyStories } = useContext(AuthContext)!;
  const accessToken =  getToken();
  const fetchLocalStories = async () => {
   

    if (!accessToken) return;
    
    try {
      setLoading(true);
     const res = await api.get(`/stories/my-stories`);
      

      if (res.data?.success) {
        setStories(res.data.data);
      }
    } catch {
      toast.error("Failed to load stories");
    } finally {
      setLoading(false);
    }
  }

  const handleStoryAdded = async () => {
    await fetchLocalStories();
    await fetchMyStories();
  }
  const [albums, setAlbums] = useState<any[]>([]);

  const fetchMyAlbums = async () => {
  
    try {
      setAlbumsLoading(true);
      const res = await api.get(`/albums/my-albums`);

      if (res.data?.success) {
        setAlbums(res.data.data);
      }
    } catch {
      toast.error("Failed to load albums");
    } finally {
      setAlbumsLoading(false);
    }
  }
const [selectedStory, setSelectedStory] = useState<any | null>(null);
const [isDeleteOpen, setIsDeleteOpen] = useState(false);
const [isAddOpen, setIsAddOpen] = useState(false);
const handleEditStory = (e: Event) => {
  const story = (e as CustomEvent<any>).detail;
  setSelectedStory(story);
  setIsAddOpen(true);
};
const handleDeleteStory = (e: Event) => {
  const story = (e as CustomEvent<any>).detail;
  setSelectedStory(story);
  setIsDeleteOpen(true);
}
useEffect(() => {
  window.addEventListener("editStory", handleEditStory);
  return () => {
    window.removeEventListener("editStory", handleEditStory);
  };
}, []);
useEffect(() => {
  window.addEventListener("deleteStory", handleDeleteStory);
  return () => {
    window.removeEventListener("deleteStory", handleDeleteStory);
  };
}, []);
const confirmDelete = async () => {
  if (!accessToken) return;
  try {
    await api.delete(`/stories/${selectedStory.id}`);
    toast.success("Story deleted successfully");
    fetchMyStories();
  } catch {
    toast.error("Failed to delete story");
  } finally {
    setIsDeleteOpen(false);
    setSelectedStory(null);
  }
};
const resetModalState = useCallback(() => {
  setSelectedStory(null);
}, []);
const [profileInfo, setProfileInfo] = useState<any>();
const FetchProfile_Info = async () => {
  if (!accessToken) return;
  try {
    const res = await api.get(`/users/profiles/me`);

    if (res.data?.success) {
      setProfileInfo(res.data.data);
    }
  } catch (error) {
    toast.error("Failed to load profile info");
  }
};
const [followStatus, setFollowStatus] = useState<any>(null);
const Fetch_Follow_Status = async ()=>{
 
  
  try {
    const res=await api.get(`/users/follows/stats`);
    if(res.data?.success){
      setFollowStatus(res.data.data);
     
    }
    
  } catch (error) {
    toast.error("Failed to load follow status");
    
  }
};
const [followersCount, setFollowersCount] = useState<any[]>([]);
const GetFollowers = async () => {
  if (!accessToken) return;
  try {
    const res = await api.get(`/users/follows/followers`);
    if (res.data?.success) {
      setFollowersCount(res.data.data);
      setFollowStatus((prev: any) => ({
        ...prev,
        followersCount: res.data.data.length
      }));
    }
  } catch (error) {}
};
const [Following, setFollowing] = useState<any[]>([]);
const GetFollowing = async () => {
  if (!accessToken) return;
  try {
    const res = await api.get(`/users/follows/following`);
    if (res.data?.success) {
      setFollowing(res.data.data);
      setFollowStatus((prev: any) => ({
        ...prev,
        followingCount: res.data.data.length
      }));
    }
  } catch (error) {}
};
const handleFollowUpdate = async () => {
  await GetFollowers();
  await GetFollowing();
};
const params = useParams();
const profileUserId = params?.userId as string | undefined;
const { user } = useContext(AuthContext)!;
const loggedInUserId = user?.sub
const isOwner =
  !profileUserId || profileUserId === loggedInUserId;
useEffect(() => {
  if (accessToken) {
    fetchMyStories();
    fetchMyAlbums();
    FetchProfile_Info();
    Fetch_Follow_Status();
    GetFollowers();
    GetFollowing();
  }
}, [accessToken]); 
const handleModalClose = () => setOpenStoryModal(null);
const handleRefreshAlbums = () => fetchMyAlbums();
const handleStoryAddedCallback = async () => {
  await fetchLocalStories();
  await fetchMyStories();
}
const handleSlideDeleted = useCallback(async (slideId: number, albumId: number) => {
  setAlbums((prevAlbums) =>
    prevAlbums
      .map((album) =>
        album.id === albumId
          ? { ...album, slides: album.slides.filter((slide: any) => slide.id !== slideId) }
          : album
      )
      .filter((album) => {
        const validSlides = album.slides?.filter((slide: any) => slide.mediaUrl && slide.mediaUrl.trim() !== "") || [];
        return validSlides.length > 0;
      })
  );
  await fetchLocalStories();
  fetchMyStories();
}, [fetchMyStories]);

type StoryModalType = "story" | "albumWithStory" | "storyToAlbum" | null;
const [openStoryModal, setOpenStoryModal] = useState<StoryModalType>(null);

  // Defer StoryViewer 
  const [hasOpenedStory, setHasOpenedStory] = useState(false);
  const [pendingStoryDetail, setPendingStoryDetail] = useState<{ albums: any[]; startAlbumId: number; userName?: string; userProfileImage?: string } | null>(null);
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.albums?.length) {
        setPendingStoryDetail(detail);
        setHasOpenedStory(true);
      }
    };
    window.addEventListener("openStory", handler);
    return () => window.removeEventListener("openStory", handler);
  }, []);

  if (!accessToken || !profileInfo) {
    return (
      <section aria-label="User profile" className="p-4 max-w-screen-xl mx-auto">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section aria-label="User profile" className="max-w-screen-xl mx-auto px-0 sm:px-0 md:px-0 lg:px-4 py-4 pb-[80px] min-h-screen">
       <Personal_Data_Profile
        onStoryAdded={handleStoryAdded}
        onAddStory={() => setOpenStoryModal("story")}
        onFollowUpdate={handleFollowUpdate}
        profile={{
        ...profileInfo,
        followersCount: followStatus?.followersCount ?? 0,
        followingCount: followStatus?.followingCount ?? 0,
      }}
        followers={followersCount}
        following={Following}
          isOwner={true}
       />

         <div className="relative max-w-screen-xl w-full mx-auto overflow-visible">
       <StoriesProfilee 
         albums={albums} 
         loading={albumsLoading} 
         onAlbumsChange={setAlbums} 
         viewerMode="owner" 
        
         onRequestAddAlbumWithStory={() => setOpenStoryModal("albumWithStory")}
         onRequestAddStoryToAlbum={() => setOpenStoryModal("storyToAlbum")}
       />
      <div className="flex justify-center gap-4 mt-4">
      </div>
      </div>
      {hasOpenedStory && (
        <StoryViewer
          mode={isOwner ? "owner" : "viewer"}
          isOwner={isOwner}
          profileUserId={profileUserId || user?.sub}
          onSlideDeleted={handleSlideDeleted}
          onStoriesRefresh={fetchMyStories}
          userName={`${profileInfo?.firstName || ""} ${profileInfo?.lastName || ""}`.trim() || profileInfo?.userName}
          userProfileImage={profileInfo?.profilePicture}
          initialOpenDetail={pendingStoryDetail}
        />
      )}
      {isDeleteOpen && selectedStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => { setIsDeleteOpen(false); setSelectedStory(null); }} aria-hidden />
          <div className="relative z-10 bg-white rounded-xl shadow-xl p-6 max-w-sm w-full text-center">
            <p className="text-gray-800 font-medium mb-2">Delete this story?</p>
            <p className="text-gray-600 text-sm mb-6">This action cannot be undone.</p>
            <div className="flex gap-3 justify-center">
              <button
                type="button"
                onClick={() => { setIsDeleteOpen(false); setSelectedStory(null); }}
                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => { confirmDelete(); }}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
<UserStoriesModalContainer
  openType={openStoryModal}
  onClose={handleModalClose}
  parentAlbums={albums}
  onRefreshAlbums={handleRefreshAlbums}
  onStoryAdded={handleStoryAddedCallback}
/>
      <ADsAnd_Videos 
        isOwner={isOwner}
  profileUserId={profileUserId}
      />
    </section>
  );
}

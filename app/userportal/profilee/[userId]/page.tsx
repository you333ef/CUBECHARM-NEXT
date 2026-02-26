"use client";

import dynamic from "next/dynamic";
import Personal_Data_Profile from "../componants/Personal_Data_Profile";
import { useCallback, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { useParams } from "next/navigation";

import AuthContext from "@/app/providers/AuthContext";
import api from "@/app/AuthLayout/refresh";

const StoryViewer = dynamic(
  () => import("@/app/features/stories/engine/StoryViewer"),
  { ssr: false }
);

const StoriesProfilee = dynamic(
  () => import("@/app/features/stories/engine/StoriesProfilee"),
  { ssr: false }
);
const UserStoriesModalContainer = dynamic(
  () => import("../ComPonatntModals.tsx/Container/UserStoriesModalContainer"),
  { ssr: false }
);
const ADsAnd_Videos = dynamic(() => import("../componants/ADsAnd_Videos"), {
  ssr: false,
});

const ProfilePage = () => {
  const [profileInfo, setProfileInfo] = useState<any>();
  const params = useParams();
  const userId = params?.userId as string | undefined;

 
  const { baseUrl, user, refresh_data, myStories, fetchMyStories } = useContext(AuthContext)!;

  const loggedInUserId = user?.sub;
  const isOwner = !!loggedInUserId && (!userId || userId === loggedInUserId);

  const [followStatus, setFollowStatus] = useState<any>(null);
  const [followersCount, setFollowersCount] = useState<any[]>([]);
  const [Following, setFollowing] = useState<any[]>([]);
  const [isFollowing, setIsFollowing] = useState<boolean | null>(null);
  const [userStories, setUserStories] = useState<any[]>([]);
  const [albums, setAlbums] = useState<any[]>([]);
  const [albumsLoading, setAlbumsLoading] = useState(false);

  type StoryModalType = "story" | "albumWithStory" | "storyToAlbum" | null;
  const [openStoryModal, setOpenStoryModal] = useState<StoryModalType>(null);

  const FetchProfile_Info = async () => {
    if (!loggedInUserId) return;
    try {
      const url = (!userId || userId === loggedInUserId)
        ? `/users/profiles/me`
        : `/users/profiles/${userId}`;

      const res = await api.get(url, 
       
    );

      if (res.data?.success) {
        setProfileInfo(res.data.data);
      }
    } catch (error) {
      toast.error("failed  to  fetch data Profile");
    }
  };

  const Fetch_Follow_Status = async () => {
    try {
      const res = await api.get(`/users/follows/stats`, 
       
    );
      if (res.data?.success) {
        setFollowStatus(res.data.data);
      }
    } catch (error) {
      toast.error(" failed  To  Fetch follow ");
    }
  };

  const GetFollowers = async () => {
    try {
      const res = await api.get(`/users/follows/followers`, 
       
    );
      if (res.data?.success) {
        setFollowersCount(res.data.data);
      }
    } catch (error) {
    }
  };

  const GetFollowing = async () => {
    try {
      const res = await api.get(`/users/follows/following`, 
     
    );
      if (res.data?.success) {
        setFollowing(res.data.data);
      }
    } catch (error) {
    }
  };

  const fetchUserStories = async () => {
    if (!userId || isOwner) return;
    try {
      const res = await api.get(`/stories/user/${userId}`, 
       
    );
      if (res.data?.success) {
        setUserStories(res.data.data);
      }
    } catch {}
  };

  const fetchAlbums = async () => {
    if (!loggedInUserId) return;
    try {
      setAlbumsLoading(true);
      const ownerNow = !userId || userId === loggedInUserId;
      const url = ownerNow
        ? `/albums/my-albums`
        : `/albums/user/${userId}`;
      const res = await api.get(url, 
       
    );
      if (res.data?.success) {
        setAlbums(res.data.data);
      }
    } catch {} finally {
      setAlbumsLoading(false);
    }
  };

  const handleStoryAdded = async () => {
    if (isOwner) await fetchMyStories();
    await fetchAlbums();
  };

  const handleSlideDeleted = useCallback((slideId: number, albumId: number) => {
    setAlbums((prev) =>
      prev
        .map((a) =>
          a.id === albumId
            ? { ...a, slides: a.slides.filter((s: any) => s.id !== slideId) }
            : a
        )
        .filter((a) => a.slides?.some((s: any) => s.mediaUrl?.trim()))
    );
    if (isOwner) fetchMyStories();
  }, [isOwner, fetchMyStories]);

  useEffect(() => {
    if (isOwner || userId) {
      FetchProfile_Info();
      Fetch_Follow_Status();
      GetFollowers();
      GetFollowing();
      fetchAlbums();
    }
    if (isOwner) {
      fetchMyStories();
    } else if (userId) {
      fetchUserStories();
    }
  }, [userId, refresh_data, loggedInUserId]);

  if (!loggedInUserId || !profileInfo) {
    return <div>Loading ...</div>;
  }

  return (
    <>
      <section aria-label="User profile" className="p-4 max-w-screen-xl mx-auto">
        <div>
          <Personal_Data_Profile
            profile={{
              ...profileInfo,
              followersCount: followStatus?.followersCount ?? 0,
              followingCount: followStatus?.followingCount ?? 0,
            }}
            followers={followersCount}
            following={Following}
            isOwner={isOwner}
            isFollowing={isFollowing}
            userStories={isOwner ? myStories : userStories}
            onStoryAdded={isOwner ? handleStoryAdded : undefined}
            onAddStory={isOwner ? () => setOpenStoryModal("story") : undefined}
          />

          <StoriesProfilee
            albums={albums}
            loading={albumsLoading}
            onAlbumsChange={setAlbums}
            viewerMode={isOwner ? "owner" : "viewer"}
            onRequestAddAlbumWithStory={isOwner ? () => setOpenStoryModal("albumWithStory") : undefined}
            onRequestAddStoryToAlbum={isOwner ? () => setOpenStoryModal("storyToAlbum") : undefined}
          />

          <StoryViewer
            mode={isOwner ? "owner" : "viewer"}
            isOwner={isOwner}
            profileUserId={userId || loggedInUserId}
            onSlideDeleted={isOwner ? handleSlideDeleted : undefined}
            onStoriesRefresh={isOwner ? fetchMyStories : undefined}
            userName={`${profileInfo?.firstName || ''} ${profileInfo?.lastName || ''}`.trim() || profileInfo?.userName}
            userProfileImage={profileInfo?.profilePicture}
          />

          {isOwner && (
            <UserStoriesModalContainer
              openType={openStoryModal}
              onClose={() => setOpenStoryModal(null)}
              parentAlbums={albums}
              onRefreshAlbums={fetchAlbums}
              onStoryAdded={handleStoryAdded}
            />
          )}

          <ADsAnd_Videos isOwner={isOwner} profileUserId={userId} />
        </div>
      </section>
    </>
  );
};

export default ProfilePage;

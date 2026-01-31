"use client";

import dynamic from "next/dynamic";
import Personal_Data_Profile from "../componants/Personal_Data_Profile";
import { useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { useParams } from "next/navigation";

import AuthContext from "@/app/providers/AuthContext";

const StoryViewer = dynamic(() => import("../componants/StoryViewer"), {
  ssr: false,
});
const StoriesProfilee = dynamic(() => import("../componants/StoriesProfilee"), {
  ssr: false,
});
const ADsAnd_Videos = dynamic(() => import("../componants/ADsAnd_Videos"), {
  ssr: false,
});

const ProfilePage = () => {
  const [profileInfo, setProfileInfo] = useState<any>();
  const params = useParams();
  const userId = params?.userId as string | undefined;

  const accessToken =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  const { baseUrl, user, refresh_data } = useContext(AuthContext)!;

  const loggedInUserId = user?.sub;
  const isOwner = !userId || userId === loggedInUserId;

  const FetchProfile_Info = async () => {
    try {
      const url = isOwner
        ? `${baseUrl}/users/profiles/me`
        : `${baseUrl}/users/profiles/${userId}`;

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (res.data?.success) {
        setProfileInfo(res.data.data);
      }
    } catch (error) {
      toast.error("failed  to  fetch data Profile");
    }
  };

  const [followStatus, setFollowStatus] = useState<any>(null);
  const Fetch_Follow_Status = async () => {
    try {
      const res = await axios.get(`${baseUrl}/users/follows/stats`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (res.data?.success) {
        setFollowStatus(res.data.data);
      }
    } catch (error) {
      toast.error(" failed  To  Fetch follow ");
    }
  };

  const [followersCount, setFollowersCount] = useState<any[]>([]);
  const GetFollowers = async () => {
    try {
      const res = await axios.get(`${baseUrl}/users/follows/followers`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (res.data?.success) {
        setFollowersCount(res.data.data);
      }
    } catch (error) {
    }
  };

  const [Following, setFollowing] = useState<any[]>([]);
  const GetFollowing = async () => {
    try {
      const res = await axios.get(`${baseUrl}/users/follows/following`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (res.data?.success) {
        setFollowing(res.data.data);
      }
    } catch (error) {
    }
  };

  const [isFollowing, setIsFollowing] = useState<boolean | null>(null);

  useEffect(() => {
    if (isOwner || userId) {
      FetchProfile_Info();
      Fetch_Follow_Status();
      GetFollowers();
      GetFollowing();    }
  }, [userId, refresh_data, loggedInUserId]);

  if (!profileInfo) {
    return <div>Loadin ...</div>;
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
          />

          <StoryViewer />
          <ADsAnd_Videos isOwner={isOwner} profileUserId={userId} />
        </div>
      </section>
    </>
  );
};

export default ProfilePage;

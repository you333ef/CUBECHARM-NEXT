"use client";

import React, { useState, useEffect, useContext } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { FaAngleLeft, FaTimes } from "react-icons/fa";
import { IoIosAddCircle } from "react-icons/io";
import Button from "../../componants/shared/Button";
import dynamic from "next/dynamic";
import { useFollow } from "../componants/useFollow";
import AuthContext from "@/app/providers/AuthContext";
import { toast } from "sonner";
import axios from "axios";

type PersonalDataProfileProps = {
  onStoryAdded?: () => void;
  onAddStory?: () => void;
  profile: ProfileInfo;
  followers: any[];
  following: any[];
  isOwner?: boolean;
  isFollowing?: boolean | null;
};

export type ProfileInfo = {
  userId: string;
  userName: string;
  firstName: string;
  lastName: string;
  fullName: string;
  profilePicture: string | null;
  bio?: string;
  followersCount: number;
  followingCount: number;
};

const AddMediaModal = dynamic(() => import("./AddMediaModal"), { ssr: false });

const Avatar = ({ src, alt }: { src?: string; alt: string }) => (
  <Image
    src={src || "/images/default-avatar.png"}
    alt={alt}
    width={48}
    height={48}
    className="rounded-full object-cover"
  />
);

export default function PersonalDataProfile({
  onStoryAdded,
  onAddStory,
  profile,
  followers,
  following,
  isOwner = false,
  isFollowing,
}: PersonalDataProfileProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isPostMode = searchParams.get("activity") !== null;
  const auth = useContext(AuthContext)!;
  const currentUserId = auth?.user?.sub;
  const resolvedIsOwner = isOwner || currentUserId === profile?.userId;
 

  const [showAddModal, setShowAddModal] = useState(false);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);

  const { followUser, unfollowUser, followLoading, checkIsFollowing } = useFollow();

  const [localFollowing, setLocalFollowing] = useState<boolean | null>(isFollowing ?? null);

  useEffect(() => {
    if (!resolvedIsOwner && profile?.userId) {
      let mounted = true;
      checkIsFollowing(profile.userId)
        .then((res) => {
          if (mounted) setLocalFollowing(Boolean(res));
        })
        .catch(() => {
          if (mounted) setLocalFollowing(false);
        });
      return () => { mounted = false; };
    }
  }, [profile?.userId, resolvedIsOwner]);

  useEffect(() => {
    if (searchParams.get("openStory") === "true") {
      setShowAddModal(true);
    }
  }, [searchParams]);

  if (!profile) {
    return <div className="p-10 text-center text-gray-500">Loading profile...</div>;
  }

  const fullName = `${profile.firstName || ""} ${profile.lastName || ""}`.trim();
  const BaseUrl = "http://localhost:5000";
  const imageSrc = profile.profilePicture ? `${BaseUrl}/${profile.profilePicture}` : "/images/default-avatar.png";

  const handleFollowProfile = async () => {
    if (followLoading || !profile.userId || profile.userId === currentUserId) return;
    try {
      await followUser(profile.userId);
      setLocalFollowing(true);
    } catch (err: any) {
      const msg = err?.response?.data?.errors?.[0] || err?.response?.data?.message || err?.message;
      if (typeof msg === "string" && msg.toLowerCase().includes("already following")) {
        setLocalFollowing(true);
      } else {
        toast.error(msg || "Follow failed");
      }
    }
  };

  const handleUnfollowProfile = async () => {
    if (followLoading || !profile.userId || profile.userId === currentUserId) return;
    try {
      await unfollowUser(profile.userId);
      setLocalFollowing(false);
    } catch (err: any) {
      const msg = err?.response?.data?.errors?.[0] || err?.response?.data?.message || err?.message;
      if (typeof msg === "string" && msg.toLowerCase().includes("cannot unfollow yourself")) {
        setLocalFollowing(false);
      } else {
        toast.error(msg || "Unfollow failed");
      }
    }
  };
   const { baseUrl } = useContext(AuthContext)!;
    const accessToken =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
const startConversation = async (otherUserId: string) => {
  try {
    const response = await axios.post(
      `${baseUrl}/messaging/conversations/start/${otherUserId}`,
      null,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.data?.success) {
      throw new Error(response.data?.message || "Failed to start conversation");
    }

    return response.data.data;
  } catch (error: any) {
    throw error;
  }
};
const handleMessageClick = async () => {
  if (!profile.userId) return;

  try {
    const conversation = await startConversation(profile.userId);

    router.push(
      `/userportal/messaes?conversationId=${conversation.id}`
    );
  } catch (err) {
    toast.error("Failed to open conversation");
  }
};



  return (
    <>
      <section className="w-full px-4 mt-6 md:px-0">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => (history.length > 1 ? router.back() : router.push("/default-home"))}
              className="md:hidden p-2 rounded-full hover:bg-gray-100"
            >
              <FaAngleLeft size={24} />
            </button>
            <h1 className="text-2xl font-bold">{profile.userName || "User"}</h1>
            <div className="w-10 md:hidden" />
          </div>

          <div className="flex justify-between items-start py-5 border-y text-sm font-medium">
            {resolvedIsOwner && onAddStory ? (
              <button onClick={onAddStory} className="flex flex-col items-center text-blue-600">
                <IoIosAddCircle size={28} />
                <span>Add Story</span>
              </button>
            ) : (
              <div className="text-center">
                <div className="font-bold text-lg">0</div>
                <div className="text-gray-600">Ads</div>
              </div>
            )}

            <button onClick={() => followers.length && setShowFollowers(true)} className="text-center">
              <div className="font-bold text-lg">{profile.followersCount ?? 0}</div>
              <div className="text-gray-600">Followers</div>
            </button>

            <button onClick={() => following.length && setShowFollowing(true)} className="text-center">
              <div className="font-bold text-lg">{profile.followingCount ?? 0}</div>
              <div className="text-gray-600">Following</div>
            </button>
          </div>

          <div className="mt-8 flex flex-col-reverse md:flex-row items-center md:items-start gap-8">
            <div className="text-center md:text-left flex-1">
              <h2 className="text-2xl font-bold">{fullName || profile.userName}</h2>
              <p className="text-gray-600 mt-2">{profile.bio}</p>

              {resolvedIsOwner ? (
                <div className="flex gap-3 mt-6 justify-center md:justify-start">
                  <Button
                    name="Account Info"
                    onClick={() => router.push("/userportal/Settings/profilesettings/profile_info")}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg"
                  />
                  <Button
                    name="Update Profile"
                    onClick={() => router.push("/userportal/Settings/profilesettings/update")}
                    className="bg-gray-300 px-6 py-2 rounded-lg"
                  />
                </div>
              ) : (
                <div className="flex gap-3 mt-6 justify-center md:justify-start">
                  {localFollowing ? (
                    <Button
                      name={followLoading ? "Loading..." : "Unfollow"}
                      onClick={handleUnfollowProfile}
                      className="bg-gray-500 text-white py-2 px-6 rounded-lg"
                      disabled={followLoading}
                    />
                  ) : (
                    <Button
                      name={followLoading ? "Loading..." : "Follow"}
                      onClick={handleFollowProfile}
                      className="bg-blue-600 text-white py-2 px-6 rounded-lg"
                      disabled={followLoading}
                    />
                  )}
                  <Button name="Message" onClick={handleMessageClick} className="bg-blue-600 text-white py-2 px-6 rounded-lg" />
                </div>
              )}
            </div>

            <Image
              src={imageSrc}
              alt={profile.userName ? `${profile.userName} profile picture` : "Profile Picture"}
              width={180}
              height={180}
              unoptimized
              className="rounded-3xl object-cover shadow-lg"
            />
          </div>
        </div>

        {resolvedIsOwner && onStoryAdded && (
          <AddMediaModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} onStoryAdded={onStoryAdded} isPost={isPostMode} />
        )}

        {showFollowers && (
          <Modal title="Followers" users={followers} onClose={() => setShowFollowers(false)} currentUserId={currentUserId} />
        )}

        {showFollowing && (
          <Modal title="Following" users={following} onClose={() => setShowFollowing(false)} currentUserId={currentUserId} />
        )}
      </section>
    </>
  );
}

function Modal({
  title,
  users,
  onClose,
  currentUserId,
}: {
  title: string;
  users: any[];
  onClose: () => void;
  currentUserId?: string;
}) {
  const { followUser, unfollowUser, checkIsFollowing, followLoading } = useFollow();
  const [map, setMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let mounted = true;
    const fetchAll = async () => {
      try {
        const results = await Promise.all(
          users.map((u) => checkIsFollowing(u.userId).catch(() => false))
        );
        if (!mounted) return;
        const initial: Record<string, boolean> = {};
        users.forEach((u, i) => { initial[u.userId] = Boolean(results[i]); });
        setMap(initial);
      } catch {
        if (mounted) {
          const initial: Record<string, boolean> = {};
          users.forEach((u) => { initial[u.userId] = false; });
          setMap(initial);
        }
      }
    };
    fetchAll();
    return () => { mounted = false; };
  }, [users]);

  const handleFollow = async (id: string) => {
    if (followLoading || id === currentUserId || map[id]) return;
    setMap((p) => ({ ...p, [id]: true }));
    try { await followUser(id); } 
    catch (err: any) { setMap((p) => ({ ...p, [id]: false })); toast.error("Follow failed"); }
  };

  const handleUnfollow = async (id: string) => {
    if (followLoading || id === currentUserId || !map[id]) return;
    setMap((p) => ({ ...p, [id]: false }));
    try { await unfollowUser(id); } 
    catch (err: any) { setMap((p) => ({ ...p, [id]: true })); toast.error("Unfollow failed"); }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">{title}</h2>
          <button onClick={onClose}><FaTimes size={22} /></button>
        </div>
        <div className="overflow-y-auto p-4 space-y-4">
          {users.map((u) => (
            <div key={u.userId} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar src={u.profilePicture} alt={u.userName} />
                <p className="font-medium">{u.userName}</p>
              </div>
              {u.userId === currentUserId ? null : map[u.userId] ? (
                <button onClick={() => handleUnfollow(u.userId)} className="px-3 py-1 text-sm bg-gray-300 rounded" disabled={followLoading}>Unfollow</button>
              ) : (
                <button onClick={() => handleFollow(u.userId)} className="px-3 py-1 text-sm bg-blue-600 text-white rounded" disabled={followLoading}>Follow</button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect, FC  } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { FaAngleLeft, FaTimes } from "react-icons/fa";
import { IoIosAddCircle } from "react-icons/io";
import Button from "../../componants/shared/Button";
import { profileData } from "../../../utils/stories";
import dynamic from "next/dynamic";
export interface AddMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  isPost: boolean;
}

const AddMediaModal = React.lazy(() => 
  import("./AddMediaModal")
);




// 1
const useFollowers = () => {
  const [followers, setFollowers] = useState([
    { id: 1, username: "sarah_jones", name: "Sarah Jones", avatar: "https://i.pravatar.cc/150?img=1", following: false },
    { id: 2, username: "mike_wilson", name: "Mike Wilson", avatar: "https://i.pravatar.cc/150?img=2", following: true },
    { id: 3, username: "emma_davis", name: "Emma Davis", avatar: "https://i.pravatar.cc/150?img=3", following: false },
  ]);

  const toggleFollow = (id: number) => {
    setFollowers(prev => prev.map(u => u.id === id ? { ...u, following: !u.following } : u));
    //2
  };

  return { followers, toggleFollow };
};




const useFollowing = () => {
  const [following, setFollowing] = useState([
    { id: 4, username: "john_smith", name: "John Smith", avatar: "https://i.pravatar.cc/150?img=4", following: true },
    { id: 5, username: "lisa_anderson", name: "Lisa Anderson", avatar: "https://i.pravatar.cc/150?img=5", following: true },
    { id: 6, username: "david_lee", name: "David Lee", avatar: "https://i.pravatar.cc/150?img=6", following: true },
  ]);

  const unfollow = (id: number) => {
    setFollowing(prev => prev.filter(u => u.id !== id));
    //3
  };

  return { following, unfollow };
};

// 4
const Avatar = ({ src, alt }: { src: string; alt: string }) => (
  <Image
    src={src}
    alt={alt}
    width={48}
    height={48}
    className="rounded-full object-cover"
    loading="lazy"
  />
);

// 5
const UserRow = ({ user, isFollowing, onAction }: {
  user: any;
  isFollowing: boolean;
  onAction: (id: number) => void;
}) => {
  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
      <div className="flex items-center gap-3">
        <Avatar src={user.avatar} alt={user.username} />
        <div>
          <p className="font-medium">{user.username}</p>
          <p className="text-sm text-gray-500">{user.name}</p>
        </div>
      </div>

      <button
        onClick={() => onAction(user.id)}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
          isFollowing
            ? "bg-blue-100 text-black"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
      >
        {isFollowing ? "Unfollow" : "Follow"}
      </button>
    </div>
  );
};

// 6





// 7
export default function PersonalDataProfile() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isPostMode = searchParams.get("activity") !== null;

  const [showAddModal, setShowAddModal] = useState(false);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);

  const { followers, toggleFollow } = useFollowers();
  const { following, unfollow } = useFollowing();

  useEffect(() => {
    if (searchParams.get("openStory") === "true") {
      setShowAddModal(true);
    }
  }, [searchParams]);
//  8
  const goBack = () => {
    if (history.length > 1) router.back();
    else router.push("/default-home");
  };
  return (
    <>
      {/*9*/}
      <link rel="preload" as="image" href="/images/a9054bca-63af-4ee6-a443-e15e322569c3.png" />
      <link rel="preload" as="image" href="/images/a9054bca-63af-4ee6-a443-e15e322569c3.webp" type="image/webp" />

      <section className="w-full px-4 mt-6 md:px-0">
        <div className="max-w-3xl mx-auto">

          {/* 10 */}
          <div className="flex items-center justify-between mb-6">
            <button onClick={goBack} className="md:hidden p-2 rounded-full hover:bg-gray-100">
              <FaAngleLeft size={24} />
            </button>
            <h1 className="text-2xl font-bold">{profileData.username}</h1>
            <div className="w-10 md:hidden" />
          </div>

          {/* 11 */}
          <div className="flex justify-between items-start py-5 border-y text-sm font-medium">
            <button onClick={() => setShowAddModal(true)} className="flex flex-col items-center gap-1 text-blue-600">
              <IoIosAddCircle size={28} />
              <span>{isPostMode ? "Add Post" : "Add Story"}</span>
            </button>
            <button onClick={() => setShowFollowers(true)} className="text-center">
              <div className="font-bold text-lg">{followers.length}</div>
              <div className="text-gray-600">Followers</div>
            </button>
            <button onClick={() => setShowFollowing(true)} className="text-center">
              <div className="font-bold text-lg">{following.length}</div>
              <div className="text-gray-600">Following</div>
            </button>
          </div>

          {/* 12 */}
          <div className="mt-8 flex flex-col-reverse md:flex-row items-center md:items-start gap-8">
            <div className="text-center md:text-left flex-1">
              <h2 className="text-2xl font-bold">{profileData.name}</h2>
              <p className="text-gray-600 mt-2">{profileData.bio}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-6">
                <Button name="Account Info" onClick={() => router.push("/userportal/Settings/profilesettings/profile_info")} className="bg-blue-600 text-white px-6 py-2 rounded-lg" />
                <Button name="Update Profile" onClick={() => router.push("/userportal/Settings/profilesettings/update")} className="bg-gray-300 px-6 py-2 rounded-lg" />
              </div>
            </div>
            <Image
              src="/images/a9054bca-63af-4ee6-a443-e15e322569c3.png"
              alt="Profile"
              width={180}
              height={180}
              priority
              fetchPriority="high"
              className="rounded-3xl object-cover shadow-lg"
            />
          </div>
        </div>

        {/* 13 */}
<AddMediaModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} isPost={isPostMode} />
        {/* 14 */}
        {showFollowers && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] flex flex-col">
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="text-xl font-bold">Followers</h2>
                <button onClick={() => setShowFollowers(false)}><FaTimes size={22} /></button>
              </div>
              <div className="overflow-y-auto p-4">
                {followers.map(user => (
                  <UserRow key={user.id} user={user} isFollowing={user.following} onAction={toggleFollow} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 15 */}
        {showFollowing && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] flex flex-col">
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="text-xl font-bold">Following</h2>
                <button onClick={() => setShowFollowing(false)}><FaTimes size={22} /></button>
              </div>
              <div className="overflow-y-auto p-4">
                {following.map(user => (
                  <UserRow key={user.id} user={user} isFollowing={true} onAction={unfollow} />
                ))}
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
}

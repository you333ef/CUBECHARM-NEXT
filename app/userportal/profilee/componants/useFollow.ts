import { useState, useContext } from "react";
import axios from "axios";
import { toast } from "sonner";
import AuthContext from "@/app/providers/AuthContext";

export const useFollow = () => {
  const { baseUrl } = useContext(AuthContext)!;
   const { refresh_data,setrerefresh_data  } = useContext(AuthContext)!;

  const accessToken =
    typeof window !== "undefined"
      ? localStorage.getItem("accessToken")
      : null;

  const [followLoading, setFollowLoading] = useState(false);

  const checkIsFollowing = async (targetUserId: string) => {
    try {
      const res = await axios.get(
        `${baseUrl}/users/follows/${targetUserId}/is-following`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setrerefresh_data
     return res.data?.data as boolean;

    } catch {
      toast.error("Failed to check follow status");
      return false;
    }
  };
  
  const followUser = async (targetUserId: string) => {
    setFollowLoading(true);
    try {
      await axios.post(
        `${baseUrl}/users/follows/${targetUserId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      toast.success("Followed successfully");
      setrerefresh_data(true);

    } catch {
      toast.error("Follow failed");
    } finally {
      setFollowLoading(false);
    }
  };

  const unfollowUser = async (targetUserId: string) => {
    setFollowLoading(true);
    try {
      await axios.delete(
        `${baseUrl}/users/follows/${targetUserId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setrerefresh_data(false);
      toast.success("Unfollowed successfully");
    } catch {
      toast.error("Unfollow failed");
    } finally {
      setFollowLoading(false);
    }
  };

  return {
    checkIsFollowing,
    followUser,
    unfollowUser,
    followLoading,
  };
};

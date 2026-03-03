import { useState, useContext } from "react";
import axios from "axios";
import { toast } from "sonner";
import AuthContext from "@/app/providers/AuthContext";
import api from "@/app/AuthLayout/refresh";

export const useFollow = () => {
   const { refresh_data,setrerefresh_data  } = useContext(AuthContext)!;

  
  const [followLoading, setFollowLoading] = useState(false);

  const checkIsFollowing = async (targetUserId: string) => {
    try {
      const res = await api.get(
        `/users/follows/${targetUserId}/is-following`
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
      await api.post(`/users/follows/${targetUserId}`, null);

     
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
      await api.delete(`/users/follows/${targetUserId}`);
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

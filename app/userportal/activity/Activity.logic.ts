import axios from "axios";
import { toast } from "sonner";
import api from "@/app/AuthLayout/refresh";

const BaseUrl = "http://localhost:5000";

/**
 * Get activity feed with
 */
export const getActivityFeed = async () => {
  try {
    const response = await api.get(`/posts?page=1&pageSize=20`);
     

    const mappedPosts = response.data.data.items.map((item: any) => {
      const videos =
        item.mediaFiles?.filter((m: any) => m.type === "Video") || [];

      const images =
        item.mediaFiles?.filter((m: any) => m.type === "Image") || [];

      return {
        id: item.postId,
        ownerUserId: item.userId,
        username: item.username,
        userImage: item.userAvatar
          ? `${BaseUrl}/${item.userAvatar}`
          : "/images/person.jpg",

        postImage:
          images.length > 0
            ? `${BaseUrl}/${images[0].url}`
            : "/images/default-post.png",

        videoUrl:
          videos.length > 0 ? `${BaseUrl}/${videos[0].url}` : null,

        hasVideo: videos.length > 0,

        caption: item.content ?? "",
        likes: item.likesCount ?? 0,
        isLiked: item.isLiked ?? false,
        timestamp: item.createdDate || "Just now",
      };
    });

    return mappedPosts;
  } catch (error) {
    console.error("Error fetching activity feed:", error);
    return [];
  }
};

/**
 * Get post details by ID
 */
export const getPostDetails = async (
  postId: number,
  baseUrl: string
): Promise<any | null> => {
  try {
    const response = await api.get(`/posts/${postId}`);

    const data = response.data.data;

    const videos =
      data.mediaFiles?.filter((m: any) => m.type === "Video") || [];

    const images =
      data.mediaFiles?.filter((m: any) => m.type === "Image") || [];

    const mappedPostDetails = {
      id: data.postId,
      username: data.username,
 ownerUserId: data.userId, 
      postImage:
        images.length > 0
          ? `${BaseUrl}/${images[0].url}`
          : "/images/default-post.png",

      videoUrl:
        videos.length > 0 ? `${BaseUrl}/${videos[0].url}` : null,

      hasVideo: videos.length > 0,

      userImage: data.userAvatar
        ? `${BaseUrl}/${data.userAvatar}`
        : "/images/person.jpg",

      caption: data.content ?? "",
      likes: data.likesCount ?? 0,
      comments: data.comments ?? [],
      isLiked: data.isLiked ?? false,
      timestamp: data.createdDate,
    };

    return mappedPostDetails;
  } catch (error) {
    console.error("Error fetching post details:", error);
    return null;
  }
};

/**
 * Create a new post with optional media
 */
// API call
export const createPost = async (formData: FormData, baseUrl: string) => {
  try {
    const response = await api.post(`/posts`, formData, {
     
    });

    toast.success(response.data.message);
    return response.data.data;
  } catch (error: any) {
    toast.error(error.response?.data?.message || "Failed to create post");
    return null;
  }
};

/**
 * Toggle like on a post
 */
export const toggleLike = async (
  postId: string,
  baseUrl: string
): Promise<{ likes: number; isLiked: boolean } | null> => {
  try {
    const response = await api.post(
      `/posts/${postId}/like`,
      {},
     
    );

    return response.data.data;
  } catch (error) {
    console.error("Error toggling like:", error);
    return null;
  }
};

/**
 * Delete a post by ID
 */
export const deletePost = async (postId: number, baseUrl: string) => {
  try {
    const response = await api.delete(`/posts/${postId}`);
     

    toast.success(response.data.message || "Post deleted");
    return true;
  } catch (error: any) {
    toast.error(error.response?.data?.message || "Failed to delete post");
    return false;
  }
};

/**
 * Report a post with reason and description
 */
export const reportPost = async (
  reportId: string | number,
  data: {
    reason: string;
    description: string;
  },
  baseUrl: string
) => {
  try {
    const res = await api.post(
      `/report/post/${reportId}`,
      { reason: data.reason, description: data.description },
      
    );

    if (res.data?.success) {
      toast.success(res.data.message || "Report submitted successfully");
      return true;
    } else {
      toast.error(res.data.message || "Something went wrong");
      return false;
    }
  } catch (error: any) {
    const errors = error?.response?.data?.errors;
    if (Array.isArray(errors)) {
      errors.forEach((e: string) => toast.error(e));
    } else {
      toast.error("Failed to submit report");
    }
    return false;
  }
};

/**
 * Block a user by ID
 */
export const blockUser = async (userId: string | number, baseUrl: string) => {
  try {
    const res = await api.post(
      `/users/blocks/${userId}`,
      {},
     
    );

    if (res.data?.success) {
      toast.success(res.data.message || "User blocked successfully");
      return true;
    } else {
      toast.error(res.data.message || "Something went wrong");
      return false;
    }
  } catch (error) {
    toast.error("Failed to block user");
    return false;
  }
};

/**
 * Fetch properties feed for ads tab
 */
export const fetchPropertiesFeed = async () => {
  try {
    const response = await api.get(`/Property/feed?page=1&pageSize=24&sort=recent`);

    if (response.status === 200) {
      const items = response.data.data.items.map((item: any) => {
        const formatUrl = (url: string | null) => {
          if (!url) return null;
          if (url.startsWith("http")) return url;
      
          return `${BaseUrl}/${url}`;
        };

        return {
          ...item,
          mainImage: formatUrl(item.imageUrl1),
        };
      });

      return items;
    }

    return [];
  } catch (err) {
    console.error("Error fetching properties feed", err);
    return [];
  }
};

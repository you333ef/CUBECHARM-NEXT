import axios from "axios";
import { toast } from "sonner";
import IMAGE from "../../../public/images/a9054bca-63af-4ee6-a443-e15e322569c3.png";

const BaseUrl = "http://localhost:5000";

/**
 * Get activity feed with
 */
export const getActivityFeed = async (baseUrl: string) => {
  try {
    const response = await axios.get(`${baseUrl}/posts?page=1&pageSize=20`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
      },
    });

    const mappedPosts = response.data.data.items.map((item: any) => {
        console.log("POST FROM API:", item);
      return {
        id: item.postId,
        ownerUserId: item.userId,
        username: item.username,
        userImage: item.userAvatar || IMAGE,
        postImage: item.mediaUrl
          ? `${BaseUrl}/${item.mediaUrl}`
          : "/images/default-post.png",
        
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
    const response = await axios.get(`${baseUrl}/posts/${postId}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
      },
    });

    const data = response.data.data;

    const mappedPostDetails = {
      id: data.postId,
      username: data.username,
      postImage: data.mediaUrl
        ? `${BaseUrl}/${data.mediaUrl}`
        : "https://via.placeholder.com/600",
      userImage: data.userAvatar
        ? `${BaseUrl}/${data.userAvatar}`
        : "https://via.placeholder.com/150",
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
export const createPost = async (
  payload: {
    content: string;
    media?: File;
  },
  baseUrl: string
) => {
  try {
    const formData = new FormData();

    formData.append("Description", payload.content ?? "");

    if (payload.media) {
      formData.append("media", payload.media);
    }

    const response = await axios.post(`${baseUrl}/posts`, formData, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
      },
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
    const response = await axios.post(
      `${baseUrl}/posts/${postId}/like`,
      {},
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("accessToken"),
        },
      }
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
    const response = await axios.delete(`${baseUrl}/posts/${postId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });

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
    const res = await axios.post(
      `${baseUrl}/report/post/${reportId}`,
      { reason: data.reason, description: data.description },
      { headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` } }
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
    const res = await axios.post(
      `${baseUrl}/users/blocks/${userId}`,
      {},
      { headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` } }
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
export const fetchPropertiesFeed = async (baseUrl: string) => {
  try {
    const response = await axios.get(
      `${baseUrl}/Property/feed?page=1&pageSize=24&sort=recent`
    );

    if (response.status === 200) {
      const items = response.data.data.items.map((item: any) => {
        const formatUrl = (url: string | null) => {
          if (!url) return null;
          if (url.startsWith("http")) return url;
          return `${baseUrl}/${url}`;
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

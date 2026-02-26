"use client";

import { createContext, useEffect, useState, ReactNode, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { getToken, setToken } from "../AuthLayout/tokenMemory";
import api from "../AuthLayout/refresh";
import { refreshToken } from "../AuthLayout/Token_Manager";

export let externalSetTokenState: ((t: string | null) => void) | null = null;

interface DecodedToken {
  sub: string;
  role: string;
  exp: number;
  nameid?: string;
  userId?: string;
  [key: string]: any;
}

export const getUserId = (user: DecodedToken | null): string | undefined => {
  if (!user) return undefined;
  return user.nameid || user.sub || user.userId || undefined;
};

export interface ProfileInfo {
  userId: string;
  userName: string;
  firstName: string;
  lastName: string;
  fullName: string;
  profilePicture: string | null;
  bio?: string;
  followersCount: number;
  followingCount: number;
}

interface AuthContextType {
  token: string | null;
  user: DecodedToken | null;
  baseUrl: string;
  role: string | null;
  login: (accessToken: string) => void;
  logout: () => void;
  isAuthLoading: boolean;
  profileInfo: ProfileInfo | null;
  setProfileInfo: (profile: ProfileInfo | null) => void;
  refresh_data: any | null;
  setrerefresh_data: (data: any | null) => void;
  myStories: any[];
  fetchMyStories: () => Promise<void>;
  storiesLoading: boolean;
  favoriteIds: Set<number>;
  toggleFavoriteId: (id: number, add: boolean) => void;
  refreshFavoriteIds: () => Promise<void>;
  syncFavoriteIds: (ids: number[]) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const baseUrl = "http://localhost:5000/api";
const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [token, setTokenState] = useState<string | null>(null);
 useEffect(() => {
  externalSetTokenState = setTokenState;
}, []);

  const [user, setUser] = useState<DecodedToken | null>(null);
 useEffect(() => {
  const tryRefresh = async () => {
    try {
      const newAccessToken = await refreshToken();

      if (newAccessToken) {
        setToken(newAccessToken);

        // React state
        setTokenState(newAccessToken);

        console.log("refresh success", newAccessToken);
      } else {
        // refresh token unAuthrized
        setToken(null);
        setTokenState(null);
        console.log("refresh failed");
      }
    } catch (err) {
      setToken(null);
      setTokenState(null);
      console.log("refresh failed", err);
    } finally {
      setIsAuthLoading(false);
    }
  };

  tryRefresh();
}, []);




  useEffect(() => {
    const accessToken = token || getToken();
    if (!accessToken) {
      setUser(null);

      return;
    }

    try {
      const decoded = jwtDecode<DecodedToken>(accessToken);
      setUser(decoded);
    } catch {
      setUser(null);
    }
     setIsAuthLoading(false);
  }, [token]);

  const [profileInfo, setProfileInfo] = useState<ProfileInfo | null>(null);
  const [refresh_data, setrerefresh_data] = useState<any | null>(null);
  const [myStories, setMyStories] = useState<any[]>([]);
  const [storiesLoading, setStoriesLoading] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set());

  const refreshFavoriteIds = async () => {
    const accessToken = getToken();
    if (!accessToken) return;
    try {
      const res = await api.get(`/favourite/property`);
      const items = res.data?.data?.items ?? res.data?.data ?? [];
      const ids = new Set<number>(
        (Array.isArray(items) ? items : []).map((item: any) => Number(item.propertyId))
      );
      setFavoriteIds(ids);
    } catch {}
  };

  const syncFavoriteIds = useCallback((ids: number[]) => {
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      ids.forEach((id) => next.add(Number(id)));
      return next;
    });
  }, []);

  const toggleFavoriteId = (id: number, add: boolean) => {
    const numId = Number(id);
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      if (add) next.add(numId);
      else next.delete(numId);
      return next;
    });
  };
//   useEffect(() => {
//   const tryRefresh = async () => {
//     try {
//       const res = await api.post("/Auth/refresh-token");
//       const newAccessToken = res.data.accessToken;

//       setToken(newAccessToken);      
//       setTokenState(newAccessToken); 
//     } catch {
//       setToken(null);
//       setTokenState(null);
//     }
//   };

//   tryRefresh();
// }, []);

  useEffect(() => {
    if (token){
 refreshFavoriteIds();
    }

   
  }, [token]);

  const login = (accessToken: string) => {
    setToken(accessToken);
    setTokenState(accessToken);

    try {
      const decoded = jwtDecode<DecodedToken>(accessToken);
      setUser(decoded);
    } catch {
      setUser(null);
    }
    refreshFavoriteIds();
  };

  const logout = async () => {
    try {
  
    setToken(null);
    setTokenState(null);
    setUser(null);
    setProfileInfo(null);
    setFavoriteIds(new Set());
    setMyStories([]);
    } catch (error) {
      
    }
  
  };

  const fetchMyStories = async () => {
    const accessToken = getToken();
    if (!accessToken || !user) return;

    try {
      setStoriesLoading(true);
      const res = await api.get(`/stories/my-stories`);

      if (res.data?.success && Array.isArray(res.data.data)) {
        const activeStories = res.data.data.filter((story: any) => {
          if (!story.isActive) return false;
          const validSlides = story.slides?.filter((slide: any) =>
            slide.mediaUrl && slide.mediaUrl.trim() !== ""
          ) || [];
          return validSlides.length > 0;
        });

        setMyStories(activeStories);
      }
    } catch {} finally {
      setStoriesLoading(false);
    }
  };

  const role = user?.role || null;

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        baseUrl,
        role,
        login,
        logout,
        isAuthLoading,
        profileInfo,
        setProfileInfo,
        refresh_data,
        setrerefresh_data,
        myStories,
        fetchMyStories,
        storiesLoading,
        favoriteIds,
        toggleFavoriteId,
        refreshFavoriteIds,
        syncFavoriteIds,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
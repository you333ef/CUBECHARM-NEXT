"use client";

import { createContext, useEffect, useState, ReactNode } from "react";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  sub: string;
  role: string;
  exp: number;
}

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
  profileInfo: ProfileInfo | null;
  setProfileInfo: (profile: ProfileInfo | null) => void;
  refresh_data: any | null;
  setrerefresh_data: (data: any | null) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const baseUrl = "http://localhost:5000/api";
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<DecodedToken | null>(null);
  const [profileInfo, setProfileInfo] = useState<ProfileInfo | null>(null);
  const [refresh_data, setrerefresh_data] = useState<any | null>(null);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) return;

    setToken(accessToken);
    try {
      const decoded = jwtDecode<DecodedToken>(accessToken);
      setUser(decoded);
    } catch {
      setToken(null);
      setUser(null);
    }
  }, []);

  const role = "admin";

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        baseUrl,
        role,
        profileInfo,
        setProfileInfo,
        refresh_data,
        setrerefresh_data,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

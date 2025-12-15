"use client";

import { createContext, useState, Dispatch, SetStateAction } from "react";

interface AuthContextType {
  role: string;
  setRole: Dispatch<SetStateAction<string>>;
}
//  First Step Creating
const AuthContext = createContext<AuthContextType | null>(null);
export const AuthProvider = ({ children }: any) => {
  const [role, setRole] = useState("admin");
//    Secend Step Providing
  return (
    <AuthContext.Provider value={{ role, setRole }}>
      {children}
    </AuthContext.Provider>
  );
};
export default AuthContext;

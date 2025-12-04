import ProtectedRoute from "@/app/providers/ProtectedRoute";

export default function MessagesLayout({ children }:any) {
  return <>
  <ProtectedRoute  userOnly>
 {children}
  </ProtectedRoute>
  
 </>;
}

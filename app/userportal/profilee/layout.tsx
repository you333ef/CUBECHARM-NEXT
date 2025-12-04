import ProtectedRoute from "@/app/providers/ProtectedRoute";

export default function profileeLayout({ children }:any) {
  return <>
  <ProtectedRoute  userOnly>
 {children}
  </ProtectedRoute>
  
 </>;
}


import { useSession } from "@supabase/auth-helpers-react";
import { Navigate, Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";

export const AdminLayout = () => {
  const session = useSession();
  const isAdmin = session?.user?.email === 'hamzaishtiaq242@gmail.com';

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex h-screen bg-[#0D1117]">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

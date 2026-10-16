"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "../hooks/useSession";
import Sidebar from "./Sidebar";

// Open to everyone, and drawn without the dashboard sidebar.
const publicPaths = ["/", "/signin", "/signup", "/forgot-password"];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, ready, isAdmin } = useSession();
  const isPublic = publicPaths.includes(pathname);
  const isAdminPage = pathname.startsWith("/admin");
  const allowed = isPublic || (user && (!isAdminPage || isAdmin));

  useEffect(() => {
    if (!ready || allowed) return;
    router.replace(user ? "/" : "/signin");
  }, [ready, allowed, user, router]);

  if (isPublic) {
    return <>{children}</>;
  }
  if (!ready || !allowed) {
    return <div className="grid min-h-screen place-items-center text-gray-500">Loading...</div>;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="min-w-0 flex-1 px-4 py-6 pb-24 sm:px-8 lg:pb-8">{children}</main>
    </div>
  );
}

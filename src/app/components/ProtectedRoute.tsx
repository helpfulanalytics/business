"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user === null) {
      // Give localStorage hydration a tick before redirecting
      const t = setTimeout(() => {
        try {
          const raw = localStorage.getItem("bl_session");
          if (!raw) router.replace("/login");
        } catch {
          router.replace("/login");
        }
      }, 50);
      return () => clearTimeout(t);
    }
  }, [user, router]);

  if (!user) return null;
  return <>{children}</>;
}

"use client";

import { useEffect, useState } from "react";

export function useSessionUser() {
  const [user, setUser] = useState<any | null>(undefined);

  useEffect(() => {
    async function load() {
      try {
        const { getCurrentUser } = await import("@/app/lib/action/auth");
        const u = await getCurrentUser();
        setUser(u);
      } catch {
        setUser(null);
      }
    }
    load();
  }, []);

  return user;
}

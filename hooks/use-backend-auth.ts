"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useAuthStore } from "@/store/auth-store";
import { apiClient } from "@/lib/api-client";

interface BackendAuthResponse {
  accessToken: string;
  user: { id: string; email: string; name: string; image: string };
}

export function useBackendAuth() {
  // region [Hooks]
  const { data: session, status } = useSession();
  const { accessToken, setAccessToken } = useAuthStore();
  // endregion

  // region [Life Cycles]
  useEffect(() => {
    if (status !== "authenticated" || !session?.idToken || accessToken) return;

    const abortController = new AbortController();

    apiClient<BackendAuthResponse>("/api/v1/auth/google", {
      method: "POST",
      body: { idToken: session.idToken },
      signal: abortController.signal,
    })
      .then((data) => setAccessToken(data.accessToken))
      .catch((err) => {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setAccessToken(null);
      });

    return () => abortController.abort();
  }, [status, session?.idToken, accessToken, setAccessToken]);
  // endregion

  // region [Privates]
  async function refreshToken(idToken: string): Promise<string | null> {
    try {
      const data = await apiClient<BackendAuthResponse>("/api/v1/auth/google", {
        method: "POST",
        body: { idToken },
      });
      setAccessToken(data.accessToken);
      return data.accessToken;
    } catch {
      setAccessToken(null);
      return null;
    }
  }
  // endregion

  return { accessToken, refreshToken, isAuthenticated: !!accessToken };
}

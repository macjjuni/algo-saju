"use client";

import { useBackendAuth } from "@/hooks/use-backend-auth";

export default function BackendAuthProvider({ children }: { children: React.ReactNode }) {
  useBackendAuth();
  return <>{children}</>;
}

"use client";

import { useAuth } from "@clerk/nextjs";
import { useMemo } from "react";
import { createAuthenticatedApi } from "@/lib/api";

export function useApi() {
  const { isLoaded, isSignedIn, getToken } = useAuth();

  const api = useMemo(
    () => createAuthenticatedApi(getToken),
    [getToken],
  );

  return {
    api,
    isLoaded,
    isSignedIn,
  };
}
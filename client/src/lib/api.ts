import axios, { type AxiosInstance } from "axios";
import { normalizeApiError } from "@/lib/api-error";

export const createAuthenticatedApi = (
  getToken: () => Promise<string | null>,
): AxiosInstance => {
  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
  });

  // Retrieve a fresh Clerk token for every request.
  api.interceptors.request.use(async (config) => {
    const token = await getToken();

    if (token) {
      config.headers.set("Authorization", `Bearer ${token}`);
    } else {
      config.headers.delete("Authorization");
    }

    return config;
  });

  // Give all API failures a consistent shape.
  api.interceptors.response.use(
    (response) => response,
    (error: unknown) => Promise.reject(normalizeApiError(error)),
  );

  return api;
};
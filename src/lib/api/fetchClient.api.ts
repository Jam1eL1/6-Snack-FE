import { logout } from "@/app/actions/auth";
import { refreshAccessToken } from "./auth.api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
let refreshPromise: Promise<unknown> | null = null;

const waitForRefresh = () => {
  if (!refreshPromise) {
    refreshPromise = refreshAccessToken().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
};

export const cookieFetch = async <T>(path: string, options: RequestInit = {}, hasRetried = false): Promise<T> => {
  const method = options.method || "GET";
  // Remove this log after development is complete
  console.log(`API request: ${method} ${API_BASE_URL}${path}`);

  // Extract the fetch call into a helper function
  const request = async () => {
    // Do not set Content-Type for FormData so the browser can set the boundary automatically
    const isFormData = options.body instanceof FormData;

    return await fetch(`${API_BASE_URL}${path}`, {
      credentials: "include",
      cache: "no-store",
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...(options.headers || {}),
      },
      ...options,
    });
  };

  let response = await request();

  const isRefreshRequest = path === "/auth/refresh-token";

  if (response.status === 401 && !isRefreshRequest && !hasRetried) {
    try {
      console.log("Attempting to refresh access token");
      await waitForRefresh();
      return cookieFetch<T>(path, options, true);
    } catch (refreshError) {
      console.error("Access token refresh failed:", refreshError);
      await logout();
      throw new Error("Your session has expired. Please log in again.");
    }
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  if (response.status === 204) {
    return null as T;
  }

  return response.json() as Promise<T>;
};

export const defaultFetch = async <T>(path: string, options: RequestInit = {}): Promise<T> => {
  const method = options.method || "GET";
  console.log(`API request: ${method} ${API_BASE_URL}${path}`);

  const response = await fetch(`${API_BASE_URL}${path}`, {
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  if (response.status === 204) {
    return null as T;
  }
  const data = await response.json();
  return data as T;
};

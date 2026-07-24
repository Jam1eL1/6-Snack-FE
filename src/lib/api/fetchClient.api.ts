import { refreshAccessToken } from "./auth.api";
import { SessionExpiredError } from "./auth.errors";
import { ApiError } from "./api.errors";

type CookieFetchOptions = RequestInit & { shouldRefreshOn401?: boolean };
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
let refreshPromise: Promise<unknown> | null = null;

const createApiError = async (response: Response) => {
  const data: unknown = await response.json().catch(() => null);
  const message =
    typeof data === "object" &&
    data !== null &&
    "message" in data &&
    typeof data.message === "string"
      ? data.message
      : `HTTP error! status: ${response.status}`;

  return new ApiError(message, response.status, data);
};

const waitForRefresh = () => {
  if (!refreshPromise) {
    refreshPromise = refreshAccessToken().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
};

export const cookieFetch = async <T>(
  path: string,
  options: CookieFetchOptions = {},
  hasRetried = false,
): Promise<T> => {
  const { shouldRefreshOn401 = true, ...requestOptions } = options;
  // Keep the fetch call in a helper so retries reuse the same request setup.
  const request = async () => {
    // Let the browser set the multipart boundary for FormData requests.
    const isFormData = requestOptions.body instanceof FormData;

    return await fetch(`${API_BASE_URL}${path}`, {
      credentials: "include",
      cache: "no-store",
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...(requestOptions.headers || {}),
      },
      ...requestOptions,
    });
  };

  const response = await request();

  if (response.status === 401 && shouldRefreshOn401 && !hasRetried) {
    try {
      console.log("Attempting to refresh access token");
      await waitForRefresh();
      return cookieFetch<T>(path, options, true);
    } catch (refreshError) {
      console.error("Access token refresh failed:", refreshError);
      throw new SessionExpiredError();
    }
  }

  if (!response.ok) {
    throw await createApiError(response);
  }

  if (response.status === 204) {
    return null as T;
  }

  return response.json() as Promise<T>;
};

export const defaultFetch = async <T>(path: string, options: RequestInit = {}): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    throw await createApiError(response);
  }

  if (response.status === 204) {
    return null as T;
  }
  const data = await response.json();
  return data as T;
};

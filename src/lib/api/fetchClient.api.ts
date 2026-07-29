import { refreshAccessToken } from "./auth.api";
import { SessionExpiredError } from "./auth.errors";
import { ApiError } from "./api.errors";

type CookieFetchOptions = RequestInit & { shouldRefreshOn401?: boolean };
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
let refreshPromise: Promise<unknown> | null = null;

const createApiError = async (response: Response) => {
  const data: unknown = await response.json().catch(() => null);
  const message =
    typeof data === "object" && data !== null && "message" in data && typeof data.message === "string"
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
  const headers = new Headers(requestOptions.headers);

  if (requestOptions.body instanceof FormData) {
    headers.delete("Content-Type");
  } else if (requestOptions.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  // Keep the fetch call in a helper so retries reuse the same request setup.
  const request = async () => {
    // Let the browser set the multipart boundary for FormData requests.

    return await fetch(`${API_BASE_URL}${path}`, {
      ...requestOptions,
      credentials: "include",
      cache: "no-store",
      headers,
    });
  };

  const response = await request();

  if (response.status === 401 && shouldRefreshOn401 && !hasRetried) {
    try {
      await waitForRefresh();
      return cookieFetch<T>(path, options, true);
    } catch {
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

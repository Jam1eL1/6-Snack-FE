import { cookieFetch } from "./fetchClient.api";

export const loginApi = async (email: string, password: string) => {
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    credentials: "include",
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Login failed.");
  }
  const result = await response.json();
  return result.user ? result.user : result;
};

export const logoutApi = async () => {
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
  await fetch(`${BASE_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
};

export const refreshAccessToken = async () => {
  return cookieFetch("/auth/refresh-token", {
    method: "POST",
  });
};

export type TSignUpWithInviteResponse = {
  message: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
};

export const signUpWithInviteApi = async (
  inviteId: string,
  password: string,
  passwordConfirm: string,
): Promise<TSignUpWithInviteResponse> => {
  return cookieFetch(`/auth/signup/${inviteId}`, {
    method: "POST",
    body: JSON.stringify({
      password,
      passwordConfirm,
    }),
  });
};

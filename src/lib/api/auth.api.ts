import { TUser } from "@/types/auth.types";
import { cookieFetch } from "./fetchClient.api";

export type TSignUpWithInviteResponse = {
  message: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
};

export type TLoginResponse = {
  message: string;
  user: TUser;
};

type TLogoutResponse = {
  message: string;
};

type TRefreshAccessTokenResponse = {
  message: string;
};

export const login = async (email: string, password: string): Promise<TUser> => {
  const response = await cookieFetch<TLoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
    shouldRefreshOn401: false,
  });
  return response.user;
};

export const logout = async (): Promise<void> => {
  await cookieFetch<TLogoutResponse>("/auth/logout", {
    method: "POST",
    shouldRefreshOn401: false,
  });
};

export const refreshAccessToken = async (): Promise<TRefreshAccessTokenResponse> => {
  return cookieFetch<TRefreshAccessTokenResponse>("/auth/refresh-token", {
    method: "POST",
    shouldRefreshOn401: false,
  });
};

export const signUpWithInvite = async (
  inviteId: string,
  password: string,
  passwordConfirm: string,
): Promise<TSignUpWithInviteResponse> => {
  return cookieFetch<TSignUpWithInviteResponse>(`/auth/signup/${inviteId}`, {
    method: "POST",
    body: JSON.stringify({
      password,
      passwordConfirm,
    }),
  });
};

import { TUser } from "@/types/auth.types";
import { cookieFetch } from "./fetchClient.api";

// 사용자 관련 API 함수들
export const getUser = async (): Promise<TUser> => {
  const res = await cookieFetch<{ user: TUser }>("/users/me");
  return res.user;
};

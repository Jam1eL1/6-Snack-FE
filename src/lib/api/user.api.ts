import { TUser } from "@/types/auth.types";
import { cookieFetch } from "./fetchClient.api";

// User-related API helpers
export const getUser = async (): Promise<TUser> => {
  const res = await cookieFetch<{ user: TUser }>("/users/me");
  return res.user;
};

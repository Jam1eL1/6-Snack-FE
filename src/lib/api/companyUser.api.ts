import { cookieFetch } from "@/lib/api/fetchClient.api";
import { TMemberItem } from "@/types/memberList.types";

type TFetchUsersParams = {
  name?: string;
  limit?: number;
  cursor?: string;
};

type TFetchUsersResponse = {
  users: TMemberItem[];
  nextCursor: string | null;
};

type TApiResponse = {
  users: TMemberItem[];
  nextCursor?: string | null;
};

export const fetchAllCompanyUsers = async (params?: TFetchUsersParams): Promise<TFetchUsersResponse> => {
  const query = new URLSearchParams();

  if (params?.name) query.set("name", params.name);
  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.cursor) query.set("cursor", params.cursor);

  const res = await cookieFetch<TApiResponse>(`/super-admin/users?${query.toString()}`);

  return {
    users: res.users,
    nextCursor: res.nextCursor ?? null,
  };
};

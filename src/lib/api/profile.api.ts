import { cookieFetch } from "./fetchClient.api";

export type TUpdateCompanyInfoRequest = {
  companyName?: string;
  passwordData?: {
    newPassword: string;
    newPasswordConfirm: string;
  };
};

type TUpdateCompanyInfoResponse = {
  message: string;
  company: {
    id: number;
    name: string;
  };
};

export type TUpdatePasswordRequest = {
  newPassword: string;
  newPasswordConfirm: string;
};

type TUpdatePasswordResponse = {
  message: string;
};

export async function updateCompanyInfo(
  userId: string,
  data: TUpdateCompanyInfoRequest,
): Promise<TUpdateCompanyInfoResponse> {
  return await cookieFetch<TUpdateCompanyInfoResponse>(`/super-admin/users/${userId}/company`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function updatePassword(userId: string, data: TUpdatePasswordRequest): Promise<TUpdatePasswordResponse> {
  return await cookieFetch<TUpdatePasswordResponse>(`/users/${userId}/password`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

import { cookieFetch } from "./fetchClient.api";

export type TUpdateCompanyInfoRequest = {
  companyName?: string;
  passwordData?: {
    newPassword: string;
    newPasswordConfirm: string;
  };
};

export type TUpdateCompanyInfoResponse = {
  message: string;
  company: {
    id: number;
    name: string;
  };
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

export async function updatePassword(userId: string, password: string) {
  return await cookieFetch(`/users/${userId}/password`, {
    method: "PATCH",
    body: JSON.stringify({
      newPassword: password,
      newPasswordConfirm: password,
    }),
  });
}

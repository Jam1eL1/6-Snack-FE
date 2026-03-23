import { cookieFetch } from "./fetchClient.api";

export async function updateCompany(userId: string, company: string) {
  return await cookieFetch(`/super-admin/users/${userId}/company`, {
    method: "PATCH",
    body: JSON.stringify({
      companyName: company,
    }),
  });
}

export async function updateSuper(userId: string, company: string, password: string) {
  return await cookieFetch(`/super-admin/users/${userId}/company`, {
    method: "PATCH",
    body: JSON.stringify({
      companyName: company,
      passwordData: {
        newPassword: password,
        newPasswordConfirm: password,
      },
    }),
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

import { cookieFetch } from "@/lib/api/fetchClient.api";
import { TUserRole } from "@/types/inviteMemberModal.types";

type TDeleteUserResponse = {
  message: string;
};

type TUpdateUserRoleResponse = {
  message: string;
};

export const deleteUserById = async (userId: string): Promise<TDeleteUserResponse> => {
  const res = await cookieFetch<TDeleteUserResponse>(`/super-admin/users/${userId}`, {
    method: "DELETE",
  });
  return res;
};

export const updateUserRole = async (userId: string, role: TUserRole): Promise<TUpdateUserRoleResponse> => {
  const res = await cookieFetch<TUpdateUserRoleResponse>(`/super-admin/users/${userId}/role`, {
    method: "PATCH",
    body: JSON.stringify({ role }),
  });
  return res;
};

export const superAdminSignUp = async (data: {
  email: string;
  name: string;
  companyName: string;
  bizNumber: string;
  password: string;
  passwordConfirm: string;
}) => {
  return cookieFetch("/auth/signup", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

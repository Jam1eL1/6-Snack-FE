import { cookieFetch } from "@/lib/api/fetchClient.api";
import { TUserRole } from "@/types/inviteMemberModal.types";

type TDeleteUserResponse = {
  message: string;
};

type TUpdateUserRoleResponse = {
  message: string;
};

type TSuperAdminSignUpRequest = {
  email: string;
  name: string;
  companyName: string;
  bizNumber: string;
  password: string;
  passwordConfirm: string;
};

type TSuperAdminSignUpResponse = {
  message: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
  company: {
    id: number;
    name: string;
  };
  monthlyBudget: {
    id: number;
    year: number;
    month: number;
    currentMonthExpense: number;
    currentMonthBudget: number;
    monthlyBudget: number;
  };
};

export const deleteUserById = (userId: string): Promise<TDeleteUserResponse> => {
  return cookieFetch<TDeleteUserResponse>(`/super-admin/users/${userId}`, {
    method: "DELETE",
  });
};

export const updateUserRole = (userId: string, role: TUserRole): Promise<TUpdateUserRoleResponse> => {
  return cookieFetch<TUpdateUserRoleResponse>(`/super-admin/users/${userId}/role`, {
    method: "PATCH",
    body: JSON.stringify({ role }),
  });
};

export const superAdminSignUp = async (data: TSuperAdminSignUpRequest): Promise<TSuperAdminSignUpResponse> => {
  return cookieFetch<TSuperAdminSignUpResponse>("/auth/signup", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

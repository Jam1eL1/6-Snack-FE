import { cookieFetch } from "./fetchClient.api";

export type TInviteInfo = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "USER";
  expiresAt: string;
  isUsed: boolean;
};

// 초대 정보 조회
export const getInvite = async (inviteId: string): Promise<TInviteInfo> => {
  return cookieFetch(`/invite/${inviteId}`);
};

export type TInviteRequestData = {
  email: string;
  name: string;
  role: "USER" | "ADMIN";
  companyId: number;
  invitedById: string;
  expiresInDays?: number;
};

export type TInviteResponse = {
  message: string;
  inviteId: string;
  inviteLink: string;
  expiresAt: string;
  emailSent: boolean;
  emailError?: string;
};

export const sendInvite = async (data: TInviteRequestData): Promise<TInviteResponse> => {
  return cookieFetch(`/invite`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};

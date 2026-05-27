import {
  TUpdateCompanyInfoRequest,
  TUpdatePasswordRequest,
  updateCompanyInfo,
  updatePassword,
} from "@/lib/api/profile.api";
import { queryKeys } from "@/lib/queryKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateCompanyInfo = ({
  onUpdateCompanyInfoSuccess,
  onUpdateCompanyInfoError,
}: {
  onUpdateCompanyInfoSuccess?: () => void;
  onUpdateCompanyInfoError?: (error: Error) => void;
} = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, payload }: { userId: string; payload: TUpdateCompanyInfoRequest }) =>
      updateCompanyInfo(userId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user.all });
      onUpdateCompanyInfoSuccess?.();
    },
    onError: (error) => {
      onUpdateCompanyInfoError?.(error);
    },
  });
};

export const useUpdatePassword = ({
  onUpdatePasswordSuccess,
  onUpdatePasswordError,
}: {
  onUpdatePasswordSuccess?: () => void;
  onUpdatePasswordError?: (error: Error) => void;
} = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, payload }: { userId: string; payload: TUpdatePasswordRequest }) =>
      updatePassword(userId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user.all });
      onUpdatePasswordSuccess?.();
    },
    onError: (error) => {
      onUpdatePasswordError?.(error);
    },
  });
};

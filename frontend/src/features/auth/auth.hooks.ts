"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/constants/query-keys";
import { authApi } from "@/features/auth/auth.api";

export const useLoginMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (session) => {
      queryClient.setQueryData(queryKeys.authUser, session.user);
    },
  });
};

export const useRegisterMutation = () => useMutation({ mutationFn: authApi.registerCustomer });
export const useCaptainRegisterMutation = () => useMutation({ mutationFn: authApi.registerCaptain });
export const useChangePasswordMutation = () => useMutation({ mutationFn: authApi.changePassword });

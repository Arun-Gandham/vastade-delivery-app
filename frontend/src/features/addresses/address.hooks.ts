"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/constants/query-keys";
import { addressApi } from "@/features/addresses/address.api";

export const useAddressesQuery = () =>
  useQuery({
    queryKey: queryKeys.addresses,
    queryFn: addressApi.list,
  });

export const useAddressMutations = () => {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: queryKeys.addresses });

  return {
    create: useMutation({ mutationFn: addressApi.create, onSuccess: invalidate }),
    update: useMutation({
      mutationFn: ({ addressId, payload }: { addressId: string; payload: Parameters<typeof addressApi.update>[1] }) =>
        addressApi.update(addressId, payload),
      onSuccess: invalidate,
    }),
    remove: useMutation({ mutationFn: addressApi.remove, onSuccess: invalidate }),
    setDefault: useMutation({ mutationFn: addressApi.setDefault, onSuccess: invalidate }),
  };
};

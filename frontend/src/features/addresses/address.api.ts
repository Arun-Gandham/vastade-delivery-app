import { unwrapResponse } from "@/lib/api/api-client";
import api from "@/lib/api/api-client";
import type { Address } from "@/types/domain";
import type { AddressInput } from "@/features/addresses/address.validation";

export const addressApi = {
  list: () => unwrapResponse<Address[]>(api.get("/customer/addresses")),
  create: (payload: AddressInput) => unwrapResponse<Address>(api.post("/customer/addresses", payload)),
  update: (addressId: string, payload: AddressInput) =>
    unwrapResponse<Address>(api.patch(`/customer/addresses/${addressId}`, payload)),
  remove: (addressId: string) => unwrapResponse<null>(api.delete(`/customer/addresses/${addressId}`)),
  setDefault: (addressId: string) =>
    unwrapResponse<Address>(api.patch(`/customer/addresses/${addressId}/default`)),
};

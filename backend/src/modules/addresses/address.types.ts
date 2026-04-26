export interface AddressFilters {
  customerId: string;
}

export interface AddressCreateInput {
  fullName: string;
  mobile: string;
  houseNo: string;
  street: string;
  landmark?: string;
  village: string;
  mandal?: string;
  district?: string;
  state?: string;
  pincode: string;
  latitude?: number;
  longitude?: number;
  addressType: "HOME" | "WORK" | "OTHER";
  isDefault?: boolean;
}

export type AddressUpdateInput = Partial<AddressCreateInput>;

export interface ShopQuery {
  village?: string;
  pincode?: string;
}

export interface ShopCreateInput {
  ownerId: string;
  name: string;
  mobile: string;
  email?: string;
  address: string;
  village: string;
  pincode: string;
  latitude?: number;
  longitude?: number;
  openingTime?: string;
  closingTime?: string;
  licenseNumber?: string;
  gstNumber?: string;
}

export type ShopUpdateInput = Partial<ShopCreateInput> & {
  isOpen?: boolean;
  isActive?: boolean;
};

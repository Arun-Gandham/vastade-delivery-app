export interface ProductListQuery {
  shopId?: string;
  categoryId?: string;
  search?: string;
  page?: number | string;
  limit?: number | string;
}

export interface ProductCreateInput {
  categoryId: string;
  name: string;
  description?: string;
  brand?: string;
  unit: string;
  unitValue?: number;
  mrp: number;
  sellingPrice: number;
  barcode?: string;
  imageUrl?: string;
}

export type ProductUpdateInput = Partial<ProductCreateInput> & {
  isActive?: boolean;
};

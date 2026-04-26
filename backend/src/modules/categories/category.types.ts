export interface CategoryCreateInput {
  name: string;
  imageUrl?: string;
  parentId?: string | null;
  sortOrder?: number;
}

export type CategoryUpdateInput = Partial<CategoryCreateInput> & {
  isActive?: boolean;
};

export type ApiMeta = {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
};

export type ApiSuccessResponse<T> = {
  success: true;
  message: string;
  data: T;
  meta?: ApiMeta;
};

export type ApiErrorItem = {
  field?: string;
  message: string;
};

export type ApiErrorResponse = {
  success: false;
  message: string;
  errorCode?: string;
  errors?: ApiErrorItem[];
};

export type Paginated<T> = {
  items: T[];
  meta?: ApiMeta;
};

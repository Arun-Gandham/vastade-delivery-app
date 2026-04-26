export const getPagination = (page?: number | string, limit?: number | string) => {
  const safePage = Math.max(Number(page ?? 1), 1);
  const safeLimit = Math.min(Math.max(Number(limit ?? 20), 1), 100);

  return {
    page: safePage,
    limit: safeLimit,
    skip: (safePage - 1) * safeLimit
  };
};

export const buildMeta = (page: number, limit: number, total: number) => ({
  page,
  limit,
  total,
  totalPages: Math.ceil(total / limit) || 1
});

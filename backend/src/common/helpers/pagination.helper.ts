import { DEFAULT_LIMIT, DEFAULT_PAGE, MAX_LIMIT } from "../constants";

export interface PaginationOptions {
  page?: number;
  limit?: number;
}

export const getPagination = ({
  page = DEFAULT_PAGE,
  limit = DEFAULT_LIMIT,
}: PaginationOptions) => {
  const currentPage = Math.max(page, DEFAULT_PAGE);

  const currentLimit = Math.min(
    Math.max(limit, DEFAULT_LIMIT),
    MAX_LIMIT
  );

  return {
    page: currentPage,
    limit: currentLimit,
    skip: (currentPage - 1) * currentLimit,
  };
};
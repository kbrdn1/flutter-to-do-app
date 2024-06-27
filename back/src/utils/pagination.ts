// Utils for pagination - pagination.ts
export const getPagesCount = (total: number, limit: number): number => {
  if (total === 0) return 1;
  if (total <= limit) return 1;
  return Math.ceil(total / limit);
};

export const getPagesUrls = (
  pagesCount: number,
  currentPage: number,
  baseUrl: string,
): string[] => {
  const pages = [];
  for (let i = 1; i <= pagesCount; i++) {
    if (i === currentPage) continue;

    let url = baseUrl;
    if (url.includes("page")) url = url.split("page")[0].slice(0, -1);

    if (url.includes("?")) pages.push(`${url}&page=${i}`);
    else pages.push(`${url}?page=${i}`);
  }
  return pages;
};

export const getOffset = (page: number, limit: number): number => {
  if (page === 1) return 0;
  return (page - 1) * limit;
};

export const getCurrentPage = (page: number, pagesCount: number): number => {
  if (page < 1) return 1;
  if (page > pagesCount) return pagesCount;
  return page;
};

export const getPage = (page: string): number => {
  if (Number.isNaN(Number(page))) return 1;
  return Number(page);
};

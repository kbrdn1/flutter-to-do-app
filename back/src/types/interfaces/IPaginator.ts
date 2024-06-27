// Type interface definition for Pagination - IPaginator.d.ts
interface IPaginator<T> {
  items: T[];
  meta: Metadata;
}

type Metadata = {
  total: number;
  pagesCount: number;
  currentPage: number;
  limit: number;
  pages: string[];
};

export default IPaginator;
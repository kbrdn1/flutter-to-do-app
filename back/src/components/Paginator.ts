// Paginator component for pagination - Paginator.ts
import type { User } from "@/types/models";
import type { IPaginator } from "@/types/interfaces";
import {
  getPagesCount,
  getPagesUrls,
  getOffset,
  getCurrentPage,
  getPage,
} from "@/utils";
import AbstractCRUDService from "./abstracts/AbstractCRUDService";

const Paginator = async (
  params: Record<string, string>,
  service: AbstractCRUDService<any>,
  url: string,
): Promise<IPaginator<User[]>> => {
  const { limit, page, orderBy, order, trash } = params;

  const count: number = await service.count({
    filters: params,
    trash: trash === "true",
  });
  const pagesCount = getPagesCount(count, limit ? Number(limit) : 50);
  const currentPage: number = getCurrentPage(
    page ? getPage(page) : 1,
    pagesCount,
  );

  const items = await service.getAll({
    filters: params,
    limit: limit ? Number(limit) : 50,
    offset: getOffset(currentPage, limit ? Number(limit) : 50),
    orderBy,
    order,
    trash: trash === "true",
  });

  const pages = getPagesUrls(pagesCount, currentPage, url);

  const pagination: IPaginator<User[]> = {
    items,
    meta: {
      total: count,
      pagesCount,
      currentPage,
      limit: limit ? Number(limit) : 50,
      pages,
    },
  };

  return pagination;
};

export default Paginator;

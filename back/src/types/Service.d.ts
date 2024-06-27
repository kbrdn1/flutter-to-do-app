// Type definition for Services classes - Service.d.ts
type getAll = {
  filters?: Record<string, string>;
  limit?: number;
  offset?: number;
  orderBy?: string;
  order?: string;
  trash?: boolean;
};

type count = {
  filters?: Record<string, string>;
  trash?: boolean;
};

type get = number;

type create = any;

type update = {
  id: number;
  data?: any;
};

type destroy = number;

type destroyMany = {
  message: string;
  ids: destroy[];
};

export { getAll, count, get, create, update, destroy, destroyMany };

// Abstract CRUD Service for all models - AbstractCRUDService.ts
import { getAll, count, get, create, update, destroy, destroyMany } from "@/types";

abstract class AbstractCRUDService<T> {
  protected prisma: any;
  public abstract getAll(params: getAll): Promise<T[]>;
  public abstract count(params: count): Promise<number>;
  public abstract get(id: get): Promise<T>;
  public abstract create(data: create): Promise<T>;
  public abstract update(params: update): Promise<T>;
  public abstract destroy(id: destroy): Promise<T>;
  public abstract destroyMany(ids: destroy[]): Promise<destroyMany>;
  protected abstract ressource(data: any): Promise<T> | T;
  protected abstract manyRessource(data: any[]): Promise<T[]> | T[];
}

export default AbstractCRUDService;
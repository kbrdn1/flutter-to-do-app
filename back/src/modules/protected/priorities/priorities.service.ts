// Service for priorities - priorities.service.ts
import { orm } from "@/middlewares";
import { HTTPException } from "hono/http-exception";
import prioritiesRessource from "./priorities.ressource";
import { getAll, count, get, create, update, destroy } from "@/types";
import { Priority } from "@/types/models";
import AbstractCRUDService from "@/components/abstracts/AbstractCRUDService";
import { capitalizeFirstLetter } from "@/utils";

class PrioritiesService extends AbstractCRUDService<Priority> {
  private priorities = orm.priorities;

  public getAll = async ({
    filters,
    limit,
    offset,
    orderBy,
    order,
    trash,
  }: getAll) => {
    const { name, level } = filters ?? {};

    const priorities = await this.priorities.findMany({
      where: {
        AND: [
          name ? { name: { contains: name } } : {},
          level ? { level: { equals: Number(level) } } : {},
          trash
            ? { deleted_at: { not: null } }
            : { deleted_at: { equals: null } },
        ],
      },
      skip: offset ?? undefined,
      orderBy: [{ [orderBy ?? "created_at"]: order ?? "desc" }],
      take: limit ? Number(limit) : undefined,
    });

    return await this.manyRessource(priorities);
  };

  public count = async ({ filters, trash }: count) => {
    const { name, level } = filters ?? {};

    return await this.priorities.count({
      where: {
        AND: [
          name ? { name: { contains: name } } : {},
          level ? { level: { equals: Number(level) } } : {},
          trash
            ? { deleted_at: { not: null } }
            : { deleted_at: { equals: null } },
        ],
      },
    });
  };

  public get = async (id: get) => {
    if (!id) throw new HTTPException(400, { message: "Id is required" });

    const priority = await this.priorities.findUnique({ where: { id } });

    if (!priority)
      throw new HTTPException(404, { message: "Priority not found" });

    return await this.ressource(priority);
  };

  public create = async (data: create) => {
    const { name, level } = data;

    data.name = this.formatName(name);
    data.level = Number(level);

    const priority = await this.priorities.create({ data });

    if (!priority)
      throw new HTTPException(500, { message: "Failed to create priority" });

    return await this.ressource(priority);
  };

  public update = async ({ id, data }: update) => {
    if (!id) throw new HTTPException(400, { message: "Id is required" });

    const priority = await this.priorities.findUnique({ where: { id } });

    if (!priority)
      throw new HTTPException(404, { message: "Priority not found" });

    const { name, level } = data;

    if (name) data.name = this.formatName(name);

    if (level) data.level = Number(level);

    const updatedPriorities = await this.priorities.update({
      where: { id },
      data,
    });

    return await this.ressource(updatedPriorities);
  };

  public destroy = async (id: destroy) => {
    if (!id) throw new HTTPException(400, { message: "Id is required" });

    const priority = await this.priorities.delete({ where: { id } });

    if (!priority)
      throw new HTTPException(500, { message: "Failed to delete priority" });

    return await this.ressource(priority);
  };

  public destroyMany = async (ids: destroy[]) => {
    if (!ids) throw new HTTPException(400, { message: "Ids are required" });

    const priorities = await this.priorities.deleteMany({
      where: { id: { in: ids } },
    });

    if (!priorities)
      throw new HTTPException(500, { message: "Failed to delete Priorities" });

    return {
      message: "Priorities deleted",
      ids,
    };
  };

  protected ressource = async (priorities: any) => {
    return await prioritiesRessource(priorities);
  };

  protected manyRessource = async (prioritiess: any[]) => {
    const result = prioritiess.map(
      async (priorities: any) => await prioritiesRessource(priorities),
    );
    return await Promise.all(result);
  };

  private formatName = (str: string) => {
    return capitalizeFirstLetter(str);
  };
}

export default new PrioritiesService();

// Service for tag - tag.service.ts
import { orm } from "@/middlewares";
import { HTTPException } from "hono/http-exception";
import tagRessource from "./tags.ressource";
import { getAll, count, get, create, update, destroy } from "@/types";
import { Tag } from "@/types/models";
import AbstractCRUDService from "@/components/abstracts/AbstractCRUDService";
import { capitalizeFirstLetter } from "@/utils";

class TagsService extends AbstractCRUDService<Tag> {
  private tags = orm.tags;

  public getAll = async ({
    filters,
    limit,
    offset,
    orderBy,
    order,
    trash,
  }: getAll) => {
    const { name } = filters ?? {};

    const tags = await this.tags.findMany({
      where: {
        AND: [
          name ? { name: { contains: name } } : {},
          trash
            ? { deleted_at: { not: null } }
            : { deleted_at: { equals: null } },
        ],
      },
      skip: offset ?? undefined,
      orderBy: [{ [orderBy ?? "created_at"]: order ?? "desc" }],
      take: limit ? Number(limit) : undefined,
    });

    return await this.manyRessource(tags);
  };

  public count = async ({ filters, trash }: count) => {
    const { name } = filters ?? {};

    return await this.tags.count({
      where: {
        AND: [
          name ? { name: { contains: name } } : {},
          trash
            ? { deleted_at: { not: null } }
            : { deleted_at: { equals: null } },
        ],
      },
    });
  };

  public get = async (id: get) => {
    if (!id) throw new HTTPException(400, { message: "Id is required" });

    const tag = await this.tags.findUnique({ where: { id } });

    if (!tag) throw new HTTPException(404, { message: "Tag not found" });

    return await this.ressource(tag);
  };

  public create = async (data: create) => {
    const { name, color } = data;

    if (!name) throw new HTTPException(400, { message: "Name is required" });

    data.name = this.formatName(name);

    const tag = await this.tags.create({ data });

    if (!tag) throw new HTTPException(500, { message: "Failed to create Tag" });

    return await this.ressource(tag);
  };

  public update = async ({ id, data }: update) => {
    if (!id) throw new HTTPException(400, { message: "Id is required" });

    const tag = await this.tags.findUnique({ where: { id } });

    if (!tag) throw new HTTPException(404, { message: "Tag not found" });

    if (data.name) data.name = this.formatName(data.name);

    const updatedTag = await this.tags.update({
      where: { id },
      data,
    });

    return await this.ressource(updatedTag);
  };

  public destroy = async (id: destroy) => {
    if (!id) throw new HTTPException(400, { message: "Id is required" });

    const tag = await this.tags.delete({ where: { id } });

    if (!tag) throw new HTTPException(500, { message: "Failed to delete Tag" });

    return await this.ressource(tag);
  };

  public destroyMany = async (ids: destroy[]) => {
    if (!ids) throw new HTTPException(400, { message: "IDs are required" });

    const tags = await this.tags.deleteMany({
      where: { id: { in: ids } },
    });

    if (!tags)
      throw new HTTPException(500, { message: "Failed to delete tags" });

    return {
      message: "Tags deleted",
      ids,
    };
  };

  protected ressource = async (tag: any) => {
    return await tagRessource(tag);
  };

  protected manyRessource = async (tags: any[]) => {
    const result = tags.map(async (tag: any) => await tagRessource(tag));
    return await Promise.all(result);
  };

  private formatName = (name: string) => {
    return capitalizeFirstLetter(name);
  };
}

export default new TagsService();

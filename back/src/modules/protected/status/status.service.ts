// Service for status - status.service.ts
import { orm } from '@/middlewares';
import { HTTPException } from 'hono/http-exception';
import statusRessource from './status.ressource';
import { getAll, count, get, create, update, destroy } from '@/types';
import { Status } from '@/types/models';
import AbstractCRUDService from '@/components/abstracts/AbstractCRUDService';
import { capitalizeFirstLetter } from '@/utils';

class StatusService extends AbstractCRUDService<Status> {
  private status = orm.status;

  public getAll = async ({
    filters,
    limit,
    offset,
    orderBy,
    order,
    trash,
  }: getAll) => {
    const { name } = filters ?? {};

    const statuses = await this.status.findMany({
      where: {
        AND: [
          name ? { name: { contains: name } } : {},
          trash
            ? { deleted_at: { not: null } }
            : { deleted_at: { equals: null } },
        ]
      },
      skip: offset ?? undefined,
      orderBy: [{ [orderBy ?? "created_at"]: order ?? "desc" }],
      take: limit ? Number(limit) : undefined,
    });

    return await this.manyRessource(statuses);
  };

  public count = async ({ filters, trash }: count) => {
    const { name } = filters ?? {};

    return await this.status.count({
      where: {
        AND: [
          name ? { name: { contains: name } } : {},
          trash
            ? { deleted_at: { not: null } }
            : { deleted_at: { equals: null } },
        ]
      }
    });
  };

  public get = async (id: get) => {
    if (!id) throw new HTTPException(400, { message: 'Id is required' });

    const status = await this.status.findUnique({ where: { id } });

    if (!status) throw new HTTPException(404, { message: 'Status not found' });

    return await this.ressource(status);
  };

  public create = async (data: create) => {
    const { name } = data;

    data.name = this.formatName(name);

    const status = await this.status.create({ data });

    if (!status) throw new HTTPException(500, { message: 'Failed to create status' });

    return await this.ressource(status);
  };

  public update = async ({id, data}: update) => {
    if (!id) throw new HTTPException(400, { message: 'Id is required' });

    const status = await this.status.findUnique({ where: { id } });

    if (!status) throw new HTTPException(404, { message: 'Status not found' });

    data.name = this.formatName(data.name);

    const updatedStatus = await this.status.update({ where: { id }, data });

    return await this.ressource(updatedStatus);
  };

  public destroy = async (id: destroy) => {
    if (!id) throw new HTTPException(400, { message: 'Id is required' });

    const status = await this.status.delete({ where: { id } });

    if (!status) throw new HTTPException(500, { message: 'Failed to delete Status' });

    return await this.ressource(status);
  };

  public destroyMany = async (ids: destroy[]) => {
    if (!ids) throw new HTTPException(400, { message: 'Ids are required' });

    const statuses = await this.status.deleteMany({ where: { id: { in: ids } } });

    if (!statuses) throw new HTTPException(500, { message: 'Failed to delete Status' });

    return {
      message: "Statuses deleted",
      ids,
    }
  };

  protected ressource = async (status: any) => {
    return await statusRessource(status);
  };

  protected manyRessource = async (statuses: any[]) => {
    const result = statuses.map(async (status: any) => await statusRessource(status));
    return await Promise.all(result);
  };
  
  private formatName = (str: string) => {
    return capitalizeFirstLetter(str)
  }
}

export default new StatusService();

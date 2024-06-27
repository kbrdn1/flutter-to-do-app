// Service for tasks - tasks.service.ts
import { orm } from "@/middlewares";
import { HTTPException } from "hono/http-exception";
import taskRessource from "./tasks.ressource";
import { getAll, count, get, create, update, destroy } from "@/types";
import { Task } from "@/types/models";
import AbstractCRUDService from "@/components/abstracts/AbstractCRUDService";

class TasksService extends AbstractCRUDService<Task> {
  private tasks = orm.tasks;

  public getAll = async ({
    filters,
    limit,
    offset,
    orderBy,
    order,
    trash,
  }: getAll) => {
    const { content, deadline, user, status, priority } = filters ?? {};

    const tasks = await this.tasks.findMany({
      where: {
        AND: [
          content ? { content: { contains: content } } : {},
          deadline ? { deadline: { equals: deadline } } : {},
          user ? { user_id: { equals: Number(user) } } : {},
          status ? { status_id: { equals: Number(status) } } : {},
          priority ? { priority_id: { equals: Number(priority) } } : {},
          trash
            ? { deleted_at: { not: null } }
            : { deleted_at: { equals: null } },
        ],
      },
      skip: offset ?? undefined,
      orderBy: [{ [orderBy ?? "created_at"]: order ?? "desc" }],
      take: limit ? Number(limit) : undefined,
    });

    return await this.manyRessource(tasks);
  };

  public count = async ({ filters, trash }: count) => {
    const { content, deadline, user, status, priority } = filters ?? {};

    return await this.tasks.count({
      where: {
        AND: [
          content ? { content: { contains: content } } : {},
          deadline ? { deadline: { equals: deadline } } : {},
          user ? { user_id: { equals: Number(user) } } : {},
          status ? { status_id: { equals: Number(status) } } : {},
          priority ? { priority_id: { equals: Number(priority) } } : {},
          trash
            ? { deleted_at: { not: null } }
            : { deleted_at: { equals: null } },
        ],
      },
    });
  };

  public get = async (id: get) => {
    if (!id) throw new HTTPException(400, { message: "Id is required" });

    const task = await this.tasks.findUnique({ where: { id } });

    if (!task) throw new HTTPException(404, { message: "Task not found" });

    return await this.ressource(task);
  };

  public create = async (data: create) => {
    const { content, deadline, user, status, priority } = data;

    if (!content || !user)
      throw new HTTPException(400, {
        message: "Content and user are required",
      });
    
    data.user_id = await this.findUser(user);
    data.content = this.formatContent(content);
    
    if (deadline) data.deadline = new Date(deadline);
    
    if (status) data.status_id = this.findStatus(status);
    
    if (priority) data.priority_id = this.findPriority(priority);
    
    const task = await this.tasks.create({ data });

    if (!task)
      throw new HTTPException(500, { message: "Failed to create Task" });

    return await this.ressource(task);
  };

  public update = async ({ id, data }: update) => {
    if (!id) throw new HTTPException(400, { message: "Id is required" });
    
    const task = await this.tasks.findUnique({ where: { id } });

    if (!task) throw new HTTPException(404, { message: "Task not found" });

    const { content, deadline, status, priority } = data;
    
    if (content) data.content = this.formatContent(content);
    if (deadline) data.deadline = new Date(deadline);
    if (status) data.status_id = this.findStatus(status);
    if (priority) data.priority_id = this.findPriority(priority);

    const updatedTask = await this.tasks.update({
      where: { id },
      data,
    });

    return await this.ressource(updatedTask);
  };

  public destroy = async (id: destroy) => {
    if (!id) throw new HTTPException(400, { message: "Id is required" });

    const task = await this.tasks.delete({ where: { id } });

    if (!task)
      throw new HTTPException(500, { message: "Failed to delete Task" });

    return await this.ressource(task);
  };

  public destroyMany = async (ids: destroy[]) => {
    if (!ids) throw new HTTPException(400, { message: "IDs are required" });

    const tasks = await this.tasks.deleteMany({
      where: { id: { in: ids } },
    });

    if (!tasks)
      throw new HTTPException(500, { message: "Failed to delete tags" });

    return {
      message: "Tags deleted",
      ids,
    };
  };
  
  private formatContent = (content: string) => { }
  
  private findUser = async (id: number) => {
    const user = await orm.users.findUnique({ where: { id } });
    if (!user) throw new HTTPException(404, { message: "User not found" });
    return user;
  }
  
  private findStatus = async (id: number) => {
    const status = await orm.status.findUnique({ where: { id } });
    if (!status) throw new HTTPException(404, { message: "Status not found" });
    return status;
  }
  
  private findPriority = async (id: number) => {
    const priority = await orm.priorities.findUnique({ where: { id } });
    if (!priority) throw new HTTPException(404, { message: "Priority not found" });
    return priority;
  }

  protected ressource = async (tag: any) => {
    return await taskRessource(tag);
  };

  protected manyRessource = async (tags: any[]) => {
    const result = tags.map(async (tag: any) => await taskRessource(tag));
    return await Promise.all(result);
  };
}

export default new TasksService();

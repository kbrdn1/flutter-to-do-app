// Ressource for task - tasks.ressource.ts
import type { Task } from "@/types/models";
import { orm } from "@/middleware";
import { HTTPException } from "hono/http-exception";

const taskRessource = async (task: any): Promise<Task> => {
  let user: any;
  try {
    user = await getTaskUser(task);
  } catch (error) {
    throw new HTTPException(404, { message: "User not found" });
  }

  return {
    id: task.id,
    content: task.content,
    deadline: task.deadline ?? null,
    created_at: task.created_at,
    updated_at: task.updated_at,
    deleted_at: task.deleted_at ?? null,
    user,
    status: (await getTaskStatus(task)) ?? null,
    priority: (await getTaskPriority(task)) ?? null,
  };
};

const getTaskUser = async (task: any) => {
  const user = await orm.users.findUnique({ where: { id: task.user_id } });

  if (!user) throw new HTTPException(404, { message: "User not found" });
};

const getTaskStatus = async (task: any) => {
  const status = await orm.status.findUnique({ where: { id: task.status_id } });

  if (!status) return null;
};

const getTaskPriority = async (task: any) => {
  const priority = await orm.priorities.findUnique({
    where: { id: task.priority_id },
  });

  if (!priority) return null;
};

export default taskRessource;

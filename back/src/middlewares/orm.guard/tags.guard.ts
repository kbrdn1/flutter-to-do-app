// Middlewares to intercept prisma tags requests - tags.guard.ts
import { PrismaClient } from "@prisma/client";
import { HTTPException } from "hono/http-exception";

const prisma = new PrismaClient();

const tags = {
  delete: async (params: any) => {
    const tag = await prisma.tags.findUnique({
      where: { id: params.where.id },
    });

    if (!tag) throw new HTTPException(404, { message: "User not found" });

    const updatedUser = await prisma.tags.update({
      where: { id: params.where.id },
      data: { deleted_at: new Date() },
    });

    if (!updatedUser)
      throw new HTTPException(500, { message: "Failed to delete tag" });

    return updatedUser;
  },
  deleteMany: async (params: any) => {
    const tags = await prisma.tags.findMany({
      where: { id: { in: params.where.id } },
    });

    if (!tags) throw new HTTPException(404, { message: "Users not found" });

    const updatedUsers = await prisma.tags.updateMany({
      where: { id: { in: params.where.id } },
      data: { deleted_at: new Date() },
    });

    if (!updatedUsers)
      throw new HTTPException(500, { message: "Failed to delete tags" });

    return updatedUsers;
  },
};

export default tags;

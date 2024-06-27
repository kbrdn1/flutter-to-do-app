// Middlewares to intercept prisma statuses requests - status.guard.ts
import { PrismaClient } from "@prisma/client";
import { HTTPException } from "hono/http-exception";

const prisma = new PrismaClient();

const status = {
  delete: async (params: any) => {
    const status = await prisma.status.findUnique({
      where: { id: params.where.id },
    });

    if (!status) throw new HTTPException(404, { message: "User not found" });

    const updatedUser = await prisma.status.update({
      where: { id: params.where.id },
      data: { deleted_at: new Date() },
    });

    if (!updatedUser)
      throw new HTTPException(500, { message: "Failed to delete status" });

    return updatedUser;
  },
  deleteMany: async (params: any) => {
    const statuses = await prisma.status.findMany({
      where: { id: { in: params.where.id } },
    });

    if (!statuses) throw new HTTPException(404, { message: "Users not found" });

    const updatedUsers = await prisma.status.updateMany({
      where: { id: { in: params.where.id } },
      data: { deleted_at: new Date() },
    });

    if (!updatedUsers)
      throw new HTTPException(500, { message: "Failed to delete statuses" });

    return updatedUsers;
  },
};

export default status;

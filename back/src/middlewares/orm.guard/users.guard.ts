// Middlewares to intercept prisma users requests - users.guard.ts
import { PrismaClient } from "@prisma/client";
import { HTTPException } from "hono/http-exception";

const prisma = new PrismaClient();

const users = {
  delete: async (params: any) => {
    const user = await prisma.users.findUnique({
      where: { id: params.where.id },
    });

    if (!user) throw new HTTPException(404, { message: "User not found" });

    const updatedUser = await prisma.users.update({
      where: { id: params.where.id },
      data: { deleted_at: new Date() },
    });

    if (!updatedUser)
      throw new HTTPException(500, { message: "Failed to delete user" });

    return updatedUser;
  },
  deleteMany: async (params: any) => {
    const users = await prisma.users.findMany({
      where: { id: { in: params.where.id } },
    });

    if (!users) throw new HTTPException(404, { message: "Users not found" });

    const updatedUsers = await prisma.users.updateMany({
      where: { id: { in: params.where.id } },
      data: { deleted_at: new Date() },
    });

    if (!updatedUsers)
      throw new HTTPException(500, { message: "Failed to delete users" });

    return updatedUsers;
  },
};

export default users;

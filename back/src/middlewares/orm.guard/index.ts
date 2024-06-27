// Middlewares to intercept orm requests - orm.guard.ts
import { PrismaClient } from "@prisma/client";
import users from "./users.guard";
import tags from "./tags.guard";
import status from "./status.guard";

const ormMiddleware = new PrismaClient().$extends({
  model: { users, tags, status }
});

export default ormMiddleware;

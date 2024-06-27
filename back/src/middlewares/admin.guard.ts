// Middlewares to validate admin users and protect routes - admin.guard.ts
import { HTTPException } from "hono/http-exception";
import { decode } from "hono/jwt";
import { JWTregex } from "@/utils";

const adminGuard = (token: string) => {
  if (!JWTregex.test(token))
    throw new HTTPException(401, { message: "Invalid token" });

  const { payload } = decode(token.split("Bearer ")[1]);

  if (!payload) throw new HTTPException(401, { message: "Unauthorized" });
};

export default adminGuard;

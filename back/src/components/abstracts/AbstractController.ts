// Abstract controller for all models - AbstractController.ts
import { Hono } from "hono";
import { PrismaClient } from "@prisma/client";
import { HTTPException } from "hono/http-exception";
import { verifyUserToken } from "@/utils";

abstract class AbstractController {
  protected basePath: string = "/";
  protected isProtected: boolean = false;
  protected routes = new Hono().basePath(this.basePath);
  protected prisma = new PrismaClient();
  protected service: any;
  protected userGuard = verifyUserToken;
  
  constructor(basePath: string, service: any, isProtected: boolean = false) {
    this.basePath = basePath;
    this.isProtected = isProtected;
    this.routes = new Hono().basePath(this.basePath);
    this.service = service;
  }
  
  protected protect = async () => {
    return this.routes.use("/*", async (c, next) => {
      if (!this.isProtected) return await next();

      const token = c.req.header("API-Token");

      if (!token) throw new HTTPException(401, { message: "Invalid token" });

      this.userGuard(token);

      return await next();
    });
  };
  
  public router = () => {
    this.protect();

    return this.routes;
  }
}

export default AbstractController;
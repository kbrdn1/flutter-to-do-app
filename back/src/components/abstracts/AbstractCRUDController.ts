// Abstract CRUD controller for all models - AbstractController.ts
import { Hono } from "hono";
import { adminGuard } from "@/middlewares";
import { HTTPException } from "hono/http-exception";
import AbstractCRUDService from "@/components/abstracts/AbstractCRUDService";

abstract class AbstractCRUDController {
  protected basePath: string = "/";
  protected isProtected: boolean = false;
  protected routes = new Hono().basePath(this.basePath);
  protected service: AbstractCRUDService<any>;
  protected adminGuard = adminGuard;

  constructor(basePath: string, service: any, isProtected: boolean = false) {
    this.basePath = basePath;
    this.isProtected = isProtected;
    this.routes = new Hono().basePath(this.basePath);
    this.service = service;
  }

  protected protect = async () => {
    return this.routes.use("/*", async (c, next) => {
      if (!this.isProtected) return await next();

      const token = c.req.header("Authorization");

      if (!token) throw new HTTPException(401, { message: "Invalid token" });

      this.adminGuard(token);

      return await next();
    });
  };

  public abstract index(): Promise<Hono>;
  public abstract show(): Promise<Hono>;
  public abstract store(): Promise<Hono>;
  public abstract update(): Promise<Hono>;
  public abstract destroy(): Promise<Hono>;
  public abstract destroyMany(): Promise<Hono>;

  public router = () => {
    this.protect();
    this.index();
    this.show();
    this.store();
    this.update();
    this.destroy();
    this.destroyMany();

    return this.routes;
  };
}

export default AbstractCRUDController;

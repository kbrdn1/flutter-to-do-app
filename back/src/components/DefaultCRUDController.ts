// Default CRUD controller for all models - DefaultController.ts
import Paginator from "@/components/Paginator";
import { HTTPException } from "hono/http-exception";
import { destroy } from "@/types";
import AbstractCRUDController from "@/components/abstracts/AbstractCRUDController";

class DefaultCRUDController extends AbstractCRUDController {
  constructor(basePath: string, service: any, isProtected: boolean = false) {
    super(basePath, service, isProtected);
  }

  public index = async () => {
    return this.routes.get("/", async (c) => {
      const url = c.req.url;

      return c.json(await Paginator(c.req.query(), this.service, url));
    });
  };

  public show = async () => {
    return this.routes.get("/:id", async (c) => {
      const { id } = c.req.param();

      const item = await this.service.get(Number(id));

      if (!item) throw new HTTPException(404, { message: "Item not found" });

      return c.json(item);
    });
  };

  public store = async () => {
    return this.routes.post("/", async (c) => {
      const body = await c.req.json();

      const item = await this.service.create(body);

      return c.json(item, 201);
    });
  };

  public update = async () => {
    return this.routes.put("/:id", async (c) => {
      const { id } = c.req.param();
      const body = await c.req.json();

      const item = await this.service.update({ id: Number(id), data: body });

      if (!item) throw new HTTPException(404, { message: "Item not found" });

      return c.json(item);
    });
  };

  public destroy = async () => {
    return this.routes.delete("/:id", async (c) => {
      const { id } = c.req.param();
      const item = await this.service.destroy(Number(id));

      if (!item) throw new HTTPException(404, { message: "Item not found" });

      return c.json(item);
    });
  };
  
  public destroyMany = async () => {
    return this.routes.delete("/", async (c) => {
      const { ids } = await c.req.json<{ids: destroy[]}>();
      
      const item = await this.service.destroyMany(ids);

      if (!item) throw new HTTPException(404, { message: "Item not found" });

      return c.json(item);
    });
  };
}

export default DefaultCRUDController;

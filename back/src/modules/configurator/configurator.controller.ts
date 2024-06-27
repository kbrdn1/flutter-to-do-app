// Controller for configurator - configurator.controller.ts
import AbstractController from "@/components/abstracts/AbstractController";
import service from "./configurator.service";
import { HTTPException } from "hono/http-exception";

class ConfiguratorController extends AbstractController {
  constructor() {
    super("/", service, true);
  }

  public search = async () => {
    return this.routes.use("/search/:brand", async (c) => {
      const { brand } = c.req.param();
      const { collection, category, ref } = c.req.query();

      const response = await this.service.search(
        brand,
        collection,
        category,
        ref,
      );
   
      if (!response.data.data)
        throw new HTTPException(404, { message: "No product(s) found" });

      return c.json(await response.data.data, 200);
    });
  };

  public config = async () => {
    return this.routes.use("/configuration/:name", async (c) => {
      const { name } = c.req.param();
      const token = c.req.header("API-Token");

      const config = await this.service.config(name);

      return c.json(config, 200);
    });
  };

  public verify = async () => {
    return this.routes.use("/domain/verify", async (c) => {
      const { domain } = c.req.query();

      await this.service.verify(domain);

      return c.json({ message: "Domain verified" }, 200);
    });
  };

  public router = () => {
    this.protect();
    this.search();
    this.config();
    this.verify();

    return this.routes;
  };
}

export default new ConfiguratorController();

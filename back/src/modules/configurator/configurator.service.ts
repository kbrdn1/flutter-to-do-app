// Service for configurator - configurator.service.ts
import { PrismaClient } from "@prisma/client";
import { HTTPException } from "hono/http-exception";
import { JsonValue } from "@prisma/client/runtime/library";
import crypto from "crypto-js/sha256";

class ConfiguratorService {
  private prisma = new PrismaClient();
  private PIMUrl: string;
  private PIMToken: string;

  constructor() {
    this.PIMUrl = process.env.PIM_URL ?? "";
    this.PIMToken = process.env.PIM_TOKEN ?? "";

    if (!this.PIMUrl || !this.PIMToken) {
      throw new HTTPException(500, {
        message: "PIM_URL and PIM_TOKEN are required",
      });
    }
  }

  public search = async (
    brand: string,
    collection?: string,
    category?: string,
    ref?: string,
  ) => {
    const url = new URL(`${this.PIMUrl}/products`);
    url.searchParams.append("brand", brand);

    if (collection) url.searchParams.append("collection", collection);
    if (category) url.searchParams.append("category", category);
    if (ref) url.searchParams.append("ref", ref);

    // const response = await (await fetch(url, {
    //     method: "GET",
    //     headers: {
    //       Authorization: `Bearer ${this.PIMToken}`,
    //     },
    //   }));
    // return { status: response.status, data: await response.json()}
    
    return await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${this.PIMToken}`,
      },
    })
      .then(async (response) => {
        return { status: response.status, data: await response.json() };
      })
      .catch((error) => {
        throw new HTTPException(500, { message: error.message });
      });
  };

  public config = async (name: string, token: string): Promise<JsonValue> => {
    return await this.checkRelationship(token, name);
  };

  public verify = async (domain: string) => {
    if (!domain)
      throw new HTTPException(401, {
        message: "Unauthorized: Domain is required",
      });

    const domainExists = await this.prisma.website.findFirst({
      where: { domain: { contains: domain } },
    });

    if (!domainExists)
      throw new HTTPException(404, {
        message: "Unauthorized: Domain not found",
      });
  };

  private checkRelationship = async (token: string, configName: string) => {
    const user = await this.prisma.users.findFirst({
      where: { token },
    });

    if (!user)
      throw new HTTPException(401, { message: "Unauthorized: Invalid token" });

    const config = await this.prisma.config.findFirst({
      where: { name: configName },
    });

    if (!config) throw new HTTPException(404, { message: "Config not found" });

    const configToWebsite = await this.prisma.configToWebsite.findFirst({
      where: { websiteId: user.websiteId, configId: config.id },
    });

    if (!configToWebsite)
      throw new HTTPException(401, {
        message: "Unauthorized: Config not related to website",
      });

    return config.value;
  };
}

export default new ConfiguratorService();

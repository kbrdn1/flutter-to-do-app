// Conrtroller for authentication - auth.controller.ts
import { Hono } from "hono";
import service from "./auth.service";
import { User } from "@/types/models";
import { JWTregex } from "@/utils";
import { HTTPException } from "hono/http-exception";

class AuthController {
  private routes = new Hono().basePath("/auth");

  public signIn = async () => {
    return this.routes.post("/signin", async (c) => {
      const body = await c.req.json();

      const token = await service.login(body);
      return c.json({ token }, 200);
    });
  };

  public signUp = async () => {
    return this.routes.post("/signup", async (c) => {
      const body = await c.req.json<User>();
      await service.register(body);

      return c.json({ message: "User registered" }, 201);
    });
  };

  public verify = async () => {
    return this.routes.get("/verify", async (c) => {
      const token = c.req.header("Authorization");

      if (!token)
        throw new HTTPException(401, { message: "No token provided" });

      if (!JWTregex.test(token))
        throw new HTTPException(401, { message: "Invalid token" });

      await service.verify(token.split("Bearer ")[1]);

      return c.json({ message: "Valid token" }, 200);
    });
  };

  public router = () => {
    this.signIn();
    this.signUp();
    this.verify();

    return this.routes;
  };
}

export default new AuthController();

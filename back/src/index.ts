// Main entry point for the server application - index.ts
import { Server, env } from "bun";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { csrf } from "hono/csrf";
import { secureHeaders } from "hono/secure-headers";
import { logger } from "hono/logger";
// import { securityGuard, brutForceGuard } from "./middlewares";
import { controllers as protectedControllers } from "./modules/protected";
import { controllers } from "./modules";

const api = new Hono().basePath("/v1");

// const origin: string = env.CORS_ORIGIN ?? "http://localhost:5173";
// console.log('origin', origin);

api.use(cors());
api.use(csrf());
api.use(secureHeaders());
api.use(logger());
// api.use(brutForceGuard);
// api.use("/*", securityGuard);

api.get("/", (c) => {
  return c.text("Hello form Jewely Configurator API !");
});

// Loop for instanciate all protected controllers
Object.entries(protectedControllers).forEach(([_, controller]) => {
  api.route("", controller.router());
});

// Loop for instanciate all controllers
Object.entries(controllers).forEach(([_, controller]) => {
  api.route("", controller.router());
});

export default {
  port: env.PORT,
  fetch(this, request: Request, server: Server) {
    const ip = server.requestIP(request);
    return api.fetch(request, { ip });
  },
};

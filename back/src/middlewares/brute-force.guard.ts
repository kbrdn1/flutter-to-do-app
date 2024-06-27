// Middlewars for brute force attack - brut-force.guard.ts
// import { env } from "bun";
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import { BruteForceProtection } from "@/utils";

const BFGuard = new BruteForceProtection(
  Number(process.env.BRUTE_FORCE_ATTEMPTS),
  Number(process.env.BRUTE_FORCE_DURATION),
);

const bruteForceGuard = createMiddleware(async (c, next) => {
  const ip = c.env.ip;

  if (!BFGuard.has(ip))
    throw new HTTPException(429, { message: "Too many requests" });

  BFGuard.add(ip);
  BFGuard.process(ip);

  return await next();
});

export default bruteForceGuard;

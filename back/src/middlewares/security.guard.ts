// Middlewares to detect malicious requests and protect routes - security.guard.ts
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import { detectMaliciousHTML, detectSQLInjection, detectXSS } from "@/utils";

const decodeBinary = (str: string) => {
  try {
    return atob(str);
  } catch {
    return str;
  }
};

const scan = (str: string) => {
  str = decodeBinary(str);

  if (detectMaliciousHTML(str))
    throw new HTTPException(400, { message: "Malicious HTML detected" });

  if (detectSQLInjection(str))
    throw new HTTPException(400, { message: "SQL Injection detected" });

  if (detectXSS(str)) throw new HTTPException(400, { message: "XSS detected" });
};

const securityGuard = createMiddleware(async (c, next) => {
  const headers = JSON.stringify(c.req.header("Authorization"));
  const url = JSON.stringify(c.req.url);
  const query = JSON.stringify(c.req.query());
  const params = JSON.stringify(c.req.param());

  scan(headers);
  scan(url);
  scan(query);
  scan(params);

  try {
    const body = await c.req.json();
    scan(body);
  } catch {
    return await next();
  }

  return await next();
});

export default securityGuard;

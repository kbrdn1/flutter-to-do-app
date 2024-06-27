// Utils for security - security.ts
import { PrismaClient } from "@prisma/client";
import { SocketAddress } from "bun";
import { HTTPException } from "hono/http-exception";
import { verify } from "hono/jwt";

export const hashPassword = async (password: string, salt: number) => await Bun.password.hash(password, {
  algorithm: "bcrypt",
  cost: salt ?? Number(process.env.SALT_ROUNDS),
});

const prisma = new PrismaClient();

export const verifyUserToken = async (token: string) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new HTTPException(500, { message: "JWT secret not set" });

  const decodedPayload = await verify(token, secret);

  if (!decodedPayload)
    throw new HTTPException(401, { message: "Unauthorized: Invalid token" });

  const user = await prisma.users.findFirst({
    where: { email: decodedPayload.email },
  });

  if (!user)
    throw new HTTPException(401, {
      message: "Unauthorized: User not found",
    });

  if (!user.token_created_at)
    throw new HTTPException(401, {
      message: "Unauthorized: Token creation date not found",
    });

  const expirationDate = new Date(
    user.token_created_at.getTime() + 1000 * 60 * 60 * 24,
  );

  if (expirationDate < new Date())
    throw new HTTPException(401, { message: "Unauthorized: Token expired" });
};

export class BruteForceProtection {
  private attempts: number;
  private duration: number;
  private list: string[] = [];
  private whiteList: string[] = [];
  private blackList: string[] = [];

  constructor(
    max: number,
    time: number,
    whiteList: string[] = [],
    blackList: string[] = [],
  ) {
    this.attempts = max;
    this.duration = time;
    this.whiteList = whiteList;
    this.blackList = blackList;
  }

  public add = (ip: SocketAddress) => {
    if (this.whiteList.includes(ip.address)) return;
    if (this.blackList.includes(ip.address))
      throw new HTTPException(403, { message: "Forbidden" });

    this.list.push(ip.address);
  };

  protected remove = (ip: SocketAddress) => {
    this.list = this.list.filter((i) => i !== ip.address);
  };

  public has = (ip: SocketAddress) => {
    if (this.whiteList.includes(ip.address)) return true;

    if (this.blackList.includes(ip.address))
      throw new HTTPException(403, { message: "Forbidden" });

    if (this.list.filter((i) => i === ip.address).length > this.attempts)
      throw new HTTPException(429, { message: "Too many requests" });

    return true;
  };

  public process = (ip: SocketAddress) => {
    setTimeout(() => this.remove(ip), this.duration);
  };
}

export class AuthBruteForceProtection {
  private attempts: number;
  private duration: number;
  private list: string[] = [];
  private processList: string[] = [];

  constructor(max: number, time: number) {
    this.attempts = max;
    this.duration = time;
  }

  public add = (email: string) => {
    this.list.push(email);
  };

  protected remove = (email: string) => {
    this.list = this.list.filter((e) => e !== email);
  };

  public has = (email: string) => {
    if (this.list.filter((e) => e === email).length > this.attempts) {
      if (this.processList.includes(email))
        throw new HTTPException(403, { message: "Too many attempts" });
      this.process(email);
      throw new HTTPException(403, { message: "Too many attempts" });
    }

    return true;
  };

  protected process = (email: string) => {
    this.processList.push(email);
    setTimeout(() => this.remove(email), this.duration);
  };
}

export const detectMaliciousHTML = (str: string) => {
  const regex =
    /<script>|<\/script>|<iframe>|<\/iframe>|<img>|<\/img>|<svg>|<\/svg>|<body>|<\/body>|<head>|<\/head>|<html>|<\/html>|<link>|<\/link>|<meta>|<\/meta>|<style>|<\/style>|<title>|<\/title>|<xml>|<\/xml>|<object>|<\/object>|<embed>|<\/embed>|<applet>|<\/applet>|<frame>|<\/frame>|<frameset>|<\/frameset>|<noframes>|<\/noframes>|<noembed>|<\/noembed>|<plaintext>|<\/plaintext>|<script|<iframe|<img|<svg|<body|<head|<html|<link|<meta|<style|<title|<xml|<object|<embed|<applet|<frame|<frameset|<noframes|<noembed|<plaintext/;
  return regex.test(str);
};

export const detectSQLInjection = (str: string) => {
  const regex =
    /(\b(ALTER|CREATE|DELETE|DROP|EXEC(UTE){0,1}|INSERT( +INTO){0,1}|MERGE|SELECT|UPDATE|UNION( +ALL){0,1})\b)|(\b(AND|OR|NOT|IS|NULL|LIKE|IN|BETWEEN|EXISTS)\b)/;
  return regex.test(str);
};

export const detectXSS = (str: string) => {
  const regex =
    /(\b(on\w+)=|javascript:|<\w+script|<\w+img|<\w+iframe|<\w+svg|<\w+body|<\w+head|<\w+html|<\w+link|<\w+meta|<\w+style|<\w+title|<\w+xml|<\w+object|<\w+embed|<\w+applet|<\w+frame|<\w+frameset|<\w+noframes|<\w+noembed|<\w+plaintext)/;
  return regex.test(str);
};

export const detectSensitiveData = (str: string) => {
  const regex = /(\b(password|email|username|token|key|secret)\b)/;
  return regex.test(str);
};

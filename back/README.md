# Lambda - Jewely Brand Product Configurator
Lambda is a serverless API for Jewely Brand Product Configurator. It is built for the purpose of managing users, websites, and configurations.

## Table of Contents 📚

- [Tech Stack](#tech-stack-)
- [Installation](#installation-)
- [Environment variables](#environment-variables-)
- [Build](#build-)
- [Getting Started](#getting-started-)
- [Make commands](#make-commands-)
  - [Make module](#make-module)
  - [Make model](#make-model)
  - [Make controller](#make-controller)
  - [Make service](#make-service)
  - [Make resource](#make-resource)
- [Database commands](#database-commands-)
  - [Format Prisma schema](#format-prisma-schema-)
  - [Load seeders to database](#load-seeders-to-database-)
  - [Migrate database](#migrate-database-)
- [API Reference](#api-reference-)
  - [User endpoints](#user-endpoints-)
  - [Admin endpoints](#admin-endpoints-%EF%B8%8F)
    - [Authentication](#authentication-)
    - [Users](#users-)
    - [Websites](#websites-)
    - [Config](#config-)
    - [Apis](#apis-)
    - [Api types](#api-types-%EF%B8%8F)
- [Schemas](#schemas-)
  - [Abstract CRUD Controller](#abstract-CRUD-controller)
  - [Abstract CRUD Service](#abstract-CRUD-service)



<details>
<summary>API Endpoint </summary>

```bash
https://tqiw8zdrdj.execute-api.eu-west-3.amazonaws.com/default/multiBrandConfigurator/v1
```
</details>

## Tech Stack 🛠

- Bun
- Hono
- TypeScript
- Prisma
- SQLite or MariaDB
- Crypto
- Prettier
- Serverless (plugin: offline)

## Installation 📥

```bash
bun install
```

## Environment variables 🌍

Copy the `.env.example` file to `.env`:
```bash:
cp .env.example .env
```

Fill in the environment variables:
```bash
# .env
CORS_ORIGIN="http://localhost:5173"

# DATABASE
DATABASE_PROVIDER="mysql"
DATABASE_URL="mysql://root:root@localhost:3306/jbpc"

# PIM Configuration
PIM_URL="https://pim.jewely.fr/api"
PIM_TOKEN= # <number>|<randomstring>, get your api token from https://pim.jewely.fr/dashboard

# AUTHENTICATION
JWT_SECRET=randomsecret
SALT_ROUNDS=<number 1-10>
PASSWORD_ATTEMPTS=<number> # number of attempts before locking the account
PASSWORD_DURATION=<number> # ex: 300000 = 5 minutes # duration of the lock

# SEEDERS
## ADMIN
ADMIN_EMAIL="admin@flippad.com"
ADMIN_PASSWORD="@Admin123"

## USER
USER_TOKEN="1|clvc69r670001cdm7q0r5f5fnclvc6a9010002cdm7a9e19l9x" # <number>|<randomstring>
```

## Build 🏗

<details>
<summary>Local 💻</summary>

```bash
bun run build
```
</details>

<details>
<summary>Zip 📂</summary>

```bash
bun ci:build
```
</details>

## Getting Started 🚀

```bash
bun serverless
```

## Make commands 🛠

### Make module

Run the following command to create a new module:
```bash
bun make:module <module-name>
```
> This command will create model, controller, service, and ressource files for the new module in the `/modules/<module-name>` directory.

### Make model

Run the following command to create a new model:
```bash
bun make:model <model-name>
```
> This command will create a new model file in the `types/models` directory.

### Make controller

Run the following command to create a new controller:
```bash
bun make:controller <controller-name>
```
> This command will create a new controller file in the `/modules/<controller-name>` directory.

### Make service

Run the following command to create a new service:
```bash
bun make:service <service-name>
```
> This command will create a new service file in the `/modules/<service-name>` directory.

### Make resource

Run the following command to create a new resource:
```bash
bun make:resource <resource-name>
```
> This command will create a new resource file in the `/modules/<resource-name>` directory.

## Database commands 🗄

<details>
<summary>Using MariaDB w/ Docker 🐳</summary>

```bash
docker compose up -d
```
> This command will start a MariaDB and PhpMyAdmin container.

-- or --

```bash
docker run -d -p 3306:3306 -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=jbpc --name jbpc mariadb
docker run -d -p 8080:80 -e PMA_HOST=jbpc phpmyadmin/phpmyadmin --name jbpc phpmyadmin
```
> This command will start a MariaDB container.

</details>

<details>
<summary>Using SQLite 📁</summary>

Change environment variables `DATABASE_PROVIDER` and `DATABASE_URL` in `.env` file:

```bash
# .env
DATABASE_PROVIDER="sqlite"
DATABASE_URL="file:./dev.db"
```

#### Update Prisma schema 📝
Replace `Json` type of `value` field in `config` model to `String`:

```prisma
model Config {
  id         Int               @id @default(autoincrement())
  name       String            @unique
  value      String
  created_at DateTime          @default(now())
  updated_at DateTime          @updatedAt
  deleted_at DateTime?
  website    ConfigToWebsite[]
}
```

#### Update seeders 🌱
In `.prisma/seeders/config.seeder.ts` use `JSON.stringify()` to store JSON data in SQLite:

```typescript
// .prisma/seeders/config.seeder.ts
await prisma.config.create({
  data: {
    name: "Fred Force 10",
    value: JSON.stringify(FredForce10JSON)
  },
});
```
</details>

### Format Prisma schema 📐

```bash
bun db:format
```

### Load seeders to database 🌱

```bash
bun db:seed
```

### Migrate database 🛠

```bash
bun db:migrate
```

## API Reference 📚
[![Go to Lambda JBPC](https://run.pstmn.io/button.svg)](https://flippad-api.postman.co/workspace/b9ab895b-181d-486e-9c1a-27b1a77e9ef7)

> Base URL: `https://localhost:3000/v1`

### User endpoints 👤

| Method | Endpoint | Params | Headers | Description |
| ------ | -------- | ------ | ------- | ----------- |
| 🟢 GET | /search/:brand | queries: `collection`, `category`, `ref` | API-Token: `token` | Get all products for a brand |
| 🟢 GET | /configuration/:name | | API-Token: `token` | Get configuration by name |
| 🟢 GET | /domain/verify | queries: `domain` | API-Token: `token` | Verify domain |

### Admin endpoints 👮🏻‍♂️

#### Authentication 🚪

| Method | Endpoint | Params | Headers | Description |
| ------ | -------- | ------ | ------- | ----------- |
| 🟡 POST | /auth/signin | body: `email`, `password` | | Sign in as admin |
| 🟡 POST | /auth/signup | body: `email`, `password` | Authorization: Bearer `token` | Sign up an admin |
| 🟢 GET | /auth/verify | | Authorization: Bearer `token` | Verify auth token |

#### Users 👤
<details>
<summary>User schema</summary>

  ```prisma
  model Users {
    id         Int       @id @default(autoincrement())
    name       String    @unique
    token      String    @unique
    created_at DateTime  @default(now())
    updated_at DateTime  @updatedAt
    deleted_at DateTime?
    website    Website   @relation(fields: [websiteId], references: [id])
    websiteId  Int
  }
  ```
</details>

| Method | Endpoint | Params | Headers | Description |
| ------ | -------- | ------ | ------- | ----------- |
| 🟢 GET | /users | query: `name`, `website`, `limit`, `page`, `order`, `orderBy`, `trash` | Authorization: Bearer `token` | Index all users |
| 🟢 GET | /users/:id | | Authorization: Bearer `token` | Show a user |
| 🟡 POST | /users | body: `name`, `websiteId` | Authorization: Bearer `token` | Store a user |
| 🔵 PUT | /users/:id | body: `name`, `websiteId` | Authorization: Bearer `token` | Update a user |
| 🔴 DELETE | /users/:id | | Authorization: Bearer `token` | Destroy a user |
| 🔴 DELETE | /users | body: `ids` | Authorization: Bearer `token | Destroy multiple users |

#### Admin 👮🏻‍♂️
<details>
<summary>Admin schema</summary>

  ```prisma
  model Admin {
    id               Int       @id @default(autoincrement())
    email            String    @unique
    password         String
    token_created_at DateTime?
    created_at       DateTime  @default(now())
    updated_at       DateTime  @updatedAt
    deleted_at       DateTime?
  }
  ```
</details>

| Method | Endpoint | Params | Headers | Description |
| ------ | -------- | ------ | ------- | ----------- |
| 🟢 GET | /admin | query: `email`, `limit`, `page`, `order`, `orderBy`, `trash` | Authorization Bearer `token` | Index all admins |
| 🟢 GET | /admin/:id | | Authorization: Bearer `token` | Show an admin |
| 🟡 POST | /admin | body: `email`, `password` | Authorization: Bearer `token` | Store an admin |
| 🔵 PUT | /admin/:id | body: `email`, `password` | Authorization: Bearer `token` | Update an admin |
| 🔴 DELETE | /admin/:id | | Authorization: Bearer `token` | Destroy an admin |
| 🔴 DELETE | /admins | body: `ids` | Authorization: Bearer `token | Destroy multiple admins |

#### Websites 🌐
<details>
<summary>Website schema</summary>

  ```prisma
  model Website {
    id         Int               @id @default(autoincrement())
    name       String
    domain     String            @unique
    created_at DateTime          @default(now())
    updated_at DateTime          @updatedAt
    deleted_at DateTime?
    api        Apis?             @relation(fields: [apiId], references: [id])
    apiId      Int?              @unique
    config     ConfigToWebsite[]
    Users      Users[]
  }
  ```
</details>

| Method | Endpoint | Params | Headers | Description |
| ------ | -------- | ------ | ------- | ----------- |
| 🟢 GET | /websites | query: `name`, `domain`, `api` `limit`, `page`, `order`, `orderBy`, `trash` | Authorization: Bearer `token` | Index all websites |
| 🟢 GET | /websites/:id | | Authorization: Bearer `token` | Show a website |
| 🟡 POST | /websites | body: `name`, `domain`, `apiId` | Authorization: Bearer `token` | Store a website |
| 🔵 PUT | /websites/:id | body: `name`, `domain`, `apiId` | Authorization: Bearer `token` | Update a website |
| 🔴 DELETE | /websites/:id | | Authorization: Bearer `token` | Destroy a website |
| 🔴 DELETE | /websites | body: `ids` | Authorization: Bearer `token` | Destroy multiple websites |

#### Config 🛠
<details>
<summary>Config schema</summary>

  ```prisma
  model Config {
    id         Int               @id @default(autoincrement())
    name       String            @unique
    value      Json
    created_at DateTime          @default(now())
    updated_at DateTime          @updatedAt
    deleted_at DateTime?
    website    ConfigToWebsite[]
  }
  ```
</details>

| Method | Endpoint | Params | Headers | Description |
| ------ | -------- | ------ | ------- | ----------- |
| 🟢 GET | /configs | query: `name`, `limit`, `page`, `order`, `orderBy`, `trash` | Authorization: Bearer `token` | Index all configs |
| 🟢 GET | /configs/:id | | Authorization: Bearer `token` | Show a config |
| 🟡 POST | /configs | body: `name`, `website`, `value` | Authorization: Bearer `token` | Store a config |
| 🔵 PUT | /configs/:id | body: `name`, `website`, `value` | Authorization: Bearer `token` | Update a config |
| 🔴 DELETE | /configs/:id | | Authorization: Bearer `token` | Destroy a config |
| 🔴 DELETE | /configs | body: `ids` | Authorization: Bearer `token | Destroy multiple configs |

#### Apis 🔁
<details>
<summary>Apis schema</summary>

  ```prisma
  model Apis {
    id                Int       @id @default(autoincrement())
    name              String
    url               String    @unique
    publicKey         String
    privateKey        String?
    addToCartEndpoint String?
    created_at        DateTime  @default(now())
    updated_at        DateTime  @updatedAt
    deleted_at        DateTime?
    Website           Website?
    type              ApiType   @relation(fields: [typeId], references: [id])
    typeId            Int
  }
  ```
</details>

| Method | Endpoint | Params | Headers | Description |
| ------ | -------- | ------ | ------- | ----------- |
| 🟢 GET | /apis | query: `name`, `url`, `addToCartEndpoint`, `typeId`, `limit`, `page`, `order`, `orderBy`, `trash` | Authorization: Bearer `token` | Index all apis |
| 🟢 GET | /apis/:id | | Authorization: Bearer `token` | Show an api |
| 🟡 POST | /apis | body: `name`, `url`, `publicKey`, `privateKey`, `addToCartEndpoint`, `typeId` | Authorization: Bearer `token` | Store an api |
| 🔵 PUT | /apis/:id | body: `name`, `url`, `publicKey`, `privateKey`, `addToCartEndpoint`, `typeId` | Authorization: Bearer `token` | Update an api |
| 🔴 DELETE | /apis/:id | | Authorization: Bearer `token` | Destroy an api |
| 🔴 DELETE | /apis | body: `ids` | Authorization: Bearer `token | Destroy multiple apis |

#### Api types 🏷️
<details>
<summary>ApiType schema</summary>

  ```prisma
  model ApiType {
    id         Int       @id @default(autoincrement())
    name       String
    created_at DateTime  @default(now())
    updated_at DateTime  @updatedAt
    deleted_at DateTime?
    Apis       Apis[]
  }
  ```
</details>

| Method | Endpoint | Params | Headers | Description |
| ------ | -------- | ------ | ------- | ----------- |
| 🟢 GET | /api-types | query: `name`, `limit`, `page`, `order`, `orderBy`, `trash` | Authorization: Bearer `token` | Index all api types |
| 🟢 GET | /api-types/:id | | Authorization: Bearer `token` | Show an api type |
| 🟡 POST | /api-types | body: `name`, `password` | Authorization: Bearer `token` | Store an api type |
| 🔵 PUT | /api-types/:id | body: `name`, `password` | Authorization: Bearer `token` | Update an api type |
| 🔴 DELETE | /api-types/:id | | Authorization: Bearer `token` | Destroy an api type |
| 🔴 DELETE | /api-types | body: `ìds` | Authorization: Bearer `token` | Destroy multiple api types |

## Schemas 📚

### Abstract Controller
<details>

<summary>ULM</summary>

```mermaid
classDiagram
  AbstractController : - basePath
  AbstractController : - isProtected
  AbstractController : - routes
  AbstractController : - prisma
  AbstractController : - service
  AbstractController : - userGuard
  AbstractController : + constructor(basePath, service, isProtected)
  AbstractController : + protect()
  AbstractController : + router()
```

</details>

<details>

<summary>File</summary>

Location: `src/components/abstracts/AbstractController.ts`

```typescript
// Abstract Controller for all controllers - AbstractController.ts
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
```

export default AbstractController;

### Abstract CRUD Controller
<details>

<summary>ULM</summary>

```mermaid
classDiagram
    AbstractCRUDController : - basePath
    AbstractCRUDController : - isProtected
    AbstractCRUDController : - routes
    AbstractCRUDController : - service
    AbstractCRUDController : - adminGuard
    AbstractCRUDController : + constructor(basePath, service, isProtected)
    AbstractCRUDController : + protect()
    AbstractCRUDController : + index()
    AbstractCRUDController : + show()
    AbstractCRUDController : + store()
    AbstractCRUDController : + update()
    AbstractCRUDController : + destroy()
    AbstractCRUDController : + destroyMany()
    AbstractCRUDController : + router()
```

</details>

<details>

<summary>File</summary>

Location: `src/components/abstracts/AbtractCRUDController.ts`

```typescript
// Abstract controller for all models - AbstractCRUDController.ts
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
```

</details>

### Abstract CRUD Service

<details>

<summary>ULM</summary>

```mermaid
classDiagram
    AbstractCRUDService : - prisma
    AbstractCRUDService : + getAll(params)
    AbstractCRUDService : + count(params)
    AbstractCRUDService : + get(id)
    AbstractCRUDService : + create(data)
    AbstractCRUDService : + update(params)
    AbstractCRUDService : + destroy(id)
    AbstractCRUDService : + destroyMany(ids)
    AbstractCRUDService : - ressource(data)
    AbstractCRUDService : - manyRessource(data)
```

</details>

<details>

<summary>File</summary>

Location: `src/components/abstracts/AbstractCRUDService.ts`

```typescript
// Abstract Service for all models - AbstractCRUDService.ts
import { getAll, count, get, create, update, destroy, destroyMany } from "@/types";

abstract class AbstractCRUDService<T> {
  protected prisma: any;
  public abstract getAll(params): Promise<T[]>;
  public abstract count(params: count): Promise<number>;
  public abstract get(id: get): Promise<T>;
  public abstract create(data: create): Promise<T>;
  public abstract update(params: update): Promise<T>;
  public abstract destroy(id: destroy): Promise<T>;
  public abstract destroyMany(ids: destroy[]): Promise<destroyMany>;
  protected abstract ressource(data: any): Promise<T> | T;
  protected abstract manyRessource(data: any[]): Promise<T[]> | T[];
}

export default AbstractCRUDService;
```

</details>

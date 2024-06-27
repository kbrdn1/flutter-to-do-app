// Modules exports - index.ts
export * as authentication from "./authentication";

import {
  AuthenticationController,
  AuthenticationService,
} from "./authentication";

const controllers = {
  authentication: AuthenticationController,
};

const services = {
  authentication: AuthenticationService,
};

const modules = {
  controllers,
  services,
}

export { modules, controllers, services };

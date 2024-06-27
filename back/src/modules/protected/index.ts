// Protected modules exports - index.ts
export * as users from "./users";
export * as tags from "./tags";
export * as status from "./status";
export * as priorities from "./priorities";

import { UsersController, UsersRessource, UsersService } from "./users";
import { TagsController, TagsRessource, TagsService } from "./tags";
import { StatusController, StatusRessource, StatusService } from "./status";
import { PrioritiesController, PrioritiesRessource, PrioritiesService } from "./priorities";

const controllers = {
  users: UsersController,
  tags: TagsController,
  status: StatusController,
  priorities: PrioritiesController
};

const services = {
  users: UsersService,
  tags: TagsService,
  status: StatusService,
  priorities: PrioritiesService
};

const resources = {
  users: UsersRessource,
  tags: TagsRessource,
  status: StatusRessource,
  priorities: PrioritiesRessource
};

const modules = {
  controllers,
  services,
  resources,
}

export { modules, controllers, services, resources };
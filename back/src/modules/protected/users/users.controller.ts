// Controller for users - users.controller.ts
import DefaultCRUDController from "@/components/DefaultCRUDController";
import service from "./users.service";

class UsersController extends DefaultCRUDController {
  constructor() {
    super("/users", service, true);
  }
}

export default new UsersController();

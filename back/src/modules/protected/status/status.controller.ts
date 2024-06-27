// Controller for status - status.controller.ts
import DefaultCRUDController from '@/components/DefaultCRUDController';
import statusService from './status.service';

class StatusController extends DefaultCRUDController {
  constructor() {
    super('/status', statusService, true);
  }
}

export default new StatusController();

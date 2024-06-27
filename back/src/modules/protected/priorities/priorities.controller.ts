// Controller for priorities - priorities.controller.ts
import DefaultCRUDController from '@/components/DefaultCRUDController';
import prioritiesService from './priorities.service';

class PrioritiesController extends DefaultCRUDController {
  constructor() {
    super('/priorities', prioritiesService, true);
  }
}

export default new PrioritiesController();

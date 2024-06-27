// Controller for tasks - tasks.controller.ts
import DefaultCRUDController from '@/components/DefaultCRUDController';
import tasksService from './tasks.service';

class TaskController extends DefaultCRUDController {
  constructor() {
    super('/tasks', tasksService, true);
  }
}

export default new TaskController();

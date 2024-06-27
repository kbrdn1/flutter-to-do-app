// Controller for tags - tags.controller.ts
import DefaultCRUDController from '@/components/DefaultCRUDController';
import tagsService from './tags.service';

class TagController extends DefaultCRUDController {
  constructor() {
    super('/tags', tagsService, true);
  }
}

export default new TagController();

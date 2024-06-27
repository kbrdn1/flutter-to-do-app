// Ressource for priorities - Priorities.ressource.ts
import { Priority } from "@/types/models";

const priorityRessource = async (priority: any): Promise<Priority> => {
  return {
    id: priority.id,
    name: priority.name,
    level: priority.level,
  };
};

export default priorityRessource;

// Ressource for user - user.ressource.ts
import { User } from "@/types/models";

const adminRessource = (user: any): User => {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
  };
};

export default adminRessource;

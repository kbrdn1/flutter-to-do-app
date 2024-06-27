import { PrismaClient } from "@prisma/client";
import AbstractSeeder from "../components/abstracts/AbstractSeeder";
import { Status } from "@/types/models";
import { faker } from "@faker-js/faker";
import { capitalizeFirstLetter } from "@/utils";

class StatusSeeder extends AbstractSeeder<Status> {
  protected orm = new PrismaClient();

  public constructor(entity: Status) {
    super(entity);
  }

  public async seed() {
    console.info("Seeding status  🏷️");
    
    if (!this.entity) return console.error("Entity is not defined");

    await this.orm.status.create({
      data: this.entity,
    });

    console.info("Status seeded ✅");
  }
}
    

export default StatusSeeder;

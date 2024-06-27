import { PrismaClient } from "@prisma/client";
import AbstractSeeder from "../components/abstracts/AbstractSeeder";
import { Priority } from "@/types/models";
import { faker } from "@faker-js/faker";
import { capitalizeFirstLetter } from "@/utils";

class PrioritiesSeeder extends AbstractSeeder<Priority> {
  protected orm = new PrismaClient();

  public constructor(entity: Priority) {
    super(entity);
  }

  public async seed() {
    console.info("Seeding priority  🏷️");

    if (!this.entity) return console.error("Entity is not defined");

    await this.orm.priorities.create({
      data: this.entity,
    });

    console.info("Priority seeded ✅");
  }
}
    

export default PrioritiesSeeder;

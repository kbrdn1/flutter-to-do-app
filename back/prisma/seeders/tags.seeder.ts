import { PrismaClient } from "@prisma/client";
import AbstractSeeder from "../components/abstracts/AbstractSeeder";
import { Tag } from "@/types/models";
import { faker } from "@faker-js/faker";
import { capitalizeFirstLetter } from "@/utils";

class TagSeeder extends AbstractSeeder<Tag> {
  protected orm = new PrismaClient();

  public constructor(count: number = 10) {
    super(undefined, count);
  }

  public async seed() {
    console.info("Seeding tags 🏷️");

    if (!this.count) return console.error("Count is not defined");

    await this.orm.tags.createMany({
      data: Array.from({ length: this.count }).map(() => ({
        name: capitalizeFirstLetter(faker.lorem.word()),
      })),
    });

    console.info("Tags seeded ✅");
  }
}

export default new TagSeeder(10);

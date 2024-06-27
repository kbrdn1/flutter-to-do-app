import { PrismaClient } from "@prisma/client";
import AbstractSeeder from "../components/abstracts/AbstractSeeder";
import { Task } from "@/types/models";
import { faker } from "@faker-js/faker";
import { capitalizeFirstLetter } from "@/utils";

class TasksSeeder extends AbstractSeeder<Task> {
  protected orm = new PrismaClient();

  public constructor(count: number = 10) {
    super(undefined, count);
  }

  public async seed() {
    console.info("Seeding tasks 🏷️");

    if (!this.count) return console.error("Count is not defined");

    await this.orm.tasks.createMany({
      data: Array.from({ length: this.count }).map((_, index) => ({
        content: capitalizeFirstLetter(
          faker.lorem.words(Math.floor(Math.random() * 5)),
        ),
        deadline: index % 2 === 0 ? faker.date.future() : undefined,
        user_id: 1,
        priority_id: Math.floor(Math.random() * 3) + 1,
        status_id: Math.floor(Math.random() * 3) + 1,
      })),
    });

    console.info("Tasks seeded ✅");
  }
}

export default new TasksSeeder(5);

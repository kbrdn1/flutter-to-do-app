import { PrismaClient } from "@prisma/client";
import AbstractSeeder from "../components/abstracts/AbstractSeeder";
import { User } from "@/types/models";

const user: User = {
  username: Bun.env.USER_USERNAME ?? "kbrdn1",
  email: Bun.env.USER_EMAIL ?? "kylian@flippad.com",
  password: Bun.env.USER_PASSWORD ?? "@User123",
};

class UserSeeder extends AbstractSeeder<User> {
  protected orm = new PrismaClient();

  public constructor(entity: User) {
    super(entity);
  }

  public async seed() {
    console.info("Seeding users 👤");

    await this.orm.users.create({
      data: {
        username: Bun.env.USER_USERNAME ?? "kbrdn1",
        email: Bun.env.USER_EMAIL ?? "kylian@flippad.com",
        password: await this.hashPassword(Bun.env.USER_PASSWORD ?? "@Admin123"),
      },
    });

    console.info("Users seeded ✅");
  }
}

export default new UserSeeder(user);

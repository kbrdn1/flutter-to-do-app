// Seeder class for any table - abstract-seeder.ts
import { PrismaClient } from "@prisma/client";

abstract class AbstractSeeder<T> {
  protected orm = new PrismaClient();
  private saltRounds: number = Number(process.env.SALT_ROUNDS);
  protected entity?: T;
  protected count?: number;

  public constructor(entity?: T, count?: number) {
    this.entity = entity ? entity : undefined;
    this.count = count ? count : undefined;
  }

  public abstract seed(): Promise<void>;

  protected hashPassword = async (password: string) => {
    return await Bun.password.hash(password, {
      algorithm: "bcrypt",
      cost: Number(process.env.SALT_ROUNDS) ?? 10,
    });
  };
}

export default AbstractSeeder;

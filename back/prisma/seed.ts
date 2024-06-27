// Seed the database with data seeders - seed.ts
import { PrismaClient } from "@prisma/client";
import * as seeders from "./seeders";
import { Status, Priority } from "@/types/models";

const prisma = new PrismaClient();

const statuses: Status[] = [
  { name: "En attente" },
  { name: "En cours" },
  { name: "Terminé" },
  { name: "Annulé" },
];

const priorities: Priority[] = [
  { name: "Normal", level: 0 },
  { name: "Important", level: 1 },
  { name: "Urgent", level: 2 },
];

const seed = async () => {
  try {
    console.info("Seeding data 🌱");

    // Seed users and tags first
    await seeders.users.seed();
    await seeders.tags.seed();

    // Seed statuses
    console.info("Seeding statuses 🏷️");
    for (const status of statuses) {
      await prisma.status.create({ data: status });
    }
    console.info("Statuses seeded ✅");

    // Seed priorities
    console.info("Seeding priorities 🏷️");
    for (const priority of priorities) {
      await prisma.priorities.create({ data: priority });
    }
    console.info("Priorities seeded ✅");

    // Seed tasks last
    await seeders.tasks.seed();

    console.info("Data seeded ✅");
  } catch (error) {
    console.error("Error seeding data 🌱", error);
  } finally {
    await prisma.$disconnect();
  }
};

seed().then(() => {
  console.log("Database seeded successfully 🚀");
}).catch((e) => {
  console.error(e);
  process.exit(1);
});
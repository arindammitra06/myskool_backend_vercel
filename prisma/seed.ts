import { PrismaClient } from "@prisma/client";
import fs from "fs";

const prisma = new PrismaClient();

async function main() {
  const sql = fs.readFileSync("prisma/seed.sql", "utf8");

  const queries = sql
    .split(";")
    .map(q => q.trim())
    .filter(q => q.length > 0);

  for (const query of queries) {
    await prisma.$executeRawUnsafe(query);
  }

  console.log("Seed completed");
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());

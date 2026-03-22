import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import "dotenv/config";

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  const adminPassword = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@raycast.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@raycast.com",
      password: adminPassword,
      role: "ADMIN",
      referralCode: "ADMIN001",
    },
  });
  console.log("Created admin user:", admin.email);

  const plans = [
    { name: "Canva Pro 7 วัน", days: 7, price: 15, isActive: true },
    { name: "Canva Pro 15 วัน", days: 15, price: 25, isActive: true },
    { name: "Canva Pro 30 วัน", days: 30, price: 40, isActive: true },
    { name: "Canva Pro 90 วัน", days: 90, price: 100, isActive: true },
    { name: "Canva Pro 180 วัน", days: 180, price: 180, isActive: true },
    { name: "Canva Pro 365 วัน", days: 365, price: 299, isActive: true },
  ];

  for (const plan of plans) {
    await prisma.plan.upsert({
      where: { id: plan.name.toLowerCase().replace(/\s+/g, "-") },
      update: {},
      create: plan,
    });
  }
  console.log("Created plans:", plans.length);

  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

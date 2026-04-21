import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

// Test the connection
prisma.$connect()
  .then(() => {
    console.log("Successfully connected to the database");
  })
  .catch((e) => {
    console.error("Failed to connect to the database:", e);
  });

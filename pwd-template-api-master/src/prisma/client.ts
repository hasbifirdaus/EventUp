import { PrismaClient } from "../generated/prisma";

let prisma: PrismaClient;

// Ensure a single PrismaClient instance is used across the application
if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  // Use a global variable in development to prevent hot-reloading from creating new instances
  if (!(global as any).prisma) {
    (global as any).prisma = new PrismaClient();
  }
  prisma = (global as any).prisma;
}

export default prisma;

import { PrismaClient } from "@prisma/client";

// Use a single PrismaClient instance to avoid connection pool issues
const globalForPrisma = globalThis;

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
